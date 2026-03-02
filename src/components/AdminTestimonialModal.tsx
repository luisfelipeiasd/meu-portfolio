import React, { useState, useEffect, useRef } from 'react';
import { Testimonial } from '../types';
import { supabase } from '../lib/supabase';
import { X } from 'lucide-react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

interface AdminTestimonialModalProps {
  testimonial: Testimonial | null;
  onClose: () => void;
  onSave: () => void;
}

export default function AdminTestimonialModal({ testimonial, onClose, onSave }: AdminTestimonialModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    author_name: '',
    author_role: '',
    content: '',
  });
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const cropperRef = useRef<ReactCropperElement>(null);

  useEffect(() => {
    if (testimonial) {
      setFormData({
        author_name: testimonial.author_name,
        author_role: testimonial.author_role,
        content: testimonial.content,
      });
      // We don't load the existing image into the cropper, just show it separately if needed
    } else {
      setFormData({
        author_name: '',
        author_role: '',
        content: '',
      });
    }
    setImageSrc(null);
    setCroppedBlob(null);
  }, [testimonial]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.getCroppedCanvas({
        width: 400,
        height: 400,
        fillColor: '#000'
      }).toBlob((blob) => {
        setCroppedBlob(blob);
      }, 'image/webp', 0.9);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: Partial<Testimonial> = {
        author_name: formData.author_name,
        author_role: formData.author_role,
        content: formData.content,
      };

      if (croppedBlob) {
        const fileName = `avatar_${Date.now()}.webp`;
        const { error: uploadErr } = await supabase.storage
          .from('avatars')
          .upload(fileName, croppedBlob, { contentType: 'image/webp' });

        if (uploadErr) throw uploadErr;

        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
        payload.avatar_url = publicUrl;
        payload.storage_path = fileName;
      }

      if (testimonial?.id) {
        const { error } = await supabase.from('testimonials').update(payload).eq('id', testimonial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('testimonials').insert([payload]);
        if (error) throw error;
      }

      onSave();
      onClose();
    } catch (error: any) {
      alert('Error saving testimonial: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-bg-card w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 rounded-2xl border border-white/10 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold font-heading">{testimonial ? 'Editar Depoimento' : 'Adicionar Depoimento'}</h3>
          <button onClick={onClose} className="text-text-muted hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Nome *</label>
              <input
                type="text"
                required
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-accent-glow focus:outline-none text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Cargo / Empresa</label>
              <input
                type="text"
                value={formData.author_role}
                onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-accent-glow focus:outline-none text-white"
                placeholder="Ex: CEO na Empresa, Founder"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Depoimento *</label>
            <textarea
              rows={4}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-accent-glow focus:outline-none text-white"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Avatar (1:1 Obrigatório)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 mb-2 text-white"
              />
              <p className="text-xs text-text-muted">Faça o upload e ajuste o corte abaixo. O recorte será transformado em quadrado perfeito.</p>
            </div>
            <div className="flex justify-center flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/10 bg-black/50 mb-2">
                {croppedBlob ? (
                  <img src={URL.createObjectURL(croppedBlob)} className="w-full h-full object-cover" />
                ) : testimonial?.avatar_url ? (
                  <img src={testimonial.avatar_url} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-xs text-gray-500">Sem Avatar</div>
                )}
              </div>
            </div>
          </div>

          {imageSrc && (
            <div className="w-full bg-black/80 rounded border border-white/10 p-2">
              <p className="text-xs text-accent-glow font-bold mb-2">Ajuste a imagem para cropar:</p>
              <Cropper
                src={imageSrc}
                style={{ height: 400, width: '100%' }}
                aspectRatio={1}
                guides={true}
                ref={cropperRef}
                viewMode={1}
                dragMode="move"
                cropBoxMovable={true}
                cropBoxResizable={true}
                background={false}
                responsive={true}
                checkOrientation={false} 
              />
              <div className="flex gap-2 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => { setImageSrc(null); setCroppedBlob(null); }}
                  className="px-3 py-1 bg-gray-800 text-white rounded text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCrop}
                  className="px-3 py-1 bg-accent-glow text-white rounded text-xs font-bold"
                >
                  Aplicar Corte
                </button>
              </div>
            </div>
          )}

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
