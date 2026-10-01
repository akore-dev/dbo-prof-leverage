export const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export const band = (score) => (score >= 8 ? "high" : score >= 5 ? "mid" : "low");

/* The four "At a Glance" lenses partition the eight diagnostic scores. */
export const glanceLenses = (scores) => [
  {
    key: "valuable",
    label: "I know what makes me valuable",
    score: Math.round(((scores.identity_clarity * 0.55) + (scores.value_articulation * 0.45)) * 10) / 10,
  },
  {
    key: "seen",
    label: "People clearly see my value",
    score: Math.round(((scores.evidence_visibility * 0.45) + (scores.positioning_strength * 0.55)) * 10) / 10,
  },
  {
    key: "heading",
    label: "I know where I’m heading next",
    score: Math.round(((scores.next_move_clarity * 0.60) + (scores.leverage_utilization * 0.40)) * 10) / 10,
  },
  {
    key: "proof",
    label: "My experience speaks for itself",
    score: Math.round(((scores.trust_pattern_awareness * 0.50) + (scores.signature_strength_recognition * 0.50)) * 10) / 10,
  },
];

/* Room statements: [before, gold highlight, after] per category and band. */
const ROOM_STATEMENTS = {
  identity_clarity: {
    high: ["You appear to know who you are professionally, and ", "that clarity is a genuine asset", " few people ever build."],
    mid: ["You seem to know yourself reasonably well, but ", "parts of your professional identity remain blurry,", " softening how clearly you come across."],
    low: ["You may be operating without ", "a clear read on your own professional identity,", " which can make every next step feel heavier."],
  },
  value_articulation: {
    high: ["When you speak about your value, ", "people appear to understand it quickly", " — a rare and powerful advantage."],
    mid: ["You can explain your value, but ", "it may be taking longer than it should", " for people to grasp what you truly bring."],
    low: ["Your strongest value may be ", "getting lost in translation,", " leaving others to underestimate what you bring."],
  },
  evidence_visibility: {
    high: ["Your proof appears well gathered — ", "your wins are ready to speak for you", " when the moment arrives."],
    mid: ["You have real evidence behind you, but ", "much of it may still be scattered,", " not yet working on your behalf."],
    low: ["Years of real results may be ", "sitting buried and unextracted,", " invisible exactly when you need them most."],
  },
  signature_strength_recognition: {
    high: ["You seem to know ", "the strengths that drive your best results", " — and that awareness compounds."],
    mid: ["Some of your strongest abilities may ", "still feel ordinary to you,", " hiding the very edge others would value most."],
    low: ["Your defining strengths may be ", "operating completely unnoticed,", " mistaken for “just how you work.”"],
  },
  trust_pattern_awareness: {
    high: ["You appear to clearly see ", "what people repeatedly trust you with", " — a signal of where your value is strongest."],
    mid: ["People rely on you in patterns you may ", "only partly recognize,", " and the meaning inside them is still forming."],
    low: ["The same kinds of problems keep finding you ", "for reasons you haven’t yet decoded,", " leaving real signal unread."],
  },
  positioning_strength: {
    high: ["The way you present yourself appears to ", "match the depth you’ve actually built", " — your outside matches your inside."],
    mid: ["Your positioning shows some of your value, but ", "important depth may still be missing", " from how you come across."],
    low: ["You may be presenting ", "far smaller than you actually are,", " and the gap could be quietly costing you."],
  },
  next_move_clarity: {
    high: ["Your next move appears ", "clear and grounded,", " which turns experience into momentum."],
    mid: ["You appear to know yourself well, but ", "your next step remains unusually unclear,", " making progress feel slower than it should."],
    low: ["Your next move may feel ", "foggy or fully stuck,", " turning every option into added pressure."],
  },
  leverage_utilization: {
    high: ["Your strongest assets appear to be ", "working where they create the highest return", " — effort well placed."],
    mid: ["Parts of your strength may be ", "pulling less return than they could,", " leaving upside quietly uncaptured."],
    low: ["A lot of your energy may be ", "flowing into low-return work,", " leaving your best assets on the bench."],
  },
};

const ROOM_ORDER = [
  "identity_clarity",
  "value_articulation",
  "evidence_visibility",
  "signature_strength_recognition",
  "trust_pattern_awareness",
  "positioning_strength",
  "next_move_clarity",
  "leverage_utilization",
];

export const roomStatements = (scores) =>
  ROOM_ORDER.map((key) => ROOM_STATEMENTS[key][band(scores[key])]);

/* Personalization: the lead-capture form is a third-party iframe, so the
   name arrives via ?name= / #n= on the result URL when available. */
export const getVisitorName = () => {
  try {
    const url = new URL(window.location.href);
    const fromQuery = url.searchParams.get("name");
    const fromHash = new URLSearchParams(url.hash.slice(1)).get("n");
    const raw = (fromQuery || fromHash || "").trim();
    return raw ? raw.replace(/[<>]/g, "").slice(0, 60) : null;
  } catch (urlError) {
    return null;
  }
};

/* Section headings in the designs put the final word in gold
   ("What We *Noticed*", "At a *Glance*"). Titles are AI-supplied, so the
   split is derived rather than hardcoded. */
export const splitTrailingWord = (title) => {
  const text = String(title || "").trim();
  const at = text.lastIndexOf(" ");
  if (at === -1) return { lead: "", gold: text };
  return { lead: text.slice(0, at + 1), gold: text.slice(at + 1) };
};

/* The hero statement renders one phrase in gold. The phrase is supplied by
   the model (opening_observation.highlight) and must appear verbatim; if it
   doesn't match, the statement simply renders without emphasis. */
export const emphasize = (text, phrase) => {
  const full = String(text || "");
  const needle = String(phrase || "").trim().replace(/[.,;:]+$/, "");
  if (!needle) return { before: full, gold: "", after: "" };

  const at = full.toLowerCase().indexOf(needle.toLowerCase());
  if (at === -1) return { before: full, gold: "", after: "" };

  return {
    before: full.slice(0, at),
    gold: full.slice(at, at + needle.length),
    after: full.slice(at + needle.length),
  };
};
