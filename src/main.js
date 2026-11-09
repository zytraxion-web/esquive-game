import { loadSettings, saveSettings } from './settings.js';
import { buyCosmetic, COSMETICS, getProfile, getQuests, xpForNextLevel, selectCosmetic, claimQuest } from './profile.js';

const dialog = document.querySelector('#settingsDialog');
const volume = document.querySelector('#volume');
const volumeOutput = document.querySelector('#volumeOutput');
const quality = document.querySelector('#quality');
const toast = document.querySelector('#toast');
const cardKicker = document.querySelector('#card-kicker');
const cardIndex = document.querySelector('#card-index');
const cardContent = document.querySelector('#card-content');
let toastTimeout;
let activePanel = 'play';

function announce(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

function renderPlay() {
  const profile = getProfile();
  return `<p class="card-map">CARTE DISPONIBLE</p><h2>Le couloir<br>des oubliés</h2><p class="card-copy">Une aile condamnée. Trois dossiers manquants. Une présence qui se rapproche.</p><div class="card-footer"><span><i class="tiny-dot"></i> PROTOTYPE SOLO</span><span>${profile.coins} PIÈCES</span></div>`;
}

function renderShop() {
  const profile = getProfile();
  const cards = COSMETICS.map(item => {
    const owned = profile.inventory.includes(item.id);
    const selected = profile.selectedCosmetic === item.id;
    const label = selected ? 'ÉQUIPÉ' : owned ? 'ÉQUIPER' : `${item.price} PIÈCES`;
    return `<article class="shop-item"><span class="swatch" style="--swatch:${item.color}"></span><span class="shop-copy"><strong>${item.name}</strong><small>${item.description}</small></span><button class="shop-action" data-cosmetic="${item.id}" ${!owned && profile.coins < item.price ? 'disabled' : ''}>${label}</button></article>`;
  }).join('');
  return `<p class="card-map">APPARENCE DU MENU · ${profile.coins} PIÈCES</p><h2>Équipement</h2><p class="card-copy">Débloquez et équipez des couleurs de lampe. Les apparences du personnage seront ajoutées quand l’inventaire sera relié au jeu.</p><div class="shop-list">${cards}</div>`;
}

function renderProgress() {
  const profile = getProfile();
  const needed = xpForNextLevel(profile.level);
  const percent = Math.min(100, Math.round(profile.xp / needed * 100));
  const quests = getQuests().map(quest => {
    const ready = quest.progress >= quest.target;
    const action = quest.claimed ? '<span class="quest-claimed">RÉCLAMÉE</span>' : ready ? `<button class="quest-claim" data-quest="${quest.id}">RÉCLAMER · ${quest.rewardCoins} ◈</button>` : `<span class="quest-progress">${quest.progress} / ${quest.target}</span>`;
    return `<div class="quest-row"><span class="quest-copy"><strong>${quest.title}</strong><small>${quest.description}</small></span>${action}</div>`;
  }).join('');
  const achievements = [
    ['first_escape', 'Première sortie'], ['file_collector', 'Archiviste · 10 dossiers'], ['ten_runs', 'Habitué · 10 parties'], ['all_files', 'Dossier complet']
  ].map(([id, title]) => `<span class="achievement ${profile.achievements[id] ? 'unlocked' : ''}" title="${title}">${profile.achievements[id] ? '✓' : '·'} ${title}</span>`).join('');
  return `<p class="card-map">DOSSIER DU JOUEUR</p><div class="profile-level"><strong>NIVEAU ${profile.level}</strong><span>${profile.xp} / ${needed} XP</span></div><div class="xp-track"><i style="width:${percent}%"></i></div><p class="profile-stats"><span><b>${profile.coins}</b> PIÈCES</span><span><b>${profile.runs}</b> PARTIES</span><span><b>${profile.escapes}</b> SORTIES</span></p><h3 class="section-title">QUÊTES DU JOUR</h3><div class="quest-list">${quests}</div><h3 class="section-title">SUCCÈS</h3><div class="achievement-list">${achievements}</div><p class="card-copy profile-note">La progression est sauvegardée automatiquement sur cet appareil. Les parties seront reliées aux récompenses dans l’étape d’intégration du jeu.</p>`;
}

function renderPanel(name) {
  activePanel = name;
  const profile = getProfile();
  cardKicker.textContent = name === 'shop' ? 'PERSONNALISATION' : name === 'progress' ? 'DOSSIER DU JOUEUR' : 'VOTRE PROCHAINE PARTIE';
  cardIndex.textContent = name === 'shop' ? '02 / 04' : name === 'progress' ? '03 / 04' : '01 / 04';
  cardContent.innerHTML = name === 'shop' ? renderShop() : name === 'progress' ? renderProgress() : renderPlay();
  document.querySelectorAll('.menu-item[data-panel]').forEach(item => {
    const active = item.dataset.panel === name;
    item.classList.toggle('selected', active);
    if (active) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
  document.documentElement.style.setProperty('--accent', COSMETICS.find(item => item.id === profile.selectedCosmetic)?.color || '#a63832');
}

function applySettings(settings) {
  volume.value = String(settings.masterVolume);
  volumeOutput.value = `${settings.masterVolume} %`;
  volumeOutput.textContent = `${settings.masterVolume} %`;
  quality.value = settings.quality;
  document.body.classList.remove('quality-low', 'quality-medium', 'quality-high');
  document.body.classList.add(`quality-${settings.quality}`);
}

applySettings(loadSettings());
renderPanel('play');

document.querySelectorAll('.menu-item[data-panel]').forEach(item => item.addEventListener('click', () => renderPanel(item.dataset.panel)));
document.querySelector('#settingsOpen').addEventListener('click', () => dialog.showModal());
document.querySelector('#settingsMenu').addEventListener('click', () => dialog.showModal());
document.querySelector('#settingsClose').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

volume.addEventListener('input', () => {
  volumeOutput.value = `${volume.value} %`;
  volumeOutput.textContent = `${volume.value} %`;
});
quality.addEventListener('change', () => {
  document.body.classList.remove('quality-low', 'quality-medium', 'quality-high');
  document.body.classList.add(`quality-${quality.value}`);
});
document.querySelector('#settingsSave').addEventListener('click', () => {
  const settings = { masterVolume: Number(volume.value), quality: quality.value };
  const saved = saveSettings(settings);
  applySettings(settings);
  document.querySelector('#settingsMessage').textContent = saved ? 'Paramètres enregistrés. Ils restent disponibles sur cet appareil.' : 'Impossible d’enregistrer : vérifiez les permissions de stockage du navigateur.';
  announce(saved ? 'Paramètres enregistrés sur cet appareil.' : 'Échec de sauvegarde des paramètres.');
});

cardContent.addEventListener('click', event => {
  const cosmeticButton = event.target.closest('[data-cosmetic]');
  if (cosmeticButton) {
    const result = buyCosmetic(cosmeticButton.dataset.cosmetic);
    if (!result.ok) announce(result.reason);
    else {
      renderPanel('shop');
      announce(result.owned ? `${result.item.name} équipée.` : `${result.item.name} débloquée et équipée.`);
    }
    return;
  }
  const questButton = event.target.closest('[data-quest]');
  if (questButton) {
    if (claimQuest(questButton.dataset.quest)) {
      renderPanel('progress');
      announce('Récompense de quête ajoutée à votre profil.');
    } else announce('Cette quête n’est pas encore terminée.');
  }
});

window.addEventListener('dernier-service:profile-updated', () => renderPanel(activePanel));
