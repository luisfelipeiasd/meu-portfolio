import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { clsx } from 'clsx';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-bg-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="relative group">
            <span className="font-heading font-bold text-2xl tracking-tighter text-white z-10 relative uppercase">
              LUÍS <span className="text-accent-glow">FELIPE</span>
            </span>
            <div className="absolute -inset-2 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/#about" className="text-sm font-medium text-text-muted hover:text-white transition-colors relative group">
              Sobre
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent-glow transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/#services" className="text-sm font-medium text-text-muted hover:text-white transition-colors relative group">
              Serviços
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent-glow transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/#experience" className="text-sm font-medium text-text-muted hover:text-white transition-colors relative group">
              Experiências
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent-glow transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/#portfolio" className="text-sm font-medium text-text-muted hover:text-white transition-colors relative group">
              Portfólio
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent-glow transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/#testimonials" className="text-sm font-medium text-text-muted hover:text-white transition-colors relative group">
              Depoimentos
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent-glow transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="/#contact"
              className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
            >
              Contato
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white text-xl p-2 z-50"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/95 z-40 flex flex-col items-center justify-center gap-8 transition-all duration-500 backdrop-blur-xl",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        )}
      >
        <a href="/#about" onClick={() => setIsOpen(false)} className="text-3xl font-heading font-bold hover:text-accent-glow transition-all transform hover:scale-110">
          Sobre
        </a>
        <a href="/#services" onClick={() => setIsOpen(false)} className="text-3xl font-heading font-bold hover:text-accent-glow transition-all transform hover:scale-110">
          Serviços
        </a>
        <a href="/#experience" onClick={() => setIsOpen(false)} className="text-3xl font-heading font-bold hover:text-accent-glow transition-all transform hover:scale-110">
          Experiências
        </a>
        <a href="/#portfolio" onClick={() => setIsOpen(false)} className="text-3xl font-heading font-bold hover:text-accent-glow transition-all transform hover:scale-110">
          Portfólio
        </a>
        <a href="/#testimonials" onClick={() => setIsOpen(false)} className="text-3xl font-heading font-bold hover:text-accent-glow transition-all transform hover:scale-110">
          Depoimentos
        </a>
        <a
          href="/#contact"
          onClick={() => setIsOpen(false)}
          className="px-10 py-4 bg-primary text-white rounded-full font-bold shadow-[0_0_30px_rgba(0,51,204,0.4)] hover:scale-105 active:scale-95 transition-all"
        >
          Fale Comigo
        </a>
      </div>
    </>
  );
}
