# Technical Requirement Document (TRD) — TravelBuddy

## 1. Architecture overview

TravelBuddy is a MERN-stack application with a decoupled client and server, communicating over REST for standard CRUD operations and over Socket.io for real-time chat and expense sync.

```
┌─────────────┐        HTTPS (REST, JWT)        ┌─────────────┐
│   Client    │ ───────────────────────────────▶│   Server    │
│ React+Vite  │◀─────────────────────────────── │Node+Express │
└─────────────┘        WebSocket (Socket.io)      └──────┬──────┘
                                                          │
                                                    ┌─────▼─────┐
                                                    │  MongoDB   │
                                                    │ (Mongoose) │
                                                    └────────────┘
                        ┌────────────┐
                        │ Cloudinary │  ← media storage (photos)
                        └────────────┘
```

## 2. Tech stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend framework | React (Vite) | fast dev server, ESM-based build |
| Routing | React Router v6 | client-side routing |
| Styling | Tailwind CSS v4 | utility-first CSS |
| UI components | shadcn/ui | accessible, composable primitives |
| Animation | Framer Motion | entrance/transition animation |
| 3D | Three.js + React Three Fiber + drei | interactive globe on home page |
| Backend runtime | Node.js + Express | REST API server |
| Database | MongoDB + Mongoose | document store, schema modeling |
| Auth | JWT + bcryptjs | stateless session, hashed passwords |
| Real-time | Socket.io | chat rooms, live expense sync |
| File uploads | Multer → Cloudinary | image handling + storage |
| PDF generation | jsPDF | client-side ticket/receipt generation |
| Deployment | Render | separate frontend + backend services |

## 3. APIs

All endpoints are served under a single Express app, namespaced by resource:

- `/api/auth` — register, login
- `/api/trips` — trip CRUD, apply, status/cancel
- `/api/matches` — compatibility results for the logged-in user
- `/api/reviews` — post-trip reviews
- `/api/posts` — travel memories feed
- `/api/expenses` — trip expense ledger
- `/api/users` — profile read/update

Full endpoint-by-endpoint reference lives in the main [README](../README.md#-api-reference).

**Auth model:** JWT issued on login, sent as `Authorization: Bearer <token>` on every protected request. Middleware verifies the token and attaches the decoded user to the request — controllers never trust a client-submitted user ID for identity-sensitive actions.

**Real-time protocol:** Socket.io. A client attempts to join a trip-specific room; the server verifies actual trip membership (not just "is logged in") before allowing the join. Chat messages and expense-ledger updates are broadcast to everyone currently in that room.

## 4. Third-party services

| Service | Purpose |
|---|---|
| MongoDB Atlas (or self-hosted) | primary datastore |
| Cloudinary | image storage + delivery for travel feed photos |
| Render | hosting for both frontend (static) and backend (Node service) |

## 5. Environment configuration

**Server (`server/.env`):**
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/travelbuddy
JWT_SECRET=your_long_random_secret_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

**Client (`client/.env`):**
```env
VITE_API_BASE_URL=http://localhost:5000
```

Both sets of variables must be duplicated in the hosting provider's dashboard (Render) for a deployed environment — `.env` files are local-only and are not read by the deployed build.

## 6. Non-functional requirements

- **Security:** password hashing (bcryptjs), JWT-based auth, server-side membership checks for chat/expenses, EXIF/GPS stripping on uploaded images, CORS allowlist.
- **Consistency:** trip status is computed from dates on every read rather than stored/cached, avoiding stale-state bugs.
- **Real-time correctness:** room joins are membership-checked server-side to prevent unauthorized access to a trip's chat or expense stream.

## 7. Known technical limitations

- Chat messages are not persisted to the database — history is lost on refresh/reconnect after the session ends.
- No automated test suite is described in the current codebase; adding one (Jest/Vitest + Supertest) would be a reasonable next step.
- Booking/payment is fully simulated — no PCI-relevant payment integration exists.
