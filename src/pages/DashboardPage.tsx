import React, { useEffect, useState, useRef, useCallback } from "react";
import { LogOut, Eye, Edit3, Plus } from "lucide-react";
import { generationApi } from "../services/generationApi";
import {
  ButtonPrimary,
  ScrollReveal,
  ResultModal,
} from "../components/ui/SharedUI";
import { StudioScene } from "../components/StudioScene";
import { ControlPanel } from "../components/ControlPanel";
import { generateSceneImageFIBO } from "../services/fiboService";
import {
  useSettingsStore,
  useCameraStore,
  useResultStore,
  useViewportStore,
} from "../stores/index";

const MOCK_PROJECTS = [
  {
    id: "1",
    title: "The Silent Echo",
    author: "Alexandros",
    views: "1.2k",
    image:
      "https://images.unsplash.com/photo-1765490106425-9c62f772234b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "2",
    title: "Abstract Thoughts",
    author: "Maria V.",
    views: "850",
    image:
      "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2670&auto=format&fit=crop",
  },
];

export const PrivateLayout = ({
  onViewChange,
  currentView,
  children,
  onLogout,
}: any) => {
  const isStudio =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("studio") === "1";
  const navZ = isStudio ? "z-10 pointer-events-none" : "z-50";
  return (
    <div className="min-h-screen bg-[#050505]">
      <nav
        className={`fixed top-0 left-0 w-full ${navZ} px-6 py-6 md:px-12 flex justify-between items-center text-white bg-gradient-to-b from-black/80 to-transparent`}
      >
        <div
          className="text-xl font-serif tracking-widest font-bold cursor-pointer"
          onClick={() => onViewChange("explore")}
        >
          MUSEUM<span className="text-blue-400">.AI</span>
        </div>
        <div className="hidden md:flex gap-12">
          {[
            { id: "explore", label: "Colección" },
            { id: "profile", label: "Mi Estudio" },
            { id: "settings", label: "Ajustes" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`text-[10px] uppercase tracking-[0.2em] ${
                currentView === item.id
                  ? "text-blue-400 font-bold"
                  : "text-white/60"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          onClick={onLogout}
          className="text-white/40 hover:text-red-400 transition-colors pointer-events-auto"
        >
          <LogOut size={20} />
        </button>
      </nav>
      <main className="relative z-20">{children}</main>
    </div>
  );
};

export const ExploreView = () => {
  const [generations, setGenerations] = useState<any[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // stores
  const settings = useSettingsStore((s) => s.settings);
  const cameraState = useCameraStore((s) => s.cameraState);
  const updateCamera = useCameraStore((s) => s.updateCamera);
  const setImageResult = useResultStore((s) => s.setImageResult);
  const setLoading = useResultStore((s) => s.setLoading);
  const showSubject = useViewportStore((s) => s.showSubject);
  const transformMode = useViewportStore((s) => s.transformMode);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token") || undefined;
        const res = await generationApi.getGenerations(token);
        if (Array.isArray(res)) setGenerations(res as any[]);
        else setGenerations(MOCK_PROJECTS as any[]);
      } catch (err) {
        console.warn("Could not fetch generations, using mock", err);
        setGenerations(MOCK_PROJECTS as any[]);
      }
    };
    load();
  }, []);

  const handleCreate = () => {
    // Open the dedicated studio editor view
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("studio", "1");
      window.location.assign(url.toString());
    } catch {
      window.location.assign("/?studio=1");
    }
  };

  const handleGenerateFromScene = useCallback(async () => {
    if (!settings.prompt) {
      alert("Please enter a scene description (prompt) before generating.");
      return;
    }

    try {
      setLoading(true);

      // capture canvas image from StudioScene
      let sceneCapture: string | null = null;
      if (canvasRef.current) {
        sceneCapture = canvasRef.current.toDataURL("image/png");
      }

      // build camera description similar to original App
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

      // call fibo service with progress callback
      const appendStatusLog = (msg: string) => {
        try {
          // dynamic import to avoid circular deps at top-level
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
        (msg: string) => {
          appendStatusLog(msg);
        }
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
    <div className="pt-32 px-6 md:px-12 pb-24 max-w-7xl mx-auto">
      <ScrollReveal>
        <div className="flex justify-between items-end mb-20 border-b border-white/10 pb-8">
          <div>
            <span className="text-blue-400 tracking-[0.3em] text-xs font-bold uppercase">
              Dashboard
            </span>
            <h2 className="text-5xl md:text-7xl font-serif mt-4 text-white">
              Galería Privada
            </h2>
          </div>
          <div>
            <div className="flex gap-3">
              <ButtonPrimary onClick={handleCreate}>
                <Plus />
                Crear
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* ExploreView now shows only the collection grid; studio editor is separate */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-12 gap-y-24">
        {generations.map((project: any, index: number) => (
          <ScrollReveal key={project.id || index} delay={index * 100}>
            <div className="group cursor-pointer">
              <div className="relative aspect-[4/5] overflow-hidden mb-6">
                <img
                  src={project.image_url || project.image}
                  alt={project.title || "obra"}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-sm">
                  <span className="border border-white/30 px-6 py-2 text-xs tracking-widest uppercase text-white hover:bg-white hover:text-black transition-colors">
                    Ver Obra
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-start border-t border-white/20 pt-4">
                <div>
                  <h3 className="text-2xl font-serif text-white group-hover:text-blue-400 transition-colors">
                    {project.title || "Untitled"}
                  </h3>
                  <p className="text-white/40 text-sm mt-1 uppercase tracking-wider">
                    Por {project.author || "Unknown"}
                  </p>
                </div>
                <div className="flex gap-4 text-white/40">
                  <span className="flex items-center gap-1 text-xs">
                    <Eye size={14} /> {project.views || "—"}
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
      <ResultModal />
    </div>
  );
};

export const ProfileView = () => (
  <div className="pt-32 px-6 md:px-12 pb-24 max-w-7xl mx-auto min-h-screen">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-4 sticky top-32 self-start">
        <ScrollReveal>
          <div className="relative w-48 h-48 mb-8 mx-auto lg:mx-0 overflow-hidden rounded-full border border-white/20 group">
            <img
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2574&auto=format&fit=crop"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <h1 className="text-4xl font-serif text-white mb-2 text-center lg:text-left">
            Alexandros
          </h1>
        </ScrollReveal>
      </div>
      <div className="lg:col-span-8">
        <div className="mb-12 border-b border-white/10 pb-4 flex justify-between items-end">
          <h3 className="text-xl font-serif text-white">Obras Recientes</h3>
          <button className="text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors flex items-center gap-2">
            Ver Todo
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            className="aspect-square border border-dashed border-white/20 flex flex-col items-center justify-center text-white/40 hover:text-white hover:border-white hover:bg-white/5 transition-all cursor-pointer group"
            onClick={() => {
              try {
                const url = new URL(window.location.href);
                url.searchParams.set("studio", "1");
                window.location.assign(url.toString());
              } catch {
                window.location.assign("/?studio=1");
              }
            }}
          >
            <Plus className="mb-2 group-hover:scale-125 transition-transform" />
            <span className="text-xs tracking-widest uppercase">
              Crear Nuevo
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const SettingsView = () => (
  <div className="pt-32 px-6 max-w-3xl mx-auto min-h-screen">
    <ScrollReveal>
      <h2 className="text-4xl font-serif text-white mb-12">Configuración</h2>
    </ScrollReveal>
    <div className="space-y-16">
      <ScrollReveal delay={100}>
        <section>
          <h3 className="text-xs font-bold tracking-[0.2em] text-blue-400 uppercase mb-8 border-b border-white/10 pb-4">
            Perfil Público
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col gap-4">
              <label className="text-xs text-white/40 tracking-widest uppercase">
                Avatar
              </label>
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center border border-white/20 cursor-pointer hover:bg-white/20 transition-colors relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2574&auto=format&fit=crop"
                  className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity"
                />
                <span className="text-xs uppercase relative z-10">Cambiar</span>
              </div>
            </div>
            <div className="space-y-6">
              <input className="w-full" />
              <input className="w-full" />
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  </div>
);

export default {};
