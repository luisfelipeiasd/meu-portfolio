import { useEffect, useState } from 'react';
import { Project } from '../types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
      setCurrentSlide(0);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [project]);

  if (!project) return null;

  // Extract video_url from description if present
  const description = project.description || '';
  const videoMatch = description.match(/\[VIDEO::(.*?)\]/);
  const cleanDescription = description.replace(/\[VIDEO::.*?\]/, '').trim();
  const videoUrl = videoMatch ? videoMatch[1] : null;

  const images = project.project_images && project.project_images.length > 0
    ? project.project_images
    : [{ image_url: 'https://placehold.co/800x600?text=Projeto', id: 'placeholder', display_order: 0, project_id: project.id, storage_path: '' }];

  // Helper to process Google Drive URLs for embedding
  const getEmbedUrl = (url: string) => {
    if (url.includes('drive.google.com')) {
      return url.replace('/view', '/preview');
    }
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        // Simple YouTube embed transformation
        const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
        return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  const hasVideo = !!videoUrl;
  const totalSlides = images.length + (hasVideo ? 1 : 0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const renderTextWithLinks = (text: string) => {
    if (!text) return null;
    return text.split(/(https?:\/\/[^\s]+)/g).map((part, i) => 
      part.match(/https?:\/\/[^\s]+/) ? (
        <a 
          key={i} 
          href={part} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-accent-glow hover:underline break-all"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      ) : part
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-bg-card w-full max-w-6xl max-h-[92vh] md:max-h-[90vh] overflow-hidden flex flex-col md:flex-row rounded-xl shadow-2xl border border-white/10">
        
        {/* Carousel */}
        <div className="w-full md:w-2/3 h-[40vh] sm:h-[50vh] md:h-[80vh] bg-black relative group select-none flex items-center justify-center">
          <div className="w-full h-full relative">
             {/* Video Slide (if exists, it's the first one, index 0) */}
             {hasVideo && (
                <div 
                    className={clsx(
                    "absolute inset-0 transition-opacity duration-500 flex items-center justify-center p-4",
                    currentSlide === 0 ? "opacity-100 z-10" : "opacity-0 z-0"
                    )}
                >
                    <iframe 
                        src={getEmbedUrl(videoUrl!)} 
                        className="w-full h-full rounded-lg shadow-2xl" 
                        allow="autoplay; encrypted-media" 
                        allowFullScreen
                        title={project.title}
                    ></iframe>
                </div>
             )}

             {/* Image Slides */}
             {images.map((img, index) => {
               const slideIndex = hasVideo ? index + 1 : index;
               return (
                <div 
                    key={img.id} 
                    className={clsx(
                    "absolute inset-0 transition-opacity duration-500 flex items-center justify-center p-4",
                    slideIndex === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                    )}
                >
                    <img 
                    src={img.image_url} 
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]" 
                    alt={`${project.title} - Image ${index + 1}`}
                    />
                </div>
               );
             })}
          </div>

          {totalSlides > 1 && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/80 border border-white/10 text-white rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-20"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/80 border border-white/10 text-white rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-20"
              >
                <ChevronRight size={20} />
              </button>
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {Array.from({ length: totalSlides }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }}
                    className={clsx(
                      "w-2 h-2 rounded-full transition-all",
                      idx === currentSlide ? "bg-accent-glow w-4" : "bg-white/50"
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="w-full md:w-1/3 p-6 md:p-12 flex flex-col bg-bg-card overflow-y-auto max-h-[52vh] md:max-h-full custom-scrollbar">
          <div className="flex justify-between items-start mb-6 sticky top-0 bg-bg-card z-10 pb-2 border-b border-white/5 md:border-none md:pb-0 md:static">
             <div>
                <span className="text-accent-glow text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 md:mb-2 block">
                    {project.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-heading font-bold leading-tight">{project.title}</h2>
             </div>
             <button onClick={onClose} className="text-white/50 hover:text-white p-2 -mr-2">
                <X size={24} />
             </button>
          </div>
          
          <div className="text-text-muted leading-relaxed mb-8 text-sm space-y-6">
            <p>{renderTextWithLinks(cleanDescription)}</p>
            
            {project.challenge && (
              <div>
                <h4 className="text-white text-xs font-bold uppercase mb-2 tracking-wider">O Desafio</h4>
                <p>{renderTextWithLinks(project.challenge)}</p>
              </div>
            )}
            
            {project.solution && (
              <div>
                <h4 className="text-white text-xs font-bold uppercase mb-2 tracking-wider">A Solução</h4>
                <p>{renderTextWithLinks(project.solution)}</p>
              </div>
            )}
          </div>

          <div className="mt-auto pt-6 border-t border-white/5">
            <h4 className="text-white text-xs font-bold uppercase mb-3">Tecnologias</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((tech, i) => (
                <span key={i} className="px-3 py-1 border border-white/10 rounded-full text-[10px] uppercase tracking-wide text-text-muted bg-white/5 hover:bg-white/10 transition-colors cursor-default">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
