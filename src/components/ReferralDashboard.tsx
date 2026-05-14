import { useState, useEffect } from "react";
import {
  createReferral,
  getReferralStats,
  getReferralLink,
  getMyReferrals,
  type ReferralData,
} from "@/lib/referral";
import { Copy, Users, TrendingUp, DollarSign, Share2 } from "lucide-react";

export function ReferralDashboard({ walletAddress }: { walletAddress: string }) {
  const [refs, setRefs] = useState<ReferralData[]>([]);
  const [stats, setStats] = useState({
    totalClicks: 0,
    totalSignups: 0,
    totalMinedHours: 0,
    totalPayout: 0,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    load();
  }, [walletAddress]);

  async function load() {
    const r = await getMyReferrals(walletAddress);
    setRefs(r);
    const s = await getReferralStats(walletAddress);
    setStats(s);
  }

  async function handleCreate() {
    await createReferral(walletAddress);
    await load();
  }

  const primaryCode = refs[0]?.code || null;
  const link = primaryCode ? getReferralLink(primaryCode) : "";

  return (
    <div className="space-y-6 p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-emerald-400">Referral System</h2>
      
      {!primaryCode ? (
        <button
          onClick={handleCreate}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-lg transition"
        >
          Generate Referral Code
        </button>
      ) : (
        <div className="bg-zinc-900 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-sm">Your referral link</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(link);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1"
            >
              <Copy size={14} /> {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="bg-black rounded px-3 py-2 text-sm font-mono text-emerald-300 truncate">
            {link}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <StatBox icon={<Users size={16} />} label="Signups" value={stats.totalSignups} />
            <StatBox icon={<TrendingUp size={16} />} label="Clicks" value={stats.totalClicks} />
            <StatBox icon={<Share2 size={16} />} label="Mined Hours" value={stats.totalMinedHours} />
            <StatBox icon={<DollarSign size={16} />} label="Payout (XMR)" value={stats.totalPayout.toFixed(4)} />
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-zinc-800 rounded p-3 text-center">
      <div className="text-zinc-400 mb-1">{icon}</div>
      <div className="text-white font-bold text-lg">{value}</div>
      <div className="text-zinc-500 text-xs">{label}</div>
    </div>
  );
}
