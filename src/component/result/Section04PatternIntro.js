import { ArrowDown } from "lucide-react";
import { scrollToSection } from "./experienceUtils";

export default function Section04PatternIntro() {
  return (
    <section
      id="xp-section-4"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#050505] px-6 py-20"
    >
      {/* The design lights the frame from off-canvas: a bright flare clipped by
          the left edge above centre, a wider wash on the right, and warmth
          pooling into the lower corners. */}
      <div
        className="pointer-events-none absolute -left-24 top-[14%] h-[420px] w-[300px]"
        style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(247,214,152,0.55), rgba(217,164,74,0.18) 38%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -left-56 top-[30%] h-[720px] w-[620px]"
        style={{ background: "radial-gradient(ellipse at 15% 40%, rgba(200,148,72,0.22), transparent 68%)" }}
      />
      <div
        className="pointer-events-none absolute -right-52 top-[6%] h-[820px] w-[640px]"
        style={{ background: "radial-gradient(ellipse at 80% 45%, rgba(207,157,80,0.24), transparent 68%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-24 h-[520px] w-[560px]"
        style={{ background: "radial-gradient(ellipse at 70% 70%, rgba(184,136,64,0.18), transparent 70%)" }}
      />

      {/* Edges of two very large circles; only the curve reads on screen. */}
      <div className="pointer-events-none absolute -left-[73rem] top-1/2 h-[1700px] w-[1500px] -translate-y-1/2 rounded-full border border-[#D9A44A]/[0.07]" />
      <div className="pointer-events-none absolute -right-[73rem] top-1/2 h-[1700px] w-[1500px] -translate-y-1/2 rounded-full border border-[#D9A44A]/[0.07]" />

      <div className="text-center">
        <h2 className="font-serif text-[56px] font-medium leading-[1.04] text-[#F5F1E8] sm:text-[80px] md:text-[92px]">
          Walk Into
          <span className="block text-[#D9A44A]">The Pattern</span>
        </h2>

        {/* glowing divider */}
        <div className="relative mx-auto mt-10 h-px w-64 bg-gradient-to-r from-transparent via-[#D9A44A]/80 to-transparent sm:w-80">
          <div
            className="absolute -top-[4px] left-1/2 h-[9px] w-40 -translate-x-1/2"
            style={{ background: "radial-gradient(ellipse at center, rgba(240,210,144,0.7), transparent 70%)" }}
          />
        </div>

        <p className="mt-12 text-[22px] font-medium text-[#F5F1E8] sm:text-[26px]">
          Let&rsquo;s connect the dots.
        </p>

        <p className="mt-6 text-[15px] leading-[1.8] text-slate-400 sm:text-[17px]">
          The observations you&rsquo;ve seen so far are not isolated.
          <br />
          Together, they begin to tell a coherent story.
        </p>
      </div>

      <button
        type="button"
        onClick={() => scrollToSection("xp-section-5")}
        className="absolute bottom-10 flex flex-col items-center gap-3"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D9A44A]/60 text-[#D9A44A] transition hover:bg-[#D9A44A]/10">
          <ArrowDown className="h-5 w-5" />
        </span>
        <span className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#D9A44A]">
          Scroll
        </span>
      </button>
    </section>
  );
}
