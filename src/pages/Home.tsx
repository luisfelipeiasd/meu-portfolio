import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Project, Testimonial, Service, Experience } from '../types';
import ProjectModal from '../components/ProjectModal';
import ServiceModal from '../components/ServiceModal';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, ChevronDown, Laptop, Diamond, Smartphone, Star, Code, PenTool, Globe, Rocket, Monitor, MessageCircle, MapPin, Mail, Linkedin, ExternalLink, GraduationCap, Briefcase, Phone } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'motion/react';

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

const fallbackExperiences: Experience[] = [
  {
    id: '1',
    company: 'Poise',
    role: 'Editor de Vídeo',
    period: 'Maio 2024 - Presente',
    description: 'Desenvolvimento de ideias e edição de vídeos cativantes e dinâmicos para Instagram Reels. Aplicação de cortes rápidos, transições suaves e escolha das músicas e efeitos visuais ideais.',
    type: 'experience',
    display_order: 1
  },
  {
    id: '2',
    company: 'Agência Ideia Goiás',
    role: 'Designer Gráfico Sênior',
    period: 'Jan 2021 - Presente',
    description: 'Criação de designs impactantes para redes sociais no setor de Marketing Médico. Desenvolvimento de conteúdo com layouts criativos, tipografia eficaz e paletas de cores harmoniosas.',
    type: 'experience',
    display_order: 2
  },
  {
    id: '3',
    company: 'Colégio e Instituições Adventistas',
    role: 'Designer Gráfico',
    period: 'Jun 2021 - Abr 2024',
    description: 'Criação de materiais publicitários, campanhas de endomarketing e produção de conteúdo audiovisual e fotográfico para redes sociais.',
    type: 'experience',
    display_order: 3
  },
  {
    id: '4',
    company: 'Agência Expand & Freelancer',
    role: 'Designer Gráfico e Social Media',
    period: 'Jan 2015 - Ago 2024',
    description: 'Gestão de redes sociais e analista de marketing digital internacional. Criação e gerenciamento de campanhas no Facebook Ads.',
    type: 'experience',
    display_order: 4
  },
  {
    id: '5',
    company: 'UniFast',
    role: 'MBA em Inovação e Produtos Digitais',
    period: 'Set 2024',
    description: '',
    type: 'education',
    display_order: 1
  },
  {
    id: '6',
    company: 'Estácio',
    role: 'CST, Marketing',
    period: 'Jun 2021 - Dez 2023',
    description: '',
    type: 'education',
    display_order: 2
  },
  {
    id: '7',
    company: 'Layer Lemonade',
    role: 'Motion Design',
    period: 'Ago 2022 - Dez 2022',
    description: '',
    type: 'education',
    display_order: 3
  },
  {
    id: '8',
    company: 'Origamid',
    role: 'UX Design Heurísticas & UI Design',
    period: 'Jan 2019 - Mai 2019',
    description: '',
    type: 'education',
    display_order: 4
  }
];

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [contactEmail, setContactEmail] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*, project_images(*)')
          .order('created_at', { ascending: false })
          .order('display_order', { foreignTable: 'project_images', ascending: true });

        if (projectsError) throw projectsError;
        setProjects(projectsData || []);

        const { data: testimonialsData, error: testimonialsError } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false });

        if (testimonialsError) throw testimonialsError;
        setTestimonials(testimonialsData || []);

        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .order('created_at', { ascending: true });

        if (servicesError) throw servicesError;
        setServices(servicesData || []);

        try {
          const { data: experiencesData, error: experiencesError } = await supabase
            .from('experiences')
            .select('*')
            .order('display_order', { ascending: true });

          if (experiencesError) {
            // If table doesn't exist or other error, use fallback
            console.warn('Could not fetch experiences, using fallback data:', experiencesError);
            setExperiences(fallbackExperiences);
          } else {
            setExperiences(experiencesData && experiencesData.length > 0 ? experiencesData : fallbackExperiences);
          }
        } catch (err) {
          console.warn('Error fetching experiences:', err);
          setExperiences(fallbackExperiences);
        }

        const { data: settingsData } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'contact_email')
          .single();

        if (settingsData) setContactEmail(settingsData.value);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => p.category.toLowerCase().includes(filter.toLowerCase()));

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactEmail) {
      alert(`Mensagem seria enviada para: ${contactEmail}\n(Simulação: Backend necessário para envio real de e-mail)`);
    } else {
      alert('Mensagem enviada (simulado)!');
    }
  };

  return (
    <div className="bg-bg-dark text-text-main font-body selection:bg-primary selection:text-white custom-scrollbar overflow-x-hidden">
      <Navbar />

      <main>
        {/* Floating WhatsApp Button */}
        <a
          href="https://wa.me/5562984077910"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center animate-pulse-green"
          title="Fale conosco no WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>

        {/* Hero Section */}
        <section className="relative min-h-[90vh] md:min-h-screen flex items-center pt-24 md:pt-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero z-0 pointer-events-none"></div>
          <div className="absolute top-[10%] right-[5%] md:top-[20%] md:right-[10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-primary/20 rounded-full blur-[80px] md:blur-[120px] animate-pulse-glow pointer-events-none"></div>
          <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px md:50px 50px' }}></div>

          <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center md:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md mx-auto md:mx-0">
                <span className="w-2 h-2 rounded-full bg-accent-glow animate-pulse"></span>
                <span className="text-xs uppercase tracking-widest font-semibold text-text-muted">Disponível para Projetos</span>
              </div>

              <h1 className="text-4xl md:text-7xl font-heading font-bold leading-[1.2] md:leading-[1.1] mb-6">
                Luís Felipe de Paula
              </h1>

              <p className="text-base md:text-xl text-text-muted mb-4 leading-relaxed max-w-lg mx-auto md:mx-0">
                Motion & Design | Editor de Vídeo | Desenvolvedor de Soluções Web
              </p>

              <div className="flex items-center justify-center md:justify-start gap-2 text-text-muted mb-8">
                <MapPin size={16} className="text-accent-glow" />
                <span className="text-xs md:text-sm">Anápolis, Goiás, Brasil</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#portfolio" className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group">
                  Ver Portfólio
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="#contact" className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold hover:bg-white/5 transition-all flex items-center justify-center">
                  Fale Comigo
                </a>
              </div>
            </motion.div>

            <div className="hidden md:flex relative h-[300px] md:h-[600px] items-center justify-center perspective-1000 mt-8 md:mt-0">
              <div className="relative w-48 h-48 md:w-80 md:h-80 transform-style-3d animate-float">
                <div className="absolute inset-0 border border-accent-glow/30 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-4 border border-white/10 rounded-full animate-spin-slow-reverse"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-accent-glow/20 to-purple-500/10 rounded-full blur-2xl"></div>

                <div className="absolute top-0 right-0 p-3 md:p-4 bg-bg-card/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl transform translate-x-6 -translate-y-6 md:translate-x-10 md:-translate-y-10 animate-float" style={{ animationDelay: '1s' }}>
                  <Diamond className="text-accent-glow text-xl md:text-2xl mb-1 md:mb-2" />
                  <p className="text-[10px] md:text-xs font-bold">Motion Design</p>
                </div>

                <div className="absolute bottom-0 left-0 p-3 md:p-4 bg-bg-card/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl transform -translate-x-6 translate-y-6 md:-translate-x-10 md:translate-y-10 animate-float" style={{ animationDelay: '2s' }}>
                  <Code className="text-accent-glow text-xl md:text-2xl mb-1 md:mb-2" />
                  <p className="text-[10px] md:text-xs font-bold">Web Dev</p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce opacity-50">
            <ChevronDown className="text-xl" />
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-10 md:py-16 relative bg-bg-dark overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center mb-16 md:mb-24">
              {/* Image Column */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative order-2 md:order-1 flex justify-center md:justify-center"
              >
                {/* Glow effect behind */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-r from-primary/20 to-accent-glow/20 blur-[100px] rounded-full opacity-40 pointer-events-none"></div>

                <img
                  src="/images/me.png"
                  alt="Luís de Paula"
                  className="relative z-10 w-full max-w-lg md:max-w-xl object-contain transform translate-y-8"
                  style={{
                    maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)'
                  }}
                />
              </motion.div>

              {/* Text Column */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center md:text-left order-1 md:order-2"
              >
                <span className="text-accent-glow text-xs font-bold uppercase tracking-widest mb-4 block">Sobre Mim</span>
                <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 md:mb-8 leading-tight">Transformando ideias em <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">experiências visuais</span></h2>
                <div className="space-y-4 md:space-y-6 text-text-muted leading-relaxed text-sm md:text-base">
                  <p>
                    Minha trajetória profissional me permitiu atuar em setores diversos, como cooperativas, agronegócio e mercado imobiliário, sempre entregando soluções estratégicas e orientadas a resultados. Tenho experiência sólida como Social Media e Designer em agências, além de uma forte atuação junto à Igreja e Educação Adventista, desenvolvendo projetos de conteúdo, fotografia e design com excelência e propósito.
                  </p>
                  <p>
                    A edição e o motion design são grandes diferenciais no meu trabalho. Utilizo After Effects e Premiere para construir narrativas dinâmicas, modernas e envolventes. Paralelamente, meu interesse por desenvolvimento web me levou a criar projetos completos desde portais e landing pages para agências criativas até sistemas de automação sempre unindo design refinado, usabilidade inteligente e alta performance técnica.
                  </p>
                  <p>
                    Também aplico Inteligência Artificial de forma estratégica nos meus processos, integrando IA à criação, automação, otimização de fluxos e desenvolvimento de soluções digitais. Isso me permite acelerar entregas, aumentar a eficiência dos projetos e oferecer resultados mais inovadores, competitivos e alinhados às tendências do mercado.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Skills Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-accent-glow/30 transition-all hover:-translate-y-1 duration-300"
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-white">
                  <div className="p-2 bg-accent-glow/10 rounded-lg">
                    <PenTool className="text-accent-glow w-5 h-5" />
                  </div>
                  Design & Prototipagem
                </h3>
                <p className="text-text-muted text-sm mb-6 leading-relaxed">Domínio avançado em ferramentas de criação e design de interface para criar layouts modernos e funcionais.</p>
                <div className="flex flex-wrap gap-2">
                  {['Illustrator', 'Photoshop', 'Figma'].map(s => (
                    <span key={s} className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-wider border border-white/10 text-text-muted hover:text-white hover:border-accent-glow/50 transition-colors">{s}</span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-accent-glow/30 transition-all hover:-translate-y-1 duration-300"
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-white">
                  <div className="p-2 bg-accent-glow/10 rounded-lg">
                    <Monitor className="text-accent-glow w-5 h-5" />
                  </div>
                  Audiovisual & Motion
                </h3>
                <p className="text-text-muted text-sm mb-6 leading-relaxed">Especialista em cortes rápidos, transições fluidas e efeitos visuais dinâmicos que prendem a atenção.</p>
                <div className="flex flex-wrap gap-2">
                  {['Premiere', 'After Effects', 'Motion Graphics'].map(s => (
                    <span key={s} className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-wider border border-white/10 text-text-muted hover:text-white hover:border-accent-glow/50 transition-colors">{s}</span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-accent-glow/30 transition-all hover:-translate-y-1 duration-300"
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-white">
                  <div className="p-2 bg-accent-glow/10 rounded-lg">
                    <Code className="text-accent-glow w-5 h-5" />
                  </div>
                  Tecnologia & Web
                </h3>
                <p className="text-text-muted text-sm mb-6 leading-relaxed">Desenvolvimento de aplicações robustas e automação de fluxos de trabalho para otimizar processos.</p>
                <div className="flex flex-wrap gap-2">
                  {['Web Dev', 'n8n', 'Google AI Studio', 'Supabase'].map(s => (
                    <span key={s} className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-wider border border-white/10 text-text-muted hover:text-white hover:border-accent-glow/50 transition-colors">{s}</span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Section (Expertise from DB) */}
        {services.length > 0 && (
          <section id="services" className="py-10 md:py-16 relative bg-bg-dark border-t border-white/5">
            <div className="container mx-auto px-6 relative z-10">
              <div className="text-center mb-12 md:mb-20 max-w-3xl mx-auto">
                <span className="text-accent-glow text-xs font-bold uppercase tracking-widest mb-4 block">Especialidades</span>
                <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 md:mb-6">Como posso ajudar <br /> seu negócio</h2>
                <p className="text-text-muted text-sm md:text-base">Serviços personalizados baseados em anos de experiência no mercado criativo e tecnológico.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                {services.map((service) => {
                  const IconComponent = iconMap[service.icon] || Laptop;
                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className="group p-8 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-accent-glow/30 transition-all duration-500 cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-accent-glow/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <IconComponent className="text-accent-glow text-xl" />
                      </div>
                      <h3 className="text-xl font-bold mb-4 group-hover:text-accent-glow transition-colors">{service.title}</h3>
                      <p className="text-text-muted text-sm leading-relaxed">{service.short_description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Experience & Education */}
        <section id="experience" className="py-10 md:py-16 bg-bg-dark">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16">
              {/* Experience */}
              <div>
                <div className="flex items-center gap-4 mb-8 md:mb-12">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-accent-glow/20 rounded-xl flex items-center justify-center">
                    <Briefcase className="text-accent-glow w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-heading font-bold">Experiência</h2>
                </div>

                <div className="space-y-10 md:space-y-12">
                  {experiences
                    .filter(exp => exp.type === 'experience')
                    .map((exp, i) => (
                      <motion.div
                        key={exp.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="relative pl-8 border-l border-white/10"
                      >
                        <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] bg-accent-glow rounded-full"></div>
                        <span className="text-xs text-accent-glow font-bold uppercase tracking-widest mb-2 block">{exp.period}</span>
                        <h3 className="text-xl font-bold mb-1">{exp.role}</h3>
                        <h4 className="text-text-muted text-sm mb-4">{exp.company}</h4>
                        <p className="text-text-muted text-sm leading-relaxed">{exp.description}</p>
                      </motion.div>
                    ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <div className="flex items-center gap-4 mb-8 md:mb-12 mt-12 md:mt-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-accent-glow/20 rounded-xl flex items-center justify-center">
                    <GraduationCap className="text-accent-glow w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-heading font-bold">Formação</h2>
                </div>

                <div className="space-y-8">
                  {experiences
                    .filter(exp => exp.type === 'education')
                    .map((edu, i) => (
                      <motion.div
                        key={edu.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-accent-glow/20 transition-all"
                      >
                        <span className="text-xs text-accent-glow font-bold mb-2 block">{edu.period}</span>
                        <h3 className="text-lg font-bold mb-1">{edu.role}</h3>
                        <p className="text-text-muted text-sm">{edu.company}</p>
                      </motion.div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Work Section */}
        <section id="portfolio" className="py-10 md:py-16 relative bg-black/50 overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 md:mb-16 gap-6 md:gap-8 text-center md:text-left">
              <div>
                <span className="text-accent-glow text-xs font-bold uppercase tracking-widest mb-4 block">Portfólio</span>
                <h2 className="text-3xl md:text-5xl font-heading font-bold">Trabalhos Selecionados</h2>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {['all', 'websites', 'design', 'motion', 'video', 'impressos'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={clsx(
                      "px-4 py-2 border rounded-full text-xs font-medium transition-all capitalize",
                      filter === f
                        ? "border-accent-glow bg-accent-glow/10 text-white"
                        : "border-white/10 text-text-muted hover:border-white/30 hover:text-white"
                    )}
                  >
                    {f === 'all' ? 'Todos' : f === 'video' ? 'Vídeos' : f}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full py-20 flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-glow"></div>
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="col-span-full text-center text-text-muted py-10 opacity-50">Nenhum projeto encontrado nesta categoria.</div>
              ) : (
                filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-accent-glow/50 transition-all"
                  >
                    <img
                      src={project.project_images?.[0]?.image_url || 'https://placehold.co/800x600?text=Projeto'}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={project.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="text-accent-glow text-[10px] font-bold uppercase tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100 bg-accent-glow/10 px-2 py-1 rounded inline-block w-fit backdrop-blur-sm border border-accent-glow/20">
                        {project.category}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-white transition-colors delay-75 shadow-black drop-shadow-lg">
                        {project.title}
                      </h3>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
              <a
                href="https://www.behance.net/luisfearaujo4"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-all"
              >
                Ver Perfil Completo no Behance
                <ExternalLink size={18} />
              </a>
              <a
                href="https://drive.google.com/drive/folders/1R2hUVr6RN2x_RJPCbjgmFyeJBJBAEupi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold hover:bg-white/5 transition-all"
              >
                Ver mais vídeos
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section id="testimonials" className="py-12 md:py-20 bg-black/30 relative">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-heading font-bold mb-4">Depoimentos</h2>
                <p className="text-text-muted">O que dizem sobre trabalhar comigo.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((t) => (
                  <div key={t.id} className="p-8 border border-white/5 bg-bg-card rounded-2xl hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-4 mb-6">
                      <img src={t.avatar_url || 'https://placehold.co/100x100?text=Avatar'} className="w-12 h-12 rounded-full object-cover border border-white/10" alt={t.author_name} />
                      <div>
                        <h4 className="font-bold text-white">{t.author_name}</h4>
                        <span className="text-xs text-text-muted uppercase tracking-wider">{t.author_role}</span>
                      </div>
                    </div>
                    <p className="text-text-muted text-sm leading-relaxed">"{t.content}"</p>
                    <div className="mt-4 flex gap-1 text-accent-glow text-[10px]">
                      {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section id="contact" className="py-12 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-bg-dark to-primary/5 pointer-events-none"></div>

          <div className="container mx-auto px-6 relative z-10 max-w-4xl">
            <div className="glass-card p-8 md:p-12 rounded-3xl text-center">
              <span className="text-accent-glow text-xs font-bold uppercase tracking-widest mb-4 block">Contato</span>
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-8">Vamos construir seu próximo projeto?</h2>

              <div className="grid md:grid-cols-2 gap-12 mb-12 text-left">
                <div className="space-y-6">
                  <p className="text-text-muted leading-relaxed">
                    Estou sempre aberto a novos desafios e colaborações criativas. Sinta-se à vontade para entrar em contato!
                  </p>
                  <div className="space-y-4">
                    <a href="mailto:luisfelipeiasd@gmail.com" className="flex items-center gap-4 text-white hover:text-accent-glow transition-colors group">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent-glow/20 transition-colors">
                        <Mail size={18} />
                      </div>
                      <span>luisfelipeiasd@gmail.com</span>
                    </a>
                    <a href="tel:+5562984077910" className="flex items-center gap-4 text-white hover:text-accent-glow transition-colors group">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent-glow/20 transition-colors">
                        <Phone size={18} />
                      </div>
                      <span>(62) 98407-7910</span>
                    </a>
                    <a href="https://www.linkedin.com/in/luislipearaujo/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white hover:text-accent-glow transition-colors group">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent-glow/20 transition-colors">
                        <Linkedin size={18} />
                      </div>
                      <span>LinkedIn Profile</span>
                    </a>
                  </div>
                </div>

                <form className="space-y-4 text-left" onSubmit={handleContactSubmit}>
                  <div>
                    <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Nome</label>
                    <input type="text" required className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-accent-glow focus:outline-none focus:ring-1 focus:ring-accent-glow transition-all" placeholder="Seu nome" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Telefone</label>
                    <input type="tel" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-accent-glow focus:outline-none focus:ring-1 focus:ring-accent-glow transition-all" placeholder="(00) 00000-0000" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Email</label>
                    <input type="email" required className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-accent-glow focus:outline-none focus:ring-1 focus:ring-accent-glow transition-all" placeholder="seu@email.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted mb-2 uppercase">Mensagem</label>
                    <textarea rows={4} required className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:border-accent-glow focus:outline-none focus:ring-1 focus:ring-accent-glow transition-all" placeholder="Conte sobre seu projeto..."></textarea>
                  </div>

                  <button type="submit" className="w-full py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all mt-4">
                    Enviar Mensagem
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}

      {selectedService && (
        <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
      )}
    </div>
  );
}
