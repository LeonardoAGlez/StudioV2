import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ArrowLeft, X } from "lucide-react";
import { useResultStore } from "../../stores";

export const useParallax = (speed = 0.5) => {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const handleScroll = () => setOffset(window.pageYOffset * speed);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);
  return offset;
};

export const ScrollReveal = ({ children, delay = 0, className = "" }: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export const ButtonPrimary = ({
  children,
  onClick,
  className = "",
  type = "button",
}: any) => (
  <button
    type={type}
    onClick={onClick}
    className={`group relative px-8 py-4 bg-white text-black font-medium tracking-widest uppercase text-xs overflow-hidden transition-all hover:bg-gray-200 ${className}`}
  >
    <span className="relative z-10 flex items-center justify-center gap-2">
      {children}
    </span>
    <div className="absolute inset-0 bg-gray-300 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
  </button>
);

export const InputField = ({
  label,
  type = "text",
  placeholder,
  icon: Icon,
}: any) => (
  <div className="group mb-8 relative">
    <div className="flex items-center space-x-4 border-b border-white/20 pb-2 group-focus-within:border-white transition-colors duration-500">
      {Icon && (
        <Icon
          size={18}
          className="text-white/40 group-focus-within:text-white transition-colors"
        />
      )}
      <input
        type={type}
        placeholder={placeholder}
        className="bg-transparent border-none text-white w-full focus:ring-0 placeholder-white/20 font-light tracking-wide text-lg"
      />
    </div>
    <label className="absolute -top-6 left-0 text-xs text-white/40 tracking-widest uppercase">
      {label}
    </label>
  </div>
);

export const AppStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&family=Inter:wght@200;300;400;500&display=swap');
    .font-serif { font-family: 'Playfair Display', serif; }
    .font-sans { font-family: 'Inter', sans-serif; }
    .animate-bounce-slow { animation: bounce 3s infinite; }
    .animate-slow-zoom { animation: slowZoom 20s ease-in-out infinite alternate; }
    .animate-pan-slow { animation: panSlow 25s linear infinite alternate; }
    @keyframes slowZoom { 0% { transform: scale(1.0); } 100% { transform: scale(1.15); } }
    @keyframes panSlow { 0% { object-position: 50% 50%; transform: scale(1.1); } 100% { object-position: 60% 50%; transform: scale(1.1); } }
    @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
  `}</style>
);

export const LoadingSpinner = ({ size = 48 }: { size?: number }) => (
  <div className="flex items-center justify-center">
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      className="animate-spin text-white/80"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        strokeWidth="4"
        stroke="currentColor"
        strokeOpacity="0.2"
        fill="none"
      ></circle>
      <path
        d="M45 25a20 20 0 0 1-20 20"
        strokeWidth="4"
        stroke="currentColor"
        strokeLinecap="round"
        fill="none"
      ></path>
    </svg>
  </div>
);

export const ResultModal: React.FC = () => {
  const result = useResultStore((s) => s.result);
  const clearResult = useResultStore((s) => s.clearResult);
  const appendStatusLog = useResultStore((s) => s.appendStatusLog);
  const clearStatusLogs = useResultStore((s) => s.clearStatusLogs);

  if (!result) return null;
  const { imageUrl, loading, error, statusLogs = [] } = result as any;

  // don't render unless active
  if (!loading && !imageUrl && !error) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => clearResult()}
      ></div>
      <div className="relative w-[min(90vw,900px)] max-h-[90vh] bg-[#0b0b0b] border border-white/10 rounded-xl p-6 overflow-auto z-[3100]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg text-white">Resultado</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (imageUrl) {
                  navigator.clipboard?.writeText(imageUrl);
                  appendStatusLog("Enlace copiado al portapapeles");
                }
              }}
              className="text-white/60 hover:text-white text-sm px-3 py-2"
            >
              Copiar enlace
            </button>
            {imageUrl && (
              <a
                href={imageUrl}
                download
                className="text-white/60 hover:text-white text-sm px-3 py-2"
              >
                Descargar
              </a>
            )}
            <button
              onClick={() => {
                clearResult();
                clearStatusLogs();
              }}
              className="text-white/60 hover:text-white"
            >
              <X />
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          {loading && (
            <div className="py-6 w-full">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 animate-pulse"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
          )}
          {error && <div className="text-red-400">{error}</div>}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Resultado"
              className="max-w-full max-h-[60vh] rounded-md shadow-md mb-4"
            />
          )}
          <div className="w-full mt-4 text-sm text-white/60 space-y-2">
            <div className="font-semibold text-white/80 mb-2">
              Registro de estado
            </div>
            <div className="max-h-40 overflow-auto bg-white/5 p-3 rounded">
              {statusLogs.length === 0 ? (
                <div className="text-white/40">
                  Sin actualizaciones todavía...
                </div>
              ) : (
                statusLogs.map((l: string, i: number) => (
                  <div key={i} className="text-xs">
                    {l}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default {};
