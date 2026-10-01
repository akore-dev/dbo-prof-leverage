import pako from "pako";
import { Buffer } from "buffer";

export const MAX_RESULT_PAYLOAD_LENGTH = 16000;

const SCORE_KEYS = [
  "identity_clarity", "value_articulation", "evidence_visibility",
  "signature_strength_recognition", "trust_pattern_awareness",
  "positioning_strength", "next_move_clarity", "leverage_utilization",
];

const toBase64Url = (bytes) => Buffer.from(bytes).toString("base64")
  .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");

const fromBase64Url = (value) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(base64 + "=".repeat((4 - (base64.length % 4)) % 4), "base64");
};

const unpackInterpretation = (p) => ({
  your_pattern: { title: p[0][0], value: p[0][1], summary: p[0][2] },
  what_this_pattern_suggests: { title: p[1][0], short: p[1][1], expanded: p[1][2] },
  what_may_be_quietly_costing_you: { title: p[2][0], points: p[2][1] },
  where_hidden_value_may_be_sitting: { title: p[3][0], points: p[3][1] },
  what_this_may_open_up: { title: p[4][0], points: p[4][1] },
});

const assertValidScores = (scores) => {
  if (!scores || !SCORE_KEYS.every((key) => Number.isInteger(scores[key]) && scores[key] >= 1 && scores[key] <= 10)) {
    throw new Error("The result contains invalid scores.");
  }
};

export const encodeResultPayload = ({ scores, interpretation }) => {
  assertValidScores(scores);
  const packed = [2, SCORE_KEYS.map((key) => scores[key]), interpretation];
  const bytes = new TextEncoder().encode(JSON.stringify(packed));
  const payload = toBase64Url(pako.deflateRaw(bytes, { level: 9 }));
  if (payload.length > MAX_RESULT_PAYLOAD_LENGTH) {
    throw new Error("The generated result is too large for a safe URL.");
  }
  return payload;
};

export const decodeResultPayload = (payload) => {
  if (!payload || payload.length > MAX_RESULT_PAYLOAD_LENGTH) throw new Error("The result URL is invalid.");
  const json = new TextDecoder().decode(pako.inflateRaw(fromBase64Url(payload)));
  const packed = JSON.parse(json);
  if (!Array.isArray(packed) || ![1, 2].includes(packed[0]) || !Array.isArray(packed[1]) || packed[1].length !== 8) {
    throw new Error("The result URL has an unsupported format.");
  }
  const scores = Object.fromEntries(SCORE_KEYS.map((key, index) => [key, Number(packed[1][index])]));
  assertValidScores(scores);
  if (packed[0] === 2) {
    if (!packed[2] || typeof packed[2] !== "object" || !packed[2].profile_snapshot) {
      throw new Error("The result URL has an unsupported format.");
    }
    return { scores, interpretation: packed[2] };
  }
  if (!Array.isArray(packed[2]) || packed[2].length !== 5) {
    throw new Error("The result URL has an unsupported format.");
  }
  return { scores, interpretation: unpackInterpretation(packed[2]) };
};

export const getResultPayloadFromUrl = (url) =>
  new URLSearchParams(new URL(url).hash.slice(1)).get("r");
