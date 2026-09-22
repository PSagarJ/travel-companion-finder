# App Flow — TravelBuddy

Complete navigation logic and user journey through the app.

## 1. Entry & authentication

```
Landing / Home (public)
   │
   ├── Explore destinations (public, read-only)
   │
   ├── "Register" → Create account → redirect to Login
   │
   └── "Login" → JWT issued, stored client-side
                       │
                       ▼
                 Authenticated app
```

Unauthenticated users can view the home page and explore destination pages. Everything involving personal data — trips, matches, chat, expenses, feed, profile — requires login and redirects to `/login` if a token is missing or invalid.

## 2. Post-login core loop

```
Dashboard
   ├── Hosted trips ─────────┐
   ├── Joined trips          │
   └── Pending applicants ───┘
          │
          ▼
   Trip Detail page
          │
   ┌──────┼───────────────┬─────────────┬─────────────┐
   ▼      ▼               ▼             ▼             ▼
 Chat   Expenses       Applicants    Matches for   Reviews
(room)  (ledger)      (creator only)  this trip   (post-completion)
```

## 3. Creating and joining a trip

```
User → "Create Trip" → fill dates, destination, description
                              │
                              ▼
                     Trip status = auto-computed
                    (Upcoming based on dates)
                              │
                              ▼
                    Trip appears in public "Browse Trips"
                              │
Another user → "Apply to join" → application sent to creator
                              │
                              ▼
              Creator reviews applicant on Trip Detail page
                    ├── Approve → user added as trip member
                    └── Reject  → user notified, not added
```

Members gain access to that trip's chat room and expense ledger only after approval.

## 4. Compatibility matching flow

```
User completes/edits Travel Profile
 (travel style, interests, destination wishlist)
              │
              ▼
   Matching engine runs on read
 (travel style 35% + destinations 35% + interests 30%,
  Jaccard similarity for overlap components)
              │
              ▼
     "Matches" page shows ranked list
     + score breakdown per match
```

## 5. Trip collaboration flow (post-join)

```
Approved trip member opens Trip Detail
        │
        ├── Chat tab
        │      → Socket.io connects → server verifies membership
        │      → joins trip-specific room → live messages
        │
        └── Expenses tab
               → member logs an expense
               → ledger updates broadcast live to all members viewing
               → "Settle Up" → Settlement Minimization Engine
                    returns the minimum set of payments to zero balances
```

## 6. Trip completion & reviews

```
Trip end date passes → status auto-updates to "Completed"
              │
              ▼
     Reviews tab unlocks for that trip's members
              │
              ▼
   Member rates + reviews other members
              │
              ▼
   Ratings aggregate onto each user's public profile
```

## 7. Travel memories feed

```
Login required
      │
      ▼
"Feed" → upload photo (Cloudinary) → optionally tag a trip
      │
      ▼
Photo appears in responsive grid, visible to other logged-in users
```

## 8. Explore & demo booking

```
Home → Explore destination (public)
              │
              ▼
   View curated stays / cuisine / flights (hardcoded data)
              │
              ▼
    "Book" (demo) → confirm details
              │
              ▼
   PDF generated client-side (jsPDF)
   → downloadable boarding pass / hotel receipt
   → clearly labeled as a demo, no real payment
```
