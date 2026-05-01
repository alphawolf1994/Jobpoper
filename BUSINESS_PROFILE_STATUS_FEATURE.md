# Business Profile Status & Edit-Resubmit Feature

This document summarizes the changes made to add status badges, rejection reasons, and an edit-and-resubmit flow to the user's Business Profiles list.

## Requirements

- Show each business profile with a status badge: `pending`, `approved`, or `rejected`.
- If a profile is `rejected`, display the admin's rejection reason.
- Allow edits **only** when status is not `pending` (i.e., `approved` or `rejected`).
- When a user edits and resubmits a rejected (or approved) profile, status flips back to `pending` for re-review.

## Files Changed

### Frontend (React Native / Expo)

#### `src/navigation/screens/BusinessProfilesScreen.tsx` (rewritten)
- Replaced the empty-state-only screen with a real list view.
- Fetches `GET /business-profiles/me` on focus and via pull-to-refresh.
- Each card renders:
  - Primary image (or storefront placeholder).
  - Business name, category, and address.
  - A colored status badge with icon (`pending` → amber clock, `approved` → green check, `rejected` → red cross).
  - Rejection callout box (red-tinted) showing `rejectionReason` when applicable.
- Edit button is gated:
  - `pending` → button hidden, replaced with an explanatory note that the profile is awaiting admin review.
  - `approved` → "Edit profile" button.
  - `rejected` → "Edit & Resubmit" button.
- Tapping edit navigates to `AddBusinessProfileScreen` with `{ mode: "edit", profile }` route params.
- The existing 3-profile cap and "+" button behavior is preserved.

#### `src/navigation/screens/AddBusinessProfileScreen.tsx` (extended)
- Reads `route.params.mode === "edit"` plus a `profile` payload to flip into edit mode.
- In edit mode:
  - Header title becomes "Edit Business Profile".
  - Form fields (business name, category, address, phone) prefill from the passed profile.
  - Category name is hydrated from the redux store once categories load (route param may only carry the `_id`).
  - Existing remote images render as a read-only strip with the primary marker; picking new files in the picker hides the strip and the new picks fully replace the set on submit.
  - The 3-profile cap pre-check is skipped (editing doesn't create a new profile).
  - At least 1 image is no longer required at submit if the user kept the existing set.
  - A banner reminds rejected-profile editors that submitting resubmits for admin review.
- Submit handler:
  - In edit mode, calls `updateBusinessProfileApi(profileId, payload)` and only sends images when the user picked new ones.
  - Backend flips status to `pending` on success.
  - Toast text adapts to the prior status:
    - Editing an **approved** profile → "Profile under review again. / Admin will respond within 24 hours."
    - Editing a **rejected** profile → "Profile resubmitted / Admin will review your changes within 24 hours."
  - Error handler also catches the new `PROFILE_PENDING_REVIEW` 409 (race where someone tried to edit a profile that just went back to pending).
- Submit button label adapts: "Submit for review" / "Submitting..." in create mode, "Resubmit for review" / "Resubmitting..." in edit mode.

#### `src/api/businessProfileApis.tsx` (extended)
- Added `UpdateBusinessProfilePayload` type and `updateBusinessProfileApi(profileId, data)` function.
- Sends a `PUT /business-profiles/:id` multipart request.
- Images are only included when the caller actually picked new ones, so the backend keeps the existing set otherwise.
- Mirrors the create-API error normalization.

### Backend (Node.js / Express / Mongoose)

#### `controllers/businessProfileController.js` (extended)
- New `updateBusinessProfile` async handler. Behavior:
  - Validates the `:id` is a valid ObjectId and that the profile belongs to the authenticated user.
  - Returns `409 PROFILE_PENDING_REVIEW` when the profile's current status is `pending` (locked while admin review is in flight).
  - Applies field updates (`businessName`, `category`, `address`, `phoneNumber`) when provided.
  - When `req.processedFileNames` carries new uploads, inserts new `BusinessImage` rows pointing to the profile, swaps `profile.images` to the new refs, and deletes the previous image rows after the save succeeds. Inserts roll back on failure.
  - Forces `profile.status = "pending"` on every successful edit. The existing model pre-save hook clears `rejectionReason` automatically.
  - Responds with `200` and the populated profile.
- Exported alongside the existing handlers.

#### `routes/businessProfiles.js` (extended)
- Wired `PUT /:id` through the same `protect` and `uploadBusinessImages` middleware as `POST /`.

### Backend Model (no changes needed)

`models/BusinessProfile.js` already supports the feature:
- `status` enum: `pending` / `approved` / `rejected`, defaulting to `pending`.
- `rejectionReason` field (nullable, max 1000 chars).
- A pre-save hook that clears `rejectionReason` whenever `status !== "rejected"`.

## API Surface

| Method | Path                              | Purpose                                                |
|--------|-----------------------------------|--------------------------------------------------------|
| GET    | `/api/business-profiles/me`       | List current user's profiles (existing).               |
| POST   | `/api/business-profiles`          | Create new profile, status defaults to `pending`.       |
| PUT    | `/api/business-profiles/:id`      | **New.** Edit profile; resets status to `pending`.      |

## Status Transition Summary

```
[create]            -> pending
admin approves      -> approved
admin rejects       -> rejected (with rejectionReason)
user edits approved -> pending  (rejectionReason already null)
user edits rejected -> pending  (pre-save hook clears rejectionReason)
user tries to edit pending -> 409 PROFILE_PENDING_REVIEW (blocked)
```

## UI States Quick Reference

| Status     | Badge color  | Edit button             | Rejection box |
|------------|--------------|-------------------------|---------------|
| pending    | Amber        | Hidden (note shown)     | Hidden        |
| approved   | Green        | "Edit profile"          | Hidden        |
| rejected   | Red          | "Edit & Resubmit"       | Visible       |

## Verification

- Ran `npx tsc --noEmit` on the frontend; no type errors introduced by these changes (pre-existing unrelated errors in other files were ignored).
- Validated all imports and that `PUT /api/business-profiles/:id` is registered through the router.
