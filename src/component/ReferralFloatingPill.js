import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ReferralFloatingPill({ shared = false, onInvite, onProgress }) {
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 40);
    const pulseTimer = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1800);
    }, 38000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(pulseTimer);
    };
  }, []);

  const Icon = shared ? TrendingUp : Sparkles;
  const prompt = "Know someone who'd benefit from this?";
  const actionLabel = shared ? "View Progress" : "Invite Them";

  return (
    <div className={`fixed bottom-4 left-4 right-4 z-40 flex justify-center transition-all duration-500 ease-out sm:bottom-6 sm:left-auto sm:right-6 sm:justify-end ${visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}>
      <button
        type="button"
        onClick={shared ? onProgress : onInvite}
        className={`flex w-full max-w-[420px] items-center justify-between gap-4 rounded-full bg-[#D49A22] px-6 py-4 text-white shadow-lg shadow-yellow-900/20 transition hover:bg-[#C98D18] focus:outline-none focus:ring-2 focus:ring-[#D49A22]/40 focus:ring-offset-2 focus:ring-offset-[#050D18] sm:w-auto sm:max-w-[380px] sm:flex-col sm:items-start sm:justify-center sm:gap-2 sm:px-5 sm:py-4 sm:text-left ${pulse ? "scale-[1.02] shadow-[0_0_0_6px_rgba(212,154,34,0.14),0_14px_34px_rgba(113,63,18,0.24)]" : ""}`}
        aria-label={shared ? "View referral progress" : "Invite someone"}
      >
        <div className="flex min-w-0 items-center gap-3 sm:gap-2">
          <Icon className="h-6 w-6 shrink-0" fill={shared ? "none" : "white"} strokeWidth={shared ? 2 : 1.8} />
          <span className="text-left text-sm font-semibold leading-5 sm:whitespace-nowrap">
            {prompt}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-semibold sm:pl-8">
          <span>{actionLabel}</span>
          <ArrowRight className="h-[18px] w-[18px]" />
        </div>
      </button>
    </div>
  );
}
