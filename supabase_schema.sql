-- Community Posts Table
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  username TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  category TEXT DEFAULT 'discussion',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Post Comments Table
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  author_name TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Reports Table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  summary TEXT,
  pest_count INTEGER,
  crop_health INTEGER,
  weather_condition TEXT,
  risk_level TEXT,
  recommendations TEXT,
  status TEXT DEFAULT 'ready',
  file_url TEXT,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS Policies (Basic examples)
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public community_posts are viewable by everyone" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Users can insert their own posts" ON community_posts FOR INSERT WITH CHECK (true);

CREATE POLICY "Public comments are viewable by everyone" ON post_comments FOR SELECT USING (true);
CREATE POLICY "Users can insert their own comments" ON post_comments FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can only see their own reports" ON reports FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own reports" ON reports FOR INSERT WITH CHECK (auth.uid()::text = user_id);
