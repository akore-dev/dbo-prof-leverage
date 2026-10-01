import { Sparkle } from "lucide-react";
import SceneImage, { useSceneImage } from "./SceneImage";

/* Light scene: stone steps rising to an open doorway filled with sunlight.
   Swap for the real image export when available. */
const DoorwayScene = () => (
  <div className="relative h-full min-h-[280px] w-full overflow-hidden lg:min-h-[560px]">
    <div className="absolute inset-0" style={{ background: "linear-gradient(165deg, #F8F3E8 0%, #F3EBD8 60%, #EDE2C8 100%)" }} />
    {/* haze */}
    <div
      className="absolute left-0 top-1/3 h-[260px] w-full"
      style={{ background: "linear-gradient(to bottom, transparent, rgba(250,246,236,0.7), transparent)" }}
    />

    <svg viewBox="0 0 640 620" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="doorLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF7E0" />
          <stop offset="55%" stopColor="#FFEBB8" />
          <stop offset="100%" stopColor="#F6CF8B" />
        </linearGradient>
        <linearGradient id="frame" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#D8C7A4" />
          <stop offset="55%" stopColor="#EADCBE" />
          <stop offset="100%" stopColor="#BCA679" />
        </linearGradient>
        <linearGradient id="step" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F5EEDC" />
          <stop offset="100%" stopColor="#CDBB92" />
        </linearGradient>
      </defs>

      {/* glow behind the door */}
      <ellipse cx="420" cy="250" rx="170" ry="150" fill="#FFEBB8" opacity="0.45" />

      {/* door frame */}
      <g transform="rotate(-2 420 250)">
        <rect x="330" y="90" width="185" height="310" rx="6" fill="url(#frame)" stroke="#B49C6C" strokeWidth="2" />
        <rect x="345" y="104" width="152" height="288" rx="4" fill="url(#doorLight)" />
      </g>
      {/* light spill onto the top landing */}
      <path d="M345 396 L500 392 L560 445 L300 452 Z" fill="#FFEBB8" opacity="0.6" />

      {/* steps */}
      <g stroke="#BCA679" strokeWidth="1.5">
        <rect x="300" y="440" width="250" height="34" rx="5" fill="url(#step)" />
        <rect x="272" y="470" width="300" height="38" rx="5" fill="url(#step)" />
        <rect x="242" y="504" width="350" height="40" rx="5" fill="url(#step)" />
        <rect x="208" y="540" width="404" height="44" rx="5" fill="url(#step)" />
        <rect x="176" y="580" width="464" height="40" rx="5" fill="url(#step)" />
      </g>

      {/* rocks + plants */}
      <ellipse cx="160" cy="600" rx="70" ry="26" fill="#D9C9A4" opacity="0.7" />
      <ellipse cx="610" cy="560" rx="60" ry="24" fill="#D9C9A4" opacity="0.65" />
      <g stroke="#B99A5E" strokeWidth="2.4" fill="none" opacity="0.7" strokeLinecap="round">
        <path d="M240 470 C232 440 244 416 238 396 M240 470 C252 448 246 428 256 412" />
        <path d="M580 500 C572 468 586 444 578 420 M580 500 C592 476 584 452 596 438" />
        <path d="M620 430 C614 404 624 386 618 366" />
      </g>
    </svg>

    <SceneImage src="/results/section-8-doorway-mobile.jpg" />
  </div>
);

const DOORWAY_ART = "/results/section-8-doorway.jpg";
const DOORWAY_MASK =
  "radial-gradient(125% 115% at 100% 25%, #000 42%, rgba(0,0,0,0.5) 66%, transparent 86%)";

export default function Section08OpensUp({ points }) {
  const doorwayArtReady = useSceneImage(DOORWAY_ART);
  const items = points.slice(0, 2);

  return (
    <section id="xp-section-8" className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #FAF7EF 0%, #F6F0E1 100%)" }} />

      {/* The design runs the scene across the whole frame, so the export is
          positioned against the section rather than boxed in the grid column. */}
      {doorwayArtReady && (
        <img
          src={DOORWAY_ART}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover lg:block"
        />
      )}

      {/* Mobile: the doorway sits in the upper right and dissolves into the
          page. Masked rather than overlaid so it leaves no edge. */}
      <div
        className="pointer-events-none absolute right-0 top-[100px] h-[380px] w-[80%] overflow-hidden lg:hidden"
        style={{ maskImage: DOORWAY_MASK, WebkitMaskImage: DOORWAY_MASK }}
      >
        <DoorwayScene />
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center gap-6 px-6 py-16 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#C9962E]/30">
            <Sparkle className="h-6 w-6 text-[#C9962E]" strokeWidth={1.4} />
          </div>

          <h2 className="mt-6 font-serif text-[40px] font-medium leading-[1.08] text-[#22262D] sm:text-[56px] md:text-[62px]">
            What This
            <span className="block text-[#BE8A2E]">May Open Up</span>
          </h2>

          <div className="relative mt-6 h-px w-48 bg-gradient-to-r from-[#C9962E]/80 to-transparent">
            <div
              className="absolute -top-[3px] left-6 h-[7px] w-20"
              style={{ background: "radial-gradient(ellipse at center, rgba(201,150,46,0.45), transparent 70%)" }}
            />
          </div>

          <p className="mt-7 max-w-sm text-[15px] leading-[1.7] text-[#6E7480] sm:text-[16px]">
            A deeper, clearer story creates more
            possibilities than you may realise.
          </p>

          <div className="mt-9 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 no-scrollbar lg:max-w-4xl">
            {items.map((point, index) => (
              <div
                key={index}
                className="w-[85vw] shrink-0 snap-start rounded-2xl bg-[#FBF7EC]/90 px-8 py-9 shadow-[0_14px_40px_rgba(120,90,40,0.10)] sm:w-[460px] sm:px-10"
              >
                <div className="flex items-start gap-7">
                  <span className="font-serif text-[40px] font-medium leading-none text-[#C9962E] sm:text-[48px]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="w-px self-stretch bg-[#C9962E]/25" />
                  <p className="font-serif text-[18px] leading-[1.5] text-[#22262D] sm:text-[21px]">
                    {point}
                  </p>
                </div>
                <div className="relative mx-auto mt-7 h-px w-36 bg-gradient-to-r from-transparent via-[#C9962E]/50 to-transparent">
                  <div
                    className="absolute -top-[3px] left-1/2 h-[7px] w-14 -translate-x-1/2"
                    style={{ background: "radial-gradient(ellipse at center, rgba(201,150,46,0.5), transparent 70%)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block">{doorwayArtReady ? null : <DoorwayScene />}</div>
      </div>
    </section>
  );
}


