import { useEffect, useMemo, useState } from "react";
import {
  Gift,
  Link2,
  Lock,
  Mail,
  Trophy,
  CalendarCheck,
  Info,
  Send,
  Users,
  Gem,
  ChevronDown,
  ChevronUp,
  CircleCheck,
} from "lucide-react";
import { WhatsAppIcon, LinkedInIcon } from "./ShareModal";
import {
  buildShareTargets,
  copyReferralLink,
  fetchReferralProgress,
  getReferralCodeFromLink,
  getStoredReferralEmail,
  getStoredReferralLink,
  rememberReferralEmail,
  rememberReferralLink,
  REFERRAL_GOAL,
} from "../utils/referral";

const AVATAR_COLORS = ["bg-[#E8D9C3] text-[#7A5B2E]", "bg-[#CFE0F5] text-[#2D4A75]", "bg-[#D8EFDD] text-[#2F6B45]"];

const BarsLogo = () => (
  <svg viewBox="0 0 34 34" fill="none" className="h-9 w-9" aria-hidden="true">
    <rect x="3" y="20" width="4" height="10" rx="1" fill="#D9A215" />
    <rect x="10" y="14" width="4" height="16" rx="1" fill="#C9962E" />
    <rect x="17" y="8" width="4" height="22" rx="1" fill="#B8862A" />
    <rect x="24" y="3" width="4" height="27" rx="1" fill="#14213D" />
  </svg>
);

function ProgressRing({ completed, goal }) {
  const radius = 84;
  const circumference = 2 * Math.PI * radius;
  const fraction = Math.min(completed / goal, 1);

  return (
    <svg viewBox="0 0 200 200" className="h-52 w-52 sm:h-60 sm:w-60" role="img" aria-label={`${completed} of ${goal} completed`}>
      <circle cx="100" cy="100" r={radius} fill="none" stroke="#E9EDF2" strokeWidth="13" />
      {fraction > 0 && (
        <circle cx="100" cy="100" r={radius} fill="none" stroke="#C9962E" strokeWidth="13" strokeLinecap="round" strokeDasharray={`${circumference * fraction} ${circumference}`} transform="rotate(-90 100 100)" />
      )}
      <text x="100" y="92" textAnchor="middle" fontSize="52" fontWeight="800" fill="#14213D">{completed}</text>
      <text x="100" y="118" textAnchor="middle" fontSize="20" fontWeight="600" fill="#14213D">of {goal}</text>
      <text x="100" y="140" textAnchor="middle" fontSize="15" fill="#5B6779">completed</text>
    </svg>
  );
}

const HOW_IT_WORKS = [
  { Icon: Send, tint: "bg-[#EAF1FE] text-[#2563EB]", title: "1. Share", text: "Share your private link with professionals who could benefit." },
  { Icon: Users, tint: "bg-[#EAF1FE] text-[#2563EB]", title: "2. They Complete", text: "When they complete the assessment and view results, it counts automatically." },
  { Icon: Lock, tint: "bg-[#EAF1FE] text-[#2563EB]", title: "3. Stay Private", text: "Your personal results are never shared. Only the diagnostic link is shared." },
  { Icon: Gift, tint: "bg-[#FBF4DE] text-[#C9962E]", title: "4. Get Rewarded", text: `Once ${REFERRAL_GOAL} professionals complete the assessment, your debrief is unlocked.` },
];

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));

const formatWhen = (value) => {
  if (!value) return "Completed";

  try {
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
  } catch (error) {
    return "Completed";
  }
};

export default function ReferralProgress() {
  const params = new URLSearchParams(window.location.search);
  const queryEmail = normalizeEmail(params.get("email") || params.get("e"));
  const initialEmail = queryEmail || getStoredReferralEmail();
  const [email, setEmail] = useState(initialEmail);
  const [emailInput, setEmailInput] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [storedLink, setStoredLink] = useState(getStoredReferralLink());
  const [progress, setProgress] = useState({ code: "", completed: 0, goal: REFERRAL_GOAL, invitations: [] });
  const [loading, setLoading] = useState(Boolean(initialEmail));
  const [identityLoading, setIdentityLoading] = useState(Boolean(initialEmail));
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [howOpen, setHowOpen] = useState(true);

  const link = useMemo(() => {
    if (storedLink && (!code || getReferralCodeFromLink(storedLink) === code)) return storedLink;
    return code ? `${window.location.origin}/s/${encodeURIComponent(code)}` : "";
  }, [code, storedLink]);
  const shareTargets = useMemo(() => buildShareTargets(link), [link]);

  useEffect(() => {
    if (!email) {
      setLoading(false);
      setIdentityLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setIdentityLoading(true);
    setError("");

    const loadProgressForEmail = async () => {
      const response = await fetch("/api/referrer-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.url || !data?.code) {
        throw new Error(data?.error || "Could not prepare your referral progress.");
      }

      rememberReferralEmail(email);
      rememberReferralLink(data.url, email);

      if (!cancelled) {
        setStoredLink(data.url);
        setCode(data.code);
      }

      const nextProgress = await fetchReferralProgress(data.code);
      if (!cancelled) setProgress(nextProgress);
    };

    loadProgressForEmail()
      .catch((loadError) => {
        if (!cancelled) setError(loadError.message || "Could not load referral progress.");
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
          setIdentityLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [email]);

  const completed = progress.completed;
  const remaining = Math.max(progress.goal - completed, 0);
  const percent = Math.round((completed / progress.goal) * 100);
  const unlocked = remaining === 0;

  const handleCopy = async () => {
    const ok = await copyReferralLink(link);
    setCopied(ok);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailSubmit = (event) => {
    event.preventDefault();
    const normalizedEmail = normalizeEmail(emailInput);

    if (!isValidEmail(normalizedEmail)) {
      setError("Enter a valid email to view your referral progress.");
      return;
    }

    setEmail(normalizedEmail);
  };

  const quickShare = [
    { key: "whatsapp", label: "WhatsApp", className: "bg-[#22C55E]", Icon: WhatsAppIcon, href: shareTargets.whatsapp() },
    { key: "email", label: "Email", className: "bg-[#2563EB]", Icon: Mail, href: shareTargets.email() },
    { key: "linkedin", label: "LinkedIn", className: "bg-[#0A66C2]", Icon: LinkedInIcon, href: shareTargets.linkedin() },
    { key: "more", label: "Copy", className: "bg-[#14213D]", Icon: Link2, href: null },
  ];

  if (!email) {
    return (
      <div className="diagnostic-page min-h-screen bg-[#EEF1F5] text-[#14213D]">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <a href="/" className="flex items-center gap-3">
              <BarsLogo />
              <div className="leading-none">
                <p className="text-[13px] font-bold tracking-[0.18em] text-[#14213D]">PROFESSIONAL</p>
                <p className="mt-[2px] text-[15px] font-extrabold tracking-[0.14em] text-[#14213D]">LEVERAGE</p>
                <p className="mt-[2px] text-[8px] tracking-[0.3em] text-slate-400">DIAGNOSTIC</p>
              </div>
            </a>

            <div className="flex items-center gap-2 text-[12px] leading-[1.4] text-slate-500 sm:text-[13px]">
              <Lock className="h-5 w-5 shrink-0 text-slate-400" />
              <span>Your results stay private. Only your referral progress is shown.</span>
            </div>
          </div>
        </header>

        <main className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
          <form onSubmit={handleEmailSubmit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm md:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FBF4DE]">
              <Gift className="h-7 w-7 text-[#C9962E]" strokeWidth={1.8} />
            </div>

            <h1 className="mt-5 text-[28px] font-extrabold leading-tight tracking-tight text-[#14213D] sm:text-[34px]">View Your Referral Progress</h1>
            <p className="mt-3 text-[14px] leading-[1.65] text-slate-600 sm:text-[15px]">
              Enter the email you used for your diagnostic so we can load your private referral link and progress.
            </p>

            <label className="mt-6 block text-left text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Email</label>
            <input
              type="email"
              value={emailInput}
              onChange={(event) => setEmailInput(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[#14213D] outline-none transition focus:border-[#C9962E]"
              autoComplete="email"
              required
            />

            {error && <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            <button type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#14213D] px-5 py-3.5 text-[14px] font-bold text-white transition hover:bg-[#1C2C4F]">
              <Link2 className="h-4 w-4" />
              <span>Continue</span>
            </button>
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className="diagnostic-page min-h-screen bg-[#EEF1F5] text-[#14213D]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <a href="/" className="flex items-center gap-3">
            <BarsLogo />
            <div className="leading-none">
              <p className="text-[13px] font-bold tracking-[0.18em] text-[#14213D]">PROFESSIONAL</p>
              <p className="mt-[2px] text-[15px] font-extrabold tracking-[0.14em] text-[#14213D]">LEVERAGE</p>
              <p className="mt-[2px] text-[8px] tracking-[0.3em] text-slate-400">DIAGNOSTIC</p>
            </div>
          </a>

          <div className="flex items-center gap-2 text-[12px] leading-[1.4] text-slate-500 sm:text-[13px]">
            <Lock className="h-5 w-5 shrink-0 text-slate-400" />
            <span>Your results stay private. Only the diagnostic link is shared.</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 md:py-10">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FBF4DE]">
              <Gift className="h-8 w-8 text-[#C9962E]" strokeWidth={1.8} />
            </div>
            <h1 className="mt-5 text-[38px] font-extrabold leading-[1.05] tracking-tight sm:text-[46px]">Your Referral Progress</h1>
            <p className="mt-5 max-w-md text-[15px] leading-[1.7] text-slate-600 sm:text-[16px]">
              Help {progress.goal} professionals complete the assessment and receive a complimentary <span className="font-semibold text-[#C9962E]">30-minute Professional Leverage Debrief.</span>
            </p>
            {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          </div>

          <div className="flex flex-col items-center">
            <ProgressRing completed={completed} goal={progress.goal} />
            <p className="mt-3 text-[17px] text-slate-600 sm:text-[19px]">
              {loading || identityLoading ? "Loading progress..." : <>You are <span className="font-bold text-[#C9962E]">{percent}%</span> of the way there.</>}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm md:p-7">
          <div className="grid gap-8 md:grid-cols-[1.6fr_1fr] md:divide-x md:divide-slate-200">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#EAF1FE]">
                <Link2 className="h-6 w-6 text-[#2563EB]" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-[19px] font-bold sm:text-[21px]">Your Private Invite Link</h2>
                <p className="mt-1 text-[13px] leading-[1.6] text-slate-500 sm:text-[14px]">Share your unique link with professionals who could benefit from this diagnostic.</p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <input readOnly value={link || "Preparing referral link..."} onFocus={(event) => event.target.select()} className="min-w-0 flex-1 truncate rounded-lg border border-slate-200 bg-white px-4 py-3 text-[13px] text-slate-600 sm:text-[14px]" />
                  <button type="button" onClick={handleCopy} disabled={!link} className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#14213D] px-5 py-3 text-[14px] font-bold text-white transition hover:bg-[#1C2C4F] disabled:cursor-not-allowed disabled:opacity-60">
                    <Link2 className="h-4 w-4" />
                    <span>{copied ? "Copied!" : "Copy Link"}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="md:pl-8">
              <h3 className="text-[17px] font-bold sm:text-[19px]">Quick Share</h3>
              <div className="mt-4 flex items-start gap-5">
                {quickShare.map(({ key, label, className, Icon, href }) => (
                  <button key={key} type="button" disabled={!link} onClick={() => (href ? window.open(href, "_blank", "noopener,noreferrer") : handleCopy())} className="flex flex-col items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-full text-white transition hover:opacity-85 ${className}`}>
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="text-[12px] font-medium text-slate-600">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.45fr_1fr]">
          <div className="rounded-2xl bg-white p-6 shadow-sm md:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border-2 border-[#22A75D]/30">
                <CircleCheck className="h-6 w-6 text-[#22A75D]" />
              </div>
              <div>
                <h2 className="text-[19px] font-bold sm:text-[21px]">Professionals You Have Helped</h2>
                <p className="mt-1 text-[13px] text-slate-500 sm:text-[14px]">These professionals have completed the assessment and viewed results.</p>
              </div>
            </div>

            {progress.invitations.length === 0 ? (
              <p className="mt-8 rounded-xl bg-[#F5F7FA] px-5 py-6 text-center text-[14px] text-slate-500">No completions yet. Share your link to get started.</p>
            ) : (
              <div className="mt-5 divide-y divide-slate-100">
                {progress.invitations.map(({ name, email: invitationEmail, completedAt }, index) => (
                  <div key={`${invitationEmail}-${completedAt}-${index}`} className="flex items-center gap-4 py-4">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[15px] font-bold ${AVATAR_COLORS[index % AVATAR_COLORS.length]}`}>
                      {String(name || "I").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-bold">{name}</p>
                      <p className="truncate text-[13px] text-slate-500">{invitationEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-semibold text-[#22A75D]">Completed</p>
                      <p className="text-[13px] text-slate-500">{formatWhen(completedAt)}</p>
                    </div>
                    <CircleCheck className="h-6 w-6 shrink-0 text-[#22A75D]" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#F0E3BC] bg-[#FCF6E3] p-6 md:p-7">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F7ECCB]">
                <Trophy className="h-7 w-7 text-[#D9A215]" strokeWidth={1.8} />
              </div>
              <h2 className="text-[19px] font-bold sm:text-[21px]">{unlocked ? "Debrief Unlocked!" : "You Are Almost There!"}</h2>
            </div>

            <p className="mt-4 text-[14px] leading-[1.65] text-slate-600 sm:text-[15px]">
              {unlocked ? "You have unlocked your complimentary Professional Leverage Debrief. Schedule it below." : `${remaining} more completed ${remaining === 1 ? "assessment" : "assessments"} to unlock your complimentary Professional Leverage Debrief.`}
            </p>

            {!unlocked && (
              <div className="relative mt-6 pb-4 text-center">
                <Gem className="absolute left-4 top-2 h-4 w-4 text-[#E3CE96]" />
                <Gem className="absolute right-6 top-10 h-3 w-3 text-[#E3CE96]" />
                <p className="text-[64px] font-extrabold leading-none text-[#C9962E] sm:text-[72px]">{remaining}</p>
                <p className="mt-1 text-[20px] font-semibold text-[#C9962E] sm:text-[22px]">more to go</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-[#D9EBD9] bg-[#F4FAF4] p-6 md:p-7">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                <CalendarCheck className="h-7 w-7 text-[#22A75D]" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#22A75D] sm:text-[15px]">Your Thank-You</p>
                <h2 className="mt-1 text-[22px] font-extrabold leading-tight sm:text-[26px]">FREE 30-Minute Professional Leverage Debrief</h2>
                <p className="mt-3 max-w-md text-[13px] leading-[1.65] text-slate-600 sm:text-[14px]">A guided interpretation session to help you understand your results and clarify what deserves deeper work.</p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <button type="button" disabled={!unlocked} className={`flex w-full max-w-sm items-center justify-center gap-2 rounded-lg px-5 py-3.5 text-[15px] font-bold text-white transition ${unlocked ? "bg-[#22A75D] hover:bg-[#1D9250]" : "cursor-not-allowed bg-slate-400"}`}>
                <CalendarCheck className="h-5 w-5" />
                <span>Schedule My Session</span>
              </button>
              <p className="mt-2 text-[12px] text-slate-500 sm:text-[13px]">Once unlocked, you can schedule at your convenience.</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm md:p-7">
          <button type="button" onClick={() => setHowOpen((current) => !current)} aria-expanded={howOpen} className="flex w-full items-center justify-between">
            <span className="flex items-center gap-3">
              <Info className="h-6 w-6 text-[#2563EB]" />
              <span className="text-[17px] font-bold sm:text-[19px]">How it works</span>
            </span>
            {howOpen ? <ChevronUp className="h-5 w-5 text-slate-500" /> : <ChevronDown className="h-5 w-5 text-slate-500" />}
          </button>

          {howOpen && (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-4 md:gap-0 md:divide-x md:divide-slate-200">
              {HOW_IT_WORKS.map(({ Icon, tint, title, text }) => (
                <div key={title} className="flex items-start gap-3 md:px-5 md:first:pl-0 md:last:pr-0">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${tint}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold">{title}</p>
                    <p className="mt-1 text-[12px] leading-[1.55] text-slate-500 sm:text-[13px]">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
