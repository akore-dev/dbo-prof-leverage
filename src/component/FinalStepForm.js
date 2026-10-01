import { useCallback, useEffect, useRef } from "react";
import {
  CheckCircle2,
  Shield,
  TrendingUp,
  Target,
  ArrowUpRight,
} from "lucide-react";
const EMAIL_PATTERN = /[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+/i;
const COMPLETION_EMAIL_WAIT_MS = 2500;

const extractEmailFromFormMessage = (value, depth = 0) => {
  if (!value || depth > 4) return "";

  if (typeof value === "string") {
    try {
      const decoded = decodeURIComponent(value.replace(/\+/g, " "));
      return decoded.match(EMAIL_PATTERN)?.[0] || "";
    } catch (error) {
      return value.match(EMAIL_PATTERN)?.[0] || "";
    }
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const email = extractEmailFromFormMessage(item, depth + 1);
      if (email) return email;
    }
    return "";
  }

  if (typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      if (/email/i.test(key) && typeof item === "string") {
        const email = extractEmailFromFormMessage(item, depth + 1);
        if (email) return email;
      }
    }

    for (const item of Object.values(value)) {
      const email = extractEmailFromFormMessage(item, depth + 1);
      if (email) return email;
    }
  }

  return "";
};
const sanitizeSubmittedName = (value) => {
  const name = String(value || "").trim().replace(/[<>]/g, "").slice(0, 60);
  return name && !EMAIL_PATTERN.test(name) ? name : "";
};

const NAME_FIELD_PATTERN = /^(name|full_?name|first_?name|contact_?name)$/i;

const extractNameFromFormMessage = (value, depth = 0) => {
  if (!value || depth > 6) return "";

  if (typeof value === "string") {
    let decoded = value;
    try {
      decoded = decodeURIComponent(value.replace(/\+/g, " "));
    } catch (error) {
      // Use the original message when it is not URL encoded.
    }

    try {
      const parsed = JSON.parse(decoded);
      const parsedName = extractNameFromFormMessage(parsed, depth + 1);
      if (parsedName) return parsedName;
    } catch (error) {
      // The form also sends plain strings and URLs.
    }

    const parameterMatch = decoded.match(
      /(?:^|[?&"'\s])(?:name|full_?name|first_?name|contact_?name)[=:]?["']?([^&#,"'}]+)/i
    );
    return sanitizeSubmittedName(parameterMatch?.[1]);
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const name = extractNameFromFormMessage(item, depth + 1);
      if (name) return name;
    }
    return "";
  }

  if (typeof value !== "object") return "";

  const descriptor = value.field || value.fieldName || value.key || value.id;
  if (typeof descriptor === "string" && NAME_FIELD_PATTERN.test(descriptor)) {
    const fieldValue = value.value || value.answer || value.data;
    const name = sanitizeSubmittedName(fieldValue);
    if (name) return name;
  }

  for (const [key, item] of Object.entries(value)) {
    if (NAME_FIELD_PATTERN.test(key) && typeof item === "string") {
      const name = sanitizeSubmittedName(item);
      if (name && !NAME_FIELD_PATTERN.test(name)) return name;
    }
  }

  for (const item of Object.values(value)) {
    const name = extractNameFromFormMessage(item, depth + 1);
    if (name) return name;
  }

  return "";
};
export default function FinalStepForm({ onComplete, resultUrl }) {
  const completionTimerRef = useRef(null);
  const completedRef = useRef(false);
  const latestEmailRef = useRef("");
  const latestNameRef = useRef("");

  const finishForm = useCallback((email = "", name = "") => {
    if (completedRef.current) return;

    completedRef.current = true;
    if (completionTimerRef.current) {
      window.clearTimeout(completionTimerRef.current);
      completionTimerRef.current = null;
    }

    onComplete?.({
      email: email || latestEmailRef.current,
      name: name || latestNameRef.current,
    });
  }, [onComplete]);

  const completeWhenEmailSettles = useCallback((email = "", name = "") => {
    if (email) latestEmailRef.current = email;
    if (name) latestNameRef.current = name;

    if (latestEmailRef.current && latestNameRef.current) {
      finishForm(latestEmailRef.current, latestNameRef.current);
      return;
    }

    if (completionTimerRef.current || completedRef.current) return;

    completionTimerRef.current = window.setTimeout(() => {
      completionTimerRef.current = null;
      finishForm(latestEmailRef.current, latestNameRef.current);
    }, COMPLETION_EMAIL_WAIT_MS);
  }, [finishForm]);
  const formUrl = new URL(
    "https://link.msgsndr.com/widget/form/7NRMz5kJUIxJuRh7ToGv"
  );

  if (resultUrl) {
    const fullResultUrl = new URL(resultUrl, window.location.origin).toString();
    formUrl.searchParams.set("wheelurl", fullResultUrl);
  }
  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://link.msgsndr.com/js/form_embed.js"]'
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://link.msgsndr.com/js/form_embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const handleFormMessage = (event) => {
      const iframe = document.getElementById("inline-7NRMz5kJUIxJuRh7ToGv");

      if (!iframe || event.source !== iframe.contentWindow) return;

      const action = Array.isArray(event.data) ? event.data[0] : null;
      const email = extractEmailFromFormMessage(event.data);
      const name = extractNameFromFormMessage(event.data);

      if (email) {
        latestEmailRef.current = email;
      }

      if (name) {
        latestNameRef.current = name;
      }

      if (action === "modify-parent-url") {
        event.stopImmediatePropagation();
        completeWhenEmailSettles(email, name);
        return;
      }

      if (action === "set-sticky-contacts") {
        completeWhenEmailSettles(email, name);
      }
    };

    window.addEventListener("message", handleFormMessage, true);
    return () => {
      if (completionTimerRef.current) {
        window.clearTimeout(completionTimerRef.current);
      }
      window.removeEventListener("message", handleFormMessage, true);
    };
  }, [completeWhenEmailSettles]);

  return (
    <section className="relative overflow-hidden rounded-xl border border-[#1B2A45] bg-[#050D18] px-5 py-7 sm:px-6 sm:py-8" data-result-url-ready={Boolean(resultUrl)}>
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,164,75,0.06),transparent_60%)]" />

      <div className="relative mx-auto max-w-3xl">
        {/* Status */}
        <div className="flex items-center justify-center gap-2 text-sm text-[#D4A44B]">
          <CheckCircle2 className="h-4 w-4" />
          <span>All questions complete</span>
        </div>

        {/* Divider */}
        <div className="mx-auto mt-4 h-px w-72 bg-[#1F2A3D]" />

        {/* Label */}
        <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.25em] text-[#D4A44B]">
          Final Step
        </p>

        {/* Heading */}
      <div className="flex flex-col items-center">
        <h1 className="mt-4 text-center font-serif text-4xl leading-tight text-white md:text-5xl">
            Your Professional
                  </h1>
                  <h1 className="text-center font-serif text-4xl leading-tight text-white md:text-5xl"> Leverage Pattern is ready.
                      </h1>
        </div>

        {/* Subtitle */}
        <p className="mx-auto mt-5 max-w-lg text-center text-slate-400">
          Enter your details to receive your personalized diagnostic results.
        </p>

        {/* Benefits */}
        <div className="mt-7 grid grid-cols-1 gap-6 text-center md:grid-cols-3">
          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#D4A44B]/40">
              <TrendingUp className="h-5 w-5 text-[#D4A44B]" />
            </div>

            <h3 className="mt-3 text-sm font-semibold text-[#D4A44B]">
              Your full diagnostic
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Your scores, pattern, and what they reveal.
            </p>
          </div>

          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#D4A44B]/40">
              <Target className="h-5 w-5 text-[#D4A44B]" />
            </div>

            <h3 className="mt-3 text-sm font-semibold text-[#D4A44B]">
              Strategic insights
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Hidden risks, under-leveraged value, and what's possible.
            </p>
          </div>

          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#D4A44B]/40">
              <ArrowUpRight className="h-5 w-5 text-[#D4A44B]" />
            </div>

            <h3 className="mt-3 text-sm font-semibold text-[#D4A44B]">
              What's next
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Clarity on your next best moves.
            </p>
          </div>
        </div>

        {/* Embedded Form */}
        <div className="mt-7 overflow-hidden rounded-lg border border-[#22324A] bg-[#0B1320]">
          <iframe
            src={formUrl.toString()}
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
            id="inline-7NRMz5kJUIxJuRh7ToGv"
            title="PLA Wheel Pre-Result Form"
            className="w-full border-0"
            style={{
              minHeight: "520px",
              width: "100%",
            }}
            data-layout='{"id":"INLINE"}'
            data-trigger-type="alwaysShow"
            data-trigger-value=""
            data-activation-type="alwaysActivated"
            data-activation-value=""
            data-deactivation-type="neverDeactivate"
            data-deactivation-value=""
            data-form-name="PLA Wheel Pre-Result Form"
            data-layout-iframe-id="inline-7NRMz5kJUIxJuRh7ToGv"
            data-form-id="7NRMz5kJUIxJuRh7ToGv"
          />
        </div>

        {/* Privacy Note */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Shield className="h-3.5 w-3.5 text-[#D4A44B]" />
          <span>No spam. Your results are private.</span>
        </div>
      </div>
    </section>
  );
}
