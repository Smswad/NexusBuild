# NexusBuild

NexusBuild is a full-stack web application developed as an academic project for the course **CSE412 - Software Engineering** at *East West University*. The platform bridges the gap between physical real estate infrastructure and digital accessibility for an external client, providing an interactive, map-based interface alongside comprehensive account and project management modules.

---

## 👥 Project Team & Stakeholders

### Course Details
*   **Course:** CSE412 – Software Engineering
*   **Section:** 2

### Course Instructor
*   **Dr. Mohammad Mahdi Hassan**  
    Associate Professor, Department of Computer Science & Engineering  
    *East West University*

### External Client
*   **Business Name:** Reliance Housing Ltd.
*   **Office Address:** Shamabay New Market, 259 B B Road, Balur Math, Narayanganj 1400
*   **Client Representative:** SM Pabel
*   **Contact Number:** +8801614246090
*   **Client Address:** Shwapno (Masdair), Octo Office, Narayanganj

### Group Members & Project Roles (Group 2)
| ID | First Name | Last Name | Academic / Project Role |
| :--- | :--- | :--- | :--- |
| **2023-2-60-036** | Shahil Mahmud | Swad | Team Lead + Fronted Developer |
| **2023-3-60-090** | Md Saiful Islam | Emon | Database Manager |
| **2023-2-60-060** | Galib Hasan | Siam | HR of Project and Prompt Engineer |
| **2023-2-60-135** | Md Bellal | Hosen | Frontend Graphics Designer |
| **2023-2-60-040** | Debangshu Saha | Arghya | Backend Developer |

---

## Problem Statement
Traditional interaction between real estate companies and clients heavily relies on scattered phone calls, physical site visits, and generic emails. Reliance Housing Ltd., a premier company specializing in building construction, infrastructure development, and structural rebuilding, lacks a unified digital touchpoint. Clients currently have no dynamic way to visualize ongoing projects, surrounding neighborhood amenities, or seamlessly manage their property services online, leading to communication gaps and slower sales cycles.

---

## Proposed Solution & Project Scope
NexusBuild solves these communication gaps through four unified, core engineering modules:

*   **Interactive Neighborhood Mapping (GIS):** A unique, map-based interface allowing prospective buyers to visually explore Reliance projects. Users can view the surroundings of a building, including nearby shops, educational institutions, hospitals, and transit points.
*   **User Accounts & Personal Dashboards:** Secure portals for customers to track their booking status, payment history, and structural project updates in real-time.
*   **Service & Rebuilding Management:** A dedicated channel where clients can request specific infrastructure services, submit building remodeling/rebuilding queries, and track site-inspection schedules.
*   **Admin Control Panel:** A robust back-end dashboard for Reliance Housing management to update building availability, map markers, and respond to customer service requests efficiently.

---

## System Architecture

```text
+-------------------------------------------------------------------------+
|                              CLIENT LAYER                               |
|               React.js / Tailwind CSS (Single Page App)                 |
+-----------------------------------+-------------------------------------+
                                    |
                                    | HTTPS Requests (JSON)
                                    v
+-----------------------------------+-------------------------------------+
|                              API GATEWAY                                |
|         Routing, Session Authentication (JWT), Traffic Control           |
+-----------------------------------+-------------------------------------+
                                    |
                                    v
+-----------------------------------+-------------------------------------+
|                         APPLICATION BUSINESS LOGIC                      |
|                  Node.js / Express.js Backend Server                    |
|                                                                         |
|  [User Mgt Component]  [Map Processing Engine]  [Finance & Billing]     |
+-----------------+-----------------+--------------------+----------------+
                  |                 |                    |
                  |                 |                    | External GIS Data
                  v                 v                    v
+-----------------+---+   +---------+---------+   +------+----------------+
|  DATABASE LAYER     |   | CACHING LAYER     |   | EXTERNAL SERVICES     |
|  Oracle Database    |   | Redis (Sessions & |   | Google Maps API /     |
|  (User & Payments)  |   | Map Markers)      |   | Mapbox Engine         |
+---------------------+   +-------------------+   +-----------------------+


---

## Backend Architecture & API Testing

The backend server is structured with separation of concerns into dedicated modules for configuration, controllers, middleware, routes, and validation schemas.

### Directory Structure
```text
backend/
├── config/
│   ├── env.js                      # Environment variables loader & validation
│   └── supabase.js                 # Supabase client & admin initialization
├── controllers/
│   ├── auth.controller.js          # Authentication (register, login, me)
│   ├── chat.controller.js          # AI support assistant (GoogleGenAI + fileSearch)
│   ├── leads.controller.js         # Customer inquiries & leads
│   ├── map.controller.js           # GIS Google Maps shortlink resolver
│   └── projects.controller.js      # Project catalog & management
├── middleware/
│   ├── auth.middleware.js          # JWT authentication & requireAdmin RBAC
│   ├── errorHandler.middleware.js  # Centralized error handler & 404 router
│   └── validate.middleware.js      # Generic Zod request schema validation
├── routes/
│   ├── auth.routes.js              # /api/auth/* endpoints
│   ├── chat.routes.js              # /api/chat endpoint
│   ├── leads.routes.js             # /api/leads & /api/inquiries endpoints
│   ├── map.routes.js               # /api/resolve-map endpoint
│   └── projects.routes.js          # /api/projects/* endpoints
├── validators/
│   └── schemas.js                  # Zod validation schemas
└── server.js                       # Express app initialization & route wiring
```

### Running the Backend Server
```bash
npm run backend
# Server will listen on http://localhost:5001
```

### API Endpoints & cURL Testing Guide

#### 1. Server Health Check (`GET /api/health`)
Verify API connectivity and service status:
```bash
curl -X GET http://localhost:5001/api/health
```
**Expected Response (200 OK):**
```json
{
  "status": "ok",
  "service": "NexusBuild API",
  "timestamp": "2026-10-22T19:54:11.627Z"
}
```

#### 2. User Registration (`POST /api/auth/register`)
Validated with Zod schema (`fullName`, `email`, `password`, optional `phoneNumber`):
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Shahil Mahmud",
    "email": "user@example.com",
    "password": "Password123!",
    "phoneNumber": "+8801700000000"
  }'
```
**Expected Response (201 Created):**
```json
{
  "message": "Registration successful!",
  "user": { "id": "...", "email": "user@example.com" },
  "session": { "access_token": "..." }
}
```

#### 3. User Login (`POST /api/auth/login`)
Validated with Zod schema (`email`, `password`):
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }'
```
**Expected Response (200 OK):**
```json
{
  "message": "Login successful",
  "session": { "access_token": "..." },
  "user": { "id": "...", "email": "user@example.com" }
}
```

#### 4. Customer Inquiries & Leads (`POST /api/inquiries` or `POST /api/leads`)
Validated with Zod schema (requires `name`, at least one contact method `email` or `phone`, and `message` or `interest`):
```bash
curl -X POST http://localhost:5001/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tanvir Ahmed",
    "email": "tanvir@example.com",
    "phone": "+8801812345678",
    "subject": "Booking Query",
    "message": "Interested in 3-bedroom luxury flat in Narayanganj.",
    "source": "Website Contact Form"
  }'
```
**Expected Response (201 Created):**
```json
{
  "message": "Inquiry submitted successfully",
  "lead": {
    "name": "Tanvir Ahmed",
    "phone": "+8801812345678",
    "interest": "Booking Query: Interested in 3-bedroom luxury flat in Narayanganj.",
    "source": "Website Contact Form",
    "status": "New"
  }
}
```

#### 5. AI Support Chat (`POST /api/chat`)
Validated with Zod schema (requires non-empty string `message`):
```bash
curl -X POST http://localhost:5001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What ongoing residential projects are available in Narayanganj?"
  }'
```
**Expected Response (200 OK):**
```json
{
  "reply": "NexusBuild offers premium luxury apartments in Narayanganj..."
}
```

#### 6. GIS Google Maps Shortlink Resolver (`GET /api/resolve-map`)
Validated with Zod query schema (`url` parameter):
```bash
curl -G "http://localhost:5001/api/resolve-map" \
  --data-urlencode "url=https://maps.app.goo.gl/example"
```
**Expected Response (200 OK):**
```json
{
  "resolvedUrl": "https://www.google.com/maps/place/..."
}
```

#### 7. Project Catalog (`GET /api/projects`)
```bash
curl -X GET http://localhost:5001/api/projects
```
**Expected Response (200 OK):**
```json
{
  "projects": [...]
}
```
