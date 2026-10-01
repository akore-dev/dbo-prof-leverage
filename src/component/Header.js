import { Menu, ShieldCheck } from "lucide-react";

const Header = ({ confidential = false }) => {
  const confidentialLabel =
    typeof confidential === "string" ? confidential : "Your responses are confidential";
  return (
    <header className="border-b border-[#D9A44A]/25 bg-[#0E1319]">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-5 py-4 sm:px-8 md:py-5">

        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#D9A44A] font-serif text-xl text-[#D9A44A] md:h-11 md:w-11 md:text-2xl">
            PL
          </div>

          <div className="flex flex-col justify-center">
            <span className="font-serif text-[17px] font-semibold tracking-[0.18em] text-[#D9A44A] md:text-[20px]">
              <span className="text-[#EDE6D6]">PROF</span>LEVERAGE
            </span>
            <span className="mt-[3px] text-[7px] tracking-[0.28em] text-gray-400 md:text-[8px]">
              CLARITY. LEVERAGE. NEXT LEVEL.
            </span>
          </div>
        </a>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {confidential && (
            <>
              <div className="hidden items-center gap-2 text-sm text-gray-300 md:flex">
                <ShieldCheck size={18} className="text-[#D9A44A]" />
                <span>{confidentialLabel}</span>
              </div>
              <ShieldCheck size={20} className="text-[#D9A44A] md:hidden" />
            </>
          )}
          <Menu size={26} className="text-[#D9A44A] md:hidden" />
        </div>

      </div>
    </header>
  );
};

export default Header;
