import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Clock3, Info, ShieldCheck } from "lucide-react";
import Career from "./Career";
import ResultCard from "./ResultCard";
import Header from "./Header";
import FinalStepForm from "./FinalStepForm";
import { encodeResultPayload } from "../utils/resultPayload";
import { DIAGNOSTIC_QUESTIONS } from "../data/diagnosticQuestions";
const getReferralTracking = () => {
    const params = new URLSearchParams(window.location.search);
    const code = String(params.get("ref") || localStorage.getItem("professional_leverage_referrer_code") || "").trim().toUpperCase();
    const invitedToken = String(params.get("invite") || localStorage.getItem("professional_leverage_invited_token") || "").trim();

    if (!code || !invitedToken) {
        return null;
    }

    localStorage.setItem("professional_leverage_referrer_code", code);
    localStorage.setItem("professional_leverage_invited_token", invitedToken);

    return { code, invitedToken };
};

const addReferralTrackingToResultUrl = (resultUrl) => {
    const tracking = getReferralTracking();

    if (!tracking) return resultUrl;

    const url = new URL(resultUrl, window.location.origin);
    url.searchParams.set("ref", tracking.code);
    url.searchParams.set("invite", tracking.invitedToken);
    return `${url.pathname}${url.search}${url.hash}`;
};

const addEmailToResultUrl = (resultUrl, email) => {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!normalizedEmail) return resultUrl;

    const url = new URL(resultUrl, window.location.origin);
    url.searchParams.set("email", normalizedEmail);
    return `${url.pathname}${url.search}${url.hash}`;
};
const addNameToResultUrl = (resultUrl, name) => {
    const normalizedName = String(name || "").trim().replace(/[<>]/g, "").slice(0, 60);
    if (!normalizedName) return resultUrl;

    const url = new URL(resultUrl, window.location.origin);
    url.searchParams.set("name", normalizedName);
    return `${url.pathname}${url.search}${url.hash}`;
};
const CALCULATION_MESSAGES = [
    "Reading your responses...",
    "Connecting the patterns across your answers...",
    "Preparing your Professional Leverage Report...",
];
const CALCULATION_MESSAGE_INTERVAL_MS = 1400;
const MINIMUM_CALCULATION_DISPLAY_MS = CALCULATION_MESSAGES.length * CALCULATION_MESSAGE_INTERVAL_MS;

const Test = () => {
    const navigate = useNavigate();
    const [counter, setCounter] = useState(1);
    const [p, setP] = useState("Identity Clarity")
    const [career, setCareer] = useState([])
    const [health, setHealth] = useState([])
    const [money, setMoney] = useState([])
    const [per, setPer] = useState([])
    const [rel, setRel] = useState([])
    const [fun, setFun] = useState([])
    const [physical, setPhysical] = useState([])
    const [message, setMessage] = useState(false)
    const [msg, setMsg] = useState(0)
    const [formCompleted, setFormCompleted] = useState(false)
    const [phase, setPhase] = useState("questions")
    const [calculationMessageIndex, setCalculationMessageIndex] = useState(0)
    const [generationError, setGenerationError] = useState(null)
    const [generationErrorDetails, setGenerationErrorDetails] = useState(null)
    const [preparedResultUrl, setPreparedResultUrl] = useState("")
    const [finalScores, setFinalScores] = useState(null)
    const feedbackRef = useRef(null)
    const currentQuestion = DIAGNOSTIC_QUESTIONS[counter - 1] || DIAGNOSTIC_QUESTIONS[0]

    useEffect(() => {
        if (!message || !feedbackRef.current) return

        feedbackRef.current.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
            block: "start",
        })
    }, [message, msg])

    useEffect(() => {
        if (phase !== "generating") return undefined;

        const messageTimer = window.setInterval(() => {
            setCalculationMessageIndex((currentIndex) =>
                Math.min(currentIndex + 1, CALCULATION_MESSAGES.length - 1)
            );
        }, CALCULATION_MESSAGE_INTERVAL_MS);

        return () => window.clearInterval(messageTimer);
    }, [phase]);

    const generateResult = async (scores) => {
        const requestStartedAt = performance.now();
        const requestId =
            window.crypto?.randomUUID?.() ||
            `interpret-${Date.now()}-${Math.random().toString(16).slice(2)}`;

        let stage = "request";

        setCalculationMessageIndex(0);
        setPhase("generating");
        setGenerationError(null);
        setGenerationErrorDetails(null);

        try {
            const response = await fetch("/api/interpret", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Debug-Request-ID": requestId,
                },
                body: JSON.stringify({ scores }),
            });

            const responseReceivedAt = performance.now();
            const contentType = response.headers.get("content-type") || "";
            const responseText = await response.text();

            stage = "parse";

            let data = null;

            if (contentType.includes("application/json") && responseText) {
                try {
                    data = JSON.parse(responseText);
                } catch (parseError) {
                    parseError.debugCode = "INVALID_JSON_RESPONSE";
                    parseError.fullResponse = responseText;
                    throw parseError;
                }
            }

            if (!response.ok || !data || data.error) {
                const responseError = new Error(
                    data?.error || "The result could not be generated."
                );

                responseError.debugCode =
                    data?.code ||
                    (!response.ok
                        ? `HTTP_${response.status}`
                        : "EMPTY_RESPONSE");

                responseError.serverRequestId =
                    data?.requestId ||
                    response.headers.get("x-interpret-request-id");

                responseError.httpStatus = response.status;
                responseError.contentType = contentType;
                responseError.fullResponse = responseText;

                if (!contentType.includes("application/json")) {
                    responseError.responsePreview = responseText.slice(0, 200);
                }

                throw responseError;
            }

            stage = "payload";

            const payload = encodeResultPayload({
                scores,
                interpretation: data,
            });

            const resultReadyAt = performance.now();

            console.info("[interpret:client-timing]", {
                requestId:
                    response.headers.get("x-interpret-request-id") ||
                    requestId,
                serverTiming: response.headers.get("server-timing"),
                fetchMs: Math.round(
                    responseReceivedAt - requestStartedAt
                ),
                processingMs: Math.round(
                    resultReadyAt - responseReceivedAt
                ),
                totalMs: Math.round(
                    resultReadyAt - requestStartedAt
                ),
            });

            setPreparedResultUrl(
                addReferralTrackingToResultUrl("/result#r=" + payload)
            );

            const remainingDisplayTime =
                MINIMUM_CALCULATION_DISPLAY_MS -
                (performance.now() - requestStartedAt);

            if (remainingDisplayTime > 0) {
                await new Promise((resolve) =>
                    window.setTimeout(resolve, remainingDisplayTime)
                );
            }

            setPhase("form");
        } catch (error) {
            const details = {
                code:
                    error.debugCode ||
                    (stage === "request"
                        ? "NETWORK_ERROR"
                        : `${stage.toUpperCase()}_ERROR`),
                stage,
                requestId: error.serverRequestId || requestId,
                status: error.httpStatus,
                contentType: error.contentType,
                responsePreview: error.responsePreview,
                message: error.message,
                totalMs: Math.round(
                    performance.now() - requestStartedAt
                ),
            };

            // Log full error details to console for debugging
            console.error(
                "[interpret:client-error]",
                details,
                error
            );

            // Additional logging to capture full response
            console.error("[interpret:full-response]", {
                stage,
                status: error.httpStatus,
                contentType: error.contentType,
                fullResponse: error.fullResponse || error.responsePreview || "No response captured",
                errorMessage: error.message,
                timestamp: new Date().toISOString(),
            });

            setGenerationError(
                error.message ===
                    "The generated result is too large for a safe URL."
                    ? error.message
                    : "We couldn't calculate your result. Please try again."
            );

            setGenerationErrorDetails(details);
            setPhase("error");
        }
    };

    const confirm = (e) => {
        setMsg(Number(e.currentTarget.textContent))
        setMessage(true)
    }

    const submit = (ans) => {
        setCounter(counter + 1);

        if (counter === 1) {
            setCareer([...career, ans]);
            setP("Value Articulation");

        }
        if (counter === 2) {
            setMoney([...money, ans]);
            setP("Evidence Visibility");

        }
        if (counter === 3) {
            setHealth([...health, ans]);
            setP("Signature Strength Recognition");

        }
        if (counter === 4) {
            setRel([...rel, ans]);
            setP("Trust Pattern Awareness");

        }
        if (counter === 5) {
            setPer((prev) => [...prev, ans]);
            setP("Positioning Strength");

        }
        if (counter === 6) {
            setFun((prev) => [...prev, ans]);
            setP("Next-Move Clarity");

        }
        if (counter === 7) {
            setPhysical((prev) => [...prev, ans]);
            setP("Leverage Utilization");

        }
        if (counter === 8) {
            const scores = {
                identity_clarity: career[0], value_articulation: money[0],
                evidence_visibility: health[0], signature_strength_recognition: rel[0],
                trust_pattern_awareness: per[0], positioning_strength: fun[0],
                next_move_clarity: physical[0], leverage_utilization: ans,
            };
            setFinalScores(scores);
            generateResult(scores);
        }

        close();
    }

    const close = () => 
        setMessage(false)


    return (
        <div className="diagnostic-page min-h-screen bg-[#0E1319] text-white">

            <Header confidential />
            {phase === "questions" && counter <= 8 && (
                <main className="diagnostic-quiz-main px-4 py-8 md:px-6">
                    <div className="diagnostic-quiz-card max-w-6xl mx-auto border border-white/10 rounded-2xl bg-[#0A101B] px-5 md:px-20 py-10 md:py-16">

                        {/* Progress */}
                        <div className="diagnostic-progress w-full max-w-2xl md:max-w-4xl mx-auto">
                            <div className="diagnostic-progress-label text-center text-[#D9A44A] text-[17px] mb-4">
                                Question {counter} of 8
                            </div>
                            <div className="h-[5px] bg-[#272D38] rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-[#C9923B] to-[#E8B563] transition-all duration-500"
                                    style={{ width: `${(counter / 8) * 100}%` }}
                                />
                            </div>
                            <div className="diagnostic-time flex justify-center items-center gap-2 text-gray-400 text-[15px] mt-5">
                                <Clock3 size={17} />
                                <span>Takes ~5 minutes</span>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="diagnostic-category text-center mt-12 md:mt-16">
                            <span className="uppercase tracking-[0.25em] text-[#D9A44A] text-[14px] md:text-[15px] font-semibold">
                                {p}
                            </span>
                        </div>

                        {/* Question */}
                                                <div className="diagnostic-question max-w-4xl mx-auto text-center mt-6">
                            <Career question={currentQuestion.question} clarifier={currentQuestion.clarifier} />
                        </div>

                        {/* Note */}
                        <div className="diagnostic-note flex justify-center mt-8 md:mt-10">
                            <div className="flex items-center gap-2 text-gray-500 text-center text-[14px] md:text-[15px]">
                                <Info size={16} className="shrink-0" />
                                <span>There are no right answers. Go with what feels most true right now.</span>
                            </div>
                        </div>

                        {/* Score grid */}
                        <div className="diagnostic-score-area max-w-5xl mx-auto mt-10 md:mt-14">
                            <div className="diagnostic-score-grid grid grid-cols-5 md:grid-cols-10 gap-3">
                                {[1,2,3,4,5,6,7,8,9,10].map(n => {
                                    const selected = message && msg === n;
                                    return (
                                        <div key={n} className="relative">
                                            {selected && (
                                                <ChevronDown
                                                    size={18}
                                                    className="absolute -top-6 left-1/2 hidden -translate-x-1/2 text-[#D9A44A] md:block"
                                                />
                                            )}
                                            <button
                                                onClick={confirm}
                                                aria-pressed={selected}
                                                className={`h-14 w-full flex items-center justify-center rounded-xl border text-[20px] font-medium transition-all duration-200 hover:bg-[#D9A44A] hover:text-[#161005] ${selected ? "border-[#E8B563] bg-gradient-to-b from-[#E8B563] to-[#D9A44A] text-[#161005] shadow-[0_0_18px_rgba(217,164,74,0.35)]" : "border-[#D9A44A]/80 bg-transparent text-[#D9A44A]"}`}
                                            >
                                                {n}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex justify-between mt-5 text-gray-400 text-[15px] md:text-[16px]">
                                <span>Strong No</span>
                                <span>Strong Yes</span>
                            </div>


                            <div ref={feedbackRef} className="diagnostic-feedback-slot scroll-mt-6">
                                {message && (
                                    <ResultCard
                                        category={p}
                                        score={msg}
                                        onAdjust={close}
                                        onConfirm={() => submit(msg)}
                                    />
                                )}
                            </div>

                            {!message && (
                                <div className="mt-10 border-t border-white/10 pt-6 md:mt-12">
                                    <div className="flex items-center justify-center gap-2 text-[14px] text-gray-400">
                                        <ShieldCheck size={16} className="text-[#D9A44A]" />
                                        <span>Your responses are confidential.</span>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </main>
            )}

            {phase === "generating" && (
                <main className="flex min-h-[70vh] items-center justify-center px-6">
                    <div className="text-center">
                        <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-2 border-[#D9A44A] border-t-transparent" />
                        <p className="min-h-6 text-sm font-medium text-[#D9A44A]" role="status" aria-live="polite">
                            {CALCULATION_MESSAGES[calculationMessageIndex]}
                        </p>
                    </div>
                </main>
            )}

            {phase === "error" && (
                <main className="flex min-h-[70vh] items-center justify-center px-6">
                    <div className="max-w-lg text-center">
                        <p className="mb-6 text-red-400">{generationError}</p>
                        {generationErrorDetails && (
                            <p className="mb-6 break-words font-mono text-xs text-slate-400">
                                {generationErrorDetails.code}
                                {" Â· "}
                                {generationErrorDetails.stage}
                                {" Â· Request "}
                                {generationErrorDetails.requestId}
                            </p>
                        )}
                        <button type="button" onClick={() => finalScores && generateResult(finalScores)} className="!rounded-lg !bg-[#D4A24A] !px-6 !py-3 !font-semibold !text-black">Try again</button>
                    </div>
                </main>
            )}

            {/* Final details form */}
            {phase === "form" && !formCompleted && (
                <main className="px-4 py-10 md:px-6">
                    <div className="max-w-6xl mx-auto">
                        <FinalStepForm
                            resultUrl={preparedResultUrl}
                            onComplete={({ email, name }) => {
                                const emailUrl = addEmailToResultUrl(preparedResultUrl, email);
                                const nextUrl = addNameToResultUrl(emailUrl, name);
                                setFormCompleted(true);
                                navigate(nextUrl);
                            }}
                        />
                    </div>
                </main>
            )}

        </div>
    )
}

export default Test;



