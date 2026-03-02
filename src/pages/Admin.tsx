import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Project, Testimonial, Service, Experience } from '../types';
import AdminProjectModal from '../components/AdminProjectModal';
import AdminTestimonialModal from '../components/AdminTestimonialModal';
import AdminServiceModal from '../components/AdminServiceModal';
import AdminExperienceModal from '../components/AdminExperienceModal';
import { LogOut, Plus, Edit, Trash, Loader2, Laptop, Diamond, Smartphone, Code, PenTool, Globe, Rocket, Monitor, Settings, Save, Briefcase, GraduationCap } from 'lucide-react';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

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

export default function Admin() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentTab, setCurrentTab] = useState<'projects' | 'testimonials' | 'services' | 'experiences' | 'education' | 'settings'>('projects');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Experience[]>([]);
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);

  const [contactEmail, setContactEmail] = useState('');
  const [settingsLoading, setSettingsLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      loadData();
    }
  }, [session, currentTab]);

  const loadData = async () => {
    setLoading(true);
    if (currentTab === 'projects') {
      const { data, error } = await supabase
        .from('projects')
        .select('*, project_images(*)')
        .order('created_at', { ascending: false })
        .order('display_order', { foreignTable: 'project_images', ascending: true });
      if (error) {
        console.error('Error loading projects:', error);
        alert('Erro ao carregar projetos: ' + error.message);
      } else {
        setProjects(data || []);
      }
    } else if (currentTab === 'testimonials') {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error loading testimonials:', error);
        alert('Erro ao carregar depoimentos: ' + error.message);
      } else {
        setTestimonials(data || []);
      }
    } else if (currentTab === 'services') {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error loading services:', error);
        alert('Erro ao carregar serviços: ' + error.message);
      } else {
        setServices(data || []);
      }
    } else if (currentTab === 'experiences') {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('type', 'experience')
        .order('display_order', { ascending: true });
      if (error) {
        console.warn('Error loading experiences:', error);
        setExperiences([]);
      } else {
        setExperiences(data || []);
      }
    } else if (currentTab === 'education') {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('type', 'education')
        .order('display_order', { ascending: true });
      if (error) {
        console.warn('Error loading education:', error);
        setEducations([]);
      } else {
        setEducations(data || []);
      }
    } else if (currentTab === 'settings') {
        const { data, error } = await supabase
            .from('settings')
            .select('value')
            .eq('key', 'contact_email')
            .single();
        if (!error && data) setContactEmail(data.value);
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
      e.preventDefault();
      setSettingsLoading(true);
      
      // Check if setting exists
      const { data: existing } = await supabase
        .from('settings')
        .select('id')
        .eq('key', 'contact_email')
        .single();

      let error;
      if (existing) {
          const { error: updateError } = await supabase
            .from('settings')
            .update({ value: contactEmail })
            .eq('key', 'contact_email');
          error = updateError;
      } else {
          const { error: insertError } = await supabase
            .from('settings')
            .insert([{ key: 'contact_email', value: contactEmail }]);
          error = insertError;
      }

      if (error) {
          alert('Erro ao salvar configurações: ' + error.message);
      } else {
          alert('Configurações salvas com sucesso!');
      }
      setSettingsLoading(false);
  };

  const handleDelete = async (id: string, type: 'project' | 'testimonial' | 'service' | 'experience') => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;

    try {
      setLoading(true);
      console.log(`Attempting to delete ${type} with id: ${id}`);

      let deleteError = null;
      let deletedCount = null;

      if (type === 'project') {
        const project = projects.find(p => p.id === id);
        
        // Try to delete images from storage, but don't block
        if (project?.project_images && project.project_images.length > 0) {
          try {
            const paths = project.project_images.map(img => img.storage_path).filter(Boolean);
            if (paths.length > 0) {
              const { error: storageError } = await supabase.storage.from('portfolio').remove(paths);
              if (storageError) console.warn('Warning: Could not remove project images (non-fatal):', storageError);
            }
          } catch (storageErr) {
             console.warn('Exception removing project images:', storageErr);
          }
        }

        const { data, error } = await supabase.from('projects').delete().eq('id', id).select('id');
        deleteError = error;
        deletedCount = data?.length || 0;

      } else if (type === 'testimonial') {
        const testimonial = testimonials.find(t => t.id === id);
        
        // Try to remove avatar if it exists, but don't block deletion if it fails
        if (testimonial?.storage_path) {
          try {
            const { error: storageError } = await supabase.storage.from('avatars').remove([testimonial.storage_path]);
            if (storageError) {
              console.warn('Warning: Could not remove avatar file. Proceeding with record deletion.', storageError);
            }
          } catch (storageErr) {
            console.warn('Exception removing avatar file:', storageErr);
          }
        }

        const { data, error } = await supabase.from('testimonials').delete().eq('id', id).select('id');
        deleteError = error;
        deletedCount = data?.length || 0;

      } else if (type === 'service') {
        const { data, error } = await supabase.from('services').delete().eq('id', id).select('id');
        deleteError = error;
        deletedCount = data?.length || 0;

      } else if (type === 'experience') {
        const { data, error } = await supabase.from('experiences').delete().eq('id', id).select('id');
        deleteError = error;
        deletedCount = data?.length || 0;
      }
      
      if (deleteError) throw deleteError;

      if (deletedCount === 0) {
        console.warn(`No rows deleted for ${type} with id ${id}. Check if ID exists or RLS policies.`);
        alert(`Atenção: O item parece já ter sido excluído ou você não tem permissão. A lista será atualizada.`);
      } else {
        alert('Item excluído com sucesso!');
      }

      await loadData();
      
    } catch (error: any) {
      console.error('Error deleting item:', error);
      alert(`Erro ao excluir item: ${error.message || 'Erro desconhecido'}. Verifique o console para mais detalhes.`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !session) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center text-white">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center p-6">
        <div className="glass-card p-8 md:p-12 rounded-3xl w-full max-w-md border border-white/10 bg-bg-card">
          <h2 className="text-3xl font-heading font-bold mb-8 text-center text-white">Luís Felipe Admin</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-accent-glow focus:outline-none focus:ring-1 focus:ring-accent-glow text-white"
                placeholder="admin@luisfelipe.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Senha</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-accent-glow focus:outline-none focus:ring-1 focus:ring-accent-glow text-white"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-blue-600 transition-all mt-4 flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          <div className="mt-4 text-center">
             <Link to="/" className="text-sm text-text-muted hover:text-white">Voltar para Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark text-text-main font-body flex flex-col">
      {/* Navbar */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <span className="font-heading font-bold text-xl tracking-tighter">LUÍS FELIPE ADMIN</span>
          <div className="flex gap-4 items-center">
             <Link to="/" className="text-sm font-medium text-text-muted hover:text-white transition-colors">Ver Site</Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 flex-1">
        {/* Tabs */}
        <div className="flex gap-8 border-b border-white/10 mb-8 overflow-x-auto">
          <button
            onClick={() => setCurrentTab('projects')}
            className={clsx(
              "pb-4 text-text-muted hover:text-white border-b-2 font-medium whitespace-nowrap px-2 transition-colors",
              currentTab === 'projects' ? "border-accent-glow text-white" : "border-transparent"
            )}
          >
            Projetos
          </button>
          <button
            onClick={() => setCurrentTab('testimonials')}
            className={clsx(
              "pb-4 text-text-muted hover:text-white border-b-2 font-medium whitespace-nowrap px-2 transition-colors",
              currentTab === 'testimonials' ? "border-accent-glow text-white" : "border-transparent"
            )}
          >
            Depoimentos
          </button>
          <button
            onClick={() => setCurrentTab('services')}
            className={clsx(
              "pb-4 text-text-muted hover:text-white border-b-2 font-medium whitespace-nowrap px-2 transition-colors",
              currentTab === 'services' ? "border-accent-glow text-white" : "border-transparent"
            )}
          >
            Serviços
          </button>
          <button
            onClick={() => setCurrentTab('experiences')}
            className={clsx(
              "pb-4 text-text-muted hover:text-white border-b-2 font-medium whitespace-nowrap px-2 transition-colors",
              currentTab === 'experiences' ? "border-accent-glow text-white" : "border-transparent"
            )}
          >
            Experiência
          </button>
          <button
            onClick={() => setCurrentTab('education')}
            className={clsx(
              "pb-4 text-text-muted hover:text-white border-b-2 font-medium whitespace-nowrap px-2 transition-colors",
              currentTab === 'education' ? "border-accent-glow text-white" : "border-transparent"
            )}
          >
            Formação
          </button>
          <button
            onClick={() => setCurrentTab('settings')}
            className={clsx(
              "pb-4 text-text-muted hover:text-white border-b-2 font-medium whitespace-nowrap px-2 transition-colors flex items-center gap-2",
              currentTab === 'settings' ? "border-accent-glow text-white" : "border-transparent"
            )}
          >
            <Settings size={16} /> Configurações
          </button>
        </div>

        {/* Header and Action */}
        {currentTab !== 'settings' && (
            <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-heading font-bold">
                {currentTab === 'projects' ? 'Gerenciar Projetos' : 
                 currentTab === 'testimonials' ? 'Gerenciar Depoimentos' : 
                 currentTab === 'services' ? 'Gerenciar Serviços' : 
                 currentTab === 'experiences' ? 'Gerenciar Experiência' :
                 'Gerenciar Formação'}
            </h1>
            <button
                onClick={() => {
                if (currentTab === 'projects') {
                    setSelectedProject(null);
                    setIsProjectModalOpen(true);
                } else if (currentTab === 'testimonials') {
                    setSelectedTestimonial(null);
                    setIsTestimonialModalOpen(true);
                } else if (currentTab === 'services') {
                    setSelectedService(null);
                    setIsServiceModalOpen(true);
                } else {
                    setSelectedExperience(null);
                    setIsExperienceModalOpen(true);
                }
                }}
                className="px-6 py-2 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition-all text-sm flex items-center gap-2"
            >
                <Plus size={16} /> Adicionar
            </button>
            </div>
        )}

        {/* List Containers */}
        <div className="grid gap-4">
          {loading ? (
            <div className="p-8 text-center text-text-muted flex justify-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : currentTab === 'projects' ? (
            projects.length === 0 ? (
              <div className="p-8 text-center text-text-muted border border-white/10 rounded-lg border-dashed">Nenhum projeto encontrado. Adicione o primeiro!</div>
            ) : (
              projects.map((p) => (
                <div key={p.id} className="glass-card p-4 rounded-xl flex items-center justify-between border border-white/5 hover:border-white/20 transition-all bg-white/5">
                  <div className="flex items-center gap-4">
                    <img 
                      src={p.project_images?.[0]?.image_url || 'https://placehold.co/150x100?text=Sem+Foto'} 
                      className="w-16 h-16 object-cover rounded shadow-md border border-white/10" 
                      alt={p.title}
                    />
                    <div>
                      <h4 className="font-bold text-lg">{p.title}</h4>
                      <span className="text-xs text-accent-glow uppercase tracking-widest font-bold">
                        {p.category === 'video' ? 'Vídeos' : p.category}
                      </span>
                      <div className="text-xs text-text-muted mt-1 max-w-sm break-words">
                        {p.description ? p.description.split(/(https?:\/\/[^\s]+)/g).map((part, i) => 
                          part.match(/https?:\/\/[^\s]+/) ? (
                            <a 
                              key={i} 
                              href={part} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-accent-glow hover:underline relative z-10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {part}
                            </a>
                          ) : part
                        ) : 'Sem descrição'}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setSelectedProject(p); setIsProjectModalOpen(true); }}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded flex items-center gap-1 text-sm font-bold text-white"
                    >
                      <Edit size={14} /> Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id, 'project')}
                      className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded flex items-center gap-1 text-sm font-bold"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
              ))
            )
          ) : currentTab === 'testimonials' ? (
            testimonials.length === 0 ? (
              <div className="p-8 text-center text-text-muted border border-white/10 rounded-lg border-dashed">Nenhum depoimento encontrado.</div>
            ) : (
              testimonials.map((t) => (
                <div key={t.id} className="glass-card p-4 rounded-xl flex items-center justify-between border border-white/5 hover:border-white/20 transition-all bg-white/5">
                  <div className="flex items-center gap-4">
                    <img 
                      src={t.avatar_url || 'https://placehold.co/100x100?text=Avatar'} 
                      className="w-16 h-16 object-cover rounded-full border border-white/10" 
                      alt={t.author_name}
                    />
                    <div>
                      <h4 className="font-bold text-lg">{t.author_name}</h4>
                      <span className="text-xs text-text-muted">{t.author_role}</span>
                      <div className="text-xs text-text-muted mt-1 w-64 truncate">"{t.content}"</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setSelectedTestimonial(t); setIsTestimonialModalOpen(true); }}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded flex items-center gap-1 text-sm font-bold text-white"
                    >
                      <Edit size={14} /> Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(t.id, 'testimonial')}
                      className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded flex items-center gap-1 text-sm font-bold"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
              ))
            )
          ) : currentTab === 'services' ? (
            services.length === 0 ? (
              <div className="p-8 text-center text-text-muted border border-white/10 rounded-lg border-dashed">Nenhum serviço encontrado. Adicione o primeiro!</div>
            ) : (
              services.map((s) => {
                const IconComponent = iconMap[s.icon] || Laptop;
                return (
                  <div key={s.id} className="glass-card p-4 rounded-xl flex items-center justify-between border border-white/5 hover:border-white/20 transition-all bg-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-accent-glow/20 rounded-lg flex items-center justify-center border border-white/10">
                        <IconComponent className="text-accent-glow w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{s.title}</h4>
                        <div className="text-xs text-text-muted mt-1 w-64 truncate">{s.short_description}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setSelectedService(s); setIsServiceModalOpen(true); }}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded flex items-center gap-1 text-sm font-bold text-white"
                      >
                        <Edit size={14} /> Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(s.id, 'service')}
                        className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded flex items-center gap-1 text-sm font-bold"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )
          ) : currentTab === 'experiences' ? (
            experiences.length === 0 ? (
              <div className="p-8 text-center text-text-muted border border-white/10 rounded-lg border-dashed">Nenhuma experiência encontrada. Adicione a primeira!</div>
            ) : (
              experiences.map((exp) => (
                <div key={exp.id} className="glass-card p-4 rounded-xl flex items-center justify-between border border-white/5 hover:border-white/20 transition-all bg-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-accent-glow/20 rounded-lg flex items-center justify-center border border-white/10">
                      <Briefcase className="text-accent-glow w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{exp.role}</h4>
                      <span className="text-xs text-accent-glow uppercase tracking-widest font-bold">{exp.company}</span>
                      <div className="text-xs text-text-muted mt-1">{exp.period}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setSelectedExperience(exp); setIsExperienceModalOpen(true); }}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded flex items-center gap-1 text-sm font-bold text-white"
                    >
                      <Edit size={14} /> Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(exp.id, 'experience')}
                      className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded flex items-center gap-1 text-sm font-bold"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
              ))
            )
          ) : currentTab === 'education' ? (
            educations.length === 0 ? (
              <div className="p-8 text-center text-text-muted border border-white/10 rounded-lg border-dashed">Nenhuma formação encontrada. Adicione a primeira!</div>
            ) : (
              educations.map((edu) => (
                <div key={edu.id} className="glass-card p-4 rounded-xl flex items-center justify-between border border-white/5 hover:border-white/20 transition-all bg-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-accent-glow/20 rounded-lg flex items-center justify-center border border-white/10">
                      <GraduationCap className="text-accent-glow w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{edu.role}</h4>
                      <span className="text-xs text-accent-glow uppercase tracking-widest font-bold">{edu.company}</span>
                      <div className="text-xs text-text-muted mt-1">{edu.period}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setSelectedExperience(edu); setIsExperienceModalOpen(true); }}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded flex items-center gap-1 text-sm font-bold text-white"
                    >
                      <Edit size={14} /> Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(edu.id, 'experience')}
                      className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded flex items-center gap-1 text-sm font-bold"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
              ))
            )
          ) : (
              <div className="max-w-2xl mx-auto">
                  <h1 className="text-2xl font-heading font-bold mb-8">Configurações Gerais</h1>
                  <div className="glass-card p-8 rounded-xl border border-white/5 bg-white/5">
                      <form onSubmit={handleSaveSettings}>
                          <div className="mb-6">
                              <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Email para Contato (Formulário)</label>
                              <input
                                type="email"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-accent-glow focus:outline-none text-white"
                                placeholder="contato@luisfelipe.com"
                              />
                              <p className="text-xs text-text-muted mt-2">Este é o email que será usado como destino para as mensagens enviadas pelo site.</p>
                          </div>
                          <button
                            type="submit"
                            disabled={settingsLoading}
                            className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2 disabled:opacity-50"
                          >
                            {settingsLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} 
                            Salvar Configurações
                          </button>
                      </form>
                  </div>
              </div>
          )}
        </div>
      </div>

      <footer className="border-t border-white/10 py-6 bg-black/50 backdrop-blur-md mt-auto">
          <div className="container mx-auto px-6 flex justify-between items-center">
              <span className="text-xs text-text-muted">© 2024 Luís Felipe Admin Panel</span>
              <button onClick={handleLogout} className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors flex items-center gap-2">
                 Sair do Painel <LogOut size={14} />
              </button>
          </div>
      </footer>

      {isProjectModalOpen && (
        <AdminProjectModal
          project={selectedProject}
          onClose={() => setIsProjectModalOpen(false)}
          onSave={loadData}
        />
      )}

      {isTestimonialModalOpen && (
        <AdminTestimonialModal
          testimonial={selectedTestimonial}
          onClose={() => setIsTestimonialModalOpen(false)}
          onSave={loadData}
        />
      )}

      {isServiceModalOpen && (
        <AdminServiceModal
          service={selectedService}
          onClose={() => setIsServiceModalOpen(false)}
          onSave={loadData}
        />
      )}

      {isExperienceModalOpen && (
        <AdminExperienceModal
          experience={selectedExperience}
          initialType={currentTab === 'education' ? 'education' : 'experience'}
          onClose={() => setIsExperienceModalOpen(false)}
          onSave={loadData}
        />
      )}
    </div>
  );
}
