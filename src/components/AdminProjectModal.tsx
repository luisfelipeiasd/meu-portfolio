import React, { useState, useEffect } from 'react';
import { Project, ProjectImage } from '../types';
import { supabase } from '../lib/supabase';
import { X, Upload, Trash } from 'lucide-react';

interface AdminProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onSave: () => void;
}

export default function AdminProjectModal({ project, onClose, onSave }: AdminProjectModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    category: '',
    description: '',
    challenge: '',
    solution: '',
    technologies: [],
    video_url: '',
  });
  const [techInput, setTechInput] = useState('');
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ProjectImage[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]); // IDs of images to delete

  useEffect(() => {
    if (project) {
      // Extract video_url from description if present
      const description = project.description || '';
      const videoMatch = description.match(/\[VIDEO::(.*?)\]/);
      const cleanDescription = description.replace(/\[VIDEO::.*?\]/, '').trim();
      const extractedVideoUrl = videoMatch ? videoMatch[1] : '';

      setFormData({
        title: project.title,
        category: project.category,
        description: cleanDescription,
        challenge: project.challenge || '',
        solution: project.solution || '',
        technologies: project.technologies || [],
        video_url: extractedVideoUrl,
      });
      setTechInput(project.technologies?.join(', ') || '');
      setExistingImages(project.project_images || []);
    } else {
      setFormData({
        title: '',
        category: '',
        description: '',
        challenge: '',
        solution: '',
        technologies: [],
        video_url: '',
      });
      setTechInput('');
      setExistingImages([]);
    }
    setNewImages([]);
    setImagesToDelete([]);
  }, [project]);

  const handleDeleteExistingImage = (imageId: string) => {
    setImagesToDelete([...imagesToDelete, imageId]);
    setExistingImages(existingImages.filter(img => img.id !== imageId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Manual Validation
    if (!formData.title?.trim()) {
      alert('Por favor, preencha o Título.');
      return;
    }
    if (!formData.category) {
      alert('Por favor, selecione uma Categoria.');
      return;
    }
    if (!project && existingImages.length === 0 && newImages.length === 0) {
       alert('Por favor, adicione pelo menos uma imagem.');
       return;
    }

    setLoading(true);

    try {
      const techArray = techInput.split(',').map((t) => t.trim()).filter((t) => t.length > 0);
      
      let projectId = project?.id;

      // Embed video_url into description
      let finalDescription = formData.description || '';
      if (formData.video_url && formData.video_url.trim()) {
          finalDescription = `${finalDescription}\n\n[VIDEO::${formData.video_url.trim()}]`;
      }

      const projectData = {
        title: formData.title,
        category: formData.category,
        description: finalDescription,
        challenge: formData.challenge,
        solution: formData.solution,
        technologies: techArray,
        // video_url removed from here to avoid DB error
      };

      if (projectId) {
        const { error } = await supabase.from('projects').update(projectData).eq('id', projectId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('projects').insert([projectData]).select().single();
        if (error) throw error;
        projectId = data.id;
      }

      // Handle Image Deletions
      if (imagesToDelete.length > 0) {
        // First get paths to delete from storage
        const { data: imagesData } = await supabase
            .from('project_images')
            .select('storage_path')
            .in('id', imagesToDelete);
        
        if (imagesData && imagesData.length > 0) {
            const paths = imagesData.map(img => img.storage_path);
            await supabase.storage.from('portfolio').remove(paths);
        }

        // Then delete from DB
        await supabase.from('project_images').delete().in('id', imagesToDelete);
      }

      // Handle New Images
      if (newImages.length > 0 && projectId) {
        const insertPayload = [];
        // Determine starting order index based on existing images count (minus deleted ones)
        let startIndex = existingImages.length; 

        for (let i = 0; i < newImages.length; i++) {
          const file = newImages[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${projectId}/${Date.now()}_${i}.${fileExt}`;

          const { error: uploadErr } = await supabase.storage
            .from('portfolio')
            .upload(fileName, file, { cacheControl: '3600', upsert: false });

          if (uploadErr) throw uploadErr;

          const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(fileName);

          insertPayload.push({
            project_id: projectId,
            storage_path: fileName,
            image_url: publicUrl,
            display_order: startIndex + i
          });
        }

        if (insertPayload.length > 0) {
            await supabase.from('project_images').insert(insertPayload);
        }
      }

      onSave();
      onClose();
    } catch (error: any) {
      alert('Error saving project: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-bg-card w-full max-w-3xl max-h-[92vh] md:max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl custom-scrollbar">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-bg-card z-10 pb-2 md:static md:pb-0">
          <h3 className="text-xl md:text-2xl font-bold font-heading">{project ? 'Editar Projeto' : 'Adicionar Projeto'}</h3>
          <button onClick={onClose} className="text-text-muted hover:text-white p-2">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Título *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-accent-glow focus:outline-none text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Categoria *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-accent-glow focus:outline-none text-white appearance-none"
              >
                <option value="" disabled>Selecione uma categoria</option>
                <option value="websites">Websites</option>
                <option value="design">Design</option>
                <option value="motion">Motion</option>
                <option value="video">Vídeos</option>
                <option value="impressos">Impressos</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Descrição</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-accent-glow focus:outline-none text-white"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase">O Desafio</label>
              <textarea
                rows={3}
                value={formData.challenge}
                onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-accent-glow focus:outline-none text-white"
              ></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase">A Solução</label>
              <textarea
                rows={3}
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-accent-glow focus:outline-none text-white"
              ></textarea>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Tecnologias (separadas por vírgula)</label>
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-accent-glow focus:outline-none text-white"
              placeholder="HTML, CSS, GSAP"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted mb-2 uppercase">URL do Vídeo (Google Drive ou YouTube)</label>
            <input
              type="text"
              value={formData.video_url || ''}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-accent-glow focus:outline-none text-white"
              placeholder="https://drive.google.com/file/d/..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted mb-2 uppercase">
                {project ? 'Adicionar mais imagens' : 'Imagens do Projeto *'}
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setNewImages(Array.from(e.target.files || []))}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white"
            />
            
            {existingImages.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-text-muted mb-2 uppercase">Imagens Atuais</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {existingImages.map((img) => (
                    <div key={img.id} className="relative group rounded overflow-hidden border border-white/20">
                        <img src={img.image_url} className="w-full h-20 object-cover" />
                        <button
                            type="button"
                            onClick={() => handleDeleteExistingImage(img.id)}
                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
                        >
                            <Trash size={20} />
                        </button>
                    </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-white/20 rounded-md hover:bg-white/5 transition-all text-sm font-bold text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-all text-sm font-bold flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
