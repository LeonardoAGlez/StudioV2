import React, { useRef, useCallback } from "react";
import { ScrollReveal, ResultModal } from "../components/ui/SharedUI";
import { StudioScene } from "../components/StudioScene";
import { ControlPanel } from "../components/ControlPanel";
import { generateSceneImageFIBO } from "../services/fiboService";
import {
  useSettingsStore,
  useCameraStore,
  useResultStore,
  useViewportStore,
} from "../stores/index";

export const StudioEditorPage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore.getState().updateSettings;
  const cameraState = useCameraStore((s) => s.cameraState);
  const updateCamera = useCameraStore((s) => s.updateCamera);
  const setImageResult = useResultStore((s) => s.setImageResult);
  const setLoading = useResultStore((s) => s.setLoading);
  const showSubject = useViewportStore((s) => s.showSubject);
  const setShowSubject = useViewportStore.getState().setShowSubject;
  const showGrid = true;
  const setShowGrid = useViewportStore.getState().setShowGrid;
  const transformMode = useViewportStore((s) => s.transformMode);
  const setTransformMode = useViewportStore.getState().setTransformMode;

  const handleGenerateFromScene = useCallback(async () => {
    if (!settings.prompt) {
      alert("Please enter a scene description (prompt) before generating.");
      return;
    }
    try {
      setLoading(true);
      let sceneCapture: string | null = null;
      if (canvasRef.current)
        sceneCapture = canvasRef.current.toDataURL("image/png");

      const yPos = cameraState.position?.[1] ?? 2;
      let angleDesc = "Eye-level shot";
      if (yPos > 3) angleDesc = "High-angle / Crane shot";
      else if (yPos < 1) angleDesc = "Low-angle / Worm's eye view";

      const dist = Math.sqrt(
        Math.pow(cameraState.position?.[0] ?? 0, 2) +
          Math.pow(cameraState.position?.[2] ?? 0, 2)
      );
      let distDesc = "Medium shot";
      if (dist < 2) distDesc = "Close-up";
      else if (dist > 8) distDesc = "Wide shot/Long shot";
      const cameraDescription = `${angleDesc}, ${distDesc}.`;

      const appendStatusLog = (msg: string) => {
        try {
          const store = require("../stores").useResultStore;
          store.getState().appendStatusLog(msg);
        } catch (e) {
          console.warn("Could not append status log", e);
        }
      };

      const imageUrl = await generateSceneImageFIBO(
        settings,
        cameraState,
        cameraDescription,
        sceneCapture,
        (msg: string) => appendStatusLog(msg)
      );
      setImageResult(imageUrl);
      alert("Generación enviada. Comprueba la ventana de resultados.");
    } catch (err) {
      console.error("Error generating from scene", err);
      alert("Error al generar la imagen. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  }, [settings, cameraState, setImageResult, setLoading]);

  return (
    <div className="fixed inset-0 bg-[#050505] z-[100]">
      {/* Top-left Generate button restored */}
      <div className="absolute top-6 left-6 z-[200]">
        <button
          onClick={handleGenerateFromScene}
          className="uppercase tracking-widest text-xs px-4 py-2 border border-white/20 text-white/80 hover:bg-white hover:text-black transition-colors"
        >
          Generar
        </button>
      </div>

      {/* Top-right Exit to dashboard */}
      <div className="absolute top-6 right-6 z-[200]">
        <button
          onClick={() => {
            try {
              const url = new URL(window.location.href);
              url.searchParams.delete("studio");
              url.searchParams.set("view", "explore");
              window.location.assign(url.toString());
            } catch {
              window.location.assign("/?view=explore");
            }
          }}
          className="uppercase tracking-widest text-xs px-4 py-2 border border-white/20 text-white/80 hover:bg-white hover:text-black transition-colors"
        >
          Salir
        </button>
      </div>

      <div className="absolute inset-0 z-[100]">
        <StudioScene
          ref={canvasRef}
          fov={cameraState.fov}
          lighting={settings.lighting || "Studio"}
          showSubject={showSubject}
          transformMode={transformMode}
          onCameraUpdate={(s) => updateCamera(s)}
        />
      </div>

      {/* Sidebar overlays above global navbar (use high z-index) */}
      <div className="absolute top-0 left-0 h-full w-[360px] p-4 z-[200] bg-black/40 backdrop-blur-sm border-r border-white/10 overflow-auto">
        <ControlPanel
          settings={settings}
          updateSettings={(ns) => updateSettings(ns)}
          fov={cameraState.fov}
          setFov={(f) => updateCamera({ fov: f })}
          onRender={handleGenerateFromScene}
          isGenerating={useResultStore.getState().result.loading}
          showSubject={showSubject}
          setShowSubject={(s) => setShowSubject(s)}
          showGrid={showGrid}
          setShowGrid={(s) => setShowGrid(s)}
          transformMode={transformMode}
          setTransformMode={(m) => setTransformMode(m)}
        />
      </div>

      <ResultModal />
    </div>
  );
};

export default StudioEditorPage;
