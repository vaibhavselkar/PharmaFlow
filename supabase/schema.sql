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
CREATE INDEX idx_pharmacies_distributor ON agents(distributor_id);
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

-- Insert sample data

-- Sample Distributor
INSERT INTO distributors (id, agency_name, contact_email, contact_phone, address, city, state)
VALUES 
  ('dist-00001-0001-0001-0001-000000000001', 'MedSupply Distributors', 'distributor@demo.com', '+91-9876543210', '42 Industrial Area, Phase 2', 'Mumbai', 'Maharashtra');

-- Sample Pharmacies
INSERT INTO pharmacies (id, store_name, owner_name, contact_phone, email, address, city, state, license_number)
VALUES 
  ('pharmacy-00001-0001-0001', 'HealthFirst Pharmacy', 'Rajesh Patel', '+91-9812345678', 'pharmacy@demo.com', '12 MG Road', 'Mumbai', 'Maharashtra', 'MH-PH-2024-001'),
  ('pharmacy-00002-0001-0002', 'City Care Pharmacy', 'Meena Gupta', '+91-9823456789', 'pharmacy2@demo.com', '88 Station Road', 'Pune', 'Maharashtra', 'MH-PH-2024-002'),
  ('pharmacy-00003-0001-0003', 'Green Cross Pharmacy', 'Suresh Kumar', '+91-9834567890', 'pharmacy3@demo.com', '5 Civil Lines', 'Nagpur', 'Maharashtra', 'MH-PH-2024-003');

-- Sample Agents
INSERT INTO agents (id, name, contact_phone, email, distributor_id)
VALUES 
  ('agent-00001-0001-0001', 'Vikram Singh', '+91-9845678901', 'agent@demo.com', 'dist-00001-0001-0001-0001-000000000001');

-- Sample Agent Assignments
INSERT INTO agent_assignments (id, agent_id, pharmacy_id)
VALUES 
  ('assign-00001-0001-0001', 'agent-00001-0001-0001', 'pharmacy-00001-0001-0001'),
  ('assign-00001-0001-0002', 'agent-00001-0001-0001', 'pharmacy-00002-0001-0002');

-- Sample Medicines
INSERT INTO medicines (id, distributor_id, name, salt_name, brand, mrp, stock, category, description)
VALUES 
  ('med-00001-0001-0001', 'dist-00001-0001-0001-0001-000000000001', 'Amoxil 500', 'Amoxicillin', 'GSK', 125.00, 500, 'Antibiotics', 'Broad-spectrum antibiotic'),
  ('med-00001-0001-0002', 'dist-00001-0001-0001-0001-000000000001', 'Crocin Advance', 'Paracetamol', 'GSK', 32.00, 1200, 'Pain Relief', 'Fever and pain relief'),
  ('med-00001-0001-0003', 'dist-00001-0001-0001-0001-000000000001', 'Glycomet 500', 'Metformin', 'USV', 45.00, 800, 'Diabetes', 'Type 2 diabetes management'),
  ('med-00001-0001-0004', 'dist-00001-0001-0001-0001-000000000001', 'Atorva 10', 'Atorvastatin', 'Zydus', 98.00, 350, 'Cardiac', 'Cholesterol management'),
  ('med-00001-0001-0005', 'dist-00001-0001-0001-0001-000000000001', 'Omez 20', 'Omeprazole', 'Dr. Reddys', 65.00, 900, 'Gastric', 'Acid reflux and ulcer treatment'),
  ('med-00001-0001-0006', 'dist-00001-0001-0001-0001-000000000001', 'Ciplox 500', 'Ciprofloxacin', 'Cipla', 78.00, 420, 'Antibiotics', 'Fluoroquinolone antibiotic'),
  ('med-00001-0001-0007', 'dist-00001-0001-0001-0001-000000000001', 'Brufen 400', 'Ibuprofen', 'Abbott', 38.00, 1500, 'Pain Relief', 'Anti-inflammatory pain relief'),
  ('med-00001-0001-0008', 'dist-00001-0001-0001-0001-000000000001', 'Stamlo 5', 'Amlodipine', 'Dr. Reddys', 55.00, 600, 'Cardiac', 'Blood pressure management'),
  ('med-00001-0001-0009', 'dist-00001-0001-0001-0001-000000000001', 'Repace 50', 'Losartan', 'Sun Pharma', 82.00, 300, 'Cardiac', 'Hypertension treatment'),
  ('med-00001-0001-0010', 'dist-00001-0001-0001-0001-000000000001', 'Alerid 10', 'Cetirizine', 'Cipla', 28.00, 2000, 'Allergy', 'Antihistamine for allergies'),
  ('med-00001-0001-0011', 'dist-00001-0001-0001-0001-000000000001', 'Azithral 500', 'Azithromycin', 'Alembic', 110.00, 250, 'Antibiotics', 'Macrolide antibiotic'),
  ('med-00001-0001-0012', 'dist-00001-0001-0001-0001-000000000001', 'Pan 40', 'Pantoprazole', 'Alkem', 72.00, 700, 'Gastric', 'Proton pump inhibitor'),
  ('med-00001-0001-0013', 'dist-00001-0001-0001-0001-000000000001', 'Montair 10', 'Montelukast', 'Cipla', 145.00, 180, 'Respiratory', 'Asthma and allergy management'),
  ('med-00001-0001-0014', 'dist-00001-0001-0001-0001-000000000001', 'Doxyt-SL', 'Doxycycline', 'Dr. Reddys', 92.00, 330, 'Antibiotics', 'Tetracycline antibiotic'),
  ('med-00001-0001-0015', 'dist-00001-0001-0001-0001-000000000001', 'Zinetac 150', 'Ranitidine', 'GSK', 25.00, 400, 'Gastric', 'H2 receptor antagonist'),
  ('med-00001-0001-0016', 'dist-00001-0001-0001-0001-000000000001', 'Mox 500', 'Amoxicillin', 'Ranbaxy', 95.00, 380, 'Antibiotics', 'Broad-spectrum antibiotic'),
  ('med-00001-0001-0017', 'dist-00001-0001-0001-0001-000000000001', 'Dolo 650', 'Paracetamol', 'Micro Labs', 30.00, 2500, 'Pain Relief', 'Fever and pain relief');

-- Sample Orders
INSERT INTO orders (id, pharmacy_id, pharmacy_name, distributor_id, status, special_instructions, total_amount, created_at, updated_at)
VALUES 
  ('order-00001-0001-0001', 'pharmacy-00001-0001-0001', 'HealthFirst Pharmacy', 'dist-00001-0001-0001-0001-000000000001', 'delivered', 'Deliver before 10 AM', 9450.00, NOW() - INTERVAL '10 days', NOW() - INTERVAL '8 days'),
  ('order-00001-0001-0002', 'pharmacy-00001-0001-0001', 'HealthFirst Pharmacy', 'dist-00001-0001-0001-0001-000000000001', 'out_for_delivery', NULL, 4190.00, NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day'),
  ('order-00001-0001-0003', 'pharmacy-00002-0001-0002', 'City Care Pharmacy', 'dist-00001-0001-0001-0001-000000000001', 'packed', 'Fragile items - handle with care', 7495.00, NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),
  ('order-00001-0001-0004', 'pharmacy-00001-0001-0001', 'HealthFirst Pharmacy', 'dist-00001-0001-0001-0001-000000000001', 'pending', NULL, 4100.00, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
  ('order-00001-0001-0005', 'pharmacy-00003-0001-0003', 'Green Cross Pharmacy', 'dist-00001-0001-0001-0001-000000000001', 'pending', 'Call before delivery', 5620.00, NOW(), NOW());

-- Sample Order Items
INSERT INTO order_items (id, order_id, medicine_id, medicine_name, quantity, unit_price)
VALUES 
  ('oi-00001-0001-0001', 'order-00001-0001-0001', 'med-00001-0001-0001', 'Amoxil 500', 50, 125.00),
  ('oi-00001-0001-0002', 'order-00001-0001-0001', 'med-00001-0001-0002', 'Crocin Advance', 100, 32.00),
  ('oi-00001-0001-0003', 'order-00001-0001-0002', 'med-00001-0001-0005', 'Omez 20', 30, 65.00),
  ('oi-00001-0001-0004', 'order-00001-0001-0002', 'med-00001-0001-0010', 'Alerid 10', 80, 28.00),
  ('oi-00001-0001-0005', 'order-00001-0001-0003', 'med-00001-0001-0003', 'Glycomet 500', 40, 45.00),
  ('oi-00001-0001-0006', 'order-00001-0001-0003', 'med-00001-0001-0008', 'Stamlo 5', 25, 55.00),
  ('oi-00001-0001-0007', 'order-00001-0001-0003', 'med-00001-0001-0012', 'Pan 40', 60, 72.00),
  ('oi-00001-0001-0008', 'order-00001-0001-0004', 'med-00001-0001-0011', 'Azithral 500', 20, 110.00),
  ('oi-00001-0001-0009', 'order-00001-0001-0004', 'med-00001-0001-0007', 'Brufen 400', 50, 38.00),
  ('oi-00001-0001-0010', 'order-00001-0001-0005', 'med-00001-0001-0004', 'Atorva 10', 30, 98.00),
  ('oi-00001-0001-0011', 'order-00001-0001-0005', 'med-00001-0001-0009', 'Repace 50', 15, 82.00),
  ('oi-00001-0001-0012', 'order-00001-0001-0005', 'med-00001-0001-0013', 'Montair 10', 10, 145.00);

-- Display success message
SELECT 'Database schema and sample data created successfully!' AS message;
