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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert public projects mock data
INSERT INTO public.public_projects (id, name, status, status_bg, location, type, image, description, price, area) VALUES
    ('1', 'Reliance Zenith Towers', 'AVAILABLE', '#a14000', 'Narayanganj', 'Residential', '/Frontend/Projects/Reliance_Zenith_Towers.svg', 'A masterpiece of urban living featuring panoramic river views, sky lounges, and smart-home integration across 32 premium floors.', 'Starting from ৳1.25Cr', '1,200 - 2,500 sqft'),
    ('2', 'Nexus Business Hub', 'SOLD OUT', '#000f22', 'BB Road', 'Commercial', '/Frontend/Projects/Nexus_Business_Hub.svg', 'Premium commercial units designed for headquarters, featuring column-free open floors, fibre-optic connectivity, and a rooftop conference suite.', 'Contact for Pricing', '3,000 - 10,000 sqft'),
    ('3', 'The Heritage Plaza', 'READY TO MOVE', '#0a3d2e', 'Shamabay', 'Mixed Use', '/Frontend/Projects/The_Heritage_Plaza.svg', 'Exquisite residency located in the heart of Narayanganj''s commercial district, blending heritage-inspired facades with modern interiors.', 'Starting from ৳95Lac', '900 - 1,800 sqft')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.public_projects DISABLE ROW LEVEL SECURITY;

