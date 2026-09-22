# Backend Schema — TravelBuddy

Tables (Mongoose collections), relationships, and auth logic — verified directly against the actual model files.

## 1. Collections overview

```
User ──┬──< Trip (creatorId)
       ├──< Trip.applicants (userId, cached name/travelStyle/matchScore)
       ├──< Trip.approvedMembers (userId, cached name)
       ├──< Review (as reviewerId / revieweeId)
       ├──< Post (userId)
       └──< Expense (paidBy)

Trip ──┬──< Review (tripId)
       ├──< Post (optional tripId)
       └──< Expense (tripId)
```

**Note on relationships:** most cross-references (`creatorId`, `userId`, `paidBy`, `reviewerId`, etc.) are stored as plain `String`, not as Mongoose `ObjectId` refs with `populate()`. `Expense.tripId` is the one exception — it's a real `ObjectId` ref to `Trip`. Several documents also cache a denormalized display name (`payerName`, `userName`, `reviewerName`, applicant `name`) alongside the ID, likely to avoid extra lookups on the frontend.

## 2. `User`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | primary key |
| `name` | String | required, trimmed |
| `email` | String | required, unique, lowercased + trimmed automatically |
| `password` | String | required — bcrypt hash, never plaintext |
| `isGovIdVerified` | Boolean | default `false` — trust & safety verification flag |
| `govIdUrl` | String | uploaded ID document URL |
| `travelStyle` | String enum | `Backpacker`, `Luxury`, `Budget`, `Adventure`, `Chill` — default `Chill` |
| `vibeBadges` | [String] | gamification badges |
| `preferredDestinations` | [String] | destinations the user wants to go / has enjoyed — powers destination-overlap in matching |
| `createdAt` / `updatedAt` | Date | automatic timestamps |

> Note: there is no separate `interests` field — `vibeBadges` and `preferredDestinations` are the closest equivalents in the actual schema.

## 3. `Trip` (`TripModel.js`)

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | primary key |
| `title` | String | required |
| `destination` | String | required |
| `startDate` | String | required — stored as a plain string, not a `Date`, to avoid date-input formatting issues |
| `endDate` | String | required, same as above |
| `estimatedBudget` | Number | required |
| `travelStyle` | String | required |
| `targetVibe` | String | required |
| `creatorId` | String | required — references a `User._id` as a string, not a Mongoose ref |
| `applicants` | [Object] | each entry: `userId`, `status` (`pending`/`approved`/`rejected`), plus cached `name`, `travelStyle`, `matchScore` |
| `approvedMembers` | [Object] | each entry: `userId`, cached `name` |
| `status` | String enum | `Planning` (legacy value, kept for old records), `Upcoming`, `Ongoing`, `Completed`, `Cancelled` — default `Upcoming` |
| `createdAt` / `updatedAt` | Date | automatic timestamps |

**Status logic:** `Ongoing`/`Completed` are derived automatically from `startDate`/`endDate` (see `utils/tripStatus.js`); `Cancelled` is the one manual, creator-only override. `Planning` is a legacy enum value retained only for trips saved before the status logic changed — new trips default straight to `Upcoming`.

> Note: there is no `description` field on `Trip` — the closest fields are `targetVibe` and `travelStyle`.

## 4. `Review`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | primary key |
| `tripId` | String | required |
| `reviewerId` | String | required — who wrote the review |
| `reviewerName` | String | cached display name |
| `revieweeId` | String | required — who the review is about |
| `revieweeName` | String | cached display name |
| `rating` | Number | required, 1–5 |
| `comment` | String | trimmed, max 500 characters |
| `createdAt` / `updatedAt` | Date | automatic timestamps |

**Uniqueness constraint:** a compound unique index on `(tripId, reviewerId, revieweeId)` — resubmitting a review for the same person on the same trip updates the existing review rather than creating a duplicate.

## 5. `Post` (travel memories feed)

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | primary key |
| `userId` | String | required |
| `userName` | String | cached display name |
| `imageUrl` | String | required — Cloudinary URL |
| `caption` | String | trimmed, max 500 characters |
| `tripId` | String | optional — links the memory back to a trip |
| `destination` | String | trimmed, optional |
| `createdAt` / `updatedAt` | Date | automatic timestamps |

## 6. `Expense`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | primary key |
| `tripId` | ObjectId → `Trip` | required — the one real Mongoose `ref` in the schema |
| `description` | String | required, trimmed |
| `amount` | Number | required |
| `paidBy` | String | required — user ID string |
| `payerName` | String | required — cached display name |
| `createdAt` / `updatedAt` | Date | automatic timestamps |

**Splitting logic:** there is no `splitAmong` field — costs are split **evenly across all approved trip members**, not per-expense-customizable. The **Settlement Minimization Engine** (application logic, not a stored table) reads all `Expense` documents for a trip, computes each member's net balance against an equal per-person share, and outputs the minimum number of payments required to bring every balance to zero.

## 7. Auth logic

- Passwords hashed with `bcryptjs` before storage; plaintext is never persisted.
- Login issues a JWT (signed with `JWT_SECRET`) containing the user's ID.
- Every protected route runs through auth middleware that verifies the JWT and attaches the decoded user to the request — controllers read the acting user from `req.user`, never from a client-submitted ID in the body/params.
- Socket.io connections for trip chat/expense rooms are authenticated similarly: the server checks that the connecting user is an actual member of the trip room they're trying to join, not just that they hold a valid token.

## 8. Relationship integrity notes

- A user only gains access to a `Trip`'s chat and expenses after moving from `applicants` to `approvedMembers` (creator approval).
- `Review` creation is gated on the related `Trip.status` being `Completed`, verified server-side.
- `Trip.status` is a derived/computed value on read wherever possible (`Ongoing`/`Completed`), rather than a field that can drift out of sync with `startDate`/`endDate` — `Cancelled` is the one true manual state, and `Planning` only ever appears on legacy records.
- Most relationships are enforced at the application layer (matching string IDs) rather than via Mongoose's built-in `ref`/`populate()` — `Expense.tripId` is the sole exception.
