# Implementation Plan — TravelBuddy

Step-by-step build order. Written retroactively as a reference for how a project like this is best sequenced (and as a guide if rebuilding, extending, or handing this off to another builder/AI).

## Phase 1 — Foundations
1. Scaffold `client/` (Vite + React) and `server/` (Node + Express) as separate apps in one repo.
2. Set up MongoDB connection (Mongoose) and base `.env` config for both apps.
3. Build `User` model + register/login endpoints with JWT issuance and bcrypt hashing.
4. Build auth middleware that verifies JWT and attaches the user to `req.user`.
5. Build the shared axios instance on the client that auto-attaches the JWT to every request.

## Phase 2 — Core trip functionality
6. Build `Trip` model (creator, dates, destination, applicants, members, status).
7. Implement trip CRUD endpoints: create, list, get by ID, get by user.
8. Implement the derived-status logic (Upcoming/Ongoing/Completed from dates) computed on read, plus the manual `Cancelled` override restricted to the creator.
9. Implement apply-to-join and creator approve/reject endpoints.
10. Build client pages: Browse Trips, Trip Detail, Create Trip, Dashboard (hosted vs. joined split).

## Phase 3 — Matching
11. Add travel profile fields to `User` (style, interests, wishlist) with an edit UI.
12. Implement the weighted matching function: travel style (35%) + destination overlap via Jaccard (35%) + interest overlap via Jaccard (30%).
13. Build the `/api/matches` endpoint returning ranked matches with a score breakdown.
14. Build the Matches page UI, showing the "why" behind each score.

## Phase 4 — Real-time collaboration
15. Set up Socket.io on the server; implement room-join logic that verifies real trip membership before allowing a socket into a trip's room.
16. Build the chat UI (Trip Detail → Chat tab), wired to the verified socket room.
17. Build `Expense` model + endpoints (scoped to trip members only).
18. Implement live expense-ledger sync via Socket.io broadcasts on create.
19. Implement the Settlement Minimization Engine (compute net balances → minimum payment set) and surface it in the Expenses tab.

## Phase 5 — Reviews & reputation
20. Build `Review` model + endpoints, gated server-side on `Trip.status === Completed`.
21. Add aggregate rating calculation and display on user profiles.

## Phase 6 — Travel memories feed
22. Set up Cloudinary + Multer for image upload.
23. Strip EXIF/GPS metadata from uploaded images before storage.
24. Build `Post` model + endpoints (optionally tagged to a trip).
25. Build the responsive, Instagram-style feed UI, gated behind login.

## Phase 7 — Explore & demo booking
26. Curate hardcoded destination data (stays, cuisine, flights) for three featured destinations.
27. Build destination pages (publicly viewable, no login required).
28. Build the simulated booking flow UI, clearly labeled as a demo.
29. Implement client-side PDF generation (jsPDF) for the boarding pass / hotel receipt.

## Phase 8 — Home page & visual identity
30. Define the oklch-based "sunset teal → coral" palette and Fraunces/Inter typography as shared design tokens.
31. Integrate shadcn/ui components styled to match the palette/typography.
32. Build the interactive 3D globe (Three.js + React Three Fiber + drei) with clickable destination pins.
33. Add Framer Motion entrance animations across key pages/sections.

## Phase 9 — Security hardening
34. Restrict CORS to a known allowlist of frontend origins.
35. Audit every identity-sensitive endpoint to confirm it reads the acting user from the verified JWT, never from client-submitted IDs.
36. Confirm expense and chat access both re-check real trip membership server-side.

## Phase 10 — Deployment
37. Deploy backend and frontend as separate services on Render.
38. Replicate all `.env` variables in the Render dashboard for both services.
39. Verify CORS and `CLIENT_URL`/`VITE_API_BASE_URL` values match the deployed URLs, not localhost.

## Suggested next phase (not yet built)
- Persist chat history to MongoDB instead of live-only Socket.io.
- Add push/live notifications for applications, approvals, and new messages.
- Add advanced trip search/filtering.
- Integrate a real payment provider if moving the booking flow beyond demo status.
- Add an automated test suite (Jest/Vitest + Supertest) covering auth, trip status derivation, and the matching/settlement algorithms.
