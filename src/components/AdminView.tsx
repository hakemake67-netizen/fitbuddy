import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Users, 
  Layers, 
  MessageSquare, 
  Lock, 
  Unlock, 
  LogOut, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Calendar,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

type AdminTab = 'dashboard' | 'users' | 'plans' | 'feedback';

export default function AdminView() {
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('fitbuddy_admin_token') || null;
    } catch (e) {
      return null;
    }
  });

  const [passkeyInput, setPasskeyInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Admin Navigation
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('dashboard');

  // Admin Data
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [plansList, setPlansList] = useState<any[]>([]);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedPlanDetail, setSelectedPlanDetail] = useState<any | null>(null);

  // Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkeyInput.trim()) return;
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: passkeyInput.trim() })
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setAdminToken(data.token);
        try {
          sessionStorage.setItem('fitbuddy_admin_token', data.token);
        } catch (e) {}
      } else {
        setLoginError(data.error || 'Invalid administrator passkey');
      }
    } catch (err: any) {
      setLoginError('Authorization server error. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setAdminToken(null);
    try {
      sessionStorage.removeItem('fitbuddy_admin_token');
    } catch (e) {}
  };

  // Fetch Admin Data with Authorization Header
  const fetchAllAdminData = async () => {
    if (!adminToken) return;
    setIsLoading(true);

    const headers = {
      'x-admin-key': adminToken
    };

    try {
      const [dashRes, usersRes, plansRes, fbRes] = await Promise.all([
        fetch('/api/admin/dashboard', { headers }).then((r) => r.ok ? r.json() : null),
        fetch('/api/admin/users', { headers }).then((r) => r.ok ? r.json() : null),
        fetch('/api/admin/plans', { headers }).then((r) => r.ok ? r.json() : null),
        fetch('/api/admin/feedback', { headers }).then((r) => r.ok ? r.json() : null),
      ]);

      if (dashRes) setDashboardStats(dashRes);
      if (usersRes) setUsersList(usersRes.users || []);
      if (plansRes) {
        setPlansList(plansRes.plans || []);
        if (plansRes.plans?.length > 0 && !selectedPlanDetail) {
          setSelectedPlanDetail(plansRes.plans[0]);
        }
      }
      if (fbRes) setFeedbackList(fbRes.feedback || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchAllAdminData();
    }
  }, [adminToken]);

  // =========================================================================
  // 18. ADMIN SECURITY: LOGIN GATE IF NOT AUTHORIZED
  // =========================================================================
  if (!adminToken) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-[#0c1017] border border-white/[0.1] shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">
            Admin Access Required
          </h1>
          <p className="text-xs text-slate-400">
            Administrative endpoints require authorization credentials.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 font-bold block">
              Passkey
            </label>
            <input
              type="password"
              value={passkeyInput}
              onChange={(e) => setPasskeyInput(e.target.value)}
              placeholder="Enter administrator passkey..."
              className="w-full rounded-xl bg-white/[0.04] border border-white/[0.1] px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition"
              required
            />
            <span className="text-[11px] font-mono text-slate-500 block">
              Default passkey: <code className="text-emerald-400">fitbuddy-admin-2026</code>
            </span>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{loginError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow"
          >
            <span>{isLoggingIn ? 'Verifying...' : 'UNLOCK ADMIN PORTAL'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  // =========================================================================
  // 17. ADMIN AREA: AUTHORIZED INTERFACE (Dashboard, Users, Plans, Feedback)
  // =========================================================================
  return (
    <div className="max-w-5xl mx-auto space-y-6 py-2">
      {/* Admin Top Bar */}
      <div className="rounded-2xl p-6 border border-white/[0.08] bg-[#0c1017] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Unlock className="w-3.5 h-3.5" />
            <span className="font-bold uppercase tracking-wider">FITBUDDY ADMIN AREA</span>
            <span>·</span>
            <span className="text-slate-400">Authorized Session</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Platform Operations & Records</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Inspect verified athlete profiles, original generated periodization plans, and feedback-based adaptations.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={fetchAllAdminData}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.08] text-xs font-semibold transition flex items-center gap-2 cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs: Dashboard · Users · Plans · Feedback */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveAdminTab('dashboard')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeAdminTab === 'dashboard'
              ? 'bg-emerald-500 text-slate-950 shadow'
              : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeAdminTab === 'users'
              ? 'bg-emerald-500 text-slate-950 shadow'
              : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Users ({usersList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminTab('plans')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeAdminTab === 'plans'
              ? 'bg-emerald-500 text-slate-950 shadow'
              : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Plans ({plansList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveAdminTab('feedback')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeAdminTab === 'feedback'
              ? 'bg-emerald-500 text-slate-950 shadow'
              : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Feedback ({feedbackList.length})</span>
        </button>
      </div>

      {/* ======================================================================= */}
      {/* TAB 1: DASHBOARD                                                        */}
      {/* ======================================================================= */}
      {activeAdminTab === 'dashboard' && dashboardStats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/[0.08] space-y-1">
              <span className="text-xs font-mono uppercase text-slate-400">Total Athletes</span>
              <div className="text-3xl font-extrabold text-white mt-1">
                {dashboardStats.totalUsers}
              </div>
              <span className="text-[11px] text-slate-500 block">Registered profiles</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/[0.08] space-y-1">
              <span className="text-xs font-mono uppercase text-slate-400">Generated Plans</span>
              <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                {dashboardStats.totalPlans}
              </div>
              <span className="text-[11px] text-slate-500 block">{dashboardStats.updatedPlansCount} adapted with feedback</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/[0.08] space-y-1">
              <span className="text-xs font-mono uppercase text-slate-400">Completions Logged</span>
              <div className="text-3xl font-extrabold text-white mt-1">
                {dashboardStats.totalCompletions}
              </div>
              <span className="text-[11px] text-slate-500 block">Exercise sets logged</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/[0.08] space-y-1">
              <span className="text-xs font-mono uppercase text-slate-400">Feedback Submissions</span>
              <div className="text-3xl font-extrabold text-sky-400 mt-1">
                {dashboardStats.feedbackCount}
              </div>
              <span className="text-[11px] text-slate-500 block">Plan revision queries</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 2: USERS                                                            */}
      {/* ======================================================================= */}
      {activeAdminTab === 'users' && (
        <div className="rounded-2xl p-6 border border-white/[0.08] bg-[#0c1017] space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            User Accounts Registry
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 font-mono">
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">User ID</th>
                  <th className="py-3 px-3">Goal</th>
                  <th className="py-3 px-3">Experience</th>
                  <th className="py-3 px-3">Weight / Age</th>
                  <th className="py-3 px-3">Plan Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {usersList.map((u) => (
                  <tr key={u.userId} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-3 font-bold text-white">{u.name}</td>
                    <td className="py-3.5 px-3 font-mono text-slate-400">{u.userId}</td>
                    <td className="py-3.5 px-3 font-medium text-emerald-400">{u.goal}</td>
                    <td className="py-3.5 px-3 capitalize text-slate-300">{u.experience}</td>
                    <td className="py-3.5 px-3 text-slate-400">{u.weight} · {u.age} yrs</td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        u.planStatus === 'Updated'
                          ? 'bg-sky-500/20 text-sky-300'
                          : u.planStatus === 'Original'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-white/[0.05] text-slate-400'
                      }`}>
                        {u.planStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 3: PLANS (Original plan, Updated plan, Created date)                 */}
      {/* ======================================================================= */}
      {activeAdminTab === 'plans' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Plan List */}
          <div className="lg:col-span-5 rounded-2xl p-5 border border-white/[0.08] bg-[#0c1017] space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-white/[0.06]">
              All Generated Plans ({plansList.length})
            </h2>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {plansList.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlanDetail(p)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer space-y-1 text-xs ${
                    selectedPlanDetail?.id === p.id
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.14]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{p.userName}</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">{p.goal}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Plan ID: {p.id.slice(0, 10)}</span>
                    <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] text-slate-300">
                      Original: {p.originalPlan?.length || 0} days
                    </span>
                    {p.updatedPlan && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 font-bold">
                        Updated Plan
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plan Inspector */}
          <div className="lg:col-span-7 rounded-2xl p-5 border border-white/[0.08] bg-[#0c1017] space-y-4">
            {selectedPlanDetail ? (
              <div className="space-y-4 text-xs">
                <div className="border-b border-white/[0.06] pb-3 space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Plan Inspector</span>
                  <h3 className="text-base font-bold text-white">
                    {selectedPlanDetail.userName} · {selectedPlanDetail.goal}
                  </h3>
                  <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                    <span>Created: {new Date(selectedPlanDetail.createdAt).toLocaleDateString()}</span>
                    <span>·</span>
                    <span>Gear: {selectedPlanDetail.equipment}</span>
                    <span>·</span>
                    <span>Status: {selectedPlanDetail.status}</span>
                  </div>
                </div>

                {/* Original Plan Days */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono font-bold text-slate-300 uppercase block">
                    Original 7-Day Plan Days
                  </span>
                  <div className="space-y-1.5 max-h-52 overflow-y-auto">
                    {selectedPlanDetail.originalPlan?.map((d: any, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <strong className="text-white">Day {d.dayNumber}: {d.title}</strong>
                        <span className="text-slate-400 block text-[11px]">Focus: {d.focus}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Updated Plan Days if exists */}
                {selectedPlanDetail.updatedPlan && (
                  <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                    <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase block">
                      Updated Plan Days (With Applied Feedback)
                    </span>
                    <div className="space-y-1.5 max-h-52 overflow-y-auto">
                      {selectedPlanDetail.updatedPlan.map((d: any, idx: number) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-emerald-950/15 border border-emerald-500/20">
                          <strong className="text-emerald-300">Day {d.dayNumber}: {d.title}</strong>
                          <span className="text-slate-400 block text-[11px]">Focus: {d.focus}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Select a plan to inspect routines.</p>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 4: FEEDBACK                                                         */}
      {/* ======================================================================= */}
      {activeAdminTab === 'feedback' && (
        <div className="rounded-2xl p-6 border border-white/[0.08] bg-[#0c1017] space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            User Feedback & Modifications Log
          </h2>

          {feedbackList.length > 0 ? (
            <div className="space-y-3 text-xs">
              {feedbackList.map((fb, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="text-emerald-400 font-bold">{fb.userName}</span>
                    <span>{new Date(fb.appliedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-white font-medium italic">
                    "{fb.userFeedback}"
                  </p>
                  <div className="pt-1 border-t border-white/[0.04] text-[11px] text-slate-400">
                    <strong className="text-slate-300">Updated Plan: </strong>
                    <span>{fb.updatedPlanSummary}</span>
                    <span className="text-slate-500 block font-mono text-[10px] mt-0.5">Plan ID: {fb.relatedPlanId}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No feedback submissions logged yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
