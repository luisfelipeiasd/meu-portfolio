import { useEffect } from 'react';
import { Service } from '../types';
import { X, Check, Laptop, Diamond, Smartphone, Code, PenTool, Globe, Rocket, Monitor } from 'lucide-react';

interface ServiceModalProps {
  service: Service | null;
  onClose: () => void;
}

// Map of icon names to Lucide components
const iconMap: Record<string, any> = {
  Laptop,
  Diamond,
  Smartphone,
  Code,
  PenTool,
  Globe,
  Rocket,
  Monitor
};

export default function ServiceModal({ service, onClose }: ServiceModalProps) {
  useEffect(() => {
    if (service) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [service]);

  if (!service) return null;

  const IconComponent = iconMap[service.icon] || Laptop;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl animate-fade-in-up">
        <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-accent-glow/20 rounded-2xl flex items-center justify-center mb-6 border border-accent-glow/30 shadow-[0_0_30px_rgba(44,107,255,0.2)]">
            <IconComponent className="text-accent-glow w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{service.title}</h2>
          <p className="text-text-muted text-lg">{service.short_description}</p>
        </div>

        <div className="space-y-8">
          <div className="bg-white/5 p-6 rounded-xl border border-white/5">
            <h3 className="text-white font-bold uppercase text-sm tracking-widest mb-4 border-b border-white/10 pb-2">Sobre o Serviço</h3>
            <p className="text-text-muted leading-relaxed whitespace-pre-line">
              {service.full_description}
            </p>
          </div>

          {service.features && service.features.length > 0 && (
            <div>
              <h3 className="text-white font-bold uppercase text-sm tracking-widest mb-6 border-b border-white/10 pb-2">O que entregamos</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="mt-1 min-w-[20px]">
                      <Check size={16} className="text-accent-glow" />
                    </div>
                    <span className="text-text-muted text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-center">
          <a 
            href="#contact" 
            onClick={onClose}
            className="px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-blue-600 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
          >
            Solicitar Orçamento
          </a>
        </div>
      </div>
    </div>
  );
}
