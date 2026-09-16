-- ==============================================================================
-- WORKOUT DIARY - SUPABASE DATABASE SCHEMA & MOCK DATA
-- Run this SQL in your Supabase SQL Editor: https://supabase.com/dashboard/project/rfuuwurlwgzorudcssny/sql
-- ==============================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  pin VARCHAR(4) NOT NULL DEFAULT '1234',
  full_name TEXT NOT NULL,
  gender TEXT DEFAULT 'male',
  dob DATE DEFAULT '2000-01-01',
  weight NUMERIC(5,2) DEFAULT 68.5,
  height NUMERIC(5,2) DEFAULT 175.0,
  avatar TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FOOD LOGS TABLE
CREATE TABLE IF NOT EXISTS public.food_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  meal_type TEXT NOT NULL,
  food_name TEXT NOT NULL,
  calories NUMERIC(7,2) DEFAULT 0,
  protein NUMERIC(6,2) DEFAULT 0,
  carbs NUMERIC(6,2) DEFAULT 0,
  fats NUMERIC(6,2) DEFAULT 0,
  image_url TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. WORKOUT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  duration INTEGER DEFAULT 45,
  calories_burned INTEGER DEFAULT 300,
  exercises JSONB DEFAULT '[]'::jsonb,
  image_url TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. OUTDOOR & COMPETITION LOGS TABLE
CREATE TABLE IF NOT EXISTS public.outdoor_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT DEFAULT '',
  distance NUMERIC(6,2) DEFAULT 0,
  duration_text TEXT DEFAULT '',
  pace TEXT DEFAULT '',
  calories INTEGER DEFAULT 0,
  rank TEXT DEFAULT '',
  weather TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BODY METRICS & BMI LOGS TABLE
CREATE TABLE IF NOT EXISTS public.body_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  weight NUMERIC(5,2) NOT NULL,
  height NUMERIC(5,2) NOT NULL,
  body_fat NUMERIC(4,2) DEFAULT 0,
  chest NUMERIC(5,2) DEFAULT 0,
  waist NUMERIC(5,2) DEFAULT 0,
  hips NUMERIC(5,2) DEFAULT 0,
  arms NUMERIC(5,2) DEFAULT 0,
  bmi NUMERIC(4,2) DEFAULT 0,
  image_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FRIENDS TABLE
CREATE TABLE IF NOT EXISTS public.friends (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  gender TEXT DEFAULT 'male',
  dob DATE NOT NULL,
  avatar_url TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) & ALLOW PUBLIC ACCESS (FOR DEMO/APP)
-- ==============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outdoor_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

-- Allow read & write policies for anon key
CREATE POLICY "Allow all operations for anon on users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon on food_logs" ON public.food_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon on workout_logs" ON public.workout_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon on outdoor_logs" ON public.outdoor_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon on body_logs" ON public.body_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon on friends" ON public.friends FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- INSERT MOCKUP SEED DATA
-- ==============================================================================

-- 1. Mock User
INSERT INTO public.users (id, username, email, password, pin, full_name, gender, dob, weight, height, avatar)
VALUES (
  'usr_alex_001',
  'alex',
  'alex@fit.com',
  '123456',
  '1234',
  'Alex Fit',
  'male',
  '2000-04-12',
  68.5,
  175.0,
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
) ON CONFLICT (id) DO NOTHING;

-- 2. Mock Food Logs
INSERT INTO public.food_logs (id, user_id, date, meal_type, food_name, calories, protein, carbs, fats, image_url, notes)
VALUES 
(
  'food_001',
  'usr_alex_001',
  '2026-09-16',
  'breakfast',
  'ข้าวโอ๊ตต้มกล้วยหอม + นมแอลมอนด์ + เวย์โปรตีน 1 สกู๊ป',
  420,
  32,
  58,
  6,
  'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=600&auto=format&fit=crop&q=80',
  'ทานก่อนซ้อมเช้า 1 ชั่วโมง ให้พลังงานดีมาก'
),
(
  'food_002',
  'usr_alex_001',
  '2026-09-16',
  'lunch',
  'อกไก่ย่างสมุนไพร 200g + ข้าวไรซ์เบอร์รี่ + บรอกโคลีลวก',
  520,
  48,
  52,
  9,
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
  'ดื่มน้ำเปล่า 600ml'
),
(
  'food_003',
  'usr_alex_001',
  '2026-09-15',
  'dinner',
  'สเต็กแซลมอนย่างเกลือ + สลัดผักน้ำสลัดบัลซามิก',
  480,
  38,
  18,
  22,
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=80',
  'โอเมก้า 3 ครบถ้วน'
) ON CONFLICT (id) DO NOTHING;

-- 3. Mock Workout Logs
INSERT INTO public.workout_logs (id, user_id, date, category, title, duration, calories_burned, exercises, image_url, notes)
VALUES
(
  'wk_001',
  'usr_alex_001',
  '2026-09-16',
  'weightlifting',
  'Chest & Triceps Hypertrophy',
  55,
  360,
  '[
    {"name": "Barbell Bench Press", "sets": 4, "reps": 8, "weight": 75},
    {"name": "Incline Dumbbell Press", "sets": 3, "reps": 10, "weight": 24},
    {"name": "Cable Chest Fly", "sets": 3, "reps": 12, "weight": 15},
    {"name": "Tricep Rope Pushdown", "sets": 4, "reps": 12, "weight": 22}
  ]'::jsonb,
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
  'เพิ่มน้ำหนัก Bench Press ได้ 2.5kg ฟอร์มดีไม่มีเจ็บ'
),
(
  'wk_002',
  'usr_alex_001',
  '2026-09-14',
  'cardio',
  'Zone 2 Treadmill Run + Core Plank',
  45,
  410,
  '[
    {"name": "Treadmill Incline Run", "sets": 1, "reps": 35, "weight": 0},
    {"name": "Plank Hold", "sets": 3, "reps": 60, "weight": 0}
  ]'::jsonb,
  'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&auto=format&fit=crop&q=80',
  'คุม Heart Rate ไม่เกิน 140 bpm'
) ON CONFLICT (id) DO NOTHING;

-- 4. Mock Outdoor Logs
INSERT INTO public.outdoor_logs (id, user_id, date, type, title, location, distance, duration_text, pace, calories, rank, weather, image_url, notes)
VALUES
(
  'out_001',
  'usr_alex_001',
  '2026-09-13',
  'marathon',
  'Bangkok Mini Marathon 2026 (10.5K)',
  'สะพานพระราม 8 - ถนนราชดำเนิน',
  10.5,
  '00:52:14',
  '4:58',
  680,
  'อันดับที่ 84 (Overall Top 10%)',
  'อากาศเย็นสบาย 25°C ฝนพรำเล็กน้อย',
  'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=600&auto=format&fit=crop&q=80',
  'ทำ New Personal Best สำเร็จ! บรรยากาศประทับใจมาก'
) ON CONFLICT (id) DO NOTHING;

-- 5. Mock Body Metrics
INSERT INTO public.body_logs (id, user_id, date, weight, height, body_fat, chest, waist, hips, arms, bmi, image_url)
VALUES
(
  'body_001',
  'usr_alex_001',
  '2026-09-16',
  68.5,
  175.0,
  14.8,
  39.5,
  30.5,
  37.0,
  14.5,
  22.4,
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80'
),
(
  'body_002',
  'usr_alex_001',
  '2026-09-01',
  69.8,
  175.0,
  15.6,
  39.0,
  31.2,
  37.5,
  14.2,
  22.8,
  ''
) ON CONFLICT (id) DO NOTHING;

-- 6. Mock Friends
INSERT INTO public.friends (id, user_id, name, gender, dob, avatar_url, bio)
VALUES
(
  'fr_001',
  'usr_alex_001',
  'ณัฐวุฒิ สายวิ่ง (Nut)',
  'male',
  '1998-08-15',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'ซ้อมวิ่งมาราธอน 4 วัน/สัปดาห์ เป้า Sub 4 ในปีนี้ 🏃‍♂️'
),
(
  'fr_002',
  'usr_alex_001',
  'พิมพ์ชนก ฟิตเนส (Pim)',
  'female',
  '2001-02-20',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  'ชอบเล่นพิลาทิส และเวทเทรนนิ่งเน้นก้น-ขา 🧘‍♀️✨'
),
(
  'fr_003',
  'usr_alex_001',
  'โค้ชบอย Powerlifting',
  'male',
  '1995-11-03',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  'SBD Total 520kg ยินดีให้คำแนะนำท่าสควอชและเบนช์เพรส 💪'
),
(
  'fr_004',
  'usr_alex_001',
  'เมษา นักปั่น',
  'female',
  '1999-05-28',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  'สายปั่น Sky Lane และทริปเขาใหญ่ 🚴‍♀️🌿'
) ON CONFLICT (id) DO NOTHING;
