# HAVEN – Conversational Property Search and Recommendation System

HAVEN is an AI-powered real estate platform that enables home seekers to discover properties through natural-language conversations instead of rigid filter forms. It understands nuanced preferences—such as location, budget, BHK, property type, amenities, nearby facilities, and lifestyle needs—and computes transparent, content-based recommendations backed by verified database records.

---

## 🌟 Key Features

1. **AI Conversational Property Search (`/chat`)**:
   - Natural language dialogue extracting locality, budget range, BHK layout, property type, amenities, and nearby facilities.
   - Preserves accumulated context across conversational turns.
   - Interactive live "Extracted Requirements" inspector panel allowing users to modify or remove specific criteria with 1-click.
   - Proactive clarification queries when search constraints are ambiguous.
   - Dual-engine architecture: Supports **Google Gemini API** (`gemini-1.5-flash`) or zero-configuration **Deterministic NLP engine** with rich conversational templates.

2. **Content-Based Recommendation Engine (`/api/recommendations`)**:
   - Hard constraints filtering (budget cap, BHK layout).
   - Multi-factor scoring (Locality match, budget compatibility curve, amenities overlap, nearby facility distance).
   - Normalized 0–100% Match Scores.
   - Generates transparent, human-readable match explanations (*"Why this matches"*).
   - Automatic relaxed alternative suggestions when strict constraints yield zero results.

3. **Property Listings & Advanced Search (`/properties`)**:
   - Grid and List views toggle.
   - Keyword search across title, locality, address, and amenities.
   - Interactive filters: Locality, Price slider, BHK pills, Property Type, Furnishing, Amenities checkboxes.
   - Sorting by Price (Low/High), Area, and Newest.
   - Comprehensive pagination and empty-state fallbacks.

4. **Property Details (`/properties/:id`)**:
   - High-resolution property photography gallery with thumbnail selector.
   - Detailed specifications: BHK, Area, Price/sq.ft, Facing, Furnishing, Floor elevation.
   - Interactive Amenities checklist with icons.
   - Nearby transit and civic facilities with precise distance indicators (Metro, Schools, Hospitals, IT Parks, Malls).
   - Interactive **"Schedule Visit / Inquire"** modal form with immediate feedback.
   - Similar properties recommendation carousel.

5. **Side-by-Side Property Comparison (`/compare`)**:
   - Matrix comparison for 2 to 4 properties simultaneously.
   - Compares price, price/sq.ft, BHK, area, location, and full society amenity matrices.
   - **AI Trade-Off Analysis**: Highlights economic advantages, space differences, and community features without making unsupported market claims.
   - "Highlight Differences" toggle.

6. **Market Insights & Decision Support (`/insights`)**:
   - Locality price benchmarks (average price, price range, average price/sq.ft in Hyderabad hubs).
   - Space vs. Commute trade-off analysis.
   - Transparent disclaimer clearly labelling sample demo data without speculative fabrication.

7. **User Dashboard (`/dashboard`)**:
   - Profile & lifestyle preferences management.
   - Saved properties (favorites) collection.
   - Conversational search history sessions with 1-click resumption.
   - Personalized recommendations based on past user activity.

8. **Admin Portal (`/admin`)**:
   - Role-based authorization enforced securely on the backend (HTTP 403 for unauthorized users).
   - Property listing CRUD (Create, Read, Update, Delete) with image URLs, specifications, and amenities.
   - Registered users list with role badges.
   - Real-time catalog metrics and one-click demo dataset reset.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React, Axios, React Router v7.
- **Backend**: Node.js, Express.js, MongoDB with Mongoose, JWT authentication, Bcrypt.js, Morgan, Express Rate Limit.
- **AI & NLP**: Multi-factor Content-Based Recommender, Deterministic Regex & Entity NLP Service, Optional Google Gemini 1.5 Flash integration.
- **Database**: MongoDB (Supports local daemon, MongoDB Atlas, and automatic high-performance in-memory fallback via `mongodb-memory-server` for instant zero-config startup).

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ / v24+ recommended)
- **npm**: v9.0.0 or higher
- **MongoDB**: (Optional) Local MongoDB or MongoDB Atlas URI. If no MongoDB service is running, HAVEN automatically boots an internal in-memory instance for turnkey operation!

### 1. Installation

Clone or open the repository:
```bash
cd c:\projects\Haven2
```

Install backend dependencies:
```bash
cd backend
npm install
```

Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### 2. Configuration (`.env`)

In `backend/.env` (defaults are pre-configured):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/haven_db
JWT_SECRET=haven_jwt_ultra_secure_secret_key_2026_production_grade_9876543210
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Optional: Add Google Gemini API Key for cloud LLM enhancement
GEMINI_API_KEY=
```

### 3. Database Seeding

The application automatically seeds 22 realistic Hyderabad listings and demo users upon first startup! You can also manually re-seed at any time:
```bash
cd backend
npm run seed
```

### 4. Running the Application

**Start the Backend Server (Port 5000):**
```bash
cd backend
npm start
```
*Health check URL: http://localhost:5000/api/health*

**Start the Frontend Dev Server (Port 5173):**
```bash
cd frontend
npm run dev
```
*Access the web app at: http://127.0.0.1:5173/*

---

## 🔑 Demo Accounts & Credentials

For fast evaluation, HAVEN includes pre-seeded demo credentials and 1-click login buttons on the sign-in page:

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@haven.ai` | `Admin@1234` | Full access to `/admin`, property CRUD, seed reset, user metrics |
| **User** | `user@haven.ai` | `User@1234` | Access to `/dashboard`, favorites, search history, personalized picks |

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` – Register user or admin account with hashed password.
- `POST /api/auth/login` – Authenticate credentials and receive JWT token.
- `GET /api/auth/me` – Retrieve authenticated user profile (Bearer token required).
- `PUT /api/auth/profile` – Update user name and lifestyle preferences.

### Properties (`/api/properties`)
- `GET /api/properties` – Search and filter properties (supports `search`, `locality`, `propertyType`, `minPrice`, `maxPrice`, `bhk`, `furnishing`, `amenities`, `sortBy`, `page`, `limit`).
- `GET /api/properties/featured` – Retrieve curated featured listings for homepage.
- `GET /api/properties/locality-stats` – Aggregated locality price and area benchmarks.
- `GET /api/properties/:id` – Detailed property view + 3 similar property suggestions.

### AI Conversational Search (`/api/ai`)
- `POST /api/ai/chat` – Process user query, extract parameters, merge session preferences, and return recommendations.
- `GET /api/ai/conversation/:sessionId` – Retrieve chat history and active preferences.
- `PUT /api/ai/conversation/:sessionId/preferences` – Direct user preference modification.
- `DELETE /api/ai/conversation/:sessionId` – Reset conversational search session.

### Recommendations & Comparison (`/api/recommendations`)
- `POST /api/recommendations` – Content-based scoring based on structured preferences object.
- `POST /api/recommendations/compare` – Side-by-side trade-off analysis for 2 to 4 property IDs.

### User Dashboard (`/api/user`)
- `POST /api/user/saved` – Toggle property in user favorites.
- `GET /api/user/saved` – Retrieve user's saved properties list.
- `GET /api/user/conversations` – Retrieve user's conversational search sessions.
- `GET /api/user/recommendations` – Retrieve personalized recommendations based on user favorites.

### Admin Portal (`/api/admin`) *(Protected: Bearer Token + Role: admin)*
- `GET /api/admin/stats` – System overview metrics (total properties, users, conversations, avg price).
- `POST /api/admin/properties` – Create new property listing.
- `PUT /api/admin/properties/:id` – Update existing property listing.
- `DELETE /api/admin/properties/:id` – Delete property listing.
- `GET /api/admin/users` – View all registered user records.
- `POST /api/admin/reset-seed` – Restore default 22 sample Hyderabad listings.

---

## 🧪 Automated Testing

HAVEN includes unit and integration tests covering natural language preference extraction, context merging, recommendation scoring, and role-based access control.

To run tests:
```bash
cd backend
npm test
```

Test coverage includes:
- Parsing budget representations in Lakhs and Crores (`₹60L`, `under 1.5 Cr`, `between 50 and 80 lakhs`).
- Extracting locality, BHK, property type, amenities, and nearby facilities from natural queries.
- Multi-turn context preservation and preference merging.
- Content-based scoring and match reason explanation generation.
- Role-based authorization tests preventing regular users from accessing admin routes.

---

## 🏙️ Sample Conversational Queries to Try

1. **Budget-Based Search:**
   > *"Find me 2BHK flats in HITEC City under ₹60 lakhs."*
2. **Amenity & Lifestyle Matching:**
   > *"Show me 3BHK apartments in Gachibowli with a swimming pool, clubhouse, and gym."*
3. **Commute & Metro Proximity:**
   > *"I need an affordable 2BHK near Miyapur metro station under ₹45 lakhs."*
4. **Multi-Turn Context Refinement:**
   > **User**: *"Show me flats in Kondapur under ₹75 lakhs."*  
   > **HAVEN**: *Returns matches and asks if gated community is preferred.*  
   > **User**: *"Yes, in a gated society near schools."*  
   > **HAVEN**: *Refines results to gated communities in Kondapur near schools while retaining ₹75L budget.*
5. **Alternative Suggestions:**
   > *"Show me 3BHK apartments in Jubilee Hills under ₹50 lakhs."*  
   > **HAVEN**: *Explains that Jubilee Hills luxury listings exceed ₹50L, and proactively recommends alternatives in adjacent Madhapur or Kondapur meeting the budget.*

---

## 📄 License
This project is licensed under the ISC License. Designed and built for HAVEN AI Real Estate.
#   H a v e n 2  
 