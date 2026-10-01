import { decodeResultPayload, encodeResultPayload, getResultPayloadFromUrl } from "./resultPayload";

const scores = {
  identity_clarity: 7,
  value_articulation: 6,
  evidence_visibility: 5,
  signature_strength_recognition: 8,
  trust_pattern_awareness: 6,
  positioning_strength: 7,
  next_move_clarity: 4,
  leverage_utilization: 5,
};

const interpretation = {
  profile_snapshot: { headline: "The quiet strategist" },
  your_pattern: { title: "Pattern", value: "Value", summary: "Summary" },
};

test("round-trips a result payload without losing scores or interpretation", () => {
  const payload = encodeResultPayload({ scores, interpretation });
  expect(decodeResultPayload(payload)).toEqual({ scores, interpretation });
});

test("rejects incomplete scores", () => {
  expect(() => encodeResultPayload({ scores: { identity_clarity: 7 }, interpretation })).toThrow(/invalid scores/i);
});

test("reads an encoded result from the URL hash", () => {
  expect(getResultPayloadFromUrl("https://example.com/result#r=abc123")).toBe("abc123");
});