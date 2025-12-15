import { create } from 'zustand';
import { GeneratedResult } from '../types';

interface ResultState {
  result: GeneratedResult;
  setImageResult: (imageUrl: string) => void;
  setVideoResult: (videoUrl: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearResult: () => void;
  appendStatusLog: (msg: string) => void;
  clearStatusLogs: () => void;
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
      result: { imageUrl, videoUrl: null, loading: false, error: null, statusLogs: [] }
    })),
  setVideoResult: (videoUrl: string) =>
    set(() => ({
      result: { imageUrl: null, videoUrl, loading: false, error: null, statusLogs: [] }
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
      result: { ...DEFAULT_RESULT, statusLogs: [] }
    }))
  ,
  appendStatusLog: (msg: string) =>
    set((state) => ({
      result: { ...state.result, statusLogs: [...(state.result.statusLogs || []), msg] }
    })),
  clearStatusLogs: () =>
    set((state) => ({
      result: { ...state.result, statusLogs: [] }
    })),
}));
