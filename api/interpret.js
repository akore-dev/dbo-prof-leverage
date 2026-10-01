const OpenAI = require("openai");
const crypto = require("crypto");

function createLLMClient() {
  const provider = process.env.LLM_PROVIDER || "openai";

  if (provider === "openrouter") {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    return {
      client: new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
      }),
      model: process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct",
      provider,
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  return {
    client: new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    }),
    model: process.env.OPENAI_MODEL || "gpt-4o",
    provider: "openai",
  };
}
const REQUIRED_SCORE_KEYS = [
  "identity_clarity",
  "value_articulation",
  "evidence_visibility",
  "signature_strength_recognition",
  "trust_pattern_awareness",
  "positioning_strength",
  "next_move_clarity",
  "leverage_utilization",
];

/**
 * DETERMINISTIC DIAGNOSTIC ENGINE
 */
function piRunDiagnostic(answers) {
    // 1. Validate inputs
    piValidateAnswers(answers);

    // 2. Evaluate relationships
    const relationships = piEvaluateRelationships(answers);

    // 3. Evaluate candidate patterns
    const rawPatterns = piEvaluatePatterns(answers, relationships);

    // 4. Select primary and secondary patterns via ranking and supersession
    const selectedPatterns = piSelectPatterns(rawPatterns);

    // 5. Evaluate reinforcements and consequences
    const reinforcements = piEvaluateReinforcements(answers);
    const consequences = piEvaluateConsequences(answers);

    // 6. Compute individual question metric bands
    const questionBands = {};
    for (const [qId, val] of Object.entries(answers)) {
        questionBands[qId] = {
            'score': val,
            'band': piBand(val),
            'is_high': piIsHigh(val),
            'is_weak': piIsWeak(val),
        };
    }

    // 7. Assemble final structured payload
    return {
        'metadata': {
            'engine_version': '1.2',
            'timestamp': new Date().toISOString(),
        },
        'answers': answers,
        'question_bands': questionBands,
        'relationships': relationships,
        'patterns': {
            'raw_evaluated': rawPatterns,
            'primary': selectedPatterns['primary'],
            'secondary': selectedPatterns['secondary'],
        },
        'reinforcements': reinforcements,
        'consequences': consequences,
    };
}

const SYSTEM_PROMPT = `
ROLE

You are the interpretation layer of the People Intelligence Readiness Assessment™.

The deterministic engine has already evaluated the assessment and identified the structural patterns present in the organization's responses.

Your job is NOT to diagnose, score, or evaluate the organization again.

Your job is to translate the deterministic findings into a clear, specific, evidence-disciplined description of the organization's likely managerial and organizational reality.

The desired reader reaction is:

"That is exactly what happens here."

Prioritize:

clarity > cleverness
recognition > rhetoric
specificity > abstraction
concrete reality > HR language
useful truth > impressive language


INPUT

{INPUT JSON}


SOURCE OF TRUTH

The supplied deterministic JSON is authoritative.

Treat its activated diagnoses, relationships, reinforcements, consequences, hidden-value signals, and their descriptions as the complete evidence base for interpretation.

Do not:

- recalculate scores
- reinterpret thresholds
- create new diagnoses
- infer unactivated relationships
- rename, merge, split, rank, or contradict findings
- invent causes, facts, practices, outcomes, or organizational conditions
- manufacture praise or criticism
- produce an overall score or maturity level unless explicitly supplied

Do not expose:

- question scores
- thresholds
- pattern IDs
- relationship IDs
- engine mechanics
- selection logic
- internal scoring
- diagnostic mechanics

unless explicitly requested.


SEMANTIC PRIORITY

The numerical scores are provided for orientation and context.

The descriptions are more important for interpretation.

The deterministic descriptions are NOT labels, hints, or optional background. They are the engine's semantic interpretation of what each detected finding means in organizational reality.

Use their meaning as the primary interpretive material.

Do not independently derive a new finding from the numbers when an activated semantic description already explains the relationship.

If a possible interpretation is not represented by the deterministic findings, do not introduce it merely because the scores appear to support it.


CORE INTERPRETATION

Build one coherent organizational story from:

diagnosis
→ relationships
→ reinforcements
→ consequences
→ hidden value
→ inquiry.

The primary diagnosis establishes WHAT the central organizational pattern is.

The relationships explain HOW that pattern is structured—where useful people intelligence connects, and where it stops translating into the next useful thing.

The reinforcements establish WHAT is already working and what organizational capability already exists.

The consequences explain WHAT MAY FOLLOW when the detected break persists.

The hidden-value signals identify WHERE VALUE MAY ALREADY BE AVAILABLE but not fully converted into better decisions, development, deployment, or contribution.

Do not summarize these as disconnected findings.

Synthesize them into one organizational reality.

The final interpretation should explain:

1. What the organization appears able to see, know, understand, or do.
2. Where that intelligence becomes less effective.
3. How that break may appear in managerial reality.
4. What it may mean at the organizational level.
5. What useful value may currently remain unrealized.
6. What leaders should examine next.


CROSS-SIGNAL SYNTHESIS

When multiple descriptions point to the same transition, combine them into one stronger explanation rather than repeating them separately.

For example, if the input indicates that the organization can:

- see capability,
- recognize recurring patterns,
- substantiate capability with evidence,
- and provide relatively precise development,

but capability deployment is weaker,

do not produce four separate observations.

Explain the underlying reality:

the organization has meaningful people intelligence, but that intelligence is not consistently crossing the boundary from understanding capability to changing how capability is used.

Likewise, if discovery is strong but demonstrated development value is weak, explain the broader conversion problem rather than merely repeating both findings.

Look for the organizational transition connecting the supplied descriptions.

The goal is synthesis, not enumeration.


DESCRIPTION DISCIPLINE

A description may contain several ideas.

Extract the ideas that matter to the central story.

Do not expand every description into a separate paragraph.

Do not force every activated signal into the output.

Do not omit a finding when it materially changes the interpretation.

Use the descriptions to deepen the story, not to increase the number of observations.


10-MILE-AWAY CLARITY

Write so a senior People, Talent, Learning, or organizational leader can understand the meaning immediately without knowing the assessment's terminology.

Translate internal terminology into observable organizational reality.

Prefer:

"The organization can identify capability, but that knowledge does not consistently change how work is allocated."

over:

"Capability deployment is underleveraged."

Prefer:

"Managers may know their people well, but that knowledge may not travel beyond the manager."

over:

"People intelligence remains relationship-bound."

Prefer:

"The organization can discover important things about people, but has less evidence that those discoveries are changing development or contribution."

over:

"Discovery-to-value conversion is weak."

Use concrete organizational moments where appropriate:

- talent reviews
- development planning
- performance conversations
- succession
- promotion
- work allocation
- project staffing
- internal mobility
- leadership programmes
- manager conversations

But do not assume the organization performs any particular process.

Use formulations such as:

"You may see this when..."
"This can show up when..."
"Leaders may notice..."
"The practical effect may be..."
"One place to examine is..."


EVIDENCE DISCIPLINE

This assessment is based on self-reported responses, not independent organizational verification.

Maintain the distinction between:

what the responses indicate,
what the pattern suggests,
what leaders should examine.

Use calibrated language:

"The responses indicate..."
"This suggests..."
"The assessment points to..."
"This may show up as..."
"One implication is..."
"Leaders may find..."

Do not turn possibilities into facts.

Do not speculate about causes unless the input supports them.

Do not claim that a consequence has actually occurred merely because the consequence signal is activated.

Do not claim that the organization is wasting talent, losing money, failing, or experiencing a specific outcome unless the input explicitly supports such a statement.


PRIMARY AND SECONDARY DIAGNOSIS

Give the primary diagnosis the greatest interpretive weight.

The primary diagnosis should shape the central narrative, headline, executive read, and explanation of the system break.

Use secondary diagnosis only when it adds a genuinely different and meaningful dimension.

Do not treat primary and secondary diagnoses as equally important.

Do not repeat internal diagnosis names as the explanation.

Translate them into organizational language.


STRENGTHS / REINFORCEMENTS

Use reinforcements to establish what the organization already appears capable of.

Strengths are not generic praise.

Explain:

what the organization appears to do well,
why that capability matters,
and what it makes possible.

Then connect that strength to the point where the system becomes less effective.

A strong diagnosis should not erase what is already working.


BROKEN TRANSITIONS

Pay particular attention to the transition where useful intelligence becomes less effective.

Possible transitions include:

knowledge → decision
evidence → action
understanding → development
development → deployment
discovery → value
manager knowledge → organizational knowledge
formal profile → deeper professional understanding

Describe the break concretely.

Do not merely restate the score or relationship name.

Where multiple findings point to the same broken transition, treat that transition as the central structural explanation.


MANAGERIAL REALITY

Translate the pattern into everyday managerial experience where supported.

Consider:

- what managers know about their people
- what they can see
- what remains inside individual manager relationships
- what travels beyond the manager
- what reaches talent decisions
- how work and responsibilities are assigned
- how development needs are identified
- how capability is discovered
- what happens when someone appears capable of more than their current role uses

Do not blame managers when the evidence points to a broader organizational-system issue.

The question is not "What are managers doing wrong?"

The question is:

"What might this reality feel like from inside everyday management?"


ORGANIZATIONAL REALITY

Zoom out from individual managers to the organizational system.

Explain what the pattern means for how the organization:

- sees people
- understands capability
- uses evidence
- develops people
- deploys capability
- recognizes value
- converts people intelligence into organizational decisions

Focus especially on the transition between what the organization already does well and what it struggles to convert that intelligence into.


CONSEQUENCES

Translate activated consequence signals into plausible organizational implications.

Consequences are not predictions.

They are not proof that the outcome has occurred.

Use language such as:

"may"
"can"
"may make it harder to..."
"can leave..."
"may limit..."
"can create difficulty in..."

Never convert a consequence signal into an unsupported claim.


HIDDEN VALUE

Translate hidden-value signals into concrete opportunity areas.

Ask:

"If this broken transition improved, what useful organizational value could become more available?"

Look for value in:

- better deployment of existing capability
- better work allocation
- stronger use of existing evidence
- more precise development
- clearer development-to-value connections
- conversion of manager knowledge into broader organizational intelligence
- better use of discoveries about people
- richer understanding beyond formal profiles

Do not promise outcomes.

Do not invent ROI.

Do not turn this section into a generic action plan.

Describe where useful value may already be latent in what the organization knows.


QUESTIONS WORTH ASKING

Generate 4–6 specific leadership questions derived directly from the detected pattern.

Questions should help leaders investigate organizational reality, not merely discuss HR strategy.

Prefer:

"Where do we already know someone has more capability than their current role uses—and what happens to that knowledge?"

over:

"How can we improve our talent strategy?"

Prefer questions that expose:

- where knowledge stops travelling
- where evidence stops influencing decisions
- where development stops translating into deployment
- where discovery stops becoming value
- where formal profiles hide deeper capability
- where managers possess knowledge that the wider organization cannot access

Do not generate generic coaching, engagement, or transformation questions.


NEXT AREA TO EXAMINE

Identify ONE logical next area of inquiry supported by the assessment.

This is an investigation direction, not a recommendation or prescription.

It should follow naturally from the central broken transition.

State:

what to examine,
and why it is the next useful thing to understand.

Do not introduce a new problem that the assessment did not surface.


CLOSING REFLECTION

End with a concise reflection that crystallizes the central organizational reality.

It should create recognition, not motivation.

It should leave the leader thinking about the system they operate, not about the assessment itself.

Do not use slogans, calls to action, or promotional language.


STYLE

Write like an experienced organizational practitioner speaking to another experienced leader.

Clear.
Calm.
Direct.
Specific.
Respectful.
Grounded.

Avoid:

- consultant jargon
- generic HR language
- motivational language
- dramatic claims
- unnecessary metaphor
- academic prose
- rhetorical cleverness
- empty sophistication
- repetitive statements

Use plain language without making the thinking simplistic.

The writing should feel intelligent because the observation is precise, not because the language is elaborate.


NARRATIVE PRIORITY

The output should feel like an explanation of one system, not a report assembled from separate signals.

Prioritize:

1. Central structural reality
2. What is already working
3. Where intelligence stops translating
4. Managerial manifestation
5. Organizational implication
6. Potentially unrealized value
7. Questions that expose the reality
8. Next area to examine

Do not give every section equal weight if the evidence does not warrant it.


OUTPUT

Return ONLY valid JSON.

Use exactly this structure:

{
  "assessment_readout": {
    "headline": "",
    "executive_read": [],
    "the_reality": {
      "what_is_happening": "",
      "how_it_shows_up": [],
      "why_it_matters": ""
    },
    "what_you_are_already_good_at": {
      "summary": "",
      "strengths": []
    },
    "where_the_system_breaks": {
      "summary": "",
      "broken_transitions": [
        {
          "from": "",
          "to": "",
          "what_happens": ""
        }
      ]
    },
    "managerial_reality": {
      "summary": "",
      "what_managers_may_experience": []
    },
    "organizational_reality": {
      "summary": "",
      "what_this_means": []
    },
    "what_may_be_getting_lost": {
      "summary": "",
      "consequences": []
    },
    "the_opportunity": {
      "summary": "",
      "opportunities": []
    },
    "questions_worth_asking": [],
    "next_area_to_examine": {
      "focus": "",
      "why": ""
    },
    "closing_reflection": ""
  }
}


OUTPUT CONTENT GUIDANCE

headline:
One concise statement capturing the central organizational reality.
Do not use the internal diagnosis name.

executive_read:
This is the default executive view.
Return 3–4 bullets maximum.
Each bullet should be concise enough to scan quickly while still carrying substantive meaning.
Together, the bullets should answer:

1. What does the organization appear to do well?
2. Where does the intelligence stop translating?
3. What important implication follows?
4. Where may the opportunity lie?

Do not repeat the headline or simply summarize the sections below or use generic statements.
Prefer one strong sentence per bullet over several weaker sentences.
The executive read should be understandable without opening the deeper sections.

the_reality.what_is_happening:
State the central reality in plain organizational language.

the_reality.how_it_shows_up:
Provide 3–5 concrete ways this reality may appear in organizational life. Use calibrated language.

the_reality.why_it_matters:
Explain the significance of the broken transition without exaggeration.

what_you_are_already_good_at.summary:
Summarize the strongest demonstrated capabilities supported by reinforcements.

what_you_are_already_good_at.strengths:
Provide 2–4 specific strengths and explain what each enables.

where_the_system_breaks.summary:
Explain the central point where useful people intelligence becomes less effective.

where_the_system_breaks.broken_transitions:
Provide 1–3 meaningful transitions only. Do not manufacture transitions.

managerial_reality.summary:
Describe what the pattern may feel like in everyday management.

managerial_reality.what_managers_may_experience:
Provide 3–5 concrete manifestations.

organizational_reality.summary:
Explain the system-level meaning.

organizational_reality.what_this_means:
Provide 3–5 implications grounded in the input.

what_may_be_getting_lost.summary:
Explain what may remain unrealized or difficult to capture because of the broken transition.

what_may_be_getting_lost.consequences:
Provide 2–4 plausible consequences supported by the deterministic findings.

the_opportunity.summary:
Explain where existing organizational intelligence could potentially become more useful.

the_opportunity.opportunities:
Provide 2–4 concrete opportunity areas grounded in the hidden-value signals.

questions_worth_asking:
Provide 4–6 specific investigative leadership questions.

next_area_to_examine.focus:
Name one logical next area of inquiry.

next_area_to_examine.why:
Explain why that area follows from the detected pattern.

closing_reflection:
End with one concise recognition-oriented observation.


QUALITY TEST

Before returning the JSON, silently test the complete interpretation.

1. RECOGNITION
Could a senior leader plausibly read this and think:
"That is exactly what happens here?"

2. SPECIFICITY
Could this interpretation apply equally well to almost any organization?
If yes, make it more specific to the actual relationships and descriptions supplied.

3. SEMANTIC FIDELITY
Does the interpretation faithfully use the meaning contained in the deterministic descriptions?
Have you synthesized them rather than merely repeated them?

4. EVIDENCE
Is every substantive conclusion grounded in the supplied deterministic findings?
If not, remove it or soften it.

5. NO REDIAGNOSIS
Did you avoid creating conclusions from scores that are not represented by activated deterministic findings?

6. CLARITY
Would an experienced People/Talent/Learning leader understand every major point immediately?

7. MANAGERIAL REALITY
Does the interpretation describe what the pattern could actually look like in everyday organizational life?

8. SYSTEM REALITY
Does it move beyond individual managers and explain the organizational system?

9. COHERENCE
Does the output tell one connected organizational story rather than summarize separate signals?

10. RESTRAINT
Have you avoided inventing causes, facts, outcomes, recommendations, ROI, or certainty?

11. VALUE
Does the hidden-value section identify where existing intelligence may become more useful without promising outcomes?

12. ACTIONABLE INQUIRY
Do the questions help a leader investigate the actual organizational reality rather than offer generic HR advice?

Return ONLY the JSON.

`;

const RESPONSE_FORMAT = {
  type: "json_schema",
  name: "leverage_interpretation",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      profile_snapshot: {
        type: "object",
        additionalProperties: false,
        properties: {
          opening_observation: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              body: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 1 },
              highlight: { type: "string" },
            },
            required: ["title", "body", "highlight"],
          },
          realizations: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              cards: {
                type: "array",
                minItems: 3,
                maxItems: 3,
                items: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 3 },
              },
            },
            required: ["title", "cards"],
          },
          at_a_glance: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              values: {
                type: "object",
                additionalProperties: false,
                properties: {
                  i_know_what_makes_me_valuable: { type: "number" },
                  people_clearly_see_my_value: { type: "number" },
                  i_know_where_im_heading_next: { type: "number" },
                  my_experience_speaks_for_itself: { type: "number" },
                },
                required: [
                  "i_know_what_makes_me_valuable",
                  "people_clearly_see_my_value",
                  "i_know_where_im_heading_next",
                  "my_experience_speaks_for_itself",
                ],
              },
            },
            required: ["title", "values"],
          },
        },
        required: ["opening_observation", "realizations", "at_a_glance"],
      },      your_pattern: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          value: { type: "string" },
        },
        required: ["title", "value"],
      },
      what_this_pattern_suggests: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          short: {
            type: "array",
            items: { type: "string" },
            minItems: 2,
            maxItems: 3,
          },
          expanded: {
            type: "array",
            items: { type: "string" },
            minItems: 6,
            maxItems: 8,
          },
          expanded_highlights: {
            type: "array",
            items: { type: "string" },
            minItems: 6,
            maxItems: 8,
          },
        },
        required: ["title", "short", "expanded", "expanded_highlights"],
      },
      what_may_be_quietly_costing_you: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          points: {
            type: "array",
            items: { type: "string" },
            minItems: 2,
            maxItems: 2,
          },
        },
        required: ["title", "points"],
      },
      where_hidden_value_may_be_sitting: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          points: {
            type: "array",
            items: { type: "string" },
            minItems: 2,
            maxItems: 3,
          },
        },
        required: ["title", "points"],
      },
      what_this_may_open_up: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          points: {
            type: "array",
            items: { type: "string" },
            minItems: 2,
            maxItems: 2,
          },
        },
        required: ["title", "points"],
      },
    },
    required: [
      "profile_snapshot",
      "your_pattern",
      "what_this_pattern_suggests",
      "what_may_be_quietly_costing_you",
      "where_hidden_value_may_be_sitting",
      "what_this_may_open_up",
    ],
  },
};

function validateScores(scores) {
  if (!scores || typeof scores !== "object" || Array.isArray(scores)) {
    return false;
  }
  return REQUIRED_SCORE_KEYS.every((key) => {
    const value = scores[key];
    return Number.isInteger(value) && value >= 1 && value <= 10;
  });
}

function extractOutputText(response) {
  if (response.choices?.[0]?.message?.content) {
    return response.choices[0].message.content;
  }
  if (response.output_text) {
    return response.output_text;
  }
  const textItem = response.output
    ?.flatMap((item) => item.content || [])
    .find((content) => content.type === "output_text" && content.text);

  return textItem?.text;
}

function classifyInterpretError(error, stage) {
  if (stage === "configuration") return "OPENAI_KEY_MISSING";
  if (stage === "output") return "OPENAI_EMPTY_OUTPUT";

  if (stage === "parse") {
    return error instanceof SyntaxError
      ? "OPENAI_OUTPUT_PARSE_ERROR"
      : "OPENAI_SCHEMA_ERROR";
  }

  if (error?.status === 401 || error?.status === 403) {
    return "OPENAI_AUTH_ERROR";
  }

  if (error?.status === 429) {
    return "OPENAI_RATE_LIMIT";
  }

  if (error?.status === 404 || error?.code === "model_not_found") {
    return "OPENAI_MODEL_ERROR";
  }

  if (
    error?.status === 408 ||
    error?.code === "ETIMEDOUT" ||
    error?.name === "APIConnectionTimeoutError"
  ) {
    return "OPENAI_TIMEOUT";
  }

  return "OPENAI_REQUEST_ERROR";
}

module.exports = async function handler(req, res) {
  const requestStartedAt = Date.now();
  const requestId = String(
    req.headers?.["x-debug-request-id"] || crypto.randomUUID()
  ).slice(0, 100);

  res.setHeader("X-Interpret-Request-ID", requestId);

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
      code: "METHOD_NOT_ALLOWED",
      requestId,
    });
  }

  const { scores } = req.body || {};

  if (!validateScores(scores)) {
    return res.status(400).json({
      error:
        "Scores must include all eight categories with integer values from 1 to 10",
      code: "INVALID_SCORES",
      requestId,
    });
  }

  let stage = "configuration";

  try {
    const { client, model: requestedModel } = createLLMClient();

    const aiPayloadInput = {
      scores,
    };

    const openaiStartedAt = Date.now();

    stage = "llm_request";

    const response = await client.chat.completions.create({
      model: requestedModel,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: JSON.stringify(aiPayloadInput) },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: RESPONSE_FORMAT.name,
          strict: RESPONSE_FORMAT.strict,
          schema: RESPONSE_FORMAT.schema,
        },
      },
    });

    const openaiMs = Date.now() - openaiStartedAt;

    stage = "output";
    const output = extractOutputText(response);

    if (!output) {
      throw new Error("No output returned");
    }

    stage = "parse";
    const parseStartedAt = Date.now();
    const interpretation = JSON.parse(output);

    if (!interpretation?.profile_snapshot?.at_a_glance) {
      throw new Error(
        "Interpretation is missing profile_snapshot.at_a_glance"
      );
    }

    const roundToOneDecimal = (value) => Math.round(value * 10) / 10;

    interpretation.profile_snapshot.at_a_glance.values = {
      i_know_what_makes_me_valuable: roundToOneDecimal(
        scores.identity_clarity * 0.55 + scores.value_articulation * 0.45
      ),
      people_clearly_see_my_value: roundToOneDecimal(
        scores.evidence_visibility * 0.45 + scores.positioning_strength * 0.55
      ),
      i_know_where_im_heading_next: roundToOneDecimal(
        scores.next_move_clarity * 0.6 + scores.leverage_utilization * 0.4
      ),
      my_experience_speaks_for_itself: roundToOneDecimal(
        scores.trust_pattern_awareness * 0.5 +
          scores.signature_strength_recognition * 0.5
      ),
    };

    const parseMs = Date.now() - parseStartedAt;
    const totalMs = Date.now() - requestStartedAt;
    const usage = response.usage || {};
    console.info("[interpret:response]", JSON.stringify(interpretation, null, 2));

    console.info(
      "[interpret:timing]",
      JSON.stringify({
        requestId,
        openaiRequestId: response.id || "unknown",
        model: response.model || requestedModel,
        totalMs,
        openaiMs,
        parseMs,
        inputTokens: usage.prompt_tokens,
        outputTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
      })
    );

    return res.status(200).json(interpretation);
  } catch (error) {
    const code = classifyInterpretError(error, stage);

    console.error("[interpret:error]", {
      code,
      stage,
      message: error.message,
      requestId,
      openaiRequestId: error.request_id,
      status: error.status,
      type: error.type,
      errorCode: error.code,
      model: process.env.LLM_PROVIDER === "openrouter" ? process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct" : process.env.OPENAI_MODEL || "gpt-4o",
      totalMs: Date.now() - requestStartedAt,
    });

    return res.status(500).json({
      error: "Failed to generate interpretation",
      code,
      requestId,
    });
  }
};




