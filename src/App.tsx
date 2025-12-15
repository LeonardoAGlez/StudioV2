import React, { useRef, useCallback } from 'react';
import { StudioScene } from './components/StudioScene.tsx';
import { ControlPanel } from './components/ControlPanel.tsx';
import { generateSceneImage, generateSceneVideo } from './services/geminiService.ts';
import { X, Download, AlertCircle, Settings2 } from 'lucide-react';
import { useSettingsStore, useCameraStore, useResultStore, useViewportStore } from './stores/index.ts';

const App: React.FC = () => {
  // State from zustand stores
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  const cameraState = useCameraStore((state) => state.cameraState);
  const updateCamera = useCameraStore((state) => state.updateCamera);

  const result = useResultStore((state) => state.result);
  const setLoading = useResultStore((state) => state.setLoading);
  const setImageResult = useResultStore((state) => state.setImageResult);
  const setVideoResult = useResultStore((state) => state.setVideoResult);
  const setError = useResultStore((state) => state.setError);
  const clearResult = useResultStore((state) => state.clearResult);

  const showSubject = useViewportStore((state) => state.showSubject);
  const setShowSubject = useViewportStore((state) => state.setShowSubject);
  const showGrid = useViewportStore((state) => state.showGrid);
  const setShowGrid = useViewportStore((state) => state.setShowGrid);
  const transformMode = useViewportStore((state) => state.transformMode);
  const setTransformMode = useViewportStore((state) => state.setTransformMode);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Helper to safely check for AI Studio environment
  const isAIStudioEnv = () => {
    // @ts-ignore
    return typeof window !== 'undefined' && window.aistudio && window.aistudio.openSelectKey;
  };

  const handleCameraUpdate = useCallback((newCameraState: any) => {
    updateCamera(newCameraState);
  }, [updateCamera]);

  const handleRender = async () => {
    if (!settings.prompt) return;

    // Check for API Key if using Video (Veo) in an AI Studio environment
    if (settings.mode === 'video' && isAIStudioEnv()) {
       // @ts-ignore
       const hasKey = await window.aistudio.hasSelectedApiKey();
       if (!hasKey) {
          // @ts-ignore
          await window.aistudio.openSelectKey();
       }
    }

    setLoading(true);

    try {
      // 1. Capture the current 3D viewport as a base64 image
      let sceneCapture: string | null = null;
      if (canvasRef.current) {
        sceneCapture = canvasRef.current.toDataURL('image/png');
      }

      if (settings.mode === 'image') {
        // --- IMAGE GENERATION ---
        const yPos = cameraState.position[1];
        let angleDesc = "Eye-level shot";
        if (yPos > 3) angleDesc = "High-angle / Crane shot";
        else if (yPos < 1) angleDesc = "Low-angle / Worm's eye view";

        const dist = Math.sqrt(Math.pow(cameraState.position[0], 2) + Math.pow(cameraState.position[2], 2));
        let distDesc = "Medium shot";
        if (dist < 2) distDesc = "Close-up";
        else if (dist > 8) distDesc = "Wide shot/Long shot";

        const cameraDescription = `${angleDesc}, ${distDesc}.`;
        const imageUrl = await generateSceneImage(settings, cameraState, cameraDescription, sceneCapture);
        setImageResult(imageUrl);

      } else {
        // --- VIDEO GENERATION ---
        // Pass the scene capture as the starting frame/reference
        const videoUrl = await generateSceneVideo(settings, sceneCapture);
        setVideoResult(videoUrl);
      }

    } catch (err: any) {
      // NOTE: We do NOT automatically retry here to avoid infinite loops.
      // We let the user decide to switch keys via the UI button.
      
      let errorMessage = err.message || "Failed to generate.";
      
      // Enhance error message for common 404/Billing issues
      if (errorMessage.includes("404") || errorMessage.includes("Requested entity was not found")) {
        errorMessage = "Project Error: The selected Google Cloud Project does not have access to Veo. Please select a project with Billing Enabled.";
      }

      setError(errorMessage);
    }
  };

  const getAspectRatioClasses = (ratio: string) => {
    switch(ratio) {
      case "16:9": return "aspect-video";
      case "4:3": return "aspect-[4/3]";
      case "1:1": return "aspect-square";
      case "9:16": return "aspect-[9/16]";
      default: return "aspect-video";
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black font-sans text-gray-100 flex items-center justify-center">
      
      {/* 3D Viewport Layer */}
      <div className={`relative w-full h-full bg-[#111] overflow-hidden`}>
        <StudioScene 
          ref={canvasRef}
          fov={cameraState.fov} 
          lighting={settings.lighting} 
          showSubject={showSubject}
          transformMode={transformMode}
          onCameraUpdate={handleCameraUpdate} 
        />
        
        {/* Rule of Thirds Grid Overlay */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none z-10 flex flex-col opacity-20">
            <div className="flex-1 border-b border-white"></div>
            <div className="flex-1 border-b border-white"></div>
            <div className="flex-1"></div>
            <div className="absolute inset-0 flex">
              <div className="flex-1 border-r border-white"></div>
              <div className="flex-1 border-r border-white"></div>
              <div className="flex-1"></div>
            </div>
          </div>
        )}

        {/* Center Reticle */}
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center opacity-30">
          <div className="w-8 h-8 border border-white/50 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
        </div>
        
        {/* Info HUD */}
        <div className="absolute bottom-6 right-6 pointer-events-none text-right font-mono text-[10px] text-zinc-500 select-none z-10">
          <p>CAM: {cameraState.position.map(n => n.toFixed(1)).join(', ')}</p>
          <p>FOV: {cameraState.fov}</p>
          <p>FMT: {settings.aspectRatio}</p>
          <p className="uppercase text-orange-500 font-bold">{settings.mode} MODE</p>
        </div>
      </div>

      {/* Control Panel Layer */}
      <ControlPanel 
        settings={settings} 
        updateSettings={updateSettings}
        fov={cameraState.fov}
        setFov={(val) => updateCamera({ fov: val })}
        onRender={handleRender}
        isGenerating={result.loading}
        showSubject={showSubject}
        setShowSubject={setShowSubject}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        transformMode={transformMode}
        setTransformMode={setTransformMode}
      />

      {/* Result Overlay Layer */}
      {(result.imageUrl || result.videoUrl || result.loading || result.error) && (
        <div className="absolute top-4 right-4 z-30 w-[480px] bg-zinc-900 border border-zinc-700 shadow-2xl rounded-lg overflow-hidden flex flex-col">
           <div className="flex items-center justify-between p-3 border-b border-zinc-800 bg-zinc-800/50">
             <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                {result.loading ? "Processing Request" : "Render Output"}
             </h3>
             <div className="flex gap-2">
                {result.imageUrl && (
                  <a href={result.imageUrl} download="studio-render.png" className="p-1 hover:text-white text-zinc-500 transition-colors">
                    <Download className="w-4 h-4" />
                  </a>
                )}
                {result.videoUrl && (
                  <a href={result.videoUrl} download="studio-video.mp4" className="p-1 hover:text-white text-zinc-500 transition-colors">
                    <Download className="w-4 h-4" />
                  </a>
                )}
                <button 
                  onClick={() => clearResult()}
                  className="p-1 hover:text-white text-zinc-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
             </div>
           </div>

           <div className={`relative w-full bg-black flex items-center justify-center ${getAspectRatioClasses(settings.aspectRatio)}`}>
             {result.loading && (
               <div className="text-center space-y-3 p-8">
                 <div className={`w-12 h-12 border-4 border-zinc-700 rounded-full animate-spin mx-auto ${settings.mode === 'video' ? 'border-t-indigo-500' : 'border-t-orange-500'}`}></div>
                 <p className="text-xs text-zinc-500 animate-pulse font-mono">
                    {settings.mode === 'video' ? "Generating Frames (this takes a moment)..." : "Developing Negative..."}
                 </p>
                 {settings.mode === 'video' && (
                    <p className="text-[10px] text-zinc-600 max-w-[200px] mx-auto">Please wait while Veo processes your video.</p>
                 )}
               </div>
             )}
             
             {result.error && (
               <div className="p-6 text-center text-red-400 flex flex-col items-center">
                 <AlertCircle className="w-8 h-8 mb-2 opacity-80" />
                 <p className="text-sm font-bold mb-2">Generation Failed</p>
                 <p className="text-xs opacity-75 mb-4">{result.error}</p>
                 
                 {/* Project Switcher Button - Only shows if supported */}
                 {isAIStudioEnv() ? (
                    <button 
                      onClick={async () => {
                         // @ts-ignore
                         await window.aistudio.openSelectKey();
                         // We clear error so user can try again
                         setError(null);
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 rounded text-xs transition-colors"
                    >
                      <Settings2 className="w-3 h-3" />
                      Switch Google Cloud Project
                    </button>
                 ) : (
                    <div className="text-[10px] bg-zinc-800 p-2 rounded text-zinc-500 border border-zinc-700">
                      <strong>Running Locally?</strong>
                      <br/>
                      Ensure your <code>.env</code> file has a valid <code>API_KEY</code> from a paid Google Cloud Project.
                    </div>
                 )}
               </div>
             )}

             {result.imageUrl && !result.loading && (
               <img src={result.imageUrl} alt="Generated Scene" className="w-full h-full object-contain" />
             )}

             {result.videoUrl && !result.loading && (
                <video 
                  src={result.videoUrl} 
                  controls 
                  autoPlay 
                  loop 
                  className="w-full h-full object-contain"
                />
             )}
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
