import React from 'react';
import { Camera, Sun, Palette, Wand2, MonitorPlay, Ratio, User, Grid3X3, Move3d, Rotate3d, MousePointer2, Image as ImageIcon, Video } from 'lucide-react';
import { RenderSettings, LightingPreset, ArtStyle, TransformMode, OutputMode } from '../types';

interface ControlPanelProps {
  settings: RenderSettings;
  updateSettings: (newSettings: Partial<RenderSettings>) => void;
  fov: number;
  setFov: (fov: number) => void;
  onRender: () => void;
  isGenerating: boolean;
  showSubject: boolean;
  setShowSubject: (show: boolean) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  transformMode: TransformMode;
  setTransformMode: (mode: TransformMode) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  settings,
  updateSettings,
  fov,
  setFov,
  onRender,
  isGenerating,
  showSubject,
  setShowSubject,
  showGrid,
  setShowGrid,
  transformMode,
  setTransformMode
}) => {

  // Veo restricts aspect ratios
  const supportedRatios = settings.mode === 'video' 
    ? ["16:9", "9:16"] 
    : ["16:9", "4:3", "1:1", "9:16"];

  return (
    <div className="absolute top-0 left-0 h-full w-80 bg-zinc-900/95 border-r border-zinc-800 text-gray-200 p-4 flex flex-col backdrop-blur-sm shadow-xl z-20 overflow-y-auto">
      <div className="flex items-center gap-2 mb-6 border-b border-zinc-700 pb-4">
        <MonitorPlay className="w-6 h-6 text-orange-500" />
        <h1 className="text-xl font-bold tracking-tight text-white">AI Studio <span className="text-xs font-normal text-zinc-500">v1.0</span></h1>
      </div>

      <div className="space-y-6 flex-grow">
        
        {/* Mode Switcher */}
        <div className="bg-zinc-800 p-1 rounded-lg flex">
          <button 
            onClick={() => updateSettings({ mode: 'image' })}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
              settings.mode === 'image' ? 'bg-zinc-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Photo
          </button>
          <button 
             disabled
             className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all text-zinc-600 bg-zinc-800/30 cursor-not-allowed border border-transparent"
             title="Video generation is temporarily disabled"
          >
            <Video className="w-4 h-4" /> Video
          </button>
        </div>

        {/* Prompt Section */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase text-zinc-500">
            <Wand2 className="w-3 h-3" />
            {settings.mode === 'video' ? 'Video Action' : 'Scene Description'}
          </label>
          <textarea
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-3 text-sm focus:ring-1 focus:ring-orange-500 outline-none text-white resize-none"
            rows={4}
            placeholder={settings.mode === 'video' 
              ? "Describe the movement... e.g., The cyborg draws his sword slowly, sparks flying." 
              : "Describe your shot... e.g., A cyborg samurai standing in the rain."}
            value={settings.prompt}
            onChange={(e) => updateSettings({ prompt: e.target.value })}
          />
        </div>

        {/* Scene Setup Tools */}
        <div className="space-y-2 pt-2 border-t border-zinc-800">
           <label className="flex items-center gap-2 text-xs font-semibold uppercase text-zinc-500 mb-2">
             Stage Tools
           </label>
           <div className="flex gap-1 bg-zinc-800 p-1 rounded-md">
              <button
                 onClick={() => setTransformMode(null)}
                 className={`flex-1 flex flex-col items-center justify-center py-2 rounded text-[10px] transition-all ${
                   transformMode === null ? 'bg-zinc-600 text-white shadow' : 'text-zinc-400 hover:text-white hover:bg-zinc-700'
                 }`}
              >
                 <MousePointer2 className="w-4 h-4 mb-1" />
                 View
              </button>
              <button
                 onClick={() => setTransformMode('translate')}
                 disabled={!showSubject}
                 className={`flex-1 flex flex-col items-center justify-center py-2 rounded text-[10px] transition-all ${
                   transformMode === 'translate' ? 'bg-orange-600 text-white shadow' : 'text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-30'
                 }`}
              >
                 <Move3d className="w-4 h-4 mb-1" />
                 Move
              </button>
              <button
                 onClick={() => setTransformMode('rotate')}
                 disabled={!showSubject}
                 className={`flex-1 flex flex-col items-center justify-center py-2 rounded text-[10px] transition-all ${
                   transformMode === 'rotate' ? 'bg-orange-600 text-white shadow' : 'text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-30'
                 }`}
              >
                 <Rotate3d className="w-4 h-4 mb-1" />
                 Rotate
              </button>
           </div>
        </div>

        {/* Camera Settings */}
        <div className="space-y-4 pt-2 border-t border-zinc-800">
           <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase text-zinc-500">
                <Camera className="w-3 h-3" />
                Focal Length
              </label>
              <span className="text-xs text-orange-500 font-mono">{Math.round(50 * (50/fov))}mm</span>
           </div>
           
           <div className="flex items-center gap-3">
             <span className="text-xs text-zinc-500">Wide</span>
             <input
              type="range"
              min="15"
              max="90"
              value={fov}
              onChange={(e) => setFov(parseFloat(e.target.value))}
              className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <span className="text-xs text-zinc-500">Tele</span>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase text-zinc-500">
              <Ratio className="w-3 h-3" />
              Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-2">
              {supportedRatios.map(ratio => (
                <button
                  key={ratio}
                  onClick={() => updateSettings({ aspectRatio: ratio })}
                  className={`text-xs py-1 px-2 rounded border transition-colors ${
                    settings.aspectRatio === ratio 
                    ? (settings.mode === 'video' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-orange-600 border-orange-500 text-white')
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
            {settings.mode === 'video' && (
              <p className="text-[10px] text-zinc-500 italic">Video supports only 16:9 & 9:16.</p>
            )}
          </div>
        </div>

        {/* View Options */}
        <div className="space-y-2 pt-2 border-t border-zinc-800">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase text-zinc-500 mb-2">
            View Tools
          </label>
          <div className="flex gap-2">
             <button
                onClick={() => setShowSubject(!showSubject)}
                className={`flex-1 flex items-center justify-center gap-2 text-xs py-2 rounded border transition-colors ${
                  showSubject ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-800 border-zinc-800 text-zinc-500'
                }`}
             >
                <User className="w-3 h-3" />
                Subj
             </button>
             <button
                onClick={() => setShowGrid(!showGrid)}
                className={`flex-1 flex items-center justify-center gap-2 text-xs py-2 rounded border transition-colors ${
                  showGrid ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-800 border-zinc-800 text-zinc-500'
                }`}
             >
                <Grid3X3 className="w-3 h-3" />
                Grid
             </button>
          </div>
        </div>

        {/* Lighting & Style */}
        <div className="space-y-2 pt-2 border-t border-zinc-800">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase text-zinc-500">
            <Sun className="w-3 h-3" />
            Lighting Setup
          </label>
          <select
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-sm text-white outline-none focus:border-orange-500"
            value={settings.lighting}
            onChange={(e) => updateSettings({ lighting: e.target.value as LightingPreset })}
          >
            {Object.values(LightingPreset).map((preset) => (
              <option key={preset} value={preset}>{preset}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase text-zinc-500">
            <Palette className="w-3 h-3" />
            Art Direction
          </label>
          <select
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-sm text-white outline-none focus:border-orange-500"
            value={settings.style}
            onChange={(e) => updateSettings({ style: e.target.value as ArtStyle })}
          >
             {Object.values(ArtStyle).map((style) => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Render Action */}
      <div className="pt-4 border-t border-zinc-700 mt-4">
        <button
          onClick={onRender}
          disabled={isGenerating || !settings.prompt}
          className={`w-full py-3 px-4 rounded-md font-bold text-sm tracking-wide transition-all
            ${isGenerating 
              ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed' 
              : settings.mode === 'video'
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20'
                : 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-900/20'
            }`}
        >
          {isGenerating ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {settings.mode === 'video' ? 'PRODUCING VIDEO...' : 'RENDERING...'}
            </div>
          ) : (
            settings.mode === 'video' ? "ACTION! (GENERATE VIDEO)" : "GENERATE SHOT"
          )}
        </button>
      </div>
    </div>
  );
};
