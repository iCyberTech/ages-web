// Shared by p.html and pay.html. The publishable key is public by design (same as the app's Config.swift);
// the pages only call public_product (read-only) and the friend-pay function (which checks the secret pay code).
const AGES = {
  supabase: "https://ljinrrgnqghbidxvfxlk.supabase.co",
  key: "sb_publishable_HimEmp-WKPZ7FAqR8RUnSg_Yxtv9V1F",
  appStore: "https://apps.apple.com/app/ages-shopping/id6829285377",
  playStore: "https://play.google.com/store/apps/details?id=com.ages.shop",
};

async function agesRPC(name, args) {
  const r = await fetch(`${AGES.supabase}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { apikey: AGES.key, Authorization: `Bearer ${AGES.key}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  if (!r.ok) throw new Error("rpc " + r.status);
  return r.json();
}

async function agesFriendPay(body) {
  const r = await fetch(`${AGES.supabase}/functions/v1/friend-pay`, {
    method: "POST",
    headers: { apikey: AGES.key, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(data.message || "Something went wrong. Please try again."); e.code = data.error; throw e; }
  return data;
}

function agesPhoto(v) {
  if (!v) return null;
  return v.startsWith("http") ? v : `${AGES.supabase}/storage/v1/object/public/products/${v.replace(/^\/+/, "")}`;
}

function agesMoney(amount, currency, symbol) {
  const n = Number(amount || 0);
  const digits = Number.isInteger(n) ? 0 : 2;
  const s = n.toLocaleString("en", { minimumFractionDigits: digits, maximumFractionDigits: 2 });
  return (symbol || (currency ? currency + " " : "")) + s;
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const STORE_BUTTONS = `
  <div class="stores">
    <a class="store" href="${AGES.appStore}" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.74-.78-2.87-.76-1.47.02-2.83.86-3.59 2.18-1.53 2.66-.39 6.6 1.1 8.76.73 1.06 1.6 2.24 2.73 2.2 1.1-.05 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.07 2.65-2.13.84-1.22 1.18-2.4 1.2-2.47-.03-.01-2.3-.88-2.3-3.52zM14.2 6.1c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.65-1.05 1.68-.92 2.67.97.08 1.96-.49 2.56-1.22z"/></svg>App Store</a>
    <a class="store" href="${AGES.playStore}" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.6 2.2c-.2.2-.3.6-.3 1v17.6c0 .4.1.8.3 1l.1.1 9.9-9.9v-.2L3.7 2.1l-.1.1zm13.3 13.1-3.3-3.3v-.2l3.3-3.3.1.1 3.9 2.2c1.1.6 1.1 1.7 0 2.3l-3.9 2.2-.1 0zm-.1.1L13.4 12l-9.8 9.8c.4.4 1 .4 1.6.1l11.6-6.5m0-6.8L5.2 2.1c-.7-.4-1.2-.3-1.6.1l9.8 9.8 3.4-3.4z"/></svg>Google Play</a>
  </div>`;
