import { ChevronDown, Mouse } from "lucide-react";
import SceneImage from "./SceneImage";

/* CSS/SVG recreation of the mock's painted scene: dusk landscape, winding
   path to a glowing horizon, signpost, doors, scattered photographs.
   Drop a real image export in place of this composition when available. */
const DuskScene = () => (
  <div className="relative aspect-[792/584] overflow-hidden lg:aspect-auto lg:min-h-[520px]">
    {/* sky */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(190deg, #14100a 0%, #1d150c 34%, #3a2814 58%, #14100a 100%)",
      }}
    />
    {/* horizon glow */}
    <div
      className="absolute left-[38%] top-[30%] h-[240px] w-[340px]"
      style={{ background: "radial-gradient(ellipse at center, rgba(240,180,90,0.55), rgba(190,130,55,0.18) 45%, transparent 70%)" }}
    />

    <svg viewBox="0 0 640 560" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full">
      {/* distant mountains */}
      <path d="M0 250 L90 205 L180 245 L290 210 L360 240 L640 225 L640 560 L0 560 Z" fill="#191209" />
      <path d="M0 285 L120 250 L260 285 L420 258 L640 280 L640 560 L0 560 Z" fill="#100b06" />
      {/* ground */}
      <rect x="0" y="300" width="640" height="260" fill="#0d0906" />
      {/* winding path */}
      <path
        d="M300 300 C320 330 250 360 230 395 C210 430 300 460 260 510 C240 535 200 550 170 560 L340 560 C360 520 310 480 340 440 C370 400 310 360 330 330 C340 315 335 305 330 300 Z"
        fill="url(#pathGrad)"
      />
      <defs>
        <linearGradient id="pathGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a6534" stopOpacity="0.85" />
          <stop offset="1" stopColor="#241a0e" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="doorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#241a10" />
          <stop offset="1" stopColor="#0f0a06" />
        </linearGradient>
      </defs>
      {/* signpost */}
      <g stroke="#2b1f11" strokeWidth="7" fill="#2b1f11">
        <line x1="330" y1="230" x2="330" y2="330" />
        <rect x="296" y="238" width="46" height="14" rx="2" />
        <rect x="330" y="260" width="46" height="14" rx="2" />
      </g>
      <rect x="296" y="238" width="46" height="14" rx="2" fill="#3a2a15" />
      <rect x="330" y="260" width="46" height="14" rx="2" fill="#3a2a15" />
      {/* small far door */}
      <g>
        <rect x="428" y="238" width="44" height="78" rx="3" fill="url(#doorGrad)" stroke="#4a3618" strokeWidth="2" />
      </g>
      {/* large near door */}
      <g>
        <rect x="508" y="120" width="104" height="230" rx="4" fill="url(#doorGrad)" stroke="#553f1d" strokeWidth="3" />
        <line x1="560" y1="128" x2="560" y2="342" stroke="#3a2a15" strokeWidth="3" />
        <circle cx="596" cy="238" r="5" fill="#8a6534" />
        <rect x="516" y="132" width="38" height="60" rx="2" fill="none" stroke="#3a2a15" strokeWidth="2.5" />
        <rect x="566" y="132" width="38" height="60" rx="2" fill="none" stroke="#3a2a15" strokeWidth="2.5" />
        <rect x="516" y="206" width="38" height="80" rx="2" fill="none" stroke="#3a2a15" strokeWidth="2.5" />
        <rect x="566" y="206" width="38" height="80" rx="2" fill="none" stroke="#3a2a15" strokeWidth="2.5" />
      </g>
      {/* scattered photographs */}
      <g>
        <g transform="rotate(-8 430 470)">
          <rect x="370" y="430" width="120" height="86" rx="3" fill="#c9b490" opacity="0.92" />
          <rect x="378" y="438" width="104" height="62" fill="#6d5028" />
        </g>
        <g transform="rotate(6 520 490)">
          <rect x="460" y="450" width="126" height="90" rx="3" fill="#d4c09c" opacity="0.95" />
          <rect x="468" y="458" width="110" height="66" fill="#7a5c30" />
          <circle cx="523" cy="491" r="16" fill="#4a3618" />
        </g>
        <g transform="rotate(-3 590 520)">
          <rect x="530" y="500" width="110" height="60" rx="3" fill="#c9b490" opacity="0.9" />
          <rect x="538" y="508" width="94" height="44" fill="#6d5028" />
        </g>
      </g>
    </svg>

    <SceneImage
      src="/results/section-6-dusk.jpg"
      mobileSrc="/results/section-6-dusk-mobile.jpg"
    />

    {/* On desktop the scene sits beside the copy, so it fades into the card
        from the left. The mobile design butts it straight against the quote. */}
    <div
      className="absolute inset-y-0 left-0 hidden w-64 lg:block"
      style={{ background: "linear-gradient(to right, #0B0906, transparent)" }}
    />

    {/* Mobile keeps the scroll cue on the artwork, inside the card. */}
    <div className="absolute inset-x-0 bottom-4 flex flex-col items-center text-[#D9A44A] lg:hidden">
      <div className="flex items-center gap-3">
        <Mouse className="h-5 w-5" strokeWidth={1.6} />
        <span className="text-[12px] font-semibold uppercase tracking-[0.3em]">Scroll</span>
      </div>
      <ChevronDown className="mt-1 h-5 w-5 text-[#D9A44A]/80" />
    </div>
  </div>
);

export default function Section06QuietCost({ points }) {
  const items = points.slice(0, 2);

  return (
    <section
      id="xp-section-6"
      className="relative flex min-h-screen flex-col items-center justify-center bg-[#050505] px-4 py-14 sm:px-6"
    >
      <div className="w-full max-w-7xl overflow-hidden rounded-[24px] border border-[#4a3a20]/50 bg-[#0B0906]">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div className="px-7 pb-5 pt-12 sm:px-12 sm:pt-16 lg:pb-16">
            <h2 className="font-serif text-[38px] font-medium leading-[1.08] text-[#F5F1E8] sm:text-[52px] md:text-[58px]">
              What May Be
              <span className="block text-[#D9A44A]">Quietly Costing You</span>
            </h2>

            <div className="relative mt-6 h-px w-48 bg-gradient-to-r from-[#D9A44A]/80 to-transparent">
              <div
                className="absolute -top-[3px] left-6 h-[7px] w-20"
                style={{ background: "radial-gradient(ellipse at center, rgba(240,210,144,0.6), transparent 70%)" }}
              />
            </div>

            <div className="mt-6 space-y-0 lg:mt-10">
              {items.map((point, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-6 py-5 lg:py-7 ${index > 0 ? "border-t border-white/[0.07]" : ""}`}
                >
                  <span className="font-serif text-[34px] font-medium leading-none text-[#C9962E] sm:text-[40px]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-1 w-px self-stretch bg-white/15" />
                  <p className="font-serif text-[18px] leading-[1.35] text-[#E9E4D8] sm:text-[21px] lg:leading-[1.55]">
                    {point}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-4 rounded-xl border border-[#D9A44A]/20 bg-white/[0.02] px-6 py-6">
              <span className="font-serif text-[34px] leading-none text-[#C9962E]">&ldquo;</span>
              <span className="w-px self-stretch bg-[#D9A44A]/25" />
              <p className="font-serif text-[16px] italic leading-[1.5] text-[#D9A44A] sm:text-[18px]">
                I hadn&rsquo;t realised this could be costing me.
              </p>
            </div>
          </div>

          <DuskScene />
        </div>
      </div>

      <div className="mt-7 hidden items-center gap-3 text-[#D9A44A] lg:flex">
        <Mouse className="h-5 w-5" strokeWidth={1.6} />
        <span className="text-[12px] font-semibold uppercase tracking-[0.3em]">Scroll</span>
      </div>
      <ChevronDown className="mt-1 hidden h-5 w-5 text-[#D9A44A]/80 lg:block" />

      {/* bottom hairline */}
      <div className="mt-5 h-px w-64 bg-gradient-to-r from-transparent via-[#D9A44A]/70 to-transparent" />
    </section>
  );
}
