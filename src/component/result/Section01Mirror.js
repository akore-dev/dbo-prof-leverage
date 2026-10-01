import { ChevronDown, Sparkle } from "lucide-react";
import { emphasize, scrollToSection } from "./experienceUtils";
import SceneImage, { useSceneImage } from "./SceneImage";

/* CSS recreation of the reference's mirror photograph: gold-rimmed oval
   mirror on a dark pedestal under a warm spotlight. Swap for a real image
   asset by replacing the composition inside <MirrorScene />. */
const MirrorScene = () => (
  <div className="relative flex h-full min-h-[420px] w-full items-center justify-center overflow-hidden lg:min-h-[640px]">
    {/* ceiling spotlight */}
    <div
      className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2"
      style={{ background: "radial-gradient(ellipse at center top, rgba(233,190,120,0.22), transparent 62%)" }}
    />
    {/* warm wall wash behind the mirror */}
    <div
      className="pointer-events-none absolute right-[8%] top-1/3 h-[360px] w-[220px]"
      style={{ background: "radial-gradient(ellipse at center, rgba(217,164,74,0.12), transparent 70%)" }}
    />

    <div className="relative mb-16 mt-8">
      {/* mirror frame */}
      <div
        className="relative h-[340px] w-[240px] rotate-[5deg] sm:h-[420px] sm:w-[295px]"
        style={{
          borderRadius: "50%",
          border: "5px solid transparent",
          background:
            "linear-gradient(#101418, #0b0e12) padding-box, linear-gradient(150deg, #f0d290 0%, #a3762f 35%, #6f5220 60%, #e2ba6e 100%) border-box",
          boxShadow:
            "0 0 60px rgba(217,164,74,0.18), 0 30px 70px rgba(0,0,0,0.75), inset 0 0 50px rgba(0,0,0,0.55)",
        }}
      >
        {/* glass reflections */}
        <div
          className="absolute inset-[6px]"
          style={{
            borderRadius: "50%",
            background:
              "linear-gradient(160deg, rgba(70,80,92,0.45) 0%, rgba(28,33,40,0.9) 42%, rgba(12,14,18,1) 100%)",
          }}
        />
        <div
          className="absolute inset-[6px] overflow-hidden"
          style={{ borderRadius: "50%" }}
        >
          <div
            className="absolute right-[18%] top-[8%] h-[85%] w-[14%] rotate-[6deg]"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(226,196,138,0.28), transparent)",
              filter: "blur(2px)",
            }}
          />
          <div
            className="absolute left-[16%] top-[16%] h-[55%] w-[7%] rotate-[8deg]"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent)",
              filter: "blur(3px)",
            }}
          />
        </div>
        {/* stand leg */}
        <div className="absolute -bottom-7 left-1/2 h-10 w-16 -translate-x-1/2 rotate-[5deg] rounded-b-lg bg-gradient-to-b from-[#15120c] to-[#060505]" />
      </div>

      {/* pedestal */}
      <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
        <div
          className="h-14 w-[320px] sm:w-[400px]"
          style={{
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center top, #23201a 0%, #14120e 45%, #0a0908 100%)",
            boxShadow:
              "0 -2px 8px rgba(233,190,120,0.12), 0 24px 50px rgba(0,0,0,0.85)",
          }}
        />
        {/* floor glow */}
        <div
          className="absolute -bottom-8 left-1/2 h-16 w-[440px] -translate-x-1/2"
          style={{ background: "radial-gradient(ellipse at center, rgba(217,164,74,0.10), transparent 70%)" }}
        />
      </div>
    </div>

    <SceneImage src="/results/section-1-mirror-mobile.jpg" />
  </div>
);

const MIRROR_ART = "/results/section-1-mirror.jpg";

export default function Section01Mirror({ name, subline, highlight }) {
  const mirrorArtReady = useSceneImage(MIRROR_ART);
  const firstName = name ? name.trim().split(/\s+/)[0] : null;
  const truncateName = (value) =>
    value && value.length > 15 ? `${value.slice(0, 15)}...` : value || "";
  const mobileName = truncateName(firstName);
  const desktopName = truncateName(firstName);
  const observationText = String(subline || "").trim();
  const sentenceMatch = observationText.match(/^(.+?[.!?])(?:\s+|$)([\s\S]*)$/);
  const firstSentence = sentenceMatch?.[1] || observationText;
  const remainingObservation = sentenceMatch?.[2] || "";
  const statement = emphasize(firstSentence, highlight);
  /* The mobile design leads the remainder with its first sentence set brighter
     than the paragraph that follows it. */
  const remainderMatch = remainingObservation.match(/^(.+?[.!?])(?:\s+|$)([\s\S]*)$/);
  const remainderLead = remainderMatch?.[1] || remainingObservation;
  const remainderRest = remainderMatch?.[2] || "";

  return (
    <section
      id="xp-section-1"
      className="relative flex min-h-screen items-center overflow-hidden bg-[#050505]"
    >
      {/* ---------- Mobile ---------- */}
      <div className="flex min-h-screen w-full flex-col px-6 pt-8 lg:hidden">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D9A44A]/50">
          <Sparkle className="h-5 w-5 text-[#D9A44A]" strokeWidth={1.5} />
        </div>

        <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.28em] text-[#D9A44A]">
          Your Professional Mirror
        </p>

        <p className="mt-3 text-[22px] text-[#F5F1E8]">
          <span className="text-slate-400">Hello, </span>
          {mobileName ? `${mobileName}.` : ""}
        </p>

        <div className="relative mt-4 h-px w-32 bg-gradient-to-r from-[#D9A44A]/80 via-[#D9A44A]/30 to-transparent">
          <div
            className="absolute -top-[3px] left-6 h-[7px] w-16"
            style={{ background: "radial-gradient(ellipse at center, rgba(240,210,144,0.6), transparent 70%)" }}
          />
        </div>

        <h1 className="mt-5 font-serif text-[34px] font-medium leading-[1.1] text-[#F5F1E8]">
          {statement.before}
          {statement.gold && <span className="text-[#D9A44A]">{statement.gold}</span>}
          {statement.after}
        </h1>

        {remainingObservation && (
          <>
            <div className="relative mt-6 h-px w-32 bg-gradient-to-r from-[#D9A44A]/70 to-transparent">
              <div
                className="absolute -top-[3px] left-5 h-[6px] w-14"
                style={{ background: "radial-gradient(ellipse at center, rgba(240,210,144,0.5), transparent 70%)" }}
              />
            </div>

            <p className="mt-6 text-[16px] leading-[1.6] text-[#E9E4D8]">
              {remainderLead}
            </p>

            {remainderRest && (
              <p className="mt-4 text-[16px] leading-[1.6] text-slate-400">
                {remainderRest}
              </p>
            )}
          </>
        )}

        {/* The photograph bleeds to the screen edges under the copy, with the
            scroll cue sitting on top of it. */}
        <div className="relative -mx-6 mt-auto aspect-[586/1024] pt-6">
          <MirrorScene />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-24"
            style={{ background: "linear-gradient(to bottom, #050505, transparent)" }}
          />

          <button
            type="button"
            onClick={() => scrollToSection("xp-section-2")}
            className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D9A44A]/60 text-[#D9A44A]">
              <ChevronDown className="h-5 w-5" />
            </span>
            <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#D9A44A]">
              Scroll to Continue
            </span>
          </button>
        </div>
      </div>

      {/* ---------- Desktop ---------- */}
      <div className="relative z-10 mx-auto hidden w-full max-w-7xl items-center gap-8 px-6 py-16 lg:grid lg:grid-cols-[1.05fr_1fr] lg:gap-4 lg:py-10">
        <div className="min-w-0 max-w-xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#D9A44A] sm:text-[13px]">
            Your Professional Mirror
          </p>

          <h1 className="mt-6 flex items-baseline gap-3 overflow-hidden font-serif text-[52px] font-medium leading-[1.02] text-[#F5F1E8] sm:text-[68px] md:text-[76px]">
            <span className="shrink-0">Hello,</span>
            <span className="min-w-0 truncate pb-2 text-[#D9A44A]">
              {desktopName}
            </span>
          </h1>

          {/* glowing divider */}
          <div className="relative mt-2 h-px w-64 max-w-full bg-gradient-to-r from-[#D9A44A]/80 via-[#D9A44A]/30 to-transparent">
            <div
              className="absolute -top-[3px] left-10 h-[7px] w-24"
              style={{ background: "radial-gradient(ellipse at center, rgba(240,210,144,0.65), transparent 70%)" }}
            />
          </div>

                    <p className="mt-7 whitespace-nowrap text-[13px] leading-[1.5] text-slate-300 sm:text-[14px]">
            We studied your responses carefully. One pattern stood out far above everything else.
          </p>

          <div className="mt-7 h-px w-full max-w-lg bg-white/10" />

          <h2 className="mt-7 font-serif text-[30px] font-medium leading-[1.25] text-[#F5F1E8] sm:text-[38px]">
            {statement.before}
            {statement.gold && <span className="text-[#D9A44A]">{statement.gold}</span>}
            {statement.after}
          </h2>

          {remainingObservation && (
            <p className="mt-6 max-w-md text-[15px] leading-[1.75] text-slate-400 sm:text-[16px]">
              {remainingObservation}
            </p>
          )}

          <button
            type="button"
            onClick={() => scrollToSection("xp-section-2")}
            className="mt-10 flex items-center gap-5 text-left"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#D9A44A]/60 text-[#D9A44A] transition hover:bg-[#D9A44A]/10">
              <ChevronDown className="h-5 w-5" />
            </span>
            <span className="text-[15px] font-medium text-[#D9A44A] sm:text-[16px]">
              The next few minutes may explain why.
            </span>
          </button>
        </div>

        {/* The design bleeds the photograph to the frame edges, so when the
            export is present it is positioned against the section rather than
            boxed inside the grid column. */}
        {mirrorArtReady ? <div aria-hidden="true" /> : <MirrorScene />}
      </div>

      {mirrorArtReady && (
        <img
          src={MIRROR_ART}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover lg:block"
        />
      )}
    </section>
  );
}







