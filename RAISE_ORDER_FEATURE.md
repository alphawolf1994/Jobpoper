# Raise an Order — Feature Implementation

End-to-end "Raise an Order" feature spanning the JobPoper mobile app and the
JobPoper backend. Customers raise orders against a business profile; the
business owner sees them on a dedicated Orders Screen with an unread badge
and gets a push notification.

## API summary

All endpoints require authentication via the existing `protect` middleware.

| Method | Path                       | Who         | Description                                                        |
| ------ | -------------------------- | ----------- | ------------------------------------------------------------------ |
| POST   | `/api/orders`              | Any user    | Raise a new order against `businessProfileId`.                     |
| GET    | `/api/orders/received`     | Any user    | Newest-first list of orders received on the caller's businesses.   |
| GET    | `/api/orders/unread-count` | Any user    | Unread order count — backs the header badge.                       |
| PUT    | `/api/orders/read-all`     | Any user    | Mark all received orders (and matching notifications) as read.     |

Mounted in `server.js` under both `/api/orders` and `/orders` (the mobile
client's axiosInstance base URL ends in `/api`, but the existing pattern
mirrors several other routes under both prefixes).

### POST /api/orders — payload

```json
{
  "businessProfileId": "<ObjectId>",
  "name": "Jane Doe",
  "phoneNumber": "+15551234567",
  "location": "123 Main St, Springfield",   // optional
  "serviceDetail": "Need plumbing fix"        // optional
}
```

Validations:
- `businessProfileId`, `name`, `phoneNumber` are required.
- Phone is checked against `^\+?[1-9]\d{1,14}$` (E.164-ish).
- The target profile must exist, be `isActive` and `status === "approved"`.
- A user cannot raise an order against their own business.

Side effects on success:
- `Order` doc is created.
- `Notification` (`type: "order_received"`) is created for the business owner.
- An FCM push is sent to all of the owner's active devices via
  `pushNotificationService.sendPushToUserForNotification` (existing service).
  - **Title:** `"New Order Received"`
  - **Body:** `"You received a new order for <Business Name> from <Customer Name>"`
  - **Data:** `{ type: "order_received", navigationIdentifier: "order:<id>", relatedEntityType: "Order", relatedEntityId: "<id>" }`

## Backend — files added / edited

```
jobpoper_backend/
├── models/
│   ├── Order.js                       (NEW)
│   └── Notification.js                (edit: added "order_received" + "Order" to enums)
├── controllers/
│   └── orderController.js             (NEW)
├── routes/
│   └── orders.js                      (NEW)
├── services/
│   └── pushNotificationService.js     (edit: route order_received pushes to jobpoper_jobs channel)
└── server.js                          (edit: mount /api/orders and /orders)
```

### Data model — `Order`

```
businessProfile  ObjectId  ref BusinessProfile  (required, indexed)
businessOwner    ObjectId  ref User             (required, indexed, denormalized from profile.user)
customer         ObjectId  ref User             (required, indexed)
customerName     String   required
customerPhone    String   required (E.164 match)
customerLocation String   optional
serviceDetail    String   optional, up to 2000 chars
isRead           Boolean  default false, indexed
readAt           Date     nullable
timestamps       createdAt, updatedAt
```

Indexes: `{ businessOwner, createdAt: -1 }` and `{ businessOwner, isRead }` —
the two queries the Orders Screen actually issues.

## Frontend — files added / edited

```
Jobpoper/src/
├── api/
│   └── orderApis.tsx                       (NEW: raiseOrder, getReceived, unread-count, read-all)
├── components/
│   ├── RaiseOrderModal.tsx                 (NEW: 5-field modal with validation)
│   └── Header.tsx                          (edit: order icon + badge; polls /unread-count + has-approved-business)
├── interface/
│   └── interfaces.tsx                      (edit: Order types + Notification.type extended)
├── navigation/
│   ├── index.tsx                           (edit: register OrdersScreen)
│   ├── navigationRef.ts                    (edit: navigateToOrdersScreen + push deep-link)
│   └── screens/
│       ├── BusinessDetailScreen.tsx        (edit: Contact + Raise an Order, side-by-side)
│       └── OrdersScreen.tsx                (NEW: HotJobs-style card list)
├── redux/
│   ├── store.ts                            (edit: register orderSlice)
│   └── slices/
│       └── orderSlice.ts                   (NEW)
└── services/notifications/
    └── FcmHandler.native.tsx               (edit: bump order badge on FCM push, fix entity-type fallback)
```

## Frontend — flow

### Customer side — BusinessDetailScreen
- Bottom footer now has a horizontal row with **two equal-width buttons**:
  - **Contact** (primary color) — `tel:` link to business phone (existing).
  - **Raise an Order** (secondary green) — opens `<RaiseOrderModal />`.
- Modal autofills:
  - `name` from `user.profile.fullName`
  - `phoneNumber` from `user.phoneNumber`
  - `location` from `user.profile.currentLocation.fullAddress` or `user.profile.location`
- Modal validates `name` (non-empty) and `phoneNumber` (E.164 pattern),
  dispatches `raiseOrder` thunk, shows a `react-native-toast-message` success
  toast `"Order raised successfully"` on resolve, and closes itself.
- `businessProfileId` is passed in as a prop — fulfils the spec's "hidden
  reference" requirement without exposing it as a visible field.

### Business owner side — Header
- `Header.tsx` polls `/orders/unread-count` and `/business-profiles/me` every
  30s (existing 30s tick + on app foreground / screen focus).
- If `state.order.hasApprovedBusiness === true`, a receipt icon renders
  **immediately to the left of the bell**.
- A red badge shows `state.order.unreadCount` (capped to `9+`).
- Tapping the order icon navigates to `OrdersScreen` — the screen itself
  dispatches `markAllOrdersAsRead` on focus, which clears the badge.

### Business owner side — OrdersScreen
- Card design mirrors `HotJobs.tsx` (rounded blue card, white avatar, white
  pill tags, white CTA buttons) so the look-and-feel matches the rest of
  the home screen.
- Each card shows:
  - Business avatar (primary image of the profile, falls back to initials).
  - Business name as the title.
  - Customer name as the "From …" subtitle.
  - Chips for phone, location (only if provided), and relative timestamp.
  - Service/Product detail as a 2-line clipped body.
  - **Directions** button (only when location is present) — opens Google
    Maps directions URL.
  - **Call** button — `tel:` link to `customerPhone`.
- Newest-first ordering enforced server-side (`sort: { createdAt: -1 }`).
- Pull-to-refresh re-fetches the list.

### Push notification deep link
`navigationRef.navigateFromPushPayload` now recognises
`type === "order_received"` (or `navigationIdentifier` starting with
`order:`) and dispatches `navigateToOrdersScreen()` — same hook used by
foreground/background taps and cold-start launches in `FcmHandler.native.tsx`.

In the foreground, FCM messages with `type=order_received` also dispatch
`incrementUnreadOrders()` + `getUnreadOrdersCount()` so the badge ticks in
real time without waiting for the next 30s poll.

## Manual test plan

1. **Customer**: as user A, open a business profile owned by user B. Tap
   "Raise an Order", confirm name/phone/location are autofilled from your
   profile. Submit → success toast appears, modal closes.
2. **Business owner**: as user B, with at least one approved business
   profile, the home header now shows the receipt icon to the left of the
   bell with a `1` badge. A push notification is delivered.
3. Tap the order icon → Orders Screen opens, badge clears, the card for the
   new order is at the top with the customer's phone chip and (if provided)
   location chip.
4. Tap **Call** → device dialer opens with the customer's number.
5. Tap **Directions** → Google Maps directions URL opens.
6. Tap the push notification → app opens directly to the Orders Screen
   (cold start, background, and foreground all use the same handler).

## Edge cases handled

- Owner cannot raise an order against their own profile (400 on POST).
- Orders against pending/rejected profiles are rejected (400 on POST).
- If the business owner has no devices with valid push tokens, the order is
  still saved and the in-app notification still appears — the FCM call is
  best-effort and any FCM error is logged but not propagated.
- If the `markAllOrdersAsRead` call fails when opening the Orders Screen,
  the orders themselves still load (the dispatch is independent).
- The unread count fetch is dispatched for everyone but always returns 0
  for non-business users — no extra gating needed on the client.
- Notification `relatedEntityType` enum updated server-side AND the FCM
  handler's client-side fallback was extended so order notifications never
  get mis-shelved as "Job".
