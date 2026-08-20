import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from './Auth/server.js';
import { supabase } from './Auth/supabaseClient.js';

// ── Mocks Setup ───────────────────────────────────────────────────────────────

// Mock Supabase Auth methods
vi.mock('./Auth/supabaseClient.js', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
    },
  },
}));

// Mock GoogleGenAI SDK
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: vi.fn().mockImplementation(async ({ model }) => {
          if (model === 'invalid-model') {
            throw new Error('Model execution failed');
          }
          return { text: 'NexusBuild offers premium luxury apartments in Narayanganj.' };
        }),
      },
    })),
  };
});

describe('NexusBuild Backend API Specification Suite', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock environment variables
    process.env.GEMINI_FILE_SEARCH_STORE = 'fileSearchStores/nexus-build-store';
    process.env.GEMINI_API_KEY = 'mock-gemini-api-key';
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. AUTHENTICATION API ENDPOINTS (/api/auth/*)
  // ═══════════════════════════════════════════════════════════════════════════

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully with valid credentials (201 Created)', async () => {
      const mockUser = { id: 'usr-uuid-101', email: 'john@example.com' };
      const mockSession = { access_token: 'mock-access-jwt-token' };

      (supabase.auth.signUp as any).mockResolvedValueOnce({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'John Doe',
          email: 'john@example.com',
          phoneNumber: '+8801700000000',
          password: 'SecurePassword123!',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Registration successful!');
      expect(response.body.user).toEqual(mockUser);
      expect(response.body.session).toEqual(mockSession);
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'SecurePassword123!',
        options: {
          data: {
            full_name: 'John Doe',
            phone_number: '+8801700000000',
          },
        },
      });
    });

    it('should return 400 Bad Request when required field fullName is missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'john@example.com',
          password: 'Password123!',
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    it('should return 400 Bad Request when required field email is missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'John Doe',
          password: 'Password123!',
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    it('should return 400 Bad Request when password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'John Doe',
          email: 'john@example.com',
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    it('should return 400 Bad Request when Supabase auth returns an error (e.g. User already registered)', async () => {
      (supabase.auth.signUp as any).mockResolvedValueOnce({
        data: { user: null, session: null },
        error: new Error('User already registered'),
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Duplicate User',
          email: 'existing@example.com',
          password: 'Password123!',
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'User already registered' });
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate user successfully with correct credentials (200 OK)', async () => {
      const mockUser = { id: 'usr-uuid-202', email: 'client@nexusbuild.com' };
      const mockSession = { access_token: 'mock-valid-jwt-token' };

      (supabase.auth.signInWithPassword as any).mockResolvedValueOnce({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'client@nexusbuild.com',
          password: 'ValidPassword123!',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body.user).toEqual(mockUser);
      expect(response.body.session).toEqual(mockSession);
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'client@nexusbuild.com',
        password: 'ValidPassword123!',
      });
    });

    it('should return 400 Bad Request when email is omitted', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'Password123!',
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Email and password are required' });
    });

    it('should return 400 Bad Request when password is omitted', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'client@nexusbuild.com',
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Email and password are required' });
    });

    it('should return 400 Bad Request when Supabase authentication fails (Invalid credentials)', async () => {
      (supabase.auth.signInWithPassword as any).mockResolvedValueOnce({
        data: { user: null, session: null },
        error: new Error('Invalid login credentials'),
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'client@nexusbuild.com',
          password: 'WrongPassword!',
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid login credentials' });
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. AI CHATBOT API ENDPOINT (/api/chat)
  // ═══════════════════════════════════════════════════════════════════════════

  describe('POST /api/chat', () => {
    it('should return AI assistant reply for a valid non-empty user prompt (200 OK)', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'What projects are currently available in Narayanganj?',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('reply');
      expect(typeof response.body.reply).toBe('string');
      expect(response.body.reply).toContain('NexusBuild offers premium luxury apartments');
    });

    it('should return 400 Bad Request when message parameter is missing', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'message is required and must be a non-empty string',
      });
    });

    it('should return 400 Bad Request when message is an empty string or whitespace', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({ message: '   ' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'message is required and must be a non-empty string',
      });
    });

    it('should return 400 Bad Request when message is not a string type', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({ message: 12345 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'message is required and must be a non-empty string',
      });
    });

    it('should return 500 Internal Server Error if GEMINI_FILE_SEARCH_STORE environment variable is not set', async () => {
      delete process.env.GEMINI_FILE_SEARCH_STORE;

      const response = await request(app)
        .post('/api/chat')
        .send({ message: 'Hello AI' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'GEMINI_FILE_SEARCH_STORE environment variable is not set',
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. GIS MAP RESOLVER ENDPOINT (/api/resolve-map)
  // ═══════════════════════════════════════════════════════════════════════════

  describe('GET /api/resolve-map', () => {
    it('should return 400 Bad Request if url query parameter is missing', async () => {
      const response = await request(app).get('/api/resolve-map');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'url parameter is required' });
    });

    it('should resolve map location URL redirect cleanly (200 OK)', async () => {
      const mockTargetUrl = 'https://maps.google.com/short-link';
      const mockResolvedUrl = 'https://www.google.com/maps/place/Narayanganj';

      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockResolvedValueOnce({
        headers: {
          get: (headerName: string) =>
            headerName.toLowerCase() === 'location' ? mockResolvedUrl : null,
        },
      } as any);

      const response = await request(app)
        .get(`/api/resolve-map?url=${encodeURIComponent(mockTargetUrl)}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ resolvedUrl: mockResolvedUrl });

      global.fetch = originalFetch;
    });

    it('should return 500 Internal Server Error when fetch operation throws exception', async () => {
      const originalFetch = global.fetch;
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network connection failed'));

      const response = await request(app)
        .get('/api/resolve-map?url=https://unreachable-map-url.com');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Network connection failed' });

      global.fetch = originalFetch;
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. GLOBAL HTTP SECURITY & MIDDLEWARE SPECIFICATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Global Middleware & Security Headers', () => {
    it('should include CORS Access-Control-Allow-Origin header on HTTP responses', async () => {
      const response = await request(app).get('/api/resolve-map?url=http://test.com');
      expect(response.headers['access-control-allow-origin']).toBe('*');
    });

    it('should return JSON content-type header for all API responses', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'pass' });

      expect(response.headers['content-type']).toMatch(/json/);
    });
  });
});
