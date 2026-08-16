-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.inquire_nexus (
  full_name text NOT NULL,
  phone_number text NOT NULL,
  interest_area text NOT NULL,
  message text NOT NULL
);
CREATE TABLE public.registration (
  id uuid NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL UNIQUE CHECK (email ~~ '%@%.%'::text),
  phone_number text CHECK (phone_number IS NULL OR phone_number ~ '^\+?[0-9\-\s]{7,15}$'::text),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT registration_pkey PRIMARY KEY (id),
  CONSTRAINT registration_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.login_logs (
  log_id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone_number text,
  event_type text NOT NULL DEFAULT 'LOGIN'::text CHECK (event_type = ANY (ARRAY['LOGIN'::text, 'LOGOUT'::text])),
  logged_in_at timestamp with time zone NOT NULL DEFAULT now(),
  ip_address inet,
  user_agent text,
  login_method text NOT NULL DEFAULT 'email_password'::text,
  status text NOT NULL DEFAULT 'success'::text CHECK (status = ANY (ARRAY['success'::text, 'failed'::text])),
  CONSTRAINT login_logs_pkey PRIMARY KEY (log_id),
  CONSTRAINT login_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.admin_login_logs (
  log_id uuid NOT NULL DEFAULT gen_random_uuid(),
  admin_username text NOT NULL,
  event_type text NOT NULL DEFAULT 'LOGIN'::text CHECK (event_type = ANY (ARRAY['LOGIN'::text, 'LOGOUT'::text])),
  logged_at timestamp with time zone NOT NULL DEFAULT now(),
  ip_address inet,
  user_agent text,
  status text NOT NULL DEFAULT 'success'::text CHECK (status = ANY (ARRAY['success'::text, 'failed'::text])),
  CONSTRAINT admin_login_logs_pkey PRIMARY KEY (log_id)
);
CREATE TABLE public.clients (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  status text DEFAULT 'Active'::text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT clients_pkey PRIMARY KEY (id)
);
CREATE TABLE public.leads (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  phone text,
  interest text,
  source text,
  status text DEFAULT 'New'::text,
  date text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  email text,
  CONSTRAINT leads_pkey PRIMARY KEY (id)
);
CREATE TABLE public.applications (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  unit text,
  stage text DEFAULT 'KYC Verification'::text,
  status text DEFAULT 'Pending'::text,
  date text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT applications_pkey PRIMARY KEY (id)
);
CREATE TABLE public.projects (
  id text NOT NULL,
  name text NOT NULL,
  progress_phase integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  phases jsonb,
  CONSTRAINT projects_pkey PRIMARY KEY (id)
);
CREATE TABLE public.properties (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  client_id uuid,
  project_id text,
  unit_name text NOT NULL,
  location text,
  area text,
  handover_date text,
  total_valuation text,
  total_paid text DEFAULT '0'::text,
  other_charges text DEFAULT '0'::text,
  due_balance text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT properties_pkey PRIMARY KEY (id),
  CONSTRAINT properties_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id),
  CONSTRAINT properties_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
CREATE TABLE public.installments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  property_id uuid,
  installment text NOT NULL,
  due_date text NOT NULL,
  amount text NOT NULL,
  status text DEFAULT 'Pending'::text,
  status_pill text,
  active boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT installments_pkey PRIMARY KEY (id),
  CONSTRAINT installments_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id)
);
CREATE TABLE public.transactions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  property_id uuid,
  date text NOT NULL,
  type text NOT NULL,
  amount text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT transactions_pkey PRIMARY KEY (id),
  CONSTRAINT transactions_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id)
);
CREATE TABLE public.site_updates (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  project_id text,
  date text NOT NULL,
  title text NOT NULL,
  type text NOT NULL,
  desc text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT site_updates_pkey PRIMARY KEY (id),
  CONSTRAINT site_updates_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
CREATE TABLE public.tickets (
  id text NOT NULL,
  client_id uuid,
  subject text NOT NULL,
  status text DEFAULT 'Pending'::text,
  date text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT tickets_pkey PRIMARY KEY (id),
  CONSTRAINT tickets_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id)
);
CREATE TABLE public.public_projects (
  id text NOT NULL,
  name text NOT NULL,
  status text NOT NULL,
  status_bg text,
  location text NOT NULL,
  type text NOT NULL,
  image text,
  description text,
  price text,
  area text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT public_projects_pkey PRIMARY KEY (id)
);
CREATE TABLE public.system_settings (
  id text NOT NULL DEFAULT 'global'::text,
  settings jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT system_settings_pkey PRIMARY KEY (id)
);