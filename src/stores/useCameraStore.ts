import { create } from 'zustand';
import { CameraState } from '../types';

interface CameraStore {
  cameraState: CameraState;
  updateCamera: (newState: Partial<CameraState>) => void;
  resetCamera: () => void;
}

const DEFAULT_CAMERA: CameraState = {
  position: [0, 2, 5],
  rotation: [0, 0, 0],
  fov: 50
};

export const useCameraStore = create<CameraStore>((set) => ({
  cameraState: DEFAULT_CAMERA,
  updateCamera: (newState: Partial<CameraState>) =>
    set((state) => ({
      cameraState: { ...state.cameraState, ...newState }
    })),
  resetCamera: () =>
    set(() => ({
      cameraState: DEFAULT_CAMERA
    }))
}));
