/*
  # Update Instructors Schema for Admin Features

  ## Overview
  This migration updates the existing instructors table and creates supporting tables
  for the admin panel functionality.

  ## 1. Table Modifications
  
  ### `instructors` - Add new columns
  - `email` (text) - Contact email
  - `phone` (text) - Contact phone number
  - `bio` (text) - Short biography
  - `hourly_rate` (integer) - Hourly rate in Korean Won
  - `experience_years` (integer) - Years of teaching experience
  - `education` (text) - Educational background
  - `is_active` (boolean) - Whether instructor is currently active
  - `updated_at` (timestamptz) - Last update timestamp

  ## 2. New Tables
  
  ### `profiles`
  - `id` (uuid, primary key) - References auth.users
  - `email` (text) - User email
  - `name` (text) - User display name
  - `role` (text) - User role: 'student' or 'admin'
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `subjects`
  - `id` (uuid, primary key) - Subject identifier
  - `name` (text, unique) - Subject name
  - `created_at` (timestamptz) - Creation timestamp

  ### `instructor_subjects`
  - `id` (uuid, primary key) - Record identifier
  - `instructor_id` (uuid) - References instructors.id
  - `subject_id` (uuid) - References subjects.id

  ## 3. Security
  
  All tables have Row Level Security (RLS) enabled with appropriate policies.
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add new columns to instructors table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instructors' AND column_name = 'email'
  ) THEN
    ALTER TABLE instructors ADD COLUMN email text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instructors' AND column_name = 'phone'
  ) THEN
    ALTER TABLE instructors ADD COLUMN phone text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instructors' AND column_name = 'bio'
  ) THEN
    ALTER TABLE instructors ADD COLUMN bio text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instructors' AND column_name = 'hourly_rate'
  ) THEN
    ALTER TABLE instructors ADD COLUMN hourly_rate integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instructors' AND column_name = 'experience_years'
  ) THEN
    ALTER TABLE instructors ADD COLUMN experience_years integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instructors' AND column_name = 'education'
  ) THEN
    ALTER TABLE instructors ADD COLUMN education text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instructors' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE instructors ADD COLUMN is_active boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instructors' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE instructors ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read subjects"
  ON subjects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert subjects"
  ON subjects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update subjects"
  ON subjects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete subjects"
  ON subjects FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create instructor_subjects junction table
CREATE TABLE IF NOT EXISTS instructor_subjects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id uuid NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(instructor_id, subject_id)
);

ALTER TABLE instructor_subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read instructor subjects"
  ON instructor_subjects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert instructor subjects"
  ON instructor_subjects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete instructor subjects"
  ON instructor_subjects FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Enable RLS on instructors if not already enabled
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read active instructors" ON instructors;
DROP POLICY IF EXISTS "Admins can read all instructors" ON instructors;
DROP POLICY IF EXISTS "Admins can insert instructors" ON instructors;
DROP POLICY IF EXISTS "Admins can update instructors" ON instructors;
DROP POLICY IF EXISTS "Admins can delete instructors" ON instructors;

-- Create new policies for instructors
CREATE POLICY "Anyone can read active instructors"
  ON instructors FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can read all instructors"
  ON instructors FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert instructors"
  ON instructors FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update instructors"
  ON instructors FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete instructors"
  ON instructors FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Enable RLS on reviews if not already enabled
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can delete any review" ON reviews;

-- Create policies for reviews
CREATE POLICY "Anyone can read reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete any review"
  ON reviews FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON profiles;
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_instructors_updated_at ON instructors;
CREATE TRIGGER trigger_instructors_updated_at
  BEFORE UPDATE ON instructors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Insert default subjects
INSERT INTO subjects (name) VALUES
  ('수학'),
  ('영어'),
  ('국어'),
  ('과학'),
  ('사회'),
  ('코딩'),
  ('미술'),
  ('음악'),
  ('체육')
ON CONFLICT (name) DO NOTHING;