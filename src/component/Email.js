import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import pako from "pako";
import { Buffer } from "buffer";
import ResultExperience from "./result/ResultExperience";
import { decodeResultPayload, getResultPayloadFromUrl } from "../utils/resultPayload";

const CATEGORY_KEY_MAP = {
  "Identity Clarity": "identity_clarity",
  "Value Articulation": "value_articulation",
  "Evidence Visibility": "evidence_visibility",
  "Signature Strength Recognition": "signature_strength_recognition",
  "Trust Pattern Awareness": "trust_pattern_awareness",
  "Positioning Strength": "positioning_strength",
  "Next-Move Clarity": "next_move_clarity",
  "Leverage Utilization": "leverage_utilization",
};

const decodeScoresFromUrl = (url) => {
  const urlParams = new URL(url).searchParams;
  const payload = urlParams.get("payload");

  if (!payload) {
    throw new Error("Result payload not found.");
  }

  const compressedData = Buffer.from(payload, "base64");
  const decompressed = pako.inflate(compressedData, { to: "string" });
  const categories = JSON.parse(decompressed);

  const scores = {};
  categories.forEach((category) => {
    const key = CATEGORY_KEY_MAP[category.name];
    const value = Number.parseInt(category.values?.[0], 10);

    if (key && Number.isInteger(value)) {
      scores[key] = value;
    }
  });

  if (Object.keys(scores).length !== Object.keys(CATEGORY_KEY_MAP).length) {
    throw new Error("Result payload is incomplete.");
  }

  return scores;
};

const getContactEmailFromUrl = (url) => {
  const urlParams = new URL(url).searchParams;
  return (urlParams.get("email") || urlParams.get("e") || "").trim();
};

const getReferralTrackingFromUrl = (url) => {
  const urlParams = new URL(url).searchParams;
  const code = String(urlParams.get("ref") || localStorage.getItem("professional_leverage_referrer_code") || "").trim().toUpperCase();
  const invitedToken = String(urlParams.get("invite") || localStorage.getItem("professional_leverage_invited_token") || "").trim();

  if (!code || !invitedToken) {
    return null;
  }

  localStorage.setItem("professional_leverage_referrer_code", code);
  localStorage.setItem("professional_leverage_invited_token", invitedToken);

  return { code, invitedToken };
};

const markReferralResultViewed = async ({ code, invitedToken }) => {
  const response = await fetch("/api/referral-complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, invitedToken, invitedEmail: getContactEmailFromUrl(window.location.href) }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Could not update referral progress.");
  }

  return data;
};

export default function Email() {
  const navigate = useNavigate();
  const [interpretation, setInterpretation] = useState(null);
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contactEmail, setContactEmail] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setContactEmail(getContactEmailFromUrl(window.location.href));

    const loadInterpretation = async () => {
      try {
        const payload = getResultPayloadFromUrl(window.location.href);
        if (payload) {
          const result = decodeResultPayload(payload);
          setScores(result.scores);
          setInterpretation(result.interpretation);
          return;
        }

        const scores = decodeScoresFromUrl(window.location.href);
        setScores(scores);
        const response = await fetch("/api/interpret", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scores }),
          signal: controller.signal,
        });

        const contentType = response.headers.get("content-type") || "";
        const data = contentType.includes("application/json")
          ? await response.json()
          : null;

        if (!response.ok) {
          throw new Error(data?.error || `API returned ${response.status}`);
        }

        if (!data || data.error) {
          throw new Error(data?.error || "The API did not return an interpretation.");
        }

        setInterpretation(data);
      } catch (requestError) {
        if (requestError.name === "AbortError") return;

        console.error("Interpretation error:", requestError);

        if (
          requestError.message === "Result payload not found." ||
          requestError.message === "Result payload is incomplete."
        ) {
          navigate("/", { replace: true });
          return;
        }

        setError("Could not load your interpretation. Please try again later.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadInterpretation();
    return () => controller.abort();
  }, [navigate]);

  useEffect(() => {
    if (!interpretation || !scores) return;

    const tracking = getReferralTrackingFromUrl(window.location.href);

    if (!tracking) return;

    const completionKey = `professional_leverage_referral_completed_${tracking.code}_${tracking.invitedToken}`;

    if (localStorage.getItem(completionKey) === "1") {
      return;
    }

    markReferralResultViewed(tracking)
      .then(() => {
        localStorage.setItem(completionKey, "1");
      })
      .catch((requestError) => {
        console.error("Referral completion tracking error:", requestError);
      });
  }, [interpretation, scores]);

  return (
    <div className="diagnostic-page min-h-screen bg-[#050505] text-white">

      {loading && (
        <main className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-2 border-[#D9A44A] border-t-transparent" />
            <p className="text-sm uppercase tracking-widest text-[#D9A44A]">
              Generating your professional leverage interpretation...
            </p>
          </div>
        </main>
      )}

      {error && (
        <main className="mx-auto max-w-3xl px-6 py-20">
          <div className="rounded-xl border border-red-800 bg-red-900/20 p-8 text-center">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        </main>
      )}

      {interpretation && scores && (
        <ResultExperience interpretation={interpretation} scores={scores} contactEmail={contactEmail} />
      )}

    </div>
  );
}

