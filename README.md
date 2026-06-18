# NexusBuild 🌐

NexusBuild is a full-stack web application developed as an academic project for the course **CSE412 - Software Engineering** at *East West University*. The platform bridges the gap between physical real estate infrastructure and digital accessibility for an external client, providing an interactive, map-based interface alongside comprehensive account and project management modules.

---

## 👥 Project Team & Stakeholders

### Course Details
*   **Course:** CSE412 – Software Engineering
*   **Section:** 2
*   **Date of Submission:** June 7, 2026

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

### Group Members & Project Roles (Group 5)
| ID | First Name | Last Name | Academic / Project Role |
| :--- | :--- | :--- | :--- |
| **2023-2-60-036** | Shahil Mahmud | Swad | Team Lead |
| **2023-3-60-090** | Md Saiful | Islam | Emon |
| **2023-2-60-060** | Galib Hasan | Siam | Project Member |
| **2023-2-60-135** | Md Bellal | Hosen | Project Member |
| **2023-2-60-040** | Debangshu Saha | Arghya | Project Member |

---

## 📝 Problem Statement
Traditional interaction between real estate companies and clients heavily relies on scattered phone calls, physical site visits, and generic emails. Reliance Housing Ltd., a premier company specializing in building construction, infrastructure development, and structural rebuilding, lacks a unified digital touchpoint. Clients currently have no dynamic way to visualize ongoing projects, surrounding neighborhood amenities, or seamlessly manage their property services online, leading to communication gaps and slower sales cycles.

---

## 🚀 Proposed Solution & Project Scope
NexusBuild solves these communication gaps through four unified, core engineering modules:

*   **Interactive Neighborhood Mapping (GIS):** A unique, map-based interface allowing prospective buyers to visually explore Reliance projects. Users can view the surroundings of a building, including nearby shops, educational institutions, hospitals, and transit points.
*   **User Accounts & Personal Dashboards:** Secure portals for customers to track their booking status, payment history, and structural project updates in real-time.
*   **Service & Rebuilding Management:** A dedicated channel where clients can request specific infrastructure services, submit building remodeling/rebuilding queries, and track site-inspection schedules.
*   **Admin Control Panel:** A robust back-end dashboard for Reliance Housing management to update building availability, map markers, and respond to customer service requests efficiently.

---

## 🛠️ System Architecture

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