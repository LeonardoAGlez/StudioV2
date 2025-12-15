import React, { useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useParallax, ScrollReveal, ButtonPrimary } from '../components/ui/SharedUI';

const HERO_IMAGE_ALT = 'https://images.unsplash.com/photo-1552355170-c8337700279c?q=80&w=2671&auto=format&fit=crop';

export const PublicNavbar = ({ onLoginClick }: any) => (
  <nav className="fixed top-0 left-0 w-full z-50 px-6 py-8 md:px-12 flex justify-between items-center mix-blend-difference text-white">
    <div className="text-xl font-serif tracking-widest font-bold z-50 cursor-pointer">MUSEUM<span className="text-blue-400">.AI</span></div>
    <div className="hidden md:flex items-center gap-12 z-50">
      {['Artistas', 'Manifiesto', 'Eventos'].map((item) => (
        <a key={item} href="#" className="text-[10px] uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors relative group">{item}</a>
      ))}
      <div className="h-4 w-px bg-white/30"></div>
      <button onClick={onLoginClick} className="text-[10px] uppercase tracking-[0.2em] font-bold hover:text-blue-400 transition-colors">Iniciar Sesión</button>
      <button onClick={onLoginClick} className="px-6 py-2 border border-white/30 hover:bg-white hover:text-black hover:border-white transition-all text-[10px] uppercase tracking-[0.2em]">Unirse</button>
    </div>
    <button className="md:hidden text-white z-50"><ChevronDown /></button>
  </nav>
);

export const LandingHero = ({ onScrollDown }: any) => {
  const yPos = useParallax(0.3);
  return (
    <header className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0 overflow-hidden" style={{ transform: `translateY(${yPos}px)` }}>
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img src={HERO_IMAGE_ALT} alt="Renaissance Statue" className="w-full h-[120%] object-cover opacity-80 animate-slow-zoom" />
      </div>
      <div className="relative z-20 text-center px-6 mix-blend-difference">
        <ScrollReveal>
          <p className="text-xs md:text-sm tracking-[0.4em] uppercase text-white/80 mb-6">La nueva era del arte</p>
          <h1 className="text-6xl md:text-9xl font-serif text-white mb-6 italic tracking-tight">Renaissance</h1>
        </ScrollReveal>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce-slow cursor-pointer" onClick={onScrollDown}>
          <span className="text-[10px] uppercase tracking-widest mb-2 text-white/60">Descubre</span>
          <ChevronDown className="text-white/60" />
        </div>
      </div>
    </header>
  );
};

export const LandingSectionWho = () => (
  <section className="py-32 px-6 md:px-24 bg-[#050505] relative border-b border-white/5">
    <div className="grid md:grid-cols-2 gap-24 items-center max-w-7xl mx-auto">
      <div>
        <ScrollReveal>
          <span className="block text-blue-400 text-xs tracking-[0.3em] uppercase mb-4">¿Quiénes Somos?</span>
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-8 leading-tight">Arquitectos de la Imaginación Digital</h2>
          <p className="text-white/60 font-light leading-loose text-lg mb-12">No somos solo una plataforma, somos el lienzo donde la inteligencia artificial y la sensibilidad humana convergen.</p>
        </ScrollReveal>
      </div>
      <div className="relative h-[600px] w-full hidden md:block overflow-hidden">
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

export const LandingFooterCTA = ({ onLoginClick }: any) => (
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

export const LandingPage = ({ onLoginClick }: any) => {
  const whoSectionRef = useRef<HTMLDivElement>(null);
  const scrollToContent = () => whoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden">
      <PublicNavbar onLoginClick={onLoginClick} />
      <LandingHero onScrollDown={scrollToContent} />
      <div ref={whoSectionRef}>
        <LandingSectionWho />
      </div>
      <LandingFooterCTA onLoginClick={onLoginClick} />
    </div>
  );
};

export default LandingPage;
