export const SETTINGS_KEY = 'dernier-service.settings.v1';

export const DEFAULT_SETTINGS = Object.freeze({
  masterVolume: 80,
  quality: 'high'
});

const VALID_QUALITIES = new Set(['low', 'medium', 'high']);

export function loadSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null');
    if (!stored || typeof stored !== 'object') return { ...DEFAULT_SETTINGS };

    const volume = Number(stored.masterVolume);
    const quality = VALID_QUALITIES.has(stored.quality) ? stored.quality : DEFAULT_SETTINGS.quality;
    return {
      masterVolume: Number.isFinite(volume) ? Math.min(100, Math.max(0, Math.round(volume))) : DEFAULT_SETTINGS.masterVolume,
      quality
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings) {
  const volume = Number(settings.masterVolume);
  const safeSettings = {
    masterVolume: Number.isFinite(volume) ? Math.min(100, Math.max(0, Math.round(volume))) : DEFAULT_SETTINGS.masterVolume,
    quality: VALID_QUALITIES.has(settings.quality) ? settings.quality : DEFAULT_SETTINGS.quality
  };

  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(safeSettings));
    return true;
  } catch {
    return false;
  }
}
