import { ArrowUp, Sparkle } from "lucide-react";
import SceneImage, { useSceneImage } from "./SceneImage";
import { scrollToSection } from "./experienceUtils";

const SUNRISE_ART = "/results/section-7-sunrise.jpg";
const SUNRISE_MASK =
  "radial-gradient(120% 115% at 100% 18%, #000 40%, rgba(0,0,0,0.5) 64%, transparent 84%)";

/* Light sunrise backdrop. Until the real export loads this is drawn in
   CSS/SVG — cream sky, sun flare top-right, layered mountain ridges. The
   export replaces it: full-bleed on desktop, and on mobile confined to the
   upper right where the design dissolves it into the cream page. */
const SunriseBackdrop = () => {
  const artReady = useSceneImage(SUNRISE_ART);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(170deg, #FAF6ED 0%, #F6EEDD 55%, #F2E7D0 100%)" }} />

      {!artReady && (
        <>
          {/* sun */}
          <div
            className="absolute -right-24 top-6 h-[420px] w-[520px]"
            style={{ background: "radial-gradient(circle at 65% 35%, rgba(255,240,205,0.95) 0%, rgba(246,204,120,0.55) 28%, transparent 62%)" }}
          />
          {/* rays */}
          <div
            className="absolute right-[6%] top-[10%] h-[300px] w-[300px]"
            style={{
              background:
                "conic-gradient(from 210deg at 50% 50%, transparent 0deg, rgba(240,200,120,0.18) 8deg, transparent 18deg, rgba(240,200,120,0.14) 30deg, transparent 42deg, rgba(240,200,120,0.12) 55deg, transparent 70deg)",
            }}
          />
          {/* mountain ridges */}
          <svg viewBox="0 0 1440 620" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-0 h-[72%] w-full">
            <path d="M520 300 L700 180 L880 280 L1080 140 L1250 240 L1440 170 L1440 620 L520 620 Z" fill="#E4CFA4" opacity="0.5" />
            <path d="M600 380 L820 260 L1010 360 L1200 250 L1440 340 L1440 620 L600 620 Z" fill="#D9BC85" opacity="0.55" />
            <path d="M700 480 L950 360 L1180 470 L1440 390 L1440 620 L700 620 Z" fill="#C9A45C" opacity="0.5" />
          </svg>
        </>
      )}

      {/* bottom-left decorative flow lines */}
      <svg viewBox="0 0 600 300" className="absolute -left-10 bottom-0 h-[240px] w-[560px]" fill="none">
        <path d="M-20 260 C120 210 260 290 420 240 C500 215 560 230 620 210" stroke="#D9BC85" strokeOpacity="0.35" strokeWidth="1.5" />
        <path d="M-20 290 C140 245 300 315 470 265 C540 245 590 255 640 240" stroke="#D9BC85" strokeOpacity="0.25" strokeWidth="1.5" />
      </svg>

      <SceneImage src={SUNRISE_ART} className="hidden lg:block" />

      {/* Masked rather than overlaid with cream, so the photograph dissolves
          into whatever the page is behind it instead of leaving an edge. */}
      <div
        className="absolute right-0 top-[190px] h-[430px] w-[74%] overflow-hidden lg:hidden"
        style={{
          maskImage: SUNRISE_MASK,
          WebkitMaskImage: SUNRISE_MASK,
        }}
      >
        <SceneImage src={SUNRISE_ART} />
      </div>
    </div>
  );
};

export default function Section07HiddenValue({ points }) {
  const items = points.slice(0, 2);

  return (
    <section id="xp-section-7" className="relative min-h-screen overflow-hidden">
      <SunriseBackdrop />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 py-16 sm:px-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#C9962E]/30">
          <Sparkle className="h-6 w-6 text-[#C9962E]" strokeWidth={1.4} />
        </div>

        <h2 className="mt-6 font-serif text-[40px] font-medium leading-[1.08] text-[#22262D] sm:text-[56px] md:text-[62px]">
          Where
          <span className="block text-[#BE8A2E]">Hidden Value</span>
          May Be Sitting
        </h2>

        <div className="relative mt-6 h-px w-48 bg-gradient-to-r from-[#C9962E]/80 to-transparent">
          <div
            className="absolute -top-[3px] left-6 h-[7px] w-20"
            style={{ background: "radial-gradient(ellipse at center, rgba(201,150,46,0.45), transparent 70%)" }}
          />
        </div>

        <p className="mt-7 max-w-md text-[15px] leading-[1.7] text-[#6E7480] sm:text-[16px]">
          Within your experience, there are signs
          <br />
          of value that are easier to miss than to see.
          <br />
          Let&rsquo;s uncover them.
        </p>

        <div className="mt-10 grid gap-7 md:grid-cols-2">
          {items.map((point, index) => (
            <div
              key={index}
              className="rounded-2xl bg-[#FDFBF4]/90 px-8 py-10 shadow-[0_18px_50px_rgba(120,90,40,0.12)] backdrop-blur-[2px] sm:px-10"
            >
              <div className="flex items-start gap-7">
                <span className="font-serif text-[44px] font-medium leading-none text-[#C9962E] sm:text-[52px]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="w-px self-stretch bg-[#C9962E]/25" />
                <p className="font-serif text-[19px] leading-[1.5] text-[#22262D] sm:text-[22px]">
                  {point}
                </p>
              </div>
              {/* flourish */}
              <div className="relative mx-auto mt-8 h-px w-40 bg-gradient-to-r from-transparent via-[#C9962E]/50 to-transparent">
                <div
                  className="absolute -top-[3px] left-1/2 h-[7px] w-16 -translate-x-1/2"
                  style={{ background: "radial-gradient(ellipse at center, rgba(201,150,46,0.5), transparent 70%)" }}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollToSection("xp-section-8")}
          className="mx-auto mt-12 flex flex-col items-center gap-2"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C9962E]/50 text-[#C9962E] transition hover:bg-[#C9962E]/10">
            <ArrowUp className="h-4 w-4" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#C9962E]">
            Scroll
          </span>
        </button>
      </div>
    </section>
  );
}
