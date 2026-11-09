import { loadSettings, saveSettings, DEFAULT_SETTINGS } from './settings.js';

const dialog = document.querySelector('#settingsDialog');
const volume = document.querySelector('#volume');
const volumeOutput = document.querySelector('#volumeOutput');
const quality = document.querySelector('#quality');
const toast = document.querySelector('#toast');
const cardKicker = document.querySelector('#card-kicker');
const cardIndex = document.querySelector('#card-index');
const cardContent = document.querySelector('#card-content');
let toastTimeout;

const panels = {
  play: {
    kicker: 'VOTRE PROCHAINE PARTIE', index: '01 / 04',
    content: '<p class="card-map">CARTE DISPONIBLE</p><h2>Le couloir<br>des oubliés</h2><p class="card-copy">Une aile condamnée. Trois dossiers manquants. Une présence qui se rapproche.</p><div class="card-footer"><span><i class="tiny-dot"></i> PROTOTYPE SOLO</span><span>01 CARTE</span></div>'
  },
  shop: {
    kicker: 'PERSONNALISATION', index: '02 / 04',
    content: '<p class="card-map">BOUTIQUE</p><h2>Préparez<br>votre prochaine nuit.</h2><p class="card-copy">Les objets cosmétiques et le système de monnaie seront construits dans une prochaine étape. Aucun achat n’est actif dans ce prototype.</p><div class="card-footer"><span>ÉCONOMIE À VENIR</span><span>EN PRÉPARATION</span></div>'
  },
  progress: {
    kicker: 'DOSSIER DU JOUEUR', index: '03 / 04',
    content: '<p class="card-map">PROGRESSION</p><h2>Chaque nuit<br>laisse une trace.</h2><p class="card-copy">Les niveaux, quêtes, succès et sauvegardes seront ajoutés progressivement. Cette version ne crée pas encore de profil joueur.</p><div class="card-footer"><span>PROGRESSION À VENIR</span><span>EN PRÉPARATION</span></div>'
  }
};

function announce(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

function showPanel(name) {
  const panel = panels[name];
  if (!panel) return;
  cardKicker.textContent = panel.kicker;
  cardIndex.textContent = panel.index;
  cardContent.innerHTML = panel.content;
  document.querySelectorAll('.menu-item[data-panel]').forEach((item) => {
    const active = item.dataset.panel === name;
    item.classList.toggle('selected', active);
    if (active) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
  if (name !== 'play') announce(name === 'shop' ? 'La boutique sera ajoutée dans une prochaine étape.' : 'La progression sera ajoutée dans une prochaine étape.');
}

function applySettings(settings) {
  volume.value = String(settings.masterVolume);
  volumeOutput.value = `${settings.masterVolume} %`;
  volumeOutput.textContent = `${settings.masterVolume} %`;
  quality.value = settings.quality;
  document.body.classList.remove('quality-low', 'quality-medium', 'quality-high');
  document.body.classList.add(`quality-${settings.quality}`);
}

const initialSettings = loadSettings();
applySettings(initialSettings);

document.querySelectorAll('.menu-item[data-panel]').forEach((item) => {
  item.addEventListener('click', () => showPanel(item.dataset.panel));
});

document.querySelector('#settingsOpen').addEventListener('click', () => dialog.showModal());
document.querySelector('#settingsMenu').addEventListener('click', () => dialog.showModal());
document.querySelector('#settingsClose').addEventListener('click', () => dialog.close());

dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

volume.addEventListener('input', () => {
  volumeOutput.value = `${volume.value} %`;
  volumeOutput.textContent = `${volume.value} %`;
});

quality.addEventListener('change', () => {
  document.body.classList.remove('quality-low', 'quality-medium', 'quality-high');
  document.body.classList.add(`quality-${quality.value}`);
});

document.querySelector('#settingsSave').addEventListener('click', () => {
  const settings = {
    masterVolume: Number(volume.value),
    quality: quality.value
  };
  saveSettings(settings);
  applySettings(settings);
  announce('Paramètres enregistrés sur cet appareil.');
  document.querySelector('#settingsMessage').textContent = 'Paramètres enregistrés. Ils restent disponibles sur cet appareil.';
});

// Keep the settings object schema forward-compatible if new options are added.
void DEFAULT_SETTINGS;
