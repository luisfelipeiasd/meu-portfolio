export interface Service {
  id: string;
  title: string;
  icon: string;
  short_description: string;
  full_description: string;
  features?: string[];
  created_at?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  challenge?: string;
  solution?: string;
  technologies?: string[];
  created_at?: string;
  project_images?: ProjectImage[];
  video_url?: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  storage_path: string;
  image_url: string;
  display_order: number;
}

export interface Testimonial {
  id: string;
  author_name: string;
  author_role?: string;
  content: string;
  avatar_url?: string;
  storage_path?: string;
  created_at?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  type: 'experience' | 'education';
  display_order: number;
  created_at?: string;
}

export interface BehanceProject {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
}
