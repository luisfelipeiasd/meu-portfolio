import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Experience } from '../types';

interface AdminExperienceModalProps {
  experience: Experience | null;
  initialType?: 'experience' | 'education';
  onClose: () => void;
  onSave: () => void;
}

export default function AdminExperienceModal({ experience, initialType = 'experience', onClose, onSave }: AdminExperienceModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    period: '',
    description: '',
    type: initialType,
    display_order: 0
  });

  useEffect(() => {
    if (experience) {
      setFormData({
        company: experience.company,
        role: experience.role,
        period: experience.period,
        description: experience.description || '',
        type: experience.type,
        display_order: experience.display_order
      });
    } else {
      setFormData({
        company: '',
        role: '',
        period: '',
        description: '',
        type: initialType,
        display_order: 0
      });
    }
  }, [experience, initialType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (experience) {
        const { error } = await supabase
          .from('experiences')
          .update(formData)
          .eq('id', experience.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('experiences')
          .insert([formData]);
        if (error) throw error;
      }
      onSave();
      onClose();
    } catch (error: any) {
      alert('Erro ao salvar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-bg-card border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-bg-card z-10">
          <h2 className="text-xl font-heading font-bold text-white">
            {experience ? 'Editar Item' : 'Novo Item'}
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Tipo</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'experience' | 'education' })}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-accent-glow focus:outline-none text-white"
              >
                <option value="experience">Experiência Profissional</option>
                <option value="education">Formação Acadêmica</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Ordem de Exibição</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-accent-glow focus:outline-none text-white"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase">
                {formData.type === 'experience' ? 'Empresa' : 'Instituição'}
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-accent-glow focus:outline-none text-white"
                placeholder={formData.type === 'experience' ? 'Nome da Empresa' : 'Nome da Instituição'}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase">
                {formData.type === 'experience' ? 'Cargo' : 'Curso / Título'}
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-accent-glow focus:outline-none text-white"
                placeholder={formData.type === 'experience' ? 'Ex: Designer Sênior' : 'Ex: MBA em Marketing'}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Período</label>
            <input
              type="text"
              required
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-accent-glow focus:outline-none text-white"
              placeholder="Ex: Jan 2023 - Presente"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Descrição (Opcional)</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-accent-glow focus:outline-none text-white"
              placeholder="Descreva as responsabilidades ou detalhes do curso..."
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-text-muted hover:text-white font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
