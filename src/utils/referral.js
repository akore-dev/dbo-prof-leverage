export const REFERRAL_GOAL = 5;

const PROMPT_KEY = "pl_share_prompted";
const LINK_KEY = "professional_leverage_referral_url";
const CODE_KEY = "professional_leverage_referral_code";
const EMAIL_KEY = "professional_leverage_referral_email";
const SHARED_KEY = "professional_leverage_referral_shared";

export const getReferralCodeFromLink = (referralUrl = "") => {
  try {
    const url = new URL(referralUrl, window.location.origin);
    const pathMatch = url.pathname.match(/^\/s\/([^/]+)\/?$/i);
    const code = pathMatch ? decodeURIComponent(pathMatch[1]) : url.searchParams.get("code");
    return String(code || "").trim().toUpperCase();
  } catch (error) {
    return "";
  }
};

export const rememberReferralLink = (referralUrl = "", email = "") => {
  if (!referralUrl) return;

  try {
    localStorage.setItem(LINK_KEY, referralUrl);
    const code = getReferralCodeFromLink(referralUrl);
    if (code) {
      localStorage.setItem(CODE_KEY, code);
    }
    if (email) {
      localStorage.setItem(EMAIL_KEY, String(email).trim().toLowerCase());
    }
  } catch (storageError) {
    // Non-blocking.
  }
};

export const rememberReferralEmail = (email = "") => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) return;

  try {
    localStorage.setItem(EMAIL_KEY, normalizedEmail);
  } catch (storageError) {
    // Non-blocking.
  }
};

export const getStoredReferralEmail = () => {
  try {
    return localStorage.getItem(EMAIL_KEY) || "";
  } catch (storageError) {
    return "";
  }
};

export const getStoredReferralLink = () => {
  try {
    const referralUrl = localStorage.getItem(LINK_KEY) || "";
    const code = getReferralCodeFromLink(referralUrl);

    if (!referralUrl || !code) return referralUrl;

    const url = new URL(referralUrl, window.location.origin);
    const shortUrl = `${url.origin}/s/${encodeURIComponent(code)}`;
    if (shortUrl !== referralUrl) localStorage.setItem(LINK_KEY, shortUrl);

    return shortUrl;
  } catch (storageError) {
    return "";
  }
};

export const getStoredReferralCode = () => {
  try {
    return localStorage.getItem(CODE_KEY) || getReferralCodeFromLink(getStoredReferralLink());
  } catch (storageError) {
    return "";
  }
};

export const fetchReferralProgress = async (code) => {
  const normalizedCode = String(code || "").trim().toUpperCase();

  if (!normalizedCode) {
    return { code: "", completed: 0, goal: REFERRAL_GOAL, invitations: [] };
  }

  const response = await fetch("/api/referral-progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: normalizedCode }),
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Could not load referral progress.");
  }

  return {
    code: data.code || normalizedCode,
    completed: Number(data.completed || 0),
    goal: Number(data.goal || REFERRAL_GOAL),
    invitations: Array.isArray(data.invitations) ? data.invitations : [],
  };
};

const WHATSAPP_SHARE_MESSAGES = [
  `What if the biggest thing slowing your career isn't your ability, but something you can't easily see?

I found this surprisingly thought-provoking.
Free Professional Leverage Diagnostic (5 minutes):
[LINK]`,
  `Most professionals don't have a capability problem.
They have a leverage problem.
This free diagnostic made me wonder which one I have.
[LINK]`,
  `Ever feel like you're capable of more, but your career isn't fully reflecting it?
This 5-minute diagnostic explains why that might happen.
Worth taking.
[LINK]`,
  `This asked me questions I wasn't expecting.
The result explained a few things I've quietly wondered about for years.
Curious what yours would say.
[LINK]`,
  `You probably know your strengths.
But do you know which one is costing you the most by being underused?
This was worth five minutes.
[LINK]`,
  `What if the biggest thing slowing your career isn't your ability, but something you can't see?
I wasn't expecting this free 5-minute Professional Leverage Diagnostic to be this insightful.
I'm genuinely curious what it would uncover for you.
[LINK]`,
  `The hardest career problems are often the ones you can't see yourself.
This free 5-minute Professional Leverage Diagnostic showed me patterns I hadn't noticed before.
Curious what it would uncover for you.
[LINK]`,
  `Ever feel like you're doing good work, but not getting the opportunities you should?
This free diagnostic explains one possible reason why.
It definitely made me think.
[LINK]`,
  `I expected another career quiz.
Instead, this showed me patterns between my strengths, positioning, and direction that I'd never connected before.
Worth five minutes.
[LINK]`,
  `What if you've already built more professional value than your career currently reflects?
That's the question this free Professional Leverage Diagnostic made me think about.
[LINK]`,
];


const EMAIL_SHARE_MESSAGE =
  "I just took the Professional Leverage Diagnostic, a free 5-minute read on where your career may be carrying hidden friction. Worth a look:";

const getRandomMessageIndex = () => {
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    const randomValue = new Uint32Array(1);
    window.crypto.getRandomValues(randomValue);
    return randomValue[0] % WHATSAPP_SHARE_MESSAGES.length;
  }

  return Math.floor(Math.random() * WHATSAPP_SHARE_MESSAGES.length);
};

export const getRandomReferralShareMessage = (referralUrl = "") => {
  const template = WHATSAPP_SHARE_MESSAGES[getRandomMessageIndex()];
  return template.replace("[LINK]", referralUrl);
};

const copyText = async (text = "") => {
  if (!text) return false;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (clipboardError) {
    const input = document.createElement("textarea");
    input.value = text;
    document.body.appendChild(input);
    input.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(input);
    return copied;
  }
};

export const buildRandomWhatsAppShareUrl = (referralUrl = "") =>
  `https://wa.me/?text=${encodeURIComponent(getRandomReferralShareMessage(referralUrl))}`;


export const buildShareTargets = (referralUrl = "") => ({
  whatsapp: () => buildRandomWhatsAppShareUrl(referralUrl),
  email: () =>
    `mailto:?subject=${encodeURIComponent("A 5-minute diagnostic worth taking")}&body=${encodeURIComponent(`${EMAIL_SHARE_MESSAGE}\n\n${referralUrl}`)}`,
  linkedin: () =>
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`,
});

export const copyReferralLink = async (referralUrl = "") => copyText(referralUrl);

export const wasSharePrompted = () => {
  try {
    return sessionStorage.getItem(PROMPT_KEY) === "1";
  } catch (storageError) {
    return false;
  }
};

export const markSharePrompted = () => {
  try {
    sessionStorage.setItem(PROMPT_KEY, "1");
  } catch (storageError) {
    // Non-blocking.
  }
};
export const wasReferralShared = () => {
  try {
    return localStorage.getItem(SHARED_KEY) === "1";
  } catch (storageError) {
    return false;
  }
};

export const markReferralShared = () => {
  try {
    localStorage.setItem(SHARED_KEY, "1");
  } catch (storageError) {
    // Non-blocking.
  }
};

