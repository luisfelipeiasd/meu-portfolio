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
