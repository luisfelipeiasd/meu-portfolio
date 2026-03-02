-- Create Projects Table
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  challenge TEXT,
  solution TEXT,
  technologies TEXT[],
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Project Images Table
CREATE TABLE project_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Testimonials Table
CREATE TABLE testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_role TEXT,
  content TEXT NOT NULL,
  avatar_url TEXT,
  storage_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Services Table
CREATE TABLE services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  icon TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  features TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Settings Table
CREATE TABLE settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create Policies (Public Read, Authenticated Write)
-- Projects
CREATE POLICY "Public Projects are viewable by everyone" ON projects FOR SELECT USING (true);
CREATE POLICY "Users can insert their own projects" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own projects" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete their own projects" ON projects FOR DELETE USING (auth.role() = 'authenticated');

-- Project Images
CREATE POLICY "Public Project Images are viewable by everyone" ON project_images FOR SELECT USING (true);
CREATE POLICY "Users can insert project images" ON project_images FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update project images" ON project_images FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete project images" ON project_images FOR DELETE USING (auth.role() = 'authenticated');

-- Testimonials
CREATE POLICY "Public Testimonials are viewable by everyone" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Users can insert testimonials" ON testimonials FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update testimonials" ON testimonials FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete testimonials" ON testimonials FOR DELETE USING (auth.role() = 'authenticated');

-- Services
CREATE POLICY "Public Services are viewable by everyone" ON services FOR SELECT USING (true);
CREATE POLICY "Users can insert services" ON services FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update services" ON services FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete services" ON services FOR DELETE USING (auth.role() = 'authenticated');

-- Settings
CREATE POLICY "Public Settings are viewable by everyone" ON settings FOR SELECT USING (true);
CREATE POLICY "Users can insert settings" ON settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update settings" ON settings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete settings" ON settings FOR DELETE USING (auth.role() = 'authenticated');

-- Storage Buckets
-- You need to create 'portfolio' and 'avatars' buckets in the Supabase Dashboard.
-- And set policies for them:
-- Public Access: true
-- Authenticated Insert/Update/Delete: true

-- Create Experiences Table
CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('experience', 'education')) NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Public Experiences are viewable by everyone" ON experiences FOR SELECT USING (true);
CREATE POLICY "Users can insert experiences" ON experiences FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update experiences" ON experiences FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete experiences" ON experiences FOR DELETE USING (auth.role() = 'authenticated');
