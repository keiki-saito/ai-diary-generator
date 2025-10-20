-- Create diaries table
CREATE TABLE IF NOT EXISTS diaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  user_input TEXT NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) >= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for performance optimization
CREATE INDEX IF NOT EXISTS idx_diaries_user_id_date
  ON diaries(user_id, date DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE diaries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own diaries
CREATE POLICY "Users can view their own diaries"
  ON diaries FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own diaries
CREATE POLICY "Users can insert their own diaries"
  ON diaries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own diaries
CREATE POLICY "Users can update their own diaries"
  ON diaries FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own diaries
CREATE POLICY "Users can delete their own diaries"
  ON diaries FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_diaries_updated_at
  BEFORE UPDATE ON diaries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
