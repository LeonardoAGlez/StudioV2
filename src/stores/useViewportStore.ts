import { create } from 'zustand';
import { TransformMode } from '../types';

interface ViewportState {
  showSubject: boolean;
  showGrid: boolean;
  transformMode: TransformMode;
  setShowSubject: (show: boolean) => void;
  setShowGrid: (show: boolean) => void;
  setTransformMode: (mode: TransformMode) => void;
  resetViewport: () => void;
}

export const useViewportStore = create<ViewportState>((set) => ({
  showSubject: true,
  showGrid: true,
  transformMode: null,
  setShowSubject: (show: boolean) =>
    set(() => ({
      showSubject: show
    })),
  setShowGrid: (show: boolean) =>
    set(() => ({
      showGrid: show
    })),
  setTransformMode: (mode: TransformMode) =>
    set(() => ({
      transformMode: mode
    })),
  resetViewport: () =>
    set(() => ({
      showSubject: true,
      showGrid: true,
      transformMode: null
    }))
}));
