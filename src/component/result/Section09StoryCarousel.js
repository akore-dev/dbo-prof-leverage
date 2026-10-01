import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Compass,
  Grip,
  Layers,
  Lock,
  ShieldCheck,
  Sparkle,
} from "lucide-react";

/* "As-is" artwork slides load exports dropped into public/results/.
   Until the file exists, a quiet placeholder renders instead. */
/* The doorway export carries the mock's own ground. Feathering its edges lets
   it sit on the card without reading as a pasted rectangle. */
const DOOR_MASK = "radial-gradient(closest-side at 50% 50%, #000 56%, transparent 100%)";

const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum);

const AsIsImage = ({ src, mobileSrc, alt, className, style, hideOnError = false, loading }) => {
  const [failed, setFailed] = useState(false);

  if (failed && hideOnError) return null;

  if (failed) {
    return (
      <div className={`flex items-center justify-center ${className || ""}`} style={style}>
        <p className="max-w-xs text-center font-serif text-[15px] italic text-[#B99A5E]">
          Artwork pending — save the export as
          <br />
          <span className="not-italic">{src}</span>
        </p>
      </div>
    );
  }

  /* Some artwork ships as a landscape export for wide screens and a portrait
     one for phones; <picture> picks the right crop instead of letting
     object-cover chop the composition. */
  const image = (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      onError={() => setFailed(true)}
    />
  );

  if (!mobileSrc) return image;

  return (
    <picture>
      <source media="(max-width: 1023px)" srcSet={mobileSrc} />
      {image}
    </picture>
  );
};

const Flourish = () => (
  <div className="flex items-center justify-center gap-3">
    <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C9962E]/60 sm:w-24" />
    <Sparkle className="h-4 w-4 text-[#C9962E]" strokeWidth={1.6} />
    <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C9962E]/60 sm:w-24" />
  </div>
);

/* Slide A — "There May Be More To Your Story" over sunrise mountains */
const SlideStoryIntro = ({ onAdvance }) => (
  <div className="relative h-full w-full overflow-hidden">
    {/* CSS sunrise scene; drop /results/section-8a-bg.jpg on top when available */}
    <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #FBF6EA 0%, #F8EFDC 45%, #EFDFC2 100%)" }} />
    <div
      className="absolute right-[2%] top-[38%] h-[360px] w-[420px]"
      style={{ background: "radial-gradient(circle at 60% 45%, rgba(255,246,220,0.95) 0%, rgba(246,206,126,0.55) 30%, transparent 65%)" }}
    />
    <svg viewBox="0 0 1440 520" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-0 h-[52%] w-full">
      <path d="M0 250 L200 190 L430 265 L700 175 L980 260 L1200 190 L1440 250 L1440 520 L0 520 Z" fill="#C9B392" opacity="0.45" />
      <path d="M0 320 L260 250 L520 330 L820 245 L1120 330 L1440 265 L1440 520 L0 520 Z" fill="#AE9469" opacity="0.5" />
      <path d="M0 400 C160 360 300 415 470 380 C650 343 800 415 1000 385 C1180 358 1320 405 1440 380 L1440 520 L0 520 Z" fill="#7E6841" opacity="0.65" />
      {/* foreground tree ridges */}
      <path d="M0 470 C90 430 170 455 260 435 C240 452 250 470 230 480 C300 455 350 480 430 465 L470 520 L0 520 Z" fill="#4E4026" opacity="0.85" />
      <path d="M1440 460 C1350 425 1270 452 1180 432 C1210 452 1195 468 1215 478 C1140 452 1080 478 1010 462 L980 520 L1440 520 Z" fill="#4E4026" opacity="0.8" />
    </svg>
    {/* real photo export takes over the CSS scene once dropped in */}
    <AsIsImage
      src="/results/section-8a-bg.jpg"
      alt=""
      hideOnError
      className="absolute inset-0 h-full w-full object-cover"
    />

    <div className="relative flex h-full flex-col px-8 pt-28 sm:px-16 lg:px-24">
      <h2 className="font-serif text-[44px] font-medium leading-[1.05] text-[#212B36] sm:text-[62px] md:text-[72px]">
        There May Be
        <br />
        More To
        <span className="block text-[#BE8A2E]">Your Story</span>
      </h2>

      <div className="relative mt-7 h-px w-56 bg-gradient-to-r from-[#C9962E]/70 via-[#C9962E]/30 to-transparent">
        <div
          className="absolute -top-[4px] left-14 h-[9px] w-24"
          style={{ background: "radial-gradient(ellipse at center, rgba(240,190,90,0.8), transparent 70%)" }}
        />
      </div>

      <p className="mt-9 max-w-sm text-[16px] leading-[1.7] text-[#5B6470] sm:text-[18px]">
        Everything you&rsquo;ve seen so far came
        <br />
        from the answers you gave today.
      </p>
    </div>

    <button
      type="button"
      onClick={onAdvance}
      className="absolute bottom-9 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
    >
      <span className="text-[12px] font-semibold uppercase tracking-[0.35em] text-[#C9962E]">
        Scroll to Continue
      </span>
      <ChevronDown className="h-5 w-5 text-[#C9962E]" />
    </button>
  </div>
);

/* Slide B — "Some of the strongest answers may already exist…" */
const SlideAnswersExist = () => (
  <div className="relative flex h-full w-full items-center justify-center overflow-hidden px-8">
    <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #FBF4E4 0%, #F8EEDA 100%)" }} />
    <div className="relative text-center">
      <p className="font-serif text-[34px] font-medium leading-[1.3] text-[#212B36] sm:text-[52px] md:text-[72px]">
        Some of the <span className="text-[#BE8A2E]">strongest</span>
        <br />
        answers may already exist&hellip;
      </p>

      <div className="my-9 flex items-center justify-center gap-2.5 sm:my-14">
        <span className="h-2 w-2 rounded-full bg-[#C9962E]" />
        <span className="h-2 w-2 rounded-full bg-[#C9962E]/70" />
        <span className="h-2 w-2 rounded-full bg-[#C9962E]/40" />
      </div>

      <p className="font-serif text-[34px] font-medium leading-[1.3] text-[#212B36] sm:text-[52px] md:text-[72px]">
        &hellip;inside <span className="text-[#BE8A2E]">experiences</span>
        <br />
        we haven&rsquo;t explored yet.
      </p>
    </div>
  </div>
);

/* Slide C — memory carousel: dreamy portrait art + phrases that fade
   through in sequence (client spec: show, fade, next, fade, …). */
const MEMORY_PHRASES = [
  { lead: "A conversation", tail: "you still remember." },
  { lead: "A project", tail: "that changed you." },
  { lead: "A responsibility", tail: "people trusted you with." },
  { lead: "A problem", tail: "everyone brought to you." },
  { lead: "A success", tail: "you’ve stopped thinking about." },
];

const MEMORY_HOLD_MS = 3200;
const MEMORY_FADE_MS = 650;

const SlideMemories = () => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((current) => (current + 1) % MEMORY_PHRASES.length);
        setVisible(true);
      }, MEMORY_FADE_MS);
    }, MEMORY_HOLD_MS);
    return () => clearInterval(cycle);
  }, []);

  const previous = MEMORY_PHRASES[(index + MEMORY_PHRASES.length - 1) % MEMORY_PHRASES.length];
  const current = MEMORY_PHRASES[index];
  const next = MEMORY_PHRASES[(index + 1) % MEMORY_PHRASES.length];

  const MobileFlourish = () => (
    <div className="flex items-center justify-center gap-3 lg:hidden">
      <div className="h-px w-14 bg-gradient-to-r from-transparent to-[#C9962E]/50" />
      <Sparkle className="h-3.5 w-3.5 text-[#C9962E]" strokeWidth={1.6} />
      <div className="h-px w-14 bg-gradient-to-l from-transparent to-[#C9962E]/50" />
    </div>
  );

  return (
    <div className="relative h-full w-full overflow-y-auto overflow-x-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #FBF4E6 0%, #F7EDDB 100%)" }} />

      <div className="relative flex min-h-full flex-col items-center justify-center gap-8 px-8 py-16 pt-24 sm:px-14 lg:grid lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-6 lg:pt-16">
        <div className="relative flex h-[46%] max-h-[380px] w-full items-center justify-center lg:h-[78%] lg:max-h-none lg:self-center">
          {/* soft halo behind the artwork */}
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at center, rgba(246,206,126,0.35), transparent 65%)" }}
          />
          {/* The export carries its own near-white ground; `darken` lets the
              slide's warmer cream win wherever the artwork is lighter, so the
              image reads as part of the page rather than a pasted rectangle. */}
          <AsIsImage
            src="/results/section-8c-art.jpg"
            loading="lazy"
            alt="Memories forming a portrait"
            className="relative max-h-full max-w-full object-contain"
            style={{ mixBlendMode: "darken" }}
          />
        </div>

        <div
          className="flex w-full flex-col items-center gap-6 text-center transition-opacity ease-in-out sm:gap-8 lg:items-start lg:gap-10 lg:py-16 lg:pl-8 lg:text-left"
          style={{ opacity: visible ? 1 : 0, transitionDuration: `${MEMORY_FADE_MS}ms` }}
          aria-live="polite"
        >
          <p className="font-serif text-[22px] leading-[1.35] text-[#8B93A0] opacity-50 blur-[0.6px] sm:text-[26px] lg:text-[30px]">
            {previous.lead}
            <br />
            <span className="italic">{previous.tail}</span>
          </p>

          <MobileFlourish />

          <p className="font-serif text-[34px] leading-[1.25] text-[#212B36] sm:text-[40px] lg:text-[50px]">
            {current.lead}
            <br />
            <span className="italic text-[#BE8A2E]">{current.tail}</span>
          </p>

          <MobileFlourish />

          <p className="font-serif text-[22px] leading-[1.35] text-[#8B93A0] opacity-50 blur-[0.6px] sm:text-[26px] lg:text-[30px]">
            {next.lead}
            <br />
            <span className="italic">{next.tail}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

/* Slide D — constellation artwork, used exactly as exported */
const SlideConstellation = () => (
  <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
    <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #F6EDDD 0%, #F1E5CE 100%)" }} />
    <AsIsImage
      src="/results/section-8d.jpg"
      loading="lazy"
      alt="Career, projects, trusted moments, repeated wins, patterns, identity"
      className="relative h-[92%] max-w-full rounded-[24px] object-contain"
      style={{ filter: "drop-shadow(0 24px 60px rgba(120,90,40,0.22))" }}
    />
  </div>
);

/* Slide E — "Today's answers are only part of the story." */
const SlidePartOfStory = () => (
  <div className="relative flex h-full w-full items-center justify-center overflow-hidden px-8">
    <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #FBF3E2 0%, #F7ECD6 100%)" }} />

    <div className="relative max-w-3xl text-center">
      {/* The design catches two small flares on the headline itself — one on
          the opening letter, one on the tail of the gold line. */}
      <div
        className="pointer-events-none absolute left-[14%] top-[12%] h-20 w-20 -translate-x-1/2 -translate-y-1/2"
        style={{ background: "radial-gradient(circle, rgba(255,236,190,0.75), transparent 68%)" }}
      />
      <div
        className="pointer-events-none absolute left-[86%] top-[30%] h-24 w-24 -translate-x-1/2 -translate-y-1/2"
        style={{ background: "radial-gradient(circle, rgba(255,232,175,0.8), transparent 68%)" }}
      />
      <h3 className="font-serif text-[40px] font-medium leading-[1.15] text-[#212B36] sm:text-[56px] md:text-[64px]">
        Today&rsquo;s answers
        <br />
        are only
        <span className="block italic text-[#BE8A2E]">part of the story.</span>
      </h3>

      <div className="my-9 sm:my-10">
        <Flourish />
      </div>

      <p className="font-serif text-[26px] leading-[1.4] text-[#212B36] sm:text-[36px]">
        The deeper story has been
        <br />
        quietly unfolding across
        <br />
        your career for years.
      </p>

      <div className="my-9 sm:my-10">
        <Flourish />
      </div>

      <p className="font-serif text-[16px] italic leading-[1.6] text-[#8B8574] sm:text-[19px]">
        Some of its most important pieces may
        <br />
        be hiding in experiences you&rsquo;ve stopped thinking about.
      </p>
    </div>
  </div>
);

/* Slide F — glowing wall of remembered moments, used exactly as exported */
const SlideMemoryWall = () => (
  <div className="relative h-full w-full overflow-hidden bg-[#0A0805]">
    <AsIsImage
      src="/results/section-8f.jpg"
      loading="lazy"
      mobileSrc="/results/section-8f-mobile.jpg"
      alt="A wall of glowing remembered moments, with an open door"
      className="absolute inset-0 h-full w-full object-cover"
    />
  </div>
);

/* Slide G — "That's where the rest of your story begins." */
const SlideStoryBegins = () => (
  <div className="relative flex h-full w-full items-center justify-center overflow-hidden px-8">
    <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #FBF3E4 0%, #F8EEDB 100%)" }} />

    <div className="relative w-full max-w-6xl">
      {/* A single flare caught on the gold words, as in the design. */}
      <div
        className="pointer-events-none absolute left-[66%] top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2"
        style={{ background: "radial-gradient(circle, rgba(255,232,175,0.7), transparent 68%)" }}
      />

      <p className="relative text-center font-serif text-[30px] font-medium leading-[1.3] text-[#212B36] sm:text-[48px] md:text-[64px]">
        That&rsquo;s where the rest of <span className="text-[#BE8A2E]">your story</span> begins.
      </p>
    </div>
  </div>
);

/* Slide H — "Ready to see the whole story?" (client's section 9) */
const SlideNextChapter = () => (
  <div className="relative h-full w-full overflow-y-auto overflow-x-hidden">
    <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #FBF3E4 0%, #F7EDDA 100%)" }} />
    {/* ambient sparkle arcs */}
    <div className="pointer-events-none absolute -left-24 top-1/3 h-[420px] w-[420px] rounded-full border border-[#C9962E]/15" />
    <div className="pointer-events-none absolute -right-28 top-1/4 h-[480px] w-[480px] rounded-full border border-[#C9962E]/12" />
    <div
      className="pointer-events-none absolute left-[6%] top-[58%] h-24 w-24"
      style={{ background: "radial-gradient(circle, rgba(246,206,126,0.5), transparent 70%)" }}
    />
    <div
      className="pointer-events-none absolute right-[8%] top-[70%] h-28 w-28"
      style={{ background: "radial-gradient(circle, rgba(246,206,126,0.45), transparent 70%)" }}
    />

    <div className="relative mx-auto flex min-h-full max-w-5xl flex-col justify-center px-6 py-20 sm:px-8">
      <p className="text-center text-[12px] font-semibold uppercase tracking-[0.3em] text-[#BE8A2E] sm:text-[13px]">
        The Next Chapter
      </p>

      <h2 className="mt-3 text-center font-serif text-[36px] font-medium leading-[1.12] text-[#212B36] sm:text-[52px] md:text-[60px]">
        Ready to see the <span className="text-[#BE8A2E]">whole story?</span>
      </h2>

      <div className="mt-4 flex items-center justify-center gap-3">
        <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#C9962E]/50 sm:w-28" />
        <Sparkle className="h-3.5 w-3.5 text-[#C9962E]" strokeWidth={1.6} />
        <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#C9962E]/50 sm:w-28" />
      </div>

      <p className="mx-auto mt-5 max-w-xl text-center text-[16px] leading-[1.6] text-[#3A4350] sm:text-[19px]">
        The <span className="text-[#BE8A2E]">Professional Leverage Audit™</span> begins where today&rsquo;s
        diagnostic naturally ends.
      </p>

      {/* main card */}
      <div className="relative mt-8 overflow-hidden rounded-2xl bg-[#FDFAF2]/90 p-7 shadow-[0_20px_60px_rgba(140,100,40,0.12)] sm:p-9">
        {/* The mobile design tucks the doorway into the card's top-right
            corner alongside the copy instead of stacking it underneath. */}
        <div
          className="pointer-events-none absolute right-0 top-7 aspect-[356/300] w-1/2 lg:inset-y-0 lg:top-0 lg:aspect-auto lg:h-[82%] lg:w-[44%]"
          style={{ maskImage: DOOR_MASK, WebkitMaskImage: DOOR_MASK }}
        >
          <AsIsImage
            src="/results/section-9-door.jpg"
            loading="lazy"
            alt=""
            hideOnError
            className="absolute inset-0 h-full w-full object-cover"
            style={{ mixBlendMode: "darken" }}
          />
        </div>

        <div className="grid items-center gap-8">
          <div className="lg:pr-[44%]">
            <div className="pr-[48%] lg:pr-0">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#BE8A2E] sm:text-[12px]">
                <Sparkle className="h-3.5 w-3.5" strokeWidth={2} />
                <span>The Next Step</span>
              </p>

              <h3 className="mt-3 font-serif text-[24px] font-medium leading-[1.15] text-[#212B36] sm:text-[34px]">
                Professional Leverage Audit™
              </h3>

              <p className="mt-4 max-w-xl text-[14px] leading-[1.65] text-[#3A4350] sm:text-[15px]">
                A comprehensive extraction and analysis process that uncovers
                the patterns, evidence and hidden connections behind your career.
                We go deeper—<span className="text-[#BE8A2E]">far beyond</span> what a 20-minute diagnostic can reveal.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-[#C9962E]/20">
              {[
                { Icon: Layers, title: "Deep extraction", text: "Uncover hidden assets and evidence" },
                { Icon: Grip, title: "Pattern analysis", text: "Reveal the real story behind your career" },
                { Icon: Compass, title: "Strategic clarity", text: "Gain direction, positioning and next-level options" },
              ].map(({ Icon, title, text }) => (
                <div key={title} className="flex items-start gap-3 sm:px-4 sm:first:pl-0 sm:last:pr-0">
                  <Icon className="mt-[2px] h-6 w-6 shrink-0 text-[#BE8A2E]" strokeWidth={1.5} />
                  <div>
                    <p className="text-[13px] font-semibold text-[#212B36] sm:text-[14px]">{title}</p>
                    <p className="mt-1 text-[12px] leading-[1.45] text-[#6E7480] sm:text-[13px]">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="group relative mx-auto mt-7 flex w-full max-w-lg items-center justify-center gap-3 rounded-xl bg-gradient-to-b from-[#D8A945] to-[#B8862A] px-6 py-4 text-[16px] font-semibold text-white shadow-[0_10px_30px_rgba(184,134,42,0.35)] transition hover:from-[#E0B453] hover:to-[#C19130] sm:text-[18px]"
        >
          <span>Continue My Story</span>
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-[12px] text-[#6E7480] sm:text-[13px]">
          <ShieldCheck className="h-4 w-4 text-[#BE8A2E]" />
          <span>Secure, private and confidential. You&rsquo;re in control at every step.</span>
        </div>
      </div>

      {/* debrief card */}
      <div className="mt-6 rounded-2xl bg-[#FDFAF2]/80 px-7 py-6 shadow-[0_14px_40px_rgba(140,100,40,0.08)] sm:px-9">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#F5EBD3]">
            {/* two chairs + plant */}
            <svg viewBox="0 0 64 48" className="h-12 w-14" fill="none" stroke="#B8862A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 24 L6 14 Q6 10 10 10 L16 10 Q20 10 20 14 L20 24 M4 24 L22 24 L22 36 M4 24 L4 36 M7 36 L7 30 L19 30 L19 36" />
              <path d="M44 24 L44 14 Q44 10 48 10 L54 10 Q58 10 58 14 L58 24 M42 24 L60 24 L60 36 M42 24 L42 36 M45 36 L45 30 L57 30 L57 36" />
              <path d="M32 36 L32 26 M32 26 C28 24 27 20 28 17 C31 18 33 21 32 26 Z M32 26 C36 24 37 20 36 17 C33 18 31 21 32 26 Z M28 36 L36 36" />
            </svg>
          </div>

          <div className="min-w-0 flex-1 text-center md:text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#BE8A2E] sm:text-[12px]">
              Prefer Talking It Through First?
            </p>
            <p className="mt-2 text-[14px] leading-[1.6] text-[#3A4350] sm:text-[15px]">
              Some people find it helpful to spend 30 minutes understanding
              today&rsquo;s results before deciding what comes next.
            </p>
          </div>

          <button
            type="button"
            className="flex shrink-0 items-center gap-2 rounded-xl border border-[#C9962E]/50 px-6 py-3.5 text-[14px] font-semibold text-[#BE8A2E] transition hover:bg-[#C9962E]/10 sm:text-[15px]"
          >
            <span>Book a Professional Leverage Debrief™</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-[12px] text-[#6E7480] sm:text-[13px]">
          <Lock className="h-3.5 w-3.5 text-[#BE8A2E]" />
          <span>No pressure. No commitment. Just clarity.</span>
        </div>
      </div>

      <p className="mt-8 flex items-center justify-center gap-3 text-center font-serif text-[16px] text-[#212B36] sm:text-[19px]">
        <Sparkle className="h-4 w-4 shrink-0 text-[#C9962E]" strokeWidth={1.6} />
        <span>Your story is unique. Your path forward should be too.</span>
      </p>
    </div>
  </div>
);

const SLIDES = [
  { key: "story-intro", Component: SlideStoryIntro },
  { key: "answers-exist", Component: SlideAnswersExist },
  { key: "memories", Component: SlideMemories },
  { key: "constellation", Component: SlideConstellation },
  { key: "part-of-story", Component: SlidePartOfStory },
  { key: "memory-wall", Component: SlideMemoryWall },
  { key: "story-begins", Component: SlideStoryBegins },
];

export default function Section09StoryCarousel() {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const lastIndex = Math.max(SLIDES.length - 1, 0);

  const goTo = useCallback(
    (index, behavior = "smooth") => {
      const section = sectionRef.current;
      if (!section || !lastIndex) return;

      const clampedIndex = clamp(index, 0, lastIndex);
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);

      window.scrollTo({
        top: sectionTop + (clampedIndex / lastIndex) * travel,
        behavior,
      });
    },
    [lastIndex]
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !lastIndex) {
      setActive(0);
      setProgress(0);
      return undefined;
    }

    const updateFromScroll = () => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      const nextProgress = clamp((window.scrollY - sectionTop) / travel, 0, 1);

      setProgress(nextProgress);
      setActive(Math.round(nextProgress * lastIndex));
    };

    updateFromScroll();
    window.addEventListener("scroll", updateFromScroll, { passive: true });
    window.addEventListener("resize", updateFromScroll);

    return () => {
      window.removeEventListener("scroll", updateFromScroll);
      window.removeEventListener("resize", updateFromScroll);
    };
  }, [lastIndex]);

  if (!SLIDES.length) return null;

  return (
    <>
      <section
        ref={sectionRef}
        id="xp-section-9"
        className="relative bg-[#FBF4E4]"
        style={{ height: `${Math.max(SLIDES.length, 1) * 100}vh` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden bg-[#FBF4E4]">
          <div
            className="flex h-full will-change-transform"
            style={{
              width: `${SLIDES.length * 100}vw`,
              transform: `translate3d(-${progress * lastIndex * 100}vw, 0, 0)`,
            }}
          >
            {SLIDES.map(({ key, Component }, index) => (
              <div key={key} className="h-screen w-screen shrink-0">
                <Component onAdvance={() => goTo(index + 1)} />
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between px-7 pt-7 sm:px-10 sm:pt-9">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#C9962E]/40 bg-white/20 backdrop-blur-[2px]">
              <Sparkle className="h-6 w-6 text-[#C9962E]" strokeWidth={1.4} />
            </div>

            <div className="pointer-events-auto flex items-center gap-3 pt-2">
              {SLIDES.map((slide, index) => (
                <button
                  key={slide.key}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => goTo(index)}
                  className={`h-3.5 w-3.5 rounded-full border transition ${
                    index === active
                      ? "border-[#BE8A2E] bg-[#BE8A2E]"
                      : "border-[#C9962E]/50 bg-transparent hover:bg-[#C9962E]/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="xp-next-chapter" className="relative h-screen w-full overflow-hidden bg-[#FBF4E4]">
        <SlideNextChapter />
      </section>
    </>
  );
}
