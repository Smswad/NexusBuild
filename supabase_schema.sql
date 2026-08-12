-- Supabase Schema for Nexus Build

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Clients Table (Maps to auth.users if they log in)
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Leads Table
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT,
    interest TEXT,
    source TEXT,
    status TEXT DEFAULT 'New',
    date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Applications Table
CREATE TABLE public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    unit TEXT,
    stage TEXT DEFAULT 'KYC Verification',
    status TEXT DEFAULT 'Pending',
    date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Projects Table
CREATE TABLE public.projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    total_units INTEGER DEFAULT 0,
    progress_phase INTEGER DEFAULT 1,
    phases JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Properties Table
CREATE TABLE public.properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    unit_name TEXT NOT NULL,
    location TEXT,
    area TEXT,
    handover_date TEXT,
    total_valuation TEXT,
    total_paid TEXT DEFAULT '0',
    other_charges TEXT DEFAULT '0',
    due_balance TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Installments Table
CREATE TABLE public.installments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    installment TEXT NOT NULL,
    due_date TEXT NOT NULL,
    amount TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    status_pill TEXT,
    active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. Transactions Table
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    type TEXT NOT NULL,
    amount TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 8. Site Updates Table
CREATE TABLE public.site_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    "desc" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 9. Tickets Table
CREATE TABLE public.tickets (
    id TEXT PRIMARY KEY,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    date TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert dummy data for Projects so references work
INSERT INTO public.projects (id, name, progress_phase) VALUES
    ('p1', 'Sardar Tower – Block A', 3),
    ('p2', 'Green Valley Residency', 1)
ON CONFLICT (id) DO NOTHING;

-- Turn off RLS temporarily for easy development/testing
-- In production, you MUST enable RLS and write policies.
ALTER TABLE public.clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.installments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_updates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets DISABLE ROW LEVEL SECURITY;

-- 10. Public Projects Table (For Public Website Catalog)
CREATE TABLE public.public_projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    status_bg TEXT,
    location TEXT NOT NULL,
    type TEXT NOT NULL,
    image TEXT,
    description TEXT,
    price TEXT,
    area TEXT,
    map_link TEXT,
    nearby_hospitals TEXT,
    nearby_schools TEXT,
    nearby_colleges TEXT,
    nearby_markets TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert public projects data (matching Admin Panel valid projects)
INSERT INTO public.public_projects (id, name, status, status_bg, location, type, image, description, price, area, map_link, nearby_hospitals, nearby_schools, nearby_colleges, nearby_markets) VALUES
    ('p1', 'Sardar Tower – Block A', 'AVAILABLE', '#a14000', 'Narayanganj', 'Mixed Use', '/Frontend/Projects/Reliance_Zenith_Towers.svg', 'A flagship mixed-use high-rise featuring luxury apartments, modern commercial office suites, and state-of-the-art structural foundation.', 'Starting from ৳1.50Cr', '1,400 - 2,800 sqft', 'https://maps.google.com/maps?q=23.6238,90.5000&z=15&output=embed', 'Narayanganj 200 Bed Hospital (0.8 km), Popular Diagnostic (1.2 km)', 'Ideal School & College (0.6 km), Narayanganj Govt High School (1.1 km)', 'Tolaram Govt College (1.3 km)', 'Shamabay New Market (0.3 km), Balur Math Market (0.7 km)'),
    ('p2', 'Green Valley Residency', 'READY TO MOVE', '#0a3d2e', 'Dhanmondi', 'Residential', '/Frontend/Projects/The_Heritage_Plaza.svg', 'Eco-friendly luxury residential gated community featuring lush green balconies, solar power integration, and peaceful surroundings.', 'Starting from ৳1.10Cr', '1,200 - 2,200 sqft', 'https://maps.google.com/maps?q=23.7461,90.3742&z=15&output=embed', 'Labaid Specialized Hospital (0.5 km), Square Hospital (1.4 km)', 'Scholastica School (0.8 km), Mastermind School (1.2 km)', 'Dhaka City College (0.7 km), State University (1.5 km)', 'Shimanto Square (0.6 km), Rapa Plaza (1.1 km)')
ON CONFLICT (id) DO UPDATE SET
    map_link = EXCLUDED.map_link,
    nearby_hospitals = EXCLUDED.nearby_hospitals,
    nearby_schools = EXCLUDED.nearby_schools,
    nearby_colleges = EXCLUDED.nearby_colleges,
    nearby_markets = EXCLUDED.nearby_markets;

ALTER TABLE public.public_projects DISABLE ROW LEVEL SECURITY;

-- 11. System Settings Table (Global company configurations)
CREATE TABLE public.system_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    settings JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.system_settings DISABLE ROW LEVEL SECURITY;

-- Insert default system settings
INSERT INTO public.system_settings (id, settings) VALUES
    ('global', '{
        "companyName": "Reliance Housing Ltd.",
        "regNumber": "REG-2023-998811",
        "headOfficeAddress": "Shamabay New Market, 259 B B Road, Narayanganj",
        "supportEmail": "info@reliancehousing.com",
        "supportPhone": "+880 1234 567890"
    }'::jsonb)
ON CONFLICT (id) DO NOTHING;


