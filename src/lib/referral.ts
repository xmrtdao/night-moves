/**
 * Night Moves Referral System
 * Generates referral codes, tracks signups, calculates payouts.
 * Stores everything in IndexedDB for offline resilience.
 */

const REFERRAL_STORE = "referrals";
const DB_NAME = "nightmoves_v1";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(REFERRAL_STORE))
        db.createObjectStore(REFERRAL_STORE, { keyPath: "code" });
      if (!db.objectStoreNames.contains("referral_clicks"))
        db.createObjectStore("referral_clicks", { keyPath: "id", autoIncrement: true });
    };
  });
}

async function dbPut(store: string, item: any) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    const os = tx.objectStore(store);
    const req = os.put(item);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  });
}

async function dbGet(store: string, key: string): Promise<any | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readonly");
    const os = tx.objectStore(store);
    const req = os.get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  });
}

async function dbGetAll(store: string): Promise<any[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readonly");
    const os = tx.objectStore(store);
    const req = os.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  });
}

// ── Core API ─────────────────────────────────────────────────────────────────

export interface ReferralData {
  code: string;
  owner: string; // wallet or user id
  createdAt: number;
  clicks: number;
  signups: number;
  minedHours: number;
  payoutXMR: number;
  status: "active" | "paused";
}

function generateCode(input: string): string {
  // Simple deterministic hash for demo
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash + input.charCodeAt(i)) | 0;
  }
  const abs = Math.abs(hash).toString(36).toUpperCase().slice(0, 6);
  return `XMRT-${abs}`;
}

export async function createReferral(owner: string): Promise<ReferralData> {
  const code = generateCode(owner + Date.now());
  const data: ReferralData = {
    code,
    owner,
    createdAt: Date.now(),
    clicks: 0,
    signups: 0,
    minedHours: 0,
    payoutXMR: 0,
    status: "active",
  };
  await dbPut(REFERRAL_STORE, data);
  return data;
}

export async function getReferral(code: string): Promise<ReferralData | undefined> {
  return dbGet(REFERRAL_STORE, code);
}

export async function getMyReferrals(owner: string): Promise<ReferralData[]> {
  const all = await dbGetAll(REFERRAL_STORE);
  return all.filter((r: ReferralData) => r.owner === owner);
}

export async function trackClick(code: string): Promise<void> {
  const ref = await getReferral(code);
  if (ref) {
    ref.clicks += 1;
    await dbPut(REFERRAL_STORE, ref);
  }
  await dbPut("referral_clicks", {
    code,
    timestamp: Date.now(),
    type: "click",
  });
}

export async function trackSignup(code: string, newUserId: string): Promise<void> {
  const ref = await getReferral(code);
  if (ref) {
    ref.signups += 1;
    await dbPut(REFERRAL_STORE, ref);
  }
  await dbPut("referral_clicks", {
    code,
    newUserId,
    timestamp: Date.now(),
    type: "signup",
  });
}

export async function recordMining(code: string, hours: number): Promise<void> {
  const ref = await getReferral(code);
  if (ref) {
    ref.minedHours += hours;
    ref.payoutXMR += hours * 0.001; // demo: 0.001 XMR per hour
    await dbPut(REFERRAL_STORE, ref);
  }
}

export function getReferralLink(code: string): string {
  const base = window.location.origin;
  return `${base}/?ref=${code}`;
}

export async function getReferralStats(owner: string) {
  const refs = await getMyReferrals(owner);
  return {
    totalClicks: refs.reduce((s, r) => s + r.clicks, 0),
    totalSignups: refs.reduce((s, r) => s + r.signups, 0),
    totalMinedHours: refs.reduce((s, r) => s + r.minedHours, 0),
    totalPayout: refs.reduce((s, r) => s + r.payoutXMR, 0),
    codes: refs,
  };
}
