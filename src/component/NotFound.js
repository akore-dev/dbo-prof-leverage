import { ArrowLeft } from "lucide-react";
import Header from "./Header";

export default function NotFound() {
  return (
    <main className="diagnostic-page min-h-screen bg-[#0E1319] text-[#F5F1E8]">
      <Header />
      <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#D9A44A]">404</p>
        <h1 className="mt-5 font-serif text-5xl font-medium md:text-6xl">This page is out of view.</h1>
        <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
          The page may have moved, or the link may be incomplete. Return home to begin the Professional Leverage Diagnostic.
        </p>
        <a href="/" className="mt-9 inline-flex items-center gap-2 rounded-lg bg-[#D9A44A] px-6 py-3 font-semibold text-[#161005] transition hover:bg-[#E8B563]">
          <ArrowLeft size={18} aria-hidden="true" />
          Return home
        </a>
      </section>
    </main>
  );
}