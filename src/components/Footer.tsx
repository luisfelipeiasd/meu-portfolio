import { Link } from 'react-router-dom';
import { Instagram, Linkedin } from 'lucide-react';

const BehanceIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    width="24" 
    height="24"
  >
    <path d="M20.55 7.49h-3.28v1.25h3.28V7.49zM6.64 7.25c-2.3 0-4.04 1.56-4.04 4.22 0 2.72 1.8 4.34 4.25 4.34 2.05 0 3.31-1.03 3.8-2.53h-2.09c-.25.56-.78.84-1.56.84-.97 0-1.63-.66-1.72-1.84h5.44v-.37c0-2.88-1.72-4.66-4.08-4.66zm-1.66 3.31c.09-1.03.72-1.59 1.63-1.59.91 0 1.5.59 1.59 1.59h-3.22zm10.97-3.31c-2.47 0-4.16 1.63-4.16 4.34 0 2.63 1.66 4.34 4.25 4.34 2.34 0 3.75-1.25 4.09-3.09h-2.13c-.25.81-.88 1.34-1.84 1.34-1.28 0-2.03-.84-2.06-2.16h6.16v-.5c0-2.69-1.69-4.28-4.31-4.28zm-2.03 3.19c.13-1.09.91-1.66 1.97-1.66 1.09 0 1.81.59 1.91 1.66h-3.88z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 bg-black text-center md:text-left">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-text-muted text-sm">
        <p>&copy; 2026 Luís Felipe. Todos os direitos reservados.</p>
        <div className="flex gap-6 mt-4 md:mt-0 items-center">
          <a href="https://www.instagram.com/_luislipearaujo/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <Instagram size={20} />
          </a>
          <a href="https://www.linkedin.com/in/luislipearaujo/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <Linkedin size={20} />
          </a>
          <a href="https://www.behance.net/luisfearaujo4" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <BehanceIcon className="w-5 h-5" />
          </a>
          <Link to="/admin" className="hover:text-white opacity-50 hover:opacity-100 transition-opacity ml-4">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
