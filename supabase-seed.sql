-- Seeder for Supabase Authentication
-- This will create a default admin user and bypass email verification.
-- Email: admin@example.com
-- Password: password123

-- 1. Insert into auth.users
INSERT INTO auth.users (
  instance_id, 
  id, 
  aud, 
  role, 
  email, 
  encrypted_password, 
  email_confirmed_at, 
  last_sign_in_at, 
  raw_app_meta_data, 
  raw_user_meta_data, 
  created_at, 
  updated_at, 
  confirmation_token, 
  email_change, 
  email_change_token_new, 
  recovery_token
) 
VALUES (
  '00000000-0000-0000-0000-000000000000', 
  gen_random_uuid(), 
  'authenticated', 
  'authenticated', 
  'admin@example.com', 
  crypt('password123', gen_salt('bf')), 
  now(), 
  now(), 
  '{"provider":"email","providers":["email"]}', 
  '{}', 
  now(), 
  now(), 
  '', 
  '', 
  '', 
  ''
);

-- 2. Insert into auth.identities
INSERT INTO auth.identities (
  id, 
  user_id, 
  identity_data, 
  provider, 
  last_sign_in_at, 
  created_at, 
  updated_at
) 
VALUES (
  gen_random_uuid(), 
  (SELECT id FROM auth.users WHERE email = 'admin@example.com'), 
  format('{"sub":"%s","email":"%s"}', (SELECT id FROM auth.users WHERE email = 'admin@example.com')::text, 'admin@example.com')::jsonb, 
  'email', 
  now(), 
  now(), 
  now()
);
