import { create } from 'zustand';
import { GeneratedResult } from '../types';

interface ResultState {
  result: GeneratedResult;
  setImageResult: (imageUrl: string) => void;
  setVideoResult: (videoUrl: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearResult: () => void;
}

const DEFAULT_RESULT: GeneratedResult = {
  imageUrl: null,
  videoUrl: null,
  loading: false,
  error: null
};

export const useResultStore = create<ResultState>((set) => ({
  result: DEFAULT_RESULT,
  setImageResult: (imageUrl: string) =>
    set(() => ({
      result: { imageUrl, videoUrl: null, loading: false, error: null }
    })),
  setVideoResult: (videoUrl: string) =>
    set(() => ({
      result: { imageUrl: null, videoUrl, loading: false, error: null }
    })),
  setLoading: (loading: boolean) =>
    set((state) => ({
      result: { ...state.result, loading }
    })),
  setError: (error: string | null) =>
    set((state) => ({
      result: { ...state.result, error, loading: false }
    })),
  clearResult: () =>
    set(() => ({
      result: DEFAULT_RESULT
    }))
}));
