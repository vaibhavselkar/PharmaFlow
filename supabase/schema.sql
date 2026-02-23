-- PharmaFlow Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Distributors table
CREATE TABLE distributors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) UNIQUE NOT NULL,
  contact_phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Pharmacies table
CREATE TABLE pharmacies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_name VARCHAR(255) NOT NULL,
  owner_name VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50),
  email VARCHAR(255) UNIQUE NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  license_number VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Agents (Delivery Agents) table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50),
  email VARCHAR(255) UNIQUE NOT NULL,
  distributor_id UUID REFERENCES distributors(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Agent Assignments (which pharmacies an agent serves)
CREATE TABLE agent_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  pharmacy_id UUID REFERENCES pharmacies(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(agent_id, pharmacy_id)
);

-- 5. Medicines table
CREATE TABLE medicines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  distributor_id UUID REFERENCES distributors(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  salt_name VARCHAR(255),
  brand VARCHAR(255),
  mrp DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  category VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pharmacy_id UUID REFERENCES pharmacies(id) ON DELETE SET NULL,
  pharmacy_name VARCHAR(255),
  distributor_id UUID REFERENCES distributors(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'packed', 'out_for_delivery', 'delivered')),
  special_instructions TEXT,
  total_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Order Items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  medicine_id UUID REFERENCES medicines(id) ON DELETE SET NULL,
  medicine_name VARCHAR(255),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL
);

-- 8. Admin profiles table (extends Supabase Auth)
CREATE TABLE admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_agents_distributor ON agents(distributor_id);
CREATE INDEX idx_medicines_distributor ON medicines(distributor_id);
CREATE INDEX idx_orders_pharmacy ON orders(pharmacy_id);
CREATE INDEX idx_orders_distributor ON orders(distributor_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_agent_assignments_agent ON agent_assignments(agent_id);
CREATE INDEX idx_agent_assignments_pharmacy ON agent_assignments(pharmacy_id);

-- Enable Row Level Security (RLS)
ALTER TABLE distributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_profiles (users can only see their own profile)
CREATE POLICY "Users can view own profile" ON admin_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON admin_profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for distributors (authenticated users can do all)
CREATE POLICY "Authenticated users can do everything on distributors" ON distributors
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for pharmacies
CREATE POLICY "Authenticated users can do everything on pharmacies" ON pharmacies
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for agents
CREATE POLICY "Authenticated users can do everything on agents" ON agents
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for agent_assignments
CREATE POLICY "Authenticated users can do everything on agent_assignments" ON agent_assignments
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for medicines
CREATE POLICY "Authenticated users can do everything on medicines" ON medicines
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for orders
CREATE POLICY "Authenticated users can do everything on orders" ON orders
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for order_items
CREATE POLICY "Authenticated users can do everything on order_items" ON order_items
  FOR ALL USING (auth.role() = 'authenticated');

-- Function to handle new user signup (triggered by Supabase Auth)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admin_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create admin profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data (using proper UUID format or letting DB generate)

-- Sample Distributor
INSERT INTO distributors (agency_name, contact_email, contact_phone, address, city, state)
VALUES 
  ('MedSupply Distributors', 'distributor@demo.com', '+91-9876543210', '42 Industrial Area, Phase 2', 'Mumbai', 'Maharashtra');

-- Get the distributor ID for use in other inserts
DO $$
DECLARE
  dist_id UUID;
BEGIN
  SELECT id INTO dist_id FROM distributors WHERE contact_email = 'distributor@demo.com';
  
  -- Sample Pharmacies
  INSERT INTO pharmacies (store_name, owner_name, contact_phone, email, address, city, state, license_number)
  VALUES 
    ('HealthFirst Pharmacy', 'Rajesh Patel', '+91-9812345678', 'pharmacy@demo.com', '12 MG Road', 'Mumbai', 'Maharashtra', 'MH-PH-2024-001'),
    ('City Care Pharmacy', 'Meena Gupta', '+91-9823456789', 'pharmacy2@demo.com', '88 Station Road', 'Pune', 'Maharashtra', 'MH-PH-2024-002'),
    ('Green Cross Pharmacy', 'Suresh Kumar', '+91-9834567890', 'pharmacy3@demo.com', '5 Civil Lines', 'Nagpur', 'Maharashtra', 'MH-PH-2024-003');

  -- Sample Agents
  INSERT INTO agents (name, contact_phone, email, distributor_id)
  VALUES 
    ('Vikram Singh', '+91-9845678901', 'agent@demo.com', dist_id);

  -- Sample Agent Assignments
  INSERT INTO agent_assignments (agent_id, pharmacy_id)
  SELECT a.id, p.id
  FROM agents a, pharmacies p
  WHERE a.email = 'agent@demo.com'
  AND p.store_name IN ('HealthFirst Pharmacy', 'City Care Pharmacy')
  LIMIT 2;

  -- Sample Medicines
  INSERT INTO medicines (distributor_id, name, salt_name, brand, mrp, stock, category, description)
  VALUES 
    (dist_id, 'Amoxil 500', 'Amoxicillin', 'GSK', 125.00, 500, 'Antibiotics', 'Broad-spectrum antibiotic'),
    (dist_id, 'Crocin Advance', 'Paracetamol', 'GSK', 32.00, 1200, 'Pain Relief', 'Fever and pain relief'),
    (dist_id, 'Glycomet 500', 'Metformin', 'USV', 45.00, 800, 'Diabetes', 'Type 2 diabetes management'),
    (dist_id, 'Atorva 10', 'Atorvastatin', 'Zydus', 98.00, 350, 'Cardiac', 'Cholesterol management'),
    (dist_id, 'Omez 20', 'Omeprazole', 'Dr. Reddys', 65.00, 900, 'Gastric', 'Acid reflux and ulcer treatment'),
    (dist_id, 'Ciplox 500', 'Ciprofloxacin', 'Cipla', 78.00, 420, 'Antibiotics', 'Fluoroquinolone antibiotic'),
    (dist_id, 'Brufen 400', 'Ibuprofen', 'Abbott', 38.00, 1500, 'Pain Relief', 'Anti-inflammatory pain relief'),
    (dist_id, 'Stamlo 5', 'Amlodipine', 'Dr. Reddys', 55.00, 600, 'Cardiac', 'Blood pressure management'),
    (dist_id, 'Repace 50', 'Losartan', 'Sun Pharma', 82.00, 300, 'Cardiac', 'Hypertension treatment'),
    (dist_id, 'Alerid 10', 'Cetirizine', 'Cipla', 28.00, 2000, 'Allergy', 'Antihistamine for allergies'),
    (dist_id, 'Azithral 500', 'Azithromycin', 'Alembic', 110.00, 250, 'Antibiotics', 'Macrolide antibiotic'),
    (dist_id, 'Pan 40', 'Pantoprazole', 'Alkem', 72.00, 700, 'Gastric', 'Proton pump inhibitor'),
    (dist_id, 'Montair 10', 'Montelukast', 'Cipla', 145.00, 180, 'Respiratory', 'Asthma and allergy management'),
    (dist_id, 'Doxyt-SL', 'Doxycycline', 'Dr. Reddys', 92.00, 330, 'Antibiotics', 'Tetracycline antibiotic'),
    (dist_id, 'Zinetac 150', 'Ranitidine', 'GSK', 25.00, 400, 'Gastric', 'H2 receptor antagonist'),
    (dist_id, 'Mox 500', 'Amoxicillin', 'Ranbaxy', 95.00, 380, 'Antibiotics', 'Broad-spectrum antibiotic'),
    (dist_id, 'Dolo 650', 'Paracetamol', 'Micro Labs', 30.00, 2500, 'Pain Relief', 'Fever and pain relief');

  -- Sample Orders
  INSERT INTO orders (pharmacy_id, pharmacy_name, distributor_id, status, special_instructions, total_amount, created_at, updated_at)
  SELECT 
    p.id,
    p.store_name,
    dist_id,
    'delivered',
    'Deliver before 10 AM',
    9450.00,
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '8 days'
  FROM pharmacies p WHERE p.store_name = 'HealthFirst Pharmacy';

  INSERT INTO orders (pharmacy_id, pharmacy_name, distributor_id, status, special_instructions, total_amount, created_at, updated_at)
  SELECT 
    p.id,
    p.store_name,
    dist_id,
    'out_for_delivery',
    NULL,
    4190.00,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '1 day'
  FROM pharmacies p WHERE p.store_name = 'HealthFirst Pharmacy';

  INSERT INTO orders (pharmacy_id, pharmacy_name, distributor_id, status, special_instructions, total_amount, created_at, updated_at)
  SELECT 
    p.id,
    p.store_name,
    dist_id,
    'packed',
    'Fragile items - handle with care',
    7495.00,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '1 day'
  FROM pharmacies p WHERE p.store_name = 'City Care Pharmacy';

  INSERT INTO orders (pharmacy_id, pharmacy_name, distributor_id, status, special_instructions, total_amount, created_at, updated_at)
  SELECT 
    p.id,
    p.store_name,
    dist_id,
    'pending',
    NULL,
    4100.00,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  FROM pharmacies p WHERE p.store_name = 'HealthFirst Pharmacy';

  INSERT INTO orders (pharmacy_id, pharmacy_name, distributor_id, status, special_instructions, total_amount, created_at, updated_at)
  SELECT 
    p.id,
    p.store_name,
    dist_id,
    'pending',
    'Call before delivery',
    5620.00,
    NOW(),
    NOW()
  FROM pharmacies p WHERE p.store_name = 'Green Cross Pharmacy';

  -- Sample Order Items
  INSERT INTO order_items (order_id, medicine_id, medicine_name, quantity, unit_price)
  SELECT o.id, m.id, m.name, 50, 125.00
  FROM orders o, medicines m
  WHERE o.pharmacy_name = 'HealthFirst Pharmacy' AND o.status = 'delivered'
  AND m.name = 'Amoxil 500'
  LIMIT 1;

  INSERT INTO order_items (order_id, medicine_id, medicine_name, quantity, unit_price)
  SELECT o.id, m.id, m.name, 100, 32.00
  FROM orders o, medicines m
  WHERE o.pharmacy_name = 'HealthFirst Pharmacy' AND o.status = 'delivered'
  AND m.name = 'Crocin Advance'
  LIMIT 1;

  INSERT INTO order_items (order_id, medicine_id, medicine_name, quantity, unit_price)
  SELECT o.id, m.id, m.name, 30, 65.00
  FROM orders o, medicines m
  WHERE o.pharmacy_name = 'HealthFirst Pharmacy' AND o.status = 'out_for_delivery'
  AND m.name = 'Omez 20'
  LIMIT 1;

  INSERT INTO order_items (order_id, medicine_id, medicine_name, quantity, unit_price)
  SELECT o.id, m.id, m.name, 80, 28.00
  FROM orders o, medicines m
  WHERE o.pharmacy_name = 'HealthFirst Pharmacy' AND o.status = 'out_for_delivery'
  AND m.name = 'Alerid 10'
  LIMIT 1;

  INSERT INTO order_items (order_id, medicine_id, medicine_name, quantity, unit_price)
  SELECT o.id, m.id, m.name, 40, 45.00
  FROM orders o, medicines m
  WHERE o.pharmacy_name = 'City Care Pharmacy' AND o.status = 'packed'
  AND m.name = 'Glycomet 500'
  LIMIT 1;

  INSERT INTO order_items (order_id, medicine_id, medicine_name, quantity, unit_price)
  SELECT o.id, m.id, m.name, 25, 55.00
  FROM orders o, medicines m
  WHERE o.pharmacy_name = 'City Care Pharmacy' AND o.status = 'packed'
  AND m.name = 'Stamlo 5'
  LIMIT 1;

  INSERT INTO order_items (order_id, medicine_id, medicine_name, quantity, unit_price)
  SELECT o.id, m.id, m.name, 60, 72.00
  FROM orders o, medicines m
  WHERE o.pharmacy_name = 'City Care Pharmacy' AND o.status = 'packed'
  AND m.name = 'Pan 40'
  LIMIT 1;

  INSERT INTO order_items (order_id, medicine_id, medicine_name, quantity, unit_price)
  SELECT o.id, m.id, m.name, 20, 110.00
  FROM orders o, medicines m
  WHERE o.pharmacy_name = 'HealthFirst Pharmacy' AND o.status = 'pending'
  AND m.name = 'Azithral 500'
  LIMIT 1;

  INSERT INTO order_items (order_id, medicine_id, medicine_name, quantity, unit_price)
  SELECT o.id, m.id, m.name, 50, 38.00
  FROM orders o, medicines m
  WHERE o.pharmacy_name = 'HealthFirst Pharmacy' AND o.status = 'pending'
  AND m.name = 'Brufen 400'
  LIMIT 1;

  INSERT INTO order_items (order_id, medicine_id, medicine_name, quantity, unit_price)
  SELECT o.id, m.id, m.name, 30, 98.00
  FROM orders o, medicines m
  WHERE o.pharmacy_name = 'Green Cross Pharmacy' AND o.status = 'pending'
  AND m.name = 'Atorva 10'
  LIMIT 1;

  INSERT INTO order_items (order_id, medicine_id, medicine_name, quantity, unit_price)
  SELECT o.id, m.id, m.name, 15, 82.00
  FROM orders o, medicines m
  WHERE o.pharmacy_name = 'Green Cross Pharmacy' AND o.status = 'pending'
  AND m.name = 'Repace 50'
  LIMIT 1;

  INSERT INTO order_items (order_id, medicine_id, medicine_name, quantity, unit_price)
  SELECT o.id, m.id, m.name, 10, 145.00
  FROM orders o, medicines m
  WHERE o.pharmacy_name = 'Green Cross Pharmacy' AND o.status = 'pending'
  AND m.name = 'Montair 10'
  LIMIT 1;

END $$;

-- Display success message
SELECT 'Database schema and sample data created successfully!' AS message;
