// Local-only profile storage for the single-player web prototype.
export const PROFILE_KEY = 'dernier-service.profile.v1';
export const COSMETICS = Object.freeze([
  { id: 'standard', name: 'Lampe de service', price: 0, color: '#a63832', description: 'Le rouge d’urgence de Saint-Aurore.' },
  { id: 'amber', name: 'Lueur ambrée', price: 100, color: '#a87835', description: 'Une teinte chaude pour les longues nuits.' },
  { id: 'cold', name: 'Lueur clinique', price: 150, color: '#557f8b', description: 'Un bleu pâle, presque rassurant.' },
  { id: 'violet', name: 'Dernier signal', price: 200, color: '#795b88', description: 'Pour ceux qui n’ont plus peur du noir.' }
]);
const QUESTS = Object.freeze([
  { id: 'files', title: 'Archives interdites', description: 'Récupérer 3 dossiers en une partie', target: 3, rewardCoins: 35, rewardXp: 25 },
  { id: 'escape', title: 'Sortie de nuit', description: 'S’échapper vivant de l’hôpital', target: 1, rewardCoins: 50, rewardXp: 40 },
  { id: 'play', title: 'Prise de service', description: 'Terminer une partie', target: 1, rewardCoins: 20, rewardXp: 15 }
]);
const today = () => new Date().toISOString().slice(0, 10);
const emptyDaily = () => ({ date: today(), progress: {}, claimed: [] });
function createProfile() {
  return { version: 1, coins: 250, level: 1, xp: 0, runs: 0, escapes: 0, filesFound: 0, bestTimeSeconds: 0, inventory: ['standard'], selectedCosmetic: 'standard', achievements: {}, daily: emptyDaily(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
}
function nonNegativeInt(input, fallback = 0) { const number = Number(input); return Number.isFinite(number) ? Math.max(0, Math.floor(number)) : fallback; }
function normalizeProfile(value) {
  const base = createProfile();
  if (!value || typeof value !== 'object') return base;
  const inventory = Array.isArray(value.inventory) ? [...new Set(value.inventory.filter(id => COSMETICS.some(item => item.id === id)))] : ['standard'];
  if (!inventory.includes('standard')) inventory.unshift('standard');
  const achievements = {};
  for (const id of ['first_escape', 'file_collector', 'ten_runs', 'all_files']) if (value.achievements?.[id] === true) achievements[id] = true;
  let daily = value.daily && typeof value.daily === 'object' ? value.daily : emptyDaily();
  if (daily.date !== today()) daily = emptyDaily();
  return {
    ...base, coins: nonNegativeInt(value.coins), level: Math.max(1, nonNegativeInt(value.level, 1)), xp: nonNegativeInt(value.xp),
    runs: nonNegativeInt(value.runs), escapes: nonNegativeInt(value.escapes), filesFound: nonNegativeInt(value.filesFound), bestTimeSeconds: nonNegativeInt(value.bestTimeSeconds),
    inventory, selectedCosmetic: inventory.includes(value.selectedCosmetic) ? value.selectedCosmetic : 'standard', achievements,
    daily: { date: today(), progress: Object.fromEntries(QUESTS.map(q => [q.id, Math.min(q.target, nonNegativeInt(daily.progress?.[q.id]))])), claimed: Array.isArray(daily.claimed) ? daily.claimed.filter(id => QUESTS.some(q => q.id === id)) : [] },
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : base.createdAt, updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : base.updatedAt
  };
}
function readProfile() { try { return normalizeProfile(JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null')); } catch { return createProfile(); } }
let profile = readProfile();
function persist() {
  profile.updatedAt = new Date().toISOString();
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); window.dispatchEvent(new CustomEvent('dernier-service:profile-updated', { detail: getProfile() })); return true; }
  catch { return false; }
}
export function getProfile() {
  if (typeof structuredClone === 'function') return structuredClone(profile);
  return JSON.parse(JSON.stringify(profile));
}
export function getQuests() { return QUESTS.map(q => ({ ...q, progress: profile.daily.progress[q.id] || 0, claimed: profile.daily.claimed.includes(q.id) })); }
export function xpForNextLevel(level = profile.level) { return 100 + Math.max(0, level - 1) * 25; }
function addXp(amount) {
  profile.xp += amount; const levelsGained = [];
  while (profile.xp >= xpForNextLevel(profile.level)) { profile.xp -= xpForNextLevel(profile.level); profile.level += 1; levelsGained.push(profile.level); profile.coins += 25; }
  return levelsGained;
}
export function recordRun(result = {}) {
  const filesFound = Math.min(3, nonNegativeInt(result.filesFound)); const escaped = result.won === true; const durationSeconds = nonNegativeInt(result.durationSeconds);
  profile.runs += 1; profile.filesFound += filesFound; if (escaped) profile.escapes += 1; profile.bestTimeSeconds = Math.max(profile.bestTimeSeconds, durationSeconds);
  const coinsEarned = 10 + filesFound * 5 + (escaped ? 60 : 0); const xpEarned = 20 + filesFound * 10 + (escaped ? 75 : 0);
  profile.coins += coinsEarned;
  profile.daily.progress.play = 1; profile.daily.progress.files = Math.min(3, (profile.daily.progress.files || 0) + filesFound); if (escaped) profile.daily.progress.escape = 1;
  if (profile.escapes) profile.achievements.first_escape = true; if (profile.filesFound >= 10) profile.achievements.file_collector = true; if (profile.runs >= 10) profile.achievements.ten_runs = true; if (filesFound === 3) profile.achievements.all_files = true;
  const levelsGained = addXp(xpEarned); persist(); return { coinsEarned, xpEarned, levelsGained, escaped, filesFound };
}
export function claimQuest(id) {
  const q = QUESTS.find(item => item.id === id); if (!q || profile.daily.claimed.includes(id) || (profile.daily.progress[id] || 0) < q.target) return false;
  profile.daily.claimed.push(id); profile.coins += q.rewardCoins; addXp(q.rewardXp); persist(); return true;
}
export function buyCosmetic(id) {
  const item = COSMETICS.find(entry => entry.id === id); if (!item) return { ok: false, reason: 'Objet introuvable.' };
  if (profile.inventory.includes(id)) { profile.selectedCosmetic = id; persist(); return { ok: true, owned: true, item }; }
  if (profile.coins < item.price) return { ok: false, reason: 'Pas assez de pièces.' };
  profile.coins -= item.price; profile.inventory.push(id); profile.selectedCosmetic = id; persist(); return { ok: true, owned: false, item };
}
export function selectCosmetic(id) { if (!profile.inventory.includes(id)) return false; profile.selectedCosmetic = id; persist(); return true; }
export function resetProfile() { profile = createProfile(); persist(); }
window.addEventListener('pagehide', persist);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') persist(); });
