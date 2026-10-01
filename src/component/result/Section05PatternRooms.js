import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Mouse, Sparkle } from "lucide-react";
import { emphasize } from "./experienceUtils";

const clamp = (value, minimum, maximum) =>
  Math.min(Math.max(value, minimum), maximum);

const EdgeBeams = ({ side }) => (
  <div
    className={`pointer-events-none absolute top-1/2 z-10 h-[640px] w-[260px] -translate-y-1/2 overflow-hidden ${
      side === "left" ? "left-0" : "right-0 scale-x-[-1]"
    }`}
  >
    <div
      className="absolute inset-0"
      style={{ background: "radial-gradient(ellipse at 0% 50%, rgba(233,190,120,0.22), transparent 70%)" }}
    />
    <div
      className="absolute left-[-120px] top-1/2 h-[70px] w-[420px] origin-left -rotate-[38deg]"
      style={{ background: "linear-gradient(to right, rgba(247,214,152,0.34), transparent 78%)", filter: "blur(18px)" }}
    />
    <div
      className="absolute left-[-120px] top-1/2 h-[70px] w-[420px] origin-left rotate-[38deg]"
      style={{ background: "linear-gradient(to right, rgba(247,214,152,0.30), transparent 78%)", filter: "blur(18px)" }}
    />
  </div>
);

export default function Section05PatternRooms({ title, expanded, highlights }) {
  const cards = (expanded || []).map((statement, index) => ({
    statement,
    parts: emphasize(statement, (highlights || [])[index]),
  }));
  const sectionRef = useRef(null);
  const touchRef = useRef(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const lastIndex = Math.max(cards.length - 1, 0);

  const updateFromScroll = useCallback(() => {
    const section = sectionRef.current;
    if (!section || !lastIndex) {
      setActive(0);
      setProgress(0);
      return;
    }

    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const travel = section.offsetHeight - window.innerHeight;
    const nextProgress = clamp((window.scrollY - sectionTop) / travel, 0, 1);

    setProgress(nextProgress);
    setActive(Math.round(nextProgress * lastIndex));
  }, [lastIndex]);

  useEffect(() => {
    updateFromScroll();
    window.addEventListener("scroll", updateFromScroll, { passive: true });
    window.addEventListener("resize", updateFromScroll);

    return () => {
      window.removeEventListener("scroll", updateFromScroll);
      window.removeEventListener("resize", updateFromScroll);
    };
  }, [updateFromScroll]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const handleHorizontalWheel = (event) => {
      const bounds = section.getBoundingClientRect();
      const isPinned = bounds.top <= 0 && bounds.bottom >= window.innerHeight;
      const isHorizontalGesture = Math.abs(event.deltaX) > Math.abs(event.deltaY);

      if (!isPinned || !isHorizontalGesture) return;
      event.preventDefault();
      window.scrollBy({ top: event.deltaX, behavior: "auto" });
    };

    section.addEventListener("wheel", handleHorizontalWheel, { passive: false });
    return () => section.removeEventListener("wheel", handleHorizontalWheel);
  }, []);

  const goToCard = useCallback((index, behavior = "smooth") => {
    const section = sectionRef.current;
    if (!section || !lastIndex) return;

    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const travel = section.offsetHeight - window.innerHeight;
    const targetIndex = clamp(index, 0, lastIndex);

    window.scrollTo({
      top: sectionTop + (targetIndex / lastIndex) * travel,
      behavior,
    });
  }, [lastIndex]);

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    touchRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      scrollY: window.scrollY,
    };
  };

  const handleTouchMove = (event) => {
    const start = touchRef.current;
    const touch = event.touches[0];
    if (!start || !touch) return;

    const deltaX = start.x - touch.clientX;
    const deltaY = start.y - touch.clientY;
    if (Math.abs(deltaX) <= Math.abs(deltaY)) return;

    event.preventDefault();
    window.scrollTo({ top: start.scrollY + deltaX, behavior: "auto" });
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToCard(active + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToCard(active - 1);
    }
  };

  if (!cards.length) return null;

  return (
    <section
      ref={sectionRef}
      id="xp-section-5"
      className="relative bg-[#050505]"
      style={{ height: `${Math.max(cards.length, 1) * 100}vh` }}
    >
      <div
        className="sticky top-0 h-screen overflow-hidden bg-[#050505]"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => { touchRef.current = null; }}
        aria-label={`${title}. Horizontal card sequence`}
      >
        <div className="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-[#050505] via-[#050505]/95 to-transparent">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] sm:gap-4 sm:text-[13px]">
              <span className="text-[#D9A44A]">Room 5</span>
              <span className="h-4 w-px bg-white/20" />
              <span className="hidden text-slate-300 sm:inline">Walk Into The Pattern</span>
              <span className="text-slate-300 sm:hidden">The Pattern</span>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D9A44A] sm:text-[13px]">
                {active + 1} of {cards.length}
              </span>
              <div className="hidden items-center gap-2 sm:flex">
                {cards.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Go to card ${index + 1}`}
                    aria-current={index === active ? "step" : undefined}
                    onClick={() => goToCard(index)}
                    className={`h-3 w-3 rounded-full border transition ${
                      index === active
                        ? "border-[#D9A44A] bg-[#D9A44A]"
                        : "border-white/25 bg-transparent hover:border-[#D9A44A]/70"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Light rakes in from behind the card at both edges, crossing at
            mid-height the way the design lights the room. */}
        <EdgeBeams side="left" />
        <EdgeBeams side="right" />

        <div
          className="flex h-full will-change-transform"
          style={{
            width: `${cards.length * 100}vw`,
            transform: `translate3d(-${progress * lastIndex * 100}vw, 0, 0)`,
          }}
        >
          {cards.map((card, index) => (
            <article
              key={index}
              className="flex h-screen w-screen shrink-0 flex-col items-center justify-center px-4 pb-16 pt-24 sm:px-6"
              aria-hidden={index !== active}
            >
              <div
                className="w-full max-w-6xl rounded-[28px] px-6 py-14 text-center sm:rounded-[36px] sm:px-16 sm:py-24"
                style={{
                  background: "linear-gradient(180deg, #FBF8EF 0%, #F6F1E2 100%)",
                  boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 0 40px rgba(217,164,74,0.08)",
                }}
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#C9962E]/40 sm:h-20 sm:w-20">
                  <Sparkle className="h-7 w-7 text-[#C9962E] sm:h-8 sm:w-8" strokeWidth={1.4} />
                </div>

                <p className="mx-auto mt-8 max-w-3xl font-serif text-[30px] font-medium leading-[1.22] text-[#1B1B20] sm:text-[46px] md:text-[58px]">
                  {card.parts.before}
                  {card.parts.gold && <span className="text-[#BE8A2E]">{card.parts.gold}</span>}
                  {card.parts.after}
                </p>

                <div className="relative mx-auto mt-10 h-px w-48 bg-gradient-to-r from-transparent via-[#C9962E]/60 to-transparent sm:w-64">
                  <div
                    className="absolute -top-[3px] left-1/2 h-[7px] w-24 -translate-x-1/2"
                    style={{ background: "radial-gradient(ellipse at center, rgba(201,150,46,0.5), transparent 70%)" }}
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center gap-1 text-[#D9A44A]">
                <div className="flex items-center gap-3">
                  <Mouse className="h-5 w-5" strokeWidth={1.6} />
                  <span className="text-[12px] font-semibold uppercase tracking-[0.3em]">
                    Scroll
                  </span>
                </div>
                <ChevronDown className="h-5 w-5 text-[#D9A44A]/80" />
              </div>
            </article>
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-5 z-20 flex justify-center gap-3">
          <button
            type="button"
            aria-label="Previous card"
            disabled={active === 0}
            onClick={() => goToCard(active - 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D9A44A]/50 text-[#D9A44A] transition hover:bg-[#D9A44A]/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next card"
            disabled={active === lastIndex}
            onClick={() => goToCard(active + 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D9A44A]/50 text-[#D9A44A] transition hover:bg-[#D9A44A]/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}