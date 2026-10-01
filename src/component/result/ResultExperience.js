import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Section01Mirror from "./Section01Mirror";
import Section02Noticed from "./Section02Noticed";
import Section03Glance from "./Section03Glance";
import Section04PatternIntro from "./Section04PatternIntro";
import Section05PatternRooms from "./Section05PatternRooms";
import Section06QuietCost from "./Section06QuietCost";
import Section07HiddenValue from "./Section07HiddenValue";
import Section08OpensUp from "./Section08OpensUp";
import Section09StoryCarousel from "./Section09StoryCarousel";
import ShareModal from "../ShareModal";
import ReferralFloatingPill from "../ReferralFloatingPill";
import {
  getReferralCodeFromLink,
  getStoredReferralEmail,
  getStoredReferralLink,
  markReferralShared,
  markSharePrompted,
  rememberReferralLink,
  wasReferralShared,
  wasSharePrompted,
} from "../../utils/referral";
import { getVisitorName } from "./experienceUtils";

/* The cinematic results experience. Sections are numbered to match the
   design files; later sections slot in as their designs arrive. */
export default function ResultExperience({ interpretation, scores, contactEmail = "" }) {
  const navigate = useNavigate();
  const name = getVisitorName();
  const [shareOpen, setShareOpen] = useState(false);
  const [referralUrl, setReferralUrl] = useState(getStoredReferralLink);
  const [shared, setShared] = useState(wasReferralShared);
  const [preparing, setPreparing] = useState(false);
  const [shareError, setShareError] = useState("");
  const pattern = interpretation.your_pattern;
  const suggestion = interpretation.what_this_pattern_suggests;
  const snapshot = interpretation.profile_snapshot;

  /* Referral prompt: once per session, after the reader has had time to
     take in their pattern. */
  useEffect(() => {
    if (wasSharePrompted()) return;
    const timer = setTimeout(() => {
      markSharePrompted();
      setShareOpen(true);
    }, 30000);
    return () => clearTimeout(timer);
  }, []);

  const prepareReferral = async () => {
    if (referralUrl) return true;

    const email = String(contactEmail || getStoredReferralEmail() || "").trim().toLowerCase();
    if (!email) {
      setShareError("Your email is missing from this result. Open referral progress to create your private link.");
      return false;
    }

    setPreparing(true);
    setShareError("");

    try {
      const response = await fetch("/api/referrer-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.url) {
        throw new Error(data?.error || "Could not prepare your referral link.");
      }

      rememberReferralLink(data.url, email);
      setReferralUrl(data.url);
      return true;
    } catch (error) {
      setShareError(error.message || "Could not prepare your referral link.");
      return false;
    } finally {
      setPreparing(false);
    }
  };

  const handleShared = () => {
    markReferralShared();
    setShared(true);
  };

  const openProgress = () => {
    const code = getReferralCodeFromLink(referralUrl);
    navigate(code ? `/progress?code=${encodeURIComponent(code)}` : "/progress");
  };

  return (
    <div className="bg-[#050505]">
      <Section01Mirror
        name={name}
        subline={snapshot?.opening_observation.body.join(" ") || pattern.summary?.join(" ") || ""}
        highlight={snapshot?.opening_observation?.highlight || ""}
      />
      {snapshot?.realizations && (
        <Section02Noticed
          title={snapshot.realizations.title}
          cards={snapshot.realizations.cards}
        />
      )}
      <Section03Glance snapshot={snapshot?.at_a_glance} scores={scores} />
      <Section04PatternIntro />
      <Section05PatternRooms
        title={suggestion.title}
        expanded={suggestion.expanded}
        highlights={suggestion.expanded_highlights}
      />
      <Section06QuietCost points={interpretation.what_may_be_quietly_costing_you.points} />
      <Section07HiddenValue points={interpretation.where_hidden_value_may_be_sitting.points} />
      <Section08OpensUp points={interpretation.what_this_may_open_up.points} />
      <Section09StoryCarousel />

      <ReferralFloatingPill
        shared={shared}
        onInvite={() => setShareOpen(true)}
        onProgress={openProgress}
      />

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        referralUrl={referralUrl}
        onPrepareReferral={prepareReferral}
        preparing={preparing}
        error={shareError}
        resultHeading={pattern.value}
        onReferralActionComplete={handleShared}
      />
    </div>
  );
}

