import { create } from 'zustand';
import { RenderSettings, LightingPreset, ArtStyle } from '../types';

interface SettingsState {
  settings: RenderSettings;
  updateSettings: (newSettings: Partial<RenderSettings>) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: RenderSettings = {
  prompt: "",
  lighting: LightingPreset.Studio,
  style: ArtStyle.Cinematic,
  aspectRatio: "16:9",
  mode: 'image'
};

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: DEFAULT_SETTINGS,
  updateSettings: (newSettings: Partial<RenderSettings>) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    })),
  resetSettings: () =>
    set(() => ({
      settings: DEFAULT_SETTINGS
    }))
}));
