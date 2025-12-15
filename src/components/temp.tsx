import React, { useState, useEffect, useRef } from 'react';
import { User, Settings, Grid, LogOut, Heart, Share2, Plus, ArrowRight, Lock, Mail, Eye, EyeOff, Edit3, Menu, X, ChevronDown, ArrowLeft, Camera } from 'lucide-react';
import { authApi } from '../services/authApi';
import { AppStyles } from './ui/SharedUI';

// --- Assets & Data ---
// IMÁGENES ACTUALIZADAS Y VERIFICADAS
// Hero: Estilo David / Escultura clásica con fondo oscuro
const HERO_IMAGE_ALT = "https://images.unsplash.com/photo-1552355170-c8337700279c?q=80&w=2671&auto=format&fit=crop"; 

// Autenticación (Imágenes distintas para cada estado)
// Login: Busto clásico dramático
const AUTH_IMAGE_LOGIN = "https://images.unsplash.com/photo-1576504677634-06b2130bac39?q=80&w=2535&auto=format&fit=crop"; 
// Registro: Estatua mirando hacia arriba/futuro
const AUTH_IMAGE_REGISTER = "https://images.unsplash.com/photo-1549813069-f95e44d7f498?q=80&w=2670&auto=format&fit=crop"; 
// Recuperar: Detalle de manos o textura de mármol
const AUTH_IMAGE_RECOVER = "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2670&auto=format&fit=crop"; 

const MOCK_PROJECTS = [
  { id: 1, title: "The Silent Echo", author: "Alexandros", views: "1.2k", image: "https://images.unsplash.com/photo-1555445054-010754df67eb?q=80&w=2670&auto=format&fit=crop" },
  { id: 2, title: "Abstract Thoughts", author: "Maria V.", views: "850", image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2670&auto=format&fit=crop" },
  { id: 3, title: "Neon Genesis", author: "K. L.", views: "2.1k", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" },
  { id: 4, title: "Marble Dreams", author: "Davide", views: "3.4k", image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2670&auto=format&fit=crop" },
];

// --- Hooks & Utilities ---

const useParallax = (speed = 0.5) => {
    const [offset, setOffset] = useState(0);
    useEffect(() => {
        const handleScroll = () => setOffset(window.pageYOffset * speed);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [speed]);
    return offset;
};

const ScrollReveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 } 
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.disconnect(); };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const ButtonPrimary = ({ children, onClick, className = "", type="button" }: any) => (
  <button 
    type={type}
    onClick={onClick}
    className={`group relative px-8 py-4 bg-white text-black font-medium tracking-widest uppercase text-xs overflow-hidden transition-all hover:bg-gray-200 ${className}`}
  >
    <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    <div className="absolute inset-0 bg-gray-300 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
  </button>
);

const InputField = ({ label, type = "text", placeholder, icon: Icon }: any) => (
  <div className="group mb-8 relative">
    <div className="flex items-center space-x-4 border-b border-white/20 pb-2 group-focus-within:border-white transition-colors duration-500">
      {Icon && <Icon size={18} className="text-white/40 group-focus-within:text-white transition-colors" />}
      <input 
        type={type} 
        placeholder={placeholder}
        className="bg-transparent border-none text-white w-full focus:ring-0 placeholder-white/20 font-light tracking-wide text-lg"
      />
    </div>
    <label className="absolute -top-6 left-0 text-xs text-white/40 tracking-widest uppercase">{label}</label>
  </div>
);

// --- Componentes de la Landing Page (Pública) ---

const PublicNavbar = ({ onLoginClick, onGoStudio }: any) => (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-8 md:px-12 flex justify-between items-center mix-blend-difference text-white">
        <div className="text-xl font-serif tracking-widest font-bold z-50 cursor-pointer">
            MUSEUM<span className="text-blue-400">.AI</span>
        </div>
        
        <div className="hidden md:flex items-center gap-12 z-50">
            {['Artistas', 'Manifiesto', 'Eventos'].map((item) => (
                <a key={item} href="#" className="text-[10px] uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors relative group">
                    {item}
                    <span className="absolute -bottom-2 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
            ))}
            <div className="h-4 w-px bg-white/30"></div>
            <button onClick={() => onLoginClick('login')} className="text-[10px] uppercase tracking-[0.2em] font-bold hover:text-blue-400 transition-colors">
                Iniciar Sesión
            </button>
            <button onClick={() => onLoginClick('register')} className="px-6 py-2 border border-white/30 hover:bg-white hover:text-black hover:border-white transition-all text-[10px] uppercase tracking-[0.2em]">
                Unirse
            </button>
            <button onClick={() => onGoStudio()} className="ml-4 px-4 py-2 bg-white text-black text-xs uppercase tracking-widest">Ir a Estudio</button>
        </div>
        
        <button className="md:hidden text-white z-50">
            <Menu />
        </button>
    </nav>
);

const LandingHero = ({ onScrollDown }: any) => {
    const yPos = useParallax(0.3); 
    
    return (
        <header className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Background Parallax */}
            <div 
                className="absolute inset-0 z-0 overflow-hidden"
                style={{ transform: `translateY(${yPos}px)` }} 
            >
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img 
                    src={HERO_IMAGE_ALT} 
                    alt="Renaissance Statue" 
                    className="w-full h-[120%] object-cover opacity-80 animate-slow-zoom" 
                />
            </div>

            {/* Content */}
            <div className="relative z-20 text-center px-6 mix-blend-difference">
                <ScrollReveal>
                    <p className="text-xs md:text-sm tracking-[0.4em] uppercase text-white/80 mb-6">La nueva era del arte</p>
                    <h1 className="text-6xl md:text-9xl font-serif text-white mb-6 italic tracking-tight">
                        Renaissance
                    </h1>
                </ScrollReveal>
                
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce-slow cursor-pointer" onClick={onScrollDown}>
                    <span className="text-[10px] uppercase tracking-widest mb-2 text-white/60">Descubre</span>
                    <ChevronDown className="text-white/60" />
                </div>
            </div>
        </header>
    );
};

const LandingSectionWho = () => {
    return (
        <section className="py-32 px-6 md:px-24 bg-[#050505] relative border-b border-white/5">
            <div className="grid md:grid-cols-2 gap-24 items-center max-w-7xl mx-auto">
                <div>
                     <ScrollReveal>
                        <span className="block text-blue-400 text-xs tracking-[0.3em] uppercase mb-4">¿Quiénes Somos?</span>
                        <h2 className="text-4xl md:text-6xl font-serif text-white mb-8 leading-tight">
                            Arquitectos de la <br/> Imaginación Digital
                        </h2>
                        <p className="text-white/60 font-light leading-loose text-lg mb-12">
                            No somos solo una plataforma, somos el lienzo donde la inteligencia artificial y la sensibilidad humana convergen. 
                            Curamos herramientas para que esculpas ideas en tiempo real, transformando el pensamiento en obra visual.
                        </p>
                    </ScrollReveal>
                </div>
                <div className="relative h-[600px] w-full hidden md:block overflow-hidden">
                     {/* Imagen con Panorámica suave - Detalle escultural limpio */}
                     <ScrollReveal delay={200} className="h-full w-full">
                         <div className="relative w-full h-full overflow-hidden">
                             <img src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2670&auto=format&fit=crop" alt="Detail" className="w-full h-full object-cover animate-pan-slow" />
                             <div className="absolute inset-0 border border-white/10 m-4"></div>
                         </div>
                     </ScrollReveal>
                </div>
            </div>
        </section>
    );
};

const LandingFooterCTA = ({ onLoginClick }: any) => {
    return (
        <section className="h-[80vh] flex flex-col items-center justify-center relative bg-[#080808] border-t border-white/10">
             <ScrollReveal>
                <div className="text-center px-6">
                    <h2 className="text-5xl md:text-8xl font-serif text-white mb-12">Empieza tu Legado</h2>
                    <ButtonPrimary onClick={onLoginClick} className="w-64">Entrar a la Bóveda</ButtonPrimary>
                </div>
            </ScrollReveal>
            <footer className="absolute bottom-0 w-full py-8 border-t border-white/5 flex justify-between px-12 text-[10px] text-white/20 uppercase tracking-widest">
                <span>© 2025 Museum AI</span>
                <span>Designed for Creators</span>
            </footer>
        </section>
    );
}

const LandingPage = ({ onLoginClick, onGoStudio }: any) => {
    const whoSectionRef = useRef<HTMLDivElement>(null);
    const scrollToContent = () => whoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });

    return (
        <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden">
            <PublicNavbar onLoginClick={onLoginClick} onGoStudio={onGoStudio} />
            <LandingHero onScrollDown={scrollToContent} />
            <div ref={whoSectionRef}>
                <LandingSectionWho />
            </div>
            <LandingFooterCTA onLoginClick={onGoStudio} />
        </div>
    );
};

// --- MÓDULO DE AUTENTICACIÓN (SPLIT SCREEN) ---

const AuthView = ({ onLoginSuccess, onBack, initialMode = 'login' }: any) => {
    const [authMode, setAuthMode] = useState<'login' | 'register' | 'recover'>(initialMode);
    const [isAnimating, setIsAnimating] = useState(false);

    // Función para manejar el cambio de modo con una pequeña transición
    const switchMode = (mode: 'login' | 'register' | 'recover') => {
        setIsAnimating(true);
        setTimeout(() => {
            setAuthMode(mode);
            setIsAnimating(false);
        }, 500); // Duración del fade
    };

    // Update internal mode when initialMode changes (e.g., when user clicked 'Unirse')
    React.useEffect(() => {
        setAuthMode(initialMode);
    }, [initialMode]);

    const handleSubmitAuth = async (e: any) => {
        e.preventDefault();
        try {
            const form = e.target as HTMLFormElement;
            const email = (form.querySelector('input[type="email"]') as HTMLInputElement)?.value;
            const password = (form.querySelector('input[type="password"]') as HTMLInputElement)?.value;
            if (authMode === 'login') {
                const res: any = await authApi.login({ email, password });
                if (res?.access_token) {
                    localStorage.setItem('token', res.access_token);
                    onLoginSuccess && onLoginSuccess();
                } else {
                    alert('Login falló: respuesta inesperada');
                }
            } else if (authMode === 'register') {
                const username = (form.querySelector('input[placeholder="Phidias"]') as HTMLInputElement)?.value || '';
                await authApi.register({ username, email, password });
                alert('Registro exitoso. Ahora puedes iniciar sesión.');
                setAuthMode('login');
            } else {
                // recover: backend not available -> show message
                alert('Funcionalidad de recuperación no disponible en el backend actual.');
                setAuthMode('login');
            }
        } catch (err) {
            console.error('Auth error', err);
            alert('Error en autenticación: ' + (err as any).message || String(err));
        }
    };

    // Configuración dinámica según el modo
    const config = {
        login: {
            image: AUTH_IMAGE_LOGIN,
            title: "Bienvenido de Nuevo",
            subtitle: "Tu colección espera.",
            action: onLoginSuccess,
            btnText: "Entrar"
        },
        register: {
            image: AUTH_IMAGE_REGISTER,
            title: "Crear Cuenta",
            subtitle: "Únete a los nuevos maestros.",
            action: onLoginSuccess,
            btnText: "Registrarse"
        },
        recover: {
            image: AUTH_IMAGE_RECOVER,
            title: "Recuperar Acceso",
            subtitle: "Te enviaremos una llave nueva.",
            action: () => switchMode('login'), 
            btnText: "Enviar Instrucciones"
        }
    }[authMode];

    return (
        <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col lg:flex-row overflow-hidden">
            <button onClick={onBack} className="absolute top-8 right-8 z-50 text-white/40 hover:text-white transition-colors">
                <X size={32} />
            </button>

            {/* --- COLUMNA IMAGEN (Con Animación de Movimiento) --- */}
            <div className="lg:w-1/2 h-48 lg:h-full relative overflow-hidden bg-black/50">
                <div className="absolute inset-0 bg-black/20 z-10"></div>
                {/* Animación key para cambiar imagen suavemente */}
                <div className={`w-full h-full transition-opacity duration-700 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
                    <img 
                        src={config.image} 
                        alt="Art" 
                        className="w-full h-full object-cover animate-pan-slow" // Efecto de paneo lento
                    />
                </div>
                <div className="absolute bottom-12 left-12 z-20 hidden lg:block">
                     <p className="text-white/60 text-xs tracking-widest uppercase mb-2">Colección Permanente</p>
                     <h3 className="text-2xl font-serif italic">"Clasicismo Digital"</h3>
                </div>
            </div>

            {/* --- COLUMNA FORMULARIO --- */}
            <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative">
                {/* Líneas de fondo sutiles */}
                <div className="absolute inset-0 flex justify-between pointer-events-none opacity-5 px-12">
                    <div className="w-px h-full bg-white"></div>
                    <div className="w-px h-full bg-white"></div>
                </div>

                <div className={`w-full max-w-md transition-all duration-500 transform ${isAnimating ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}>
                    <div className="mb-12">
                        {authMode !== 'login' && (
                             <button onClick={() => switchMode('login')} className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/40 hover:text-white mb-6 transition-colors">
                                 <ArrowLeft size={14}/> Volver
                             </button>
                        )}
                        <h2 className="text-4xl lg:text-5xl font-serif text-white mb-2">{config.title}</h2>
                        <p className="text-white/40 text-sm font-light tracking-wide">{config.subtitle}</p>
                    </div>

                    <form onSubmit={handleSubmitAuth}>
                        
                        {authMode === 'register' && (
                            <InputField label="Nombre de Artista" placeholder="Phidias" icon={User} />
                        )}

                        <InputField label="Correo Electrónico" type="email" placeholder="artista@museo.ai" icon={Mail} />
                        
                        {authMode !== 'recover' && (
                             <InputField label="Contraseña" type="password" placeholder="••••••••" icon={Lock} />
                        )}

                        {authMode === 'login' && (
                            <div className="flex justify-end mb-8">
                                <button type="button" onClick={() => switchMode('recover')} className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5">
                                    ¿Olvidaste tu contraseña?
                                </button>
                            </div>
                        )}

                        <ButtonPrimary className="w-full mt-4" type="submit">{config.btnText}</ButtonPrimary>
                    </form>

                    {authMode === 'login' && (
                        <div className="mt-12 text-center">
                            <span className="text-xs text-white/30 uppercase tracking-widest">¿Aún no tienes acceso?</span>
                            <button onClick={() => switchMode('register')} className="block mx-auto mt-2 text-xs text-white uppercase tracking-widest border-b border-white/40 pb-1 hover:border-white transition-colors">
                                Solicitar Registro
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Dashboard (Privado) ---

const PrivateLayout = ({ onViewChange, currentView, children, onLogout }: any) => (
    <div className="min-h-screen bg-[#050505]">
        <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-12 flex justify-between items-center mix-blend-difference text-white bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
            <div className="text-xl font-serif tracking-widest font-bold cursor-pointer" onClick={() => onViewChange('explore')}>
                MUSEUM<span className="text-blue-400">.AI</span>
            </div>
            <div className="hidden md:flex gap-12">
                {[ {id:'explore', label:'Colección'}, {id:'profile', label:'Mi Estudio'}, {id:'settings', label:'Ajustes'} ].map(item => (
                    <button 
                        key={item.id}
                        onClick={() => onViewChange(item.id)}
                        className={`text-[10px] uppercase tracking-[0.2em] transition-all hover:text-blue-400 ${currentView === item.id ? 'text-blue-400 font-bold border-b border-blue-400 pb-1' : 'text-white/60'}`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
             <button onClick={onLogout} className="text-white/40 hover:text-red-400 transition-colors">
                <LogOut size={20}/>
            </button>
        </nav>
        
        <div className="fixed left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-40">
           <div className={`w-px h-12 bg-white transition-all ${currentView === 'explore' ? 'h-24 bg-blue-400' : 'opacity-20'}`}></div>
           <div className={`w-px h-12 bg-white transition-all ${currentView === 'profile' ? 'h-24 bg-blue-400' : 'opacity-20'}`}></div>
           <div className={`w-px h-12 bg-white transition-all ${currentView === 'settings' ? 'h-24 bg-blue-400' : 'opacity-20'}`}></div>
        </div>

        <main className="relative z-10">
            {children}
        </main>
    </div>
);

const ExploreView = () => (
    <div className="pt-32 px-6 md:px-12 pb-24 max-w-7xl mx-auto">
      <ScrollReveal>
        <div className="flex justify-between items-end mb-20 border-b border-white/10 pb-8">
          <div>
            <span className="text-blue-400 tracking-[0.3em] text-xs font-bold uppercase">Dashboard</span>
            <h2 className="text-5xl md:text-7xl font-serif mt-4 text-white">Galería Privada</h2>
          </div>
        </div>
      </ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-12 gap-y-24">
        {MOCK_PROJECTS.map((project, index) => (
          <ScrollReveal key={project.id} delay={index * 100}>
            <div className="group cursor-pointer">
              <div className="relative aspect-[4/5] overflow-hidden mb-6">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-sm">
                  <span className="border border-white/30 px-6 py-2 text-xs tracking-widest uppercase text-white hover:bg-white hover:text-black transition-colors">Ver Obra</span>
                </div>
              </div>
              <div className="flex justify-between items-start border-t border-white/20 pt-4">
                <div><h3 className="text-2xl font-serif text-white group-hover:text-blue-400 transition-colors">{project.title}</h3><p className="text-white/40 text-sm mt-1 uppercase tracking-wider">Por {project.author}</p></div>
                <div className="flex gap-4 text-white/40"><span className="flex items-center gap-1 text-xs"><Eye size={14}/> {project.views}</span></div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
);

// --- VISTAS RESTAURADAS (Perfil y Ajustes) ---

const ProfileView = () => {
    return (
        <div className="pt-32 px-6 md:px-12 pb-24 max-w-7xl mx-auto min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Columna Izquierda: Info */}
                <div className="lg:col-span-4 sticky top-32 self-start">
                     <ScrollReveal>
                        <div className="relative w-48 h-48 mb-8 mx-auto lg:mx-0 overflow-hidden rounded-full border border-white/20 group">
                            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2574&auto=format&fit=crop" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                                <Camera className="text-white" size={24} />
                             </div>
                        </div>
                        <h1 className="text-4xl font-serif text-white mb-2 text-center lg:text-left">Alexandros</h1>
                        <p className="text-blue-400 text-xs tracking-[0.2em] uppercase mb-6 text-center lg:text-left">Visual Artist & AI Creator</p>
                        
                        <p className="text-white/60 font-light leading-relaxed mb-8 text-sm text-center lg:text-left">
                            "Busco la intersección entre la escultura clásica y la síntesis digital. Mis obras son un intento de congelar el caos en mármol virtual."
                        </p>

                        <div className="flex gap-4 justify-center lg:justify-start mb-12">
                             <button className="p-3 border border-white/10 hover:border-white hover:bg-white hover:text-black transition-all rounded-full"><Share2 size={16}/></button>
                             <button className="p-3 border border-white/10 hover:border-white hover:bg-white hover:text-black transition-all rounded-full"><Settings size={16}/></button>
                        </div>

                        <div className="border-t border-white/10 pt-8 grid grid-cols-2 gap-6">
                            <div>
                                <span className="block text-2xl font-serif text-white">24</span>
                                <span className="text-[10px] uppercase tracking-widest text-white/40">Proyectos</span>
                            </div>
                            <div>
                                <span className="block text-2xl font-serif text-white">1.2k</span>
                                <span className="text-[10px] uppercase tracking-widest text-white/40">Seguidores</span>
                            </div>
                        </div>
                     </ScrollReveal>
                </div>

                {/* Columna Derecha: Galería Personal */}
                <div className="lg:col-span-8">
                     <div className="mb-12 border-b border-white/10 pb-4 flex justify-between items-end">
                         <h3 className="text-xl font-serif text-white">Obras Recientes</h3>
                         <button className="text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors flex items-center gap-2">
                            Ver Todo <ArrowRight size={14}/>
                         </button>
                     </div>
                     
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[1,2,3,4].map((i) => (
                             <ScrollReveal key={i} delay={i * 100}>
                                <div className="aspect-square bg-white/5 relative group overflow-hidden border border-white/5 hover:border-white/20 transition-colors">
                                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 bg-black/60">
                                         <Edit3 className="text-white" />
                                     </div>
                                     <img src={`https://source.unsplash.com/random/800x800?sculpture&sig=${i}`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt="Work" />
                                </div>
                             </ScrollReveal>
                        ))}
                        <div
                                    className="aspect-square border border-dashed border-white/20 flex flex-col items-center justify-center text-white/40 hover:text-white hover:border-white hover:bg-white/5 transition-all cursor-pointer group"
                                    onClick={() => {
                                      try {
                                        const url = new URL(window.location.href);
                                        url.searchParams.set("view", "explore");
                                        window.location.assign(url.toString());
                                      } catch {
                                        window.location.assign("/");
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
    )
}

const SettingsView = () => {
    return (
        <div className="pt-32 px-6 max-w-3xl mx-auto min-h-screen">
            <ScrollReveal>
                <h2 className="text-4xl font-serif text-white mb-12">Configuración</h2>
            </ScrollReveal>
            
            <div className="space-y-16">
                {/* Section Profile */}
                <ScrollReveal delay={100}>
                    <section>
                        <h3 className="text-xs font-bold tracking-[0.2em] text-blue-400 uppercase mb-8 border-b border-white/10 pb-4">Perfil Público</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                             <div className="flex flex-col gap-4">
                                 <label className="text-xs text-white/40 tracking-widest uppercase">Avatar</label>
                                 <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center border border-white/20 cursor-pointer hover:bg-white/20 transition-colors relative overflow-hidden group">
                                     <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2574&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" />
                                     <span className="text-xs uppercase relative z-10">Cambiar</span>
                                 </div>
                             </div>
                             <div className="space-y-6">
                                <InputField label="Nombre Completo" placeholder="Alexandros" />
                                <InputField label="Bio" placeholder="Breve descripción..." />
                             </div>
                        </div>
                    </section>
                </ScrollReveal>

                {/* Section Security */}
                 <ScrollReveal delay={200}>
                    <section>
                        <h3 className="text-xs font-bold tracking-[0.2em] text-red-400 uppercase mb-8 border-b border-white/10 pb-4">Seguridad</h3>
                        <div className="space-y-4 max-w-md">
                            <InputField label="Contraseña Actual" type="password" placeholder="••••••••" icon={Lock} />
                            <InputField label="Nueva Contraseña" type="password" placeholder="••••••••" icon={Lock} />
                            <div className="pt-4">
                                <ButtonPrimary>Actualizar Claves</ButtonPrimary>
                            </div>
                        </div>
                    </section>
                </ScrollReveal>
            </div>
        </div>
    )
}

// --- App Root ---

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [authInitialMode, setAuthInitialMode] = useState<'login'|'register'|'recover'>('login');
    const [postLoginRedirect, setPostLoginRedirect] = useState<null | 'studio'>(null);
    const [privateView, setPrivateView] = useState('explore');
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMove = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);

    const handleLoginClick = (mode: 'login'|'register'|'recover' = 'login') => { setAuthInitialMode(mode); setShowAuth(true); };
    const handleLoginSuccess = () => {
        setShowAuth(false);
        setIsAuthenticated(true);
        window.scrollTo(0,0);
        if (postLoginRedirect === 'studio') {
            setPrivateView('profile');
            setPostLoginRedirect(null);
        }
    };

    const goToStudio = () => {
        if (isAuthenticated) {
            setPrivateView('profile');
        } else {
            // open auth modal defaulting to login and remember redirect
            setAuthInitialMode('login');
            setPostLoginRedirect('studio');
            setShowAuth(true);
        }
    };

    return (
        <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-blue-500 selection:text-white cursor-default">
            <div className="fixed w-2 h-2 bg-white rounded-full pointer-events-none z-[200] mix-blend-difference hidden md:block" style={{ left: cursorPos.x, top: cursorPos.y, transform: 'translate(-50%, -50%)' }}></div>
            <div className="fixed w-8 h-8 border border-white rounded-full pointer-events-none z-[200] transition-all duration-100 ease-out hidden md:block mix-blend-difference" style={{ left: cursorPos.x, top: cursorPos.y, transform: 'translate(-50%, -50%)' }}></div>
            <div className="fixed inset-0 opacity-[0.04] pointer-events-none z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

            {!isAuthenticated ? (
                <>
                    <LandingPage onLoginClick={handleLoginClick} onGoStudio={goToStudio} />
                    {showAuth && <AuthView initialMode={authInitialMode} onLoginSuccess={handleLoginSuccess} onBack={() => setShowAuth(false)} />}
                </>
            ) : (
                <PrivateLayout currentView={privateView} onViewChange={setPrivateView} onLogout={() => setIsAuthenticated(false)}>
                    {privateView === 'explore' && <ExploreView />}
                    {privateView === 'profile' && <ProfileView />}
                    {privateView === 'settings' && <SettingsView />}
                </PrivateLayout>
            )}

            <AppStyles />
        </div>
    );
}