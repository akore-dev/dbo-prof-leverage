import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, LogOut, Mail, Users } from "lucide-react";
import Header from "./Header";

export default function Admin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/dashboard", { credentials: "same-origin" });
      if (response.status === 401) return setDashboard(null);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load the dashboard.");
      setDashboard(data);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  async function logIn(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed.");
      setCredentials({ username: "", password: "" });
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function logOut() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" });
    setDashboard(null);
  }

  if (loading && !dashboard) return <Shell><p className="text-center text-gray-300">Loading admin portal…</p></Shell>;

  if (!dashboard) return (
    <Shell>
      <div className="mx-auto w-full max-w-md border border-white/10 bg-[#141B23] p-6 shadow-2xl sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D9A44A]">Restricted access</p>
        <h1 className="mt-3 font-serif text-3xl text-white">Admin sign in</h1>
        <p className="mt-2 text-sm text-gray-400">Enter your administrator credentials to view participant activity.</p>
        <form className="mt-8 space-y-5" onSubmit={logIn}>
          <Field label="Username" type="text" autoComplete="username" value={credentials.username}
            onChange={(event) => setCredentials({ ...credentials, username: event.target.value })} />
          <Field label="Password" type="password" autoComplete="current-password" value={credentials.password}
            onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} />
          {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
          <button disabled={submitting} className="w-full bg-[#D9A44A] px-5 py-3 text-sm font-bold text-[#0E1319] transition hover:bg-[#E8B65C] disabled:opacity-60">
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </Shell>
  );

  const cards = [
    ["Total invites", dashboard.totals.invites, Mail],
    ["Total accepted", dashboard.totals.accepted, CheckCircle2],
    ["Total participants", dashboard.totals.participants, Users],
  ];

  return (
    <Shell>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs uppercase tracking-[0.25em] text-[#D9A44A]">Admin overview</p><h1 className="mt-2 font-serif text-3xl text-white sm:text-4xl">Participant activity</h1></div>
        <button onClick={logOut} className="flex items-center gap-2 self-start border border-white/15 px-4 py-2 text-sm text-gray-300 hover:text-white"><LogOut size={16} /> Sign out</button>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cards.map(([label, value, Icon]) => <section key={label} className="border border-white/10 bg-[#141B23] p-6">
          <div className="flex items-center justify-between"><p className="text-sm text-gray-400">{label}</p><Icon size={20} className="text-[#D9A44A]" /></div>
          <p className="mt-5 font-serif text-4xl text-white">{value.toLocaleString()}</p>
        </section>)}
      </div>
      <section className="mt-8 overflow-hidden border border-white/10 bg-[#141B23]">
        <div className="border-b border-white/10 px-5 py-4"><h2 className="font-serif text-xl text-white">Members</h2></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-gray-400"><tr>
            <th className="px-5 py-4">Email address</th><th className="px-5 py-4">Referral code</th><th className="px-5 py-4 text-right">Invitees</th><th className="px-5 py-4 text-right">Accepted invitees</th>
          </tr></thead>
          <tbody className="divide-y divide-white/10">
            {dashboard.members.map((member) => <tr key={member.email} className="text-gray-200 hover:bg-white/[0.02]">
              <td className="px-5 py-4">{member.email}</td><td className="px-5 py-4 font-mono text-[#D9A44A]">{member.referralCode}</td>
              <td className="px-5 py-4 text-right">{member.invitees}</td><td className="px-5 py-4 text-right">{member.acceptedInvitees}</td>
            </tr>)}
            {!dashboard.members.length && <tr><td colSpan="4" className="px-5 py-12 text-center text-gray-400">No participants yet.</td></tr>}
          </tbody>
        </table></div>
      </section>
      {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
    </Shell>
  );
}

function Shell({ children }) {
  return <div className="diagnostic-page min-h-screen bg-[#0E1319] text-white"><Header /><main className="mx-auto w-full max-w-[1400px] px-5 py-10 sm:px-8">{children}</main></div>;
}

function Field({ label, ...props }) {
  return <label className="block"><span className="mb-2 block text-sm text-gray-300">{label}</span>
    <input required {...props} className="w-full border border-white/15 bg-[#0E1319] px-4 py-3 text-white outline-none focus:border-[#D9A44A]" />
  </label>;
}
