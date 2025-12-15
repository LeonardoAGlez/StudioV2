export interface CameraState {
  position: [number, number, number];
  rotation: [number, number, number];
  fov: number;
}

export enum LightingPreset {
  Studio = "Studio",
  GoldenHour = "Golden Hour",
  Midnight = "Midnight",
  Overcast = "Overcast",
  NeonCity = "Neon City"
}

export enum ArtStyle {
  Cinematic = "Cinematic Realism",
  Anime = "Anime",
  Cyberpunk = "Cyberpunk",
  Claymation = "Claymation",
  Sketch = "Technical Sketch"
}

export type TransformMode = 'translate' | 'rotate' | null;
export type OutputMode = 'image' | 'video';

export interface RenderSettings {
  prompt: string;
  // `lighting` can be a built-in LightingPreset string or a dynamic preset object
  lighting: LightingPreset | any;
  style: ArtStyle;
  aspectRatio: string;
  mode: OutputMode;
}

export interface GeneratedResult {
  imageUrl: string | null;
  videoUrl: string | null;
  loading: boolean;
  error: string | null;
}
