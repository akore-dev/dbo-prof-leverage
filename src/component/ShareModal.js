import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Send,
  Gift,
  Lock,
  Link2,
  Mail,
  ChevronRight,
  Trophy,
  TrendingUp,
  Users,
  LockKeyhole,
} from "lucide-react";
import {
  buildShareTargets,
  copyReferralLink,
  fetchReferralProgress,
  getReferralCodeFromLink,
  REFERRAL_GOAL,
} from "../utils/referral";

export const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2.05 22l5.3-1.39a9.87 9.87 0 0 0 4.69 1.19h.01c5.46 0 9.9-4.44 9.9-9.9a9.84 9.84 0 0 0-2.9-7A9.84 9.84 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.8-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
  </svg>
);

export const LinkedInIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
  </svg>
);

const shareOptions = [
  { key: "copy", title: "Copy Private Link", subtitle: "Share anywhere", rowClass: "bg-[#EAF1FE] hover:bg-[#DFEAFD]", iconClass: "bg-[#2563EB]", Icon: Link2 },
  { key: "whatsapp", title: "Send via WhatsApp", subtitle: "Share in chats or groups", rowClass: "bg-[#E9F9EF] hover:bg-[#DCF5E6]", iconClass: "bg-[#22C55E]", Icon: WhatsAppIcon },
  { key: "email", title: "Send via Email", subtitle: "Send a personal message", rowClass: "bg-[#F7EDFA] hover:bg-[#F2E2F8]", iconClass: "bg-[#A855F7]", Icon: Mail },
  { key: "linkedin", title: "Send via LinkedIn", subtitle: "Share with your network", rowClass: "bg-[#EAF1FE] hover:bg-[#DFEAFD]", iconClass: "bg-[#0A66C2]", Icon: LinkedInIcon },
];

export default function ShareModal({
  open,
  onClose,
  referralUrl = "",
  onPrepareReferral,
  preparing = false,
  error = "",
  resultHeading = "Professional Leverage Diagnostic",
  onReferralActionComplete,
  initialStep = "prompt",
}) {
  const navigate = useNavigate();
  const [step, setStep] = useState("prompt");
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, goal: REFERRAL_GOAL });
  const referralCode = useMemo(() => getReferralCodeFromLink(referralUrl), [referralUrl]);
  const shareTargets = useMemo(() => buildShareTargets(referralUrl), [referralUrl]);
  const completedCount = Math.min(progress.completed, progress.goal);

  useEffect(() => {
    if (!open) return undefined;

    setStep(initialStep);
    setCopied(false);
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open, initialStep]);

  useEffect(() => {
    if (!open || !referralCode) return undefined;

    let cancelled = false;
    fetchReferralProgress(referralCode)
      .then((nextProgress) => {
        if (!cancelled) setProgress(nextProgress);
      })
      .catch((loadError) => {
        if (!cancelled) console.error("Referral progress load error:", loadError);
      });

    return () => {
      cancelled = true;
    };
  }, [open, referralCode]);

  if (!open) return null;

  const prepareAndShare = async () => {
    if (!referralUrl && onPrepareReferral) {
      const ok = await onPrepareReferral();
      if (!ok) return;
    }
    setStep("share");
  };

  const handleShare = async (key) => {
    if (!referralUrl) {
      const ok = onPrepareReferral ? await onPrepareReferral() : false;
      if (!ok) return;
    }

    if (key === "copy") {
      const ok = await copyReferralLink(referralUrl);
      setCopied(ok);
      if (ok) onReferralActionComplete?.();
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    window.open(shareTargets[key](), "_blank", "noopener,noreferrer");
    onReferralActionComplete?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[380px] overflow-y-auto rounded-xl bg-white p-4 text-[#14213D] shadow-2xl sm:max-w-[420px] sm:p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-2.5 top-2.5 text-slate-400 transition hover:text-slate-600"
        >
          <X className="h-4 w-4" strokeWidth={2.5} />
        </button>

        {step === "prompt" ? (
          <div className="flex flex-col gap-3">
            <div className="flex justify-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4F6FA]">
                <Send className="h-4.5 w-4.5 text-[#14213D]" strokeWidth={1.5} />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-base font-extrabold leading-tight">
                Someone came to mind?
              </h2>
              <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-slate-600">
                Share the diagnostic with a capable professional whose career may not be fully reflecting what they can do.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-[#FBF4DE] p-3">
              <Gift className="h-5 w-5 shrink-0 text-[#C9962E]" strokeWidth={1.8} />
              <div className="border-l border-[#E5D9AE] pl-3 text-[11px] leading-snug">
                <p className="text-[#14213D]">
                  <span className="font-bold">Help {progress.goal} professionals</span> complete the assessment and receive a
                </p>
                <p className="font-extrabold text-[#C9962E]">FREE 30-minute</p>
                <p className="font-bold text-[#14213D]">Professional Leverage Debrief.</p>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 p-1.5 text-center text-[10px] text-red-700">{error}</p>
            )}

            <button
              type="button"
              onClick={prepareAndShare}
              disabled={preparing}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#14213D] py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-white transition hover:bg-[#1C2C4F] disabled:cursor-wait disabled:opacity-70"
            >
              <Send className="h-3.5 w-3.5 shrink-0" />
              <span>{preparing ? "Preparing Link..." : "Send Them the Assessment"}</span>
            </button>

            <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
              <Lock className="h-3 w-3" />
              <span>Your results stay private. Only link is shared.</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF1FE]">
                <Link2 className="h-4.5 w-4.5 text-[#2563EB]" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-lg font-extrabold leading-tight tracking-tight sm:text-xl">
                Share the <br />
                {resultHeading}
              </h2>
              <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                Help a capable professional gain clarity and level up.
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="h-px flex-1 bg-slate-200" />
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#F1F4F9]">
                <Users className="h-2.5 w-2.5 text-slate-500" />
              </div>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="space-y-1.5">
              {shareOptions.map(({ key, title, subtitle, rowClass, iconClass, Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleShare(key)}
                  disabled={!referralUrl && !onPrepareReferral}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${rowClass}`}
                >
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white ${iconClass}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold leading-tight text-[#14213D] sm:text-[13px]">
                      {key === "copy" && copied ? "Link Copied!" : title}
                    </p>
                    <p className="mt-0.5 text-[10px] leading-tight text-slate-500 sm:text-[11px]">{subtitle}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-700" strokeWidth={2.5} />
                </button>
              ))}
            </div>

            {referralUrl && (
              <a
                href={referralUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open your private invite link"
                className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-[11px] font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 sm:text-[12px]"
              >
                <Link2 className="h-3.5 w-3.5 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{referralUrl}</span>
                <span className="shrink-0">Open link</span>
              </a>
            )}

            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                <LockKeyhole className="h-3.5 w-3.5" strokeWidth={2.4} />
              </div>
              <div className="text-[11px] leading-snug sm:text-[12px]">
                <p className="font-bold text-[#071a3b]">Your results stay private.</p>
                <p className="text-slate-500">Only the diagnostic link is shared.</p>
              </div>
            </div>

            <div className="rounded-lg border border-[#F0E3BC] bg-[#FCF6E3] p-2.5">
              <div className="grid grid-cols-[32px_1fr_auto] items-center gap-2">
                <div className="flex justify-center">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F7ECCB]">
                    <Trophy className="h-4 w-4 text-[#D9A215]" strokeWidth={1.8} />
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-[#14213D] sm:text-[14px]">Your Progress</p>
                  <div className="my-0.5 flex items-center">
                    {Array.from({ length: progress.goal }, (_, index) => (
                      <div key={index} className={`flex items-center ${index < progress.goal - 1 ? "flex-1" : ""}`}>
                        <div
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[9px] font-bold ${
                            index < completedCount
                              ? "border-[#C9962E] bg-[#D9A215] text-white shadow-sm"
                              : "border-slate-300 bg-white text-slate-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                        {index < progress.goal - 1 && (
                          <div className={`h-px flex-1 ${index < completedCount ? "bg-[#C9962E]" : "bg-slate-300"}`} />
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] leading-snug text-[#14213D] sm:text-[11px]">
                    {progress.completed}/{progress.goal} invited professionals have completed the diagnostic.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(referralCode ? `/progress?code=${encodeURIComponent(referralCode)}` : "/progress");
                  }}
                  className="flex items-center gap-1 rounded-md bg-[#D69E1F] px-2 py-1.5 text-[10px] font-bold text-white transition hover:bg-[#C79218]"
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span className="whitespace-nowrap">Track</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
