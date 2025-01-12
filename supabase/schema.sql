-- ===================================================================================
-- Create tables in the public schema with best practices:
-- - snake_case naming
-- - uuid primary keys
-- - referencing with ON DELETE CASCADE or RESTRICT as appropriate
-- - Row Level Security (RLS) for data protection
-- ===================================================================================

-- Users table: each row represents an authenticated user in your system.
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Resume data table
CREATE TABLE IF NOT EXISTS resume_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL 
        REFERENCES users (id) 
        ON DELETE CASCADE,        -- or ON DELETE RESTRICT if you prefer
    resume_text TEXT NOT NULL,
    resume_json JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Job data table
CREATE TABLE IF NOT EXISTS job_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL 
        REFERENCES users (id) 
        ON DELETE CASCADE,
    job_description TEXT NOT NULL,
    extracted_details JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Refined resume data table
CREATE TABLE IF NOT EXISTS refined_resume_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL 
        REFERENCES users (id) 
        ON DELETE CASCADE,
    resume_json JSONB NOT NULL,
    job_id UUID NOT NULL 
        REFERENCES job_data (id) 
        ON DELETE CASCADE,
    refined_json JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===================================================================================
-- Enable Row Level Security (RLS) on all tables
--    RLS ensures each user can only see/manipulate their own rows.
-- ===================================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE refined_resume_data ENABLE ROW LEVEL SECURITY;

-- ===================================================================================
-- Create RLS policies
--    The policies below assume the `auth.uid()` function is available, which
--    Supabase provides to map the logged-in user's UUID to the row's user_id or id.
-- ===================================================================================

-- --------------------------
-- For users
-- --------------------------
-- Allow each user to SELECT/UPDATE/DELETE their own row in the users table.
CREATE POLICY "users_select_own_row" ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users_update_own_row" ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_delete_own_row" ON users
  FOR DELETE
  USING (auth.uid() = id);

-- Optionally allow self-inserts, e.g., for sign-up flow:
CREATE POLICY "users_insert_self" ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- --------------------------
-- For resume_data
-- --------------------------
CREATE POLICY "resume_select_own_rows" ON resume_data
  FOR SELECT
  USING (auth.uid() = user_id);

-- For MVP: Allow inserts for demo user
CREATE POLICY "resume_insert_demo_user" ON resume_data
  FOR INSERT
  WITH CHECK (user_id = '00000000-0000-0000-0000-000000000000');

-- For future multi-user: Allow authenticated inserts
CREATE POLICY "resume_insert_own_rows" ON resume_data
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "resume_update_own_rows" ON resume_data
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "resume_delete_own_rows" ON resume_data
  FOR DELETE
  USING (auth.uid() = user_id);

-- --------------------------
-- For job_data
-- --------------------------
CREATE POLICY "job_select_own_rows" ON job_data
  FOR SELECT
  USING (auth.uid() = user_id);

-- For MVP: Allow inserts for demo user
CREATE POLICY "job_insert_demo_user" ON job_data
  FOR INSERT
  WITH CHECK (user_id = '00000000-0000-0000-0000-000000000000');

-- For future multi-user: Allow authenticated inserts
CREATE POLICY "job_insert_own_rows" ON job_data
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "job_update_own_rows" ON job_data
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "job_delete_own_rows" ON job_data
  FOR DELETE
  USING (auth.uid() = user_id);

-- --------------------------
-- For refined_resume_data
-- --------------------------
CREATE POLICY "refined_resume_select_own_rows" ON refined_resume_data
  FOR SELECT
  USING (auth.uid() = user_id);

-- For MVP: Allow inserts for demo user
CREATE POLICY "refined_resume_insert_demo_user" ON refined_resume_data
  FOR INSERT
  WITH CHECK (user_id = '00000000-0000-0000-0000-000000000000');

-- For future multi-user: Allow authenticated inserts
CREATE POLICY "refined_resume_insert_own_rows" ON refined_resume_data
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "refined_resume_update_own_rows" ON refined_resume_data
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "refined_resume_delete_own_rows" ON refined_resume_data
  FOR DELETE
  USING (auth.uid() = user_id);

-- ===================================================================================
-- Create helpful indexes for performance
--    (These help with queries filtering on user_id or job_id fields)
-- ===================================================================================
CREATE INDEX IF NOT EXISTS idx_users_email 
    ON users (email);

CREATE INDEX IF NOT EXISTS idx_resume_data_user_id 
    ON resume_data (user_id);

CREATE INDEX IF NOT EXISTS idx_job_data_user_id 
    ON job_data (user_id);

CREATE INDEX IF NOT EXISTS idx_refined_resume_data_user_id 
    ON refined_resume_data (user_id);

CREATE INDEX IF NOT EXISTS idx_refined_resume_data_job_id 
    ON refined_resume_data (job_id);

-- ===================================================================================
-- Insert demo user for testing
-- ===================================================================================
INSERT INTO users (id, email)
VALUES ('00000000-0000-0000-0000-000000000000', 'demo@example.com')
ON CONFLICT (id) DO NOTHING;
