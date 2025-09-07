# Lead Management Module - Completed Submission

This repository contains a completed Lead Capture frontend and backend built from the provided starter code.

## What's included
- `frontend/` - React (Vite) + Tailwind frontend with:
  - Lead capture form with validation
  - Lead listing page with pagination and basic filters (by status)
  - Integration with backend APIs (base URL configurable)
- `backend/` - Node.js + Express + Mongoose backend with:
  - Lead model, controllers, and routes
  - Connects to MongoDB using `MONGODB` env variable
  - CORS enabled and JSON body parsing

## Quick Start (development)

### Backend
1. `cd backend`
2. Copy `.env.example` to `.env` and set `MONGODB` (MongoDB connection string) and `PORT` (e.g., 4000).
3. `npm install`
4. `npm start` (or `node app.js`)

### Frontend
1. `cd frontend`
2. `npm install`
3. Update `frontend/src/config.js` if you want to change the API base URL.
4. `npm run dev` (Vite)

By default the frontend expects the backend API at `http://localhost:4000/api/v1/lead`.

## Notes
- The backend expects a MongoDB connection. If you don't have one, you can use MongoDB Atlas and set the connection string in `.env`.
- This package intentionally keeps changes minimal to the original starter code; see commit history (if using Git) for details.

Good luck with the evaluation!
