-- ============================================
-- ADMIN CREATION INSTRUCTIONS
-- ============================================

-- Since admin users need to be created securely through Supabase Auth,
-- follow these steps to create an admin:

-- STEP 1: Create user in Supabase Dashboard
-- 1. Go to https://supabase.com/dashboard
-- 2. Select your project
-- 3. Go to Authentication -> Users
-- 4. Click "Add user"
-- 5. Enter email: admin@pharmaflow.com (or any email you want)
-- 6. Enter a temporary password
-- 7. Click "Create user"
-- 8. Copy the User ID from the Users table

-- STEP 2: Add admin profile (run this SQL with your user ID)
-- Replace 'YOUR_USER_ID' with the actual user ID from Step 1

-- Example:
-- INSERT INTO admin_profiles (id, email, full_name) 
-- VALUES ('12345678-1234-1234-1234-123456789012', 'admin@pharmaflow.com', 'Admin');

-- ============================================
-- TESTING WITH DEMO ACCOUNTS
-- ============================================

-- For now, you can test using the existing demo accounts:
-- These are already in your database from previous SQL:

-- Login at /login (not /admin/login):
-- Pharmacy: pharmacy@demo.com / password
-- Distributor: distributor@demo.com / password  
-- Agent: agent@demo.com / password

-- The demo accounts will redirect to:
-- /dashboard/pharmacy
-- /dashboard/distributor
-- /dashboard/agent

SELECT 'Admin creation instructions saved. Use demo accounts for testing at /login' AS message;
