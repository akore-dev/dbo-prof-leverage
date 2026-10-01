import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const createInviteToken = () => {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID().replace(/-/g, "");
  }

  const bytes = new Uint8Array(24);
  window.crypto?.getRandomValues?.(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const normalizeReferralCode = (code) => String(code || "").trim().toUpperCase();

export default function ReferralEntry() {
  const navigate = useNavigate();
  const { code: pathCode } = useParams();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = normalizeReferralCode(pathCode || params.get("code"));

    if (!code) {
      navigate("/", { replace: true });
      return;
    }

    const tokenKey = `professional_leverage_invite_token_${code}`;
    const token = localStorage.getItem(tokenKey) || createInviteToken();

    localStorage.setItem(tokenKey, token);
    localStorage.setItem("professional_leverage_referrer_code", code);
    localStorage.setItem("professional_leverage_invited_token", token);

    navigate(`/assessment?ref=${encodeURIComponent(code)}&invite=${encodeURIComponent(token)}`, { replace: true });
  }, [navigate, pathCode]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0E1319] px-6 text-white">
      <div className="text-center">
        <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-2 border-[#D9A44A] border-t-transparent" />
        <p className="text-sm uppercase tracking-widest text-[#D9A44A]">Opening your diagnostic</p>
      </div>
    </main>
  );
}
