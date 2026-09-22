# Backend Schema — TravelBuddy

Tables (Mongoose collections), relationships, and auth logic. This describes structure only — no real data, credentials, or connection strings.

> ⚠️ Field names/types below are inferred from the app's described features and API surface. Verify against your actual Mongoose model files before treating this as ground truth, and adjust field names to match exactly if you publish this.

## 1. Collections overview

```
User ──┬──< Trip (creator)
       ├──< Trip (applicant/member, via Trip.applicants / Trip.members)
       ├──< Review (as reviewer)
       ├──< Review (as reviewee)
       ├──< Post
       └──< Expense (as payer/participant)

Trip ──┬──< Review (scoped to a trip)
       ├──< Post (optionally tagged to a trip)
       └──< Expense (scoped to a trip)
```

## 2. `User`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | primary key |
| `name` | String | |
| `email` | String | unique, used for login |
| `password` | String | bcrypt hash — never plaintext |
| `travelStyle` | String / Enum | used in matching |
| `interests` | [String] | used in matching (Jaccard similarity) |
| `destinationWishlist` | [String] | used in matching (Jaccard similarity) |
| `avatarUrl` | String | Cloudinary URL, optional |
| `rating` | Number (avg) | aggregated from `Review` documents |
| `createdAt` / `updatedAt` | Date | timestamps |

## 3. `Trip`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | primary key |
| `creator` | ObjectId → `User` | trip owner |
| `destination` | String | |
| `description` | String | |
| `startDate` / `endDate` | Date | used to auto-derive status |
| `status` | Enum: Upcoming / Ongoing / Completed / Cancelled | computed from dates on read; `Cancelled` is the sole manual, creator-only override |
| `applicants` | [ObjectId → `User`] | users who requested to join, pending decision |
| `members` | [ObjectId → `User`] | approved trip members (gain chat + expense access) |
| `createdAt` / `updatedAt` | Date | timestamps |

## 4. `Review`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | primary key |
| `trip` | ObjectId → `Trip` | which trip this review is scoped to |
| `reviewer` | ObjectId → `User` | who wrote it |
| `reviewee` | ObjectId → `User` | who it's about |
| `rating` | Number | e.g. 1–5 |
| `comment` | String | |
| `createdAt` | Date | server checks `Trip.status === Completed` before allowing creation |

## 5. `Post` (travel memories feed)

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | primary key |
| `user` | ObjectId → `User` | author |
| `trip` | ObjectId → `Trip` | optional tag |
| `imageUrl` | String | Cloudinary URL (EXIF/GPS stripped before upload) |
| `caption` | String | optional |
| `createdAt` | Date | |

## 6. `Expense`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | primary key |
| `trip` | ObjectId → `Trip` | scoped to one trip; access requires membership |
| `paidBy` | ObjectId → `User` | who fronted the cost |
| `amount` | Number | |
| `description` | String | |
| `splitAmong` | [ObjectId → `User`] | participants sharing this cost |
| `createdAt` | Date | |

**Settlement Minimization Engine** (application logic, not a stored table): on request, reads all `Expense` documents for a trip, computes each member's net balance (paid − owed), and outputs the minimum number of payments required to bring every balance to zero — rather than a naive "everyone pays everyone" split.

## 7. Auth logic

- Passwords hashed with `bcryptjs` before storage; plaintext is never persisted.
- Login issues a JWT (signed with `JWT_SECRET`) containing the user's ID.
- Every protected route runs through auth middleware that verifies the JWT and attaches the decoded user to the request — controllers read the acting user from `req.user`, never from a client-submitted ID in the body/params.
- Socket.io connections for trip chat/expense rooms are authenticated similarly: the server checks that the connecting user is an actual member of the trip room they're trying to join, not just that they hold a valid token.

## 8. Relationship integrity notes

- A user only gains access to a `Trip`'s chat and expenses after moving from `applicants` to `members` (creator approval).
- `Review` creation is gated on the related `Trip.status` being `Completed`, verified server-side (not trusted from the client).
- `Trip.status` is a derived/computed value on read wherever possible, rather than a field that can drift out of sync with `startDate`/`endDate` — except for `Cancelled`, which is the one true manual state.
