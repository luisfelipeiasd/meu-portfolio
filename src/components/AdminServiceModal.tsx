import React, { useState, useEffect } from 'react';
import { Service } from '../types';
import { supabase } from '../lib/supabase';
import { X, Plus, Trash, Laptop, Diamond, Smartphone, Code, PenTool, Globe, Rocket, Monitor, Megaphone, Camera, Video, Palette, Layers, Box, Cpu, Zap, Target, Search } from 'lucide-react';
import { clsx } from 'clsx';

interface AdminServiceModalProps {
  service: Service | null;
  onClose: () => void;
  onSave: () => void;
}

const iconList = [
  'Laptop', 'Diamond', 'Smartphone', 'Code', 'PenTool', 'Globe', 'Rocket', 'Monitor',
  'Megaphone', 'Camera', 'Video', 'Palette', 'Layers', 'Box', 'Cpu', 'Zap', 'Target', 'Search'
];

const iconMap: Record<string, any> = {
  Laptop, Diamond, Smartphone, Code, PenTool, Globe, Rocket, Monitor,
  Megaphone, Camera, Video, Palette, Layers, Box, Cpu, Zap, Target, Search
};

export default function AdminServiceModal({ service, onClose, onSave }: AdminServiceModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    icon: 'Laptop',
    short_description: '',
    full_description: '',
    features: [],
  });
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title,
        icon: service.icon,
        short_description: service.short_description,
        full_description: service.full_description,
        features: service.features || [],
      });
    } else {
      setFormData({
        title: '',
        icon: 'Laptop',
        short_description: '',
        full_description: '',
        features: [],
      });
    }
  }, [service]);

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), featureInput.trim()],
      });
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: (formData.features || []).filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        icon: formData.icon,
        short_description: formData.short_description,
        full_description: formData.full_description,
        features: formData.features,
      };

      if (service?.id) {
        const { error } = await supabase.from('services').update(payload).eq('id', service.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('services').insert([payload]);
        if (error) throw error;
      }

      onSave();
      onClose();
    } catch (error: any) {
      alert('Error saving service: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-bg-card w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 rounded-2xl border border-white/10 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold font-heading">{service ? 'Editar Serviço' : 'Adicionar Serviço'}</h3>
          <button onClick={onClose} className="text-text-muted hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Título *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-accent-glow focus:outline-none text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Ícone *</label>
              <div className="grid grid-cols-6 gap-2 bg-black/30 border border-white/10 rounded-lg p-2 max-h-40 overflow-y-auto custom-scrollbar">
                {iconList.map((iconName) => {
                  const IconComponent = iconMap[iconName];
                  const isSelected = formData.icon === iconName;
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: iconName })}
                      className={clsx(
                        "flex items-center justify-center p-2 rounded-md transition-all",
                        isSelected ? "bg-accent-glow text-white shadow-lg shadow-accent-glow/20" : "text-text-muted hover:bg-white/10 hover:text-white"
                      )}
                      title={iconName}
                    >
                      <IconComponent size={20} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Descrição Curta *</label>
            <input
              type="text"
              required
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-accent-glow focus:outline-none text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Descrição Completa *</label>
            <textarea
              rows={5}
              required
              value={formData.full_description}
              onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-accent-glow focus:outline-none text-white"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Funcionalidades / Entregáveis</label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-accent-glow focus:outline-none text-white"
                placeholder="Adicionar funcionalidade..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
              {formData.features?.map((feature, index) => (
                <div key={index} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                  <span className="text-sm text-white">{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              ))}
            </div>
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
