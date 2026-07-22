/*
# Create projects table for OPOAD dashboard

1. New Tables
- `projects`
  - `id` (uuid, primary key, auto-generated)
  - `user_id` (uuid, not null, defaults to auth.uid() — links to the authenticated owner)
  - `name` (text, not null — project name)
  - `description` (text, nullable — project description)
  - `icon` (text, nullable, defaults to '📁' — emoji icon for the project card)
  - `status` (text, nullable, defaults to 'active' — project status)
  - `created_at` (timestamptz, defaults to now())
  - `updated_at` (timestamptz, defaults to now())

2. Security
- Enable RLS on `projects`.
- Owner-scoped CRUD: each authenticated user can only SELECT, INSERT, UPDATE, and DELETE rows they own.
- `user_id` defaults to `auth.uid()` so client inserts that omit the field still satisfy the INSERT WITH CHECK.
- Four separate policies (one per CRUD verb) scoped `TO authenticated`.

3. Indexes
- `idx_projects_user_id` on `user_id` for fast owner-scoped lookups.
- `idx_projects_created_at` on `created_at DESC` for ordered listing.
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  icon text DEFAULT '📁',
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_projects" ON projects;
CREATE POLICY "select_own_projects" ON projects FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_projects" ON projects;
CREATE POLICY "insert_own_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_projects" ON projects;
CREATE POLICY "update_own_projects" ON projects FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_projects" ON projects;
CREATE POLICY "delete_own_projects" ON projects FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
