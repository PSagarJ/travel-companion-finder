# Product Requirement Document (PRD) — TravelBuddy

## 1. Overview

**Product name:** TravelBuddy
**One-liner:** A platform to find compatible travel companions, plan trips together, and split costs fairly — in one connected flow instead of five disconnected apps.

**Problem statement**
People who want to travel but lack a companion, or who want to join an existing trip, have no dedicated way to find compatible travelers. Once a group is formed, coordinating chat, shared expenses, and post-trip memories typically requires multiple separate tools (WhatsApp, Splitwise, Google Sheets, Instagram).

**Solution**
TravelBuddy combines: trip discovery, a weighted compatibility-matching algorithm, real-time trip chat, a shared expense ledger with automatic settlement minimization, post-trip reviews, and a travel memories feed — as one product.

---

## 2. Target users

| Persona | Need |
|---|---|
| **Solo traveler** | Wants to join a trip but doesn't want to travel alone or with strangers who don't share their style |
| **Trip organizer** | Has planned a trip and wants compatible people to join, plus a way to manage applicants and split costs |
| **Existing travel group** | Wants a single shared space for trip chat + expense tracking instead of juggling apps |

---

## 3. Core goals

1. Let users discover and join trips that match their interests and style.
2. Score compatibility between users algorithmically, with transparent reasoning — not a black box.
3. Give a trip group real-time chat and expense tracking scoped strictly to trip members.
4. Minimize the friction of settling shared costs after a trip.
5. Let users build reputation through verified, post-trip reviews.
6. Provide a lightweight demo booking flow so the product feels end-to-end, without needing real payments infrastructure.

## 4. Non-goals (out of scope for current version)

- Real payment processing / real ticket issuance
- Native mobile apps
- Persisted (database-backed) chat history — chat is currently live-only
- Push notifications

---

## 5. Feature breakdown

### 5.1 Accounts
- Register/login via email + password (JWT-based session)
- Editable profile: travel style, interests, destination wishlist

### 5.2 Trip discovery & management
- Browse all open trips
- View trip detail (dates, description, creator, applicants)
- Apply to join a trip
- Creator approves/rejects applicants
- Trip status (Upcoming / Ongoing / Completed) is computed automatically from dates; Cancelled is a manual, creator-only override
- Dashboard: "My hosted trips" vs. "My joined trips"

### 5.3 Compatibility matching
- Weighted score across three factors:
  - Travel style similarity — 35%
  - Destination overlap (Jaccard similarity) — 35%
  - Shared interests (Jaccard similarity) — 30%
- Match results show a breakdown of *why* a score was produced, not just a single number

### 5.4 Real-time trip collaboration
- Trip-scoped chat rooms (Socket.io), membership-verified server-side before a socket can join a room
- Shared expense ledger, updates broadcast live to everyone viewing that trip
- Settlement Minimization Engine: given all expenses and members, computes net balances and the fewest transactions required to zero everyone out

### 5.5 Reviews & reputation
- Reviews can only be left after a trip is server-verified as completed
- Aggregate rating + review history shown on user profiles

### 5.6 Travel memories feed
- Photo uploads (Cloudinary-backed), optionally tagged to a trip
- Responsive, Instagram-style grid
- Gated behind login

### 5.7 Explore & book (demo)
- Three featured destinations with curated stays, cuisine, and flight options (hardcoded data)
- Simulated booking flow generates a downloadable PDF (boarding pass or hotel receipt), explicitly labeled as a demo — no real transaction

### 5.8 Home page
- Interactive 3D globe with clickable destination pins
- Animated entrance sequences; custom visual identity (color palette + typography)

---

## 6. Success metrics (suggested, for a real launch)

- % of registered users who complete their travel profile
- % of trip applications that get approved
- Average match score of successfully formed trip groups
- % of completed trips that receive at least one review
- Chat messages sent per active trip (proxy for engagement)

---

## 7. Risks / open questions

- Chat history is not persisted — if a user refreshes or is offline, they lose scrollback. Acceptable for demo; a real product likely needs persisted messages.
- Matching weights (35/35/30) are fixed, not personalized or A/B tested.
- Booking flow is entirely simulated; no real inventory or payment provider is integrated.
