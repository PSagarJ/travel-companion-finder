# TravelBuddy ✈️

TravelBuddy is a comprehensive, full-stack web application built on the MERN stack. Designed for modern explorers, it allows users to discover trip itineraries, apply to join travel groups, collaborate via real-time chat, log and split shared travel expenses using an automated **Settlement Minimization Engine**, and share travel photos in an Instagram-style feed.

---

## 🌟 Core Features

* 🔐 **JWT-Secured Authentication:** Registration and login issue a signed JSON Web Token. Every protected route verifies that token server-side via dedicated auth middleware — user identity is never trusted from client-submitted data.
* 💼 **Dual-Role Control Deck:** An identity-aware Creator Dashboard that splits user views into two secure access matrices:
  * **Trips You Are Hosting:** Administrative controls to review, approve, or reject incoming applicant crew requests — restricted to the verified trip creator.
  * **Trips You Are Joining:** A clean view-only space to keep tabs on upcoming itineraries with quick access to shared group tools.
* 📸 **Travel Memories Feed:** Upload and browse trip photos in a responsive, Instagram-style grid — 4 photos per row on desktop, 3 on mobile — powered by Cloudinary. Photos can be linked to a specific trip and appear on that trip's page, or posted to the general feed.
* 💰 **Live Debt Minimization Ledger:** A dynamic expense manager connected directly to a persistent database. It calculates global trip costs, divides shares dynamically among approved crew members, and executes an optimization algorithm to output immediate settlement instructions (*who owes how much to whom*).
* 💬 **Real-Time Logistics Chat:** Instantly initialized chat rooms powered by Socket.io, restricted to verified trip crew members for coordinated logistics.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| --- | --- | --- |
| **Frontend** | React.js (Vite) | Single Page Application framework with declarative state management. |
| **Routing** | React Router v6 | Client-side declarative routing and dynamic URL parameter parsing. |
| **Backend** | Node.js & Express.js | Event-driven runtime server layer executing non-blocking REST API routing. |
| **Database** | MongoDB & Mongoose | Document-based NoSQL database utilizing structural schemas and data validation models. |
| **Auth** | JSON Web Tokens (jsonwebtoken) & bcryptjs | Signed session tokens and salted password hashing. |
| **Media Storage** | Cloudinary & Multer | In-memory file handling and cloud-hosted image storage/delivery for the photo feed. |
| **Sockets** | Socket.io | Bidirectional low-latency WebSocket layer running real-time event-driven relays, restricted to allowed origins. |
| **HTTP Client** | Axios | Promise-based networking layer with a shared instance that automatically attaches the auth token to every request. |

---

## 📂 Project Architecture

```text
travel-buddy-finder/
├── client/                       # Frontend React Application
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js  # Shared axios instance — auto-attaches JWT to requests
│   │   ├── components/           # Shared UI components (Navbar, etc.)
│   │   ├── pages/                # View components (Home, Dashboard, Feed, BudgetSplitter, etc.)
│   │   ├── App.jsx               # Client-side router mappings
│   │   └── main.jsx
├── server/                       # Backend Express Server Environment
│   ├── src/
│   │   ├── config/
│   │   │   └── cloudinary.js     # Cloudinary SDK configuration
│   │   ├── controllers/          # Logical endpoint functions (tripController, postController, etc.)
│   │   ├── middleware/
│   │   │   └── authMiddleware.js # Verifies JWT, attaches req.user for protected routes
│   │   ├── models/                # Mongoose database collection blueprints (User, Trip, Post, Expense)
│   │   └── routes/                # REST API endpoint route bindings
│   └── server.js                  # Application core mounting middleware, sockets, CORS & db configurations
```

---

## 🚀 Installation & Setup

### Prerequisites

* Node.js installed globally on your machine.
* MongoDB Community Server or MongoDB Atlas instance active.
* A free [Cloudinary](https://cloudinary.com) account (for the photo feed).

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/travel-buddy-finder.git
cd travel-buddy-finder
```

### 2. Configure Backend Server Environment

Navigate into the server folder and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the root of the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/travelbuddy

# Used to sign and verify login sessions — use a long, random string.
# Never commit this value or share it publicly.
JWT_SECRET=your_long_random_secret_string

# Cloudinary credentials, from your Cloudinary dashboard
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: your deployed frontend URL, if different from the defaults
# already allowed in server.js (http://localhost:5173 and the Render frontend)
CLIENT_URL=https://your-frontend-url.com
```

Boot up the development backend server using nodemon:

```bash
npm run dev
```

> ⚠️ **Important:** `JWT_SECRET` is required — the server will reject auth requests with a "Server configuration error" if it's missing. If you deploy this app (e.g. to Render), you must also add these same environment variables in your hosting provider's dashboard; local `.env` files are gitignored and never get deployed.

### 3. Configure Frontend Client Environment

Open a secondary terminal instance, navigate to the client folder, and install dependencies:

```bash
cd client
npm install
```

Create a `.env` file in the root of the `client/` directory (optional for local development, required for pointing at a deployed backend):

```env
VITE_API_BASE_URL=http://localhost:5000
```

Start the Vite development web environment:

```bash
npm run dev
```

Open your web browser and navigate to `http://localhost:5173` to interact with the application locally!

---

## 🔌 API Endpoints Documentation

Routes marked 🔒 require a valid `Authorization: Bearer <token>` header.

### Authentication Routes (`/api/auth`)

* `POST /api/auth/register` — Registers a new user account, hashes the password, and returns a signed JWT.
* `POST /api/auth/login` — Validates credentials and returns a signed JWT.

### Trip Operational Routes (`/api/trips`)

* `GET /api/trips` — Fetches all active trip itineraries, sorted chronologically.
* `GET /api/trips/:id` — Extracts deep data details for a targeted trip document.
* `GET /api/trips/user/:userId` — Fetches all hosted and joined trips connected to a user.
* `POST /api/trips` 🔒 — Commits a new group travel itinerary; creator is derived from the token.
* `POST /api/trips/:id/apply` 🔒 — Applies the authenticated user to a trip's pending applicants queue.
* `PUT /api/trips/:id/status` 🔒 — Approves or rejects an applicant; restricted to the trip's verified creator.
* `DELETE /api/trips/:id` 🔒 — Removes a trip document; restricted to the trip's verified creator.

### Travel Photo Routes (`/api/posts`)

* `GET /api/posts` — Fetches all photo posts for the main feed, most recent first.
* `GET /api/posts/user/:userId` — Fetches all photos posted by a specific user.
* `GET /api/posts/trip/:tripId` — Fetches all photos linked to a specific trip.
* `POST /api/posts` 🔒 — Uploads a photo (multipart form, field name `image`, max 5MB) to Cloudinary and saves the post; author is derived from the token.
* `DELETE /api/posts/:id` 🔒 — Deletes a post; restricted to the post's original author.

### Financial Management Routes (`/api/expenses`)

* `GET /api/expenses/:tripId` 🔒 — Retrieves the transaction history for a specific travel crew.
* `POST /api/expenses` 🔒 — Registers a single expense payload.

### User Routes (`/api/users`)

* `GET /api/users/:id` — Fetches a user's public profile (password excluded).

---

## 🔒 Security Notes

* Passwords are hashed with `bcryptjs` before storage — never stored in plain text.
* All identity-sensitive actions (creating/deleting trips, approving applicants, posting photos/expenses) derive the acting user from the verified JWT (`req.user.id`), not from client-supplied data.
* CORS is restricted to a known allowlist of frontend origins (configurable via `CLIENT_URL`), applied consistently to both the REST API and the Socket.io connection.
* Uploaded images are validated server-side for file type and size (max 5MB) before being sent to Cloudinary.

---

> 📝 **Development Note:** Malformed test records or data entries created under early schemas can cause local rendering issues. Use a database management utility like **MongoDB Compass** to drop the `trips`, `users`, `posts`, and `expenses` collections if you need to test the end-to-end user authentication and enrollment flows from a clean slate. If you change `JWT_SECRET`, log out and log back in — tokens signed with the old secret will no longer be valid.
