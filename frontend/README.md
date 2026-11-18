# HAVEN – Frontend Application

AI-Powered Conversational Real Estate Platform built with React 19, Vite, and Tailwind CSS.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

The application will start at: **http://localhost:5173**

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

---

## Backend Connectivity
The frontend communicates with the backend API at `http://localhost:5000/api`. Make sure the backend server is running concurrently.

To configure a custom API URL, create or edit `.env` in the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000/api
```
