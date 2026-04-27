# JobPoper — notification & push catalog

This document lists **in-app notifications** in the system and which ones also send a **Firebase (FCM) push** to the user’s devices.

**Code reference (backend):** `jobpoper_backend`

---

## Summary

| In-app `type`        | FCM push sent? | Who receives (recipient) |
|----------------------|----------------|---------------------------|
| `job_created`        | **Yes**        | Users with a **saved location** within **~50 km** of the new job (excluding the job poster). Active users only. |
| `job_interest`       | **Yes**        | The **job owner** (`job.postedBy`) when another user shows interest. |
| `verification_review`| **Yes**        | The **user** whose verification was approved or rejected (after admin review). |

FCM is sent from `sendPushToUserForNotification` in `services/pushNotificationService.js`, called from:

- `jobController.js` — `job_created`, `job_interest`
- `authController.js` — `verification_review` (`reviewVerificationRequest`)
- `adminController.js` — `verification_review` (`reviewVerificationRequest`)

---

## 1. `job_created` (FCM: yes)

| Field | Value |
|--------|--------|
| **When it is created** | After a new job is successfully **created** (`POST` job create flow in `jobController.js`). A helper `createJobCreatedNotifications(job, jobCreatorId)` runs **asynchronously** (does not block the API response). |
| **Who receives it** | Users who: (1) have at least one **Location** in the DB whose distance to the job’s coordinates is **≤ 50 km** (Haversine), (2) are **not** the person who posted the job, (3) are **active** (`isActive: true`), (4) are within a **cap** of 500 candidate users from the geo query. |
| **Title** | `New job near you` |
| **Message** | `{Creator full name} posted a new job: {job.title}` (creator name defaults to `"Someone"` if missing). |
| **relatedEntityType** | `Job` |
| **relatedEntityId** | The new job’s `_id` |
| **navigationIdentifier** | `job:{jobId}` |
| **FCM** | One push per created notification document (one per recipient with a valid device token). |
| **Android channel** (FCM) | `jobpoper_jobs` (see `getAndroidChannelId` in `pushNotificationService.js`). |

**If no one is nearby or the job has no valid coordinates,** no rows are created and no pushes are sent.

---

## 2. `job_interest` (FCM: yes)

| Field | Value |
|--------|--------|
| **When it is created** | When a logged-in user calls **show interest** on a job (`POST /api/jobs/:id/interest` or equivalent route) and the job allows `show_interest` and the user was not already in `interestedUsers`. |
| **Who receives it** | The **job owner** only — `recipient: job.postedBy`. |
| **Title** | `New Interest in Your Job` |
| **Message** | `{Interested user’s full name} showed interest in your job: {job.title}` (name defaults to `"Someone"`). |
| **relatedEntityType** | `Job` |
| **relatedEntityId** | The job’s `_id` |
| **navigationIdentifier** | `job:{jobId}` |
| **FCM** | One push to the job owner, if they have an active device with a valid FCM token. |
| **Android channel** (FCM) | `jobpoper_jobs`. |

---

## 3. `verification_review` (FCM: yes)

| Field | Value |
|--------|--------|
| **When it is created** | When an admin **approves** or **rejects** a user’s identity verification: `reviewVerificationRequest` in `authController.js` (`PUT /api/auth/verification-requests/:userId/review`) or `adminController.js` (`PUT /api/admin/verifications/:userId/review`). |
| **Who receives it** | The **user** who was reviewed (`recipient: user._id`). |
| **Title** | `Verification approved` or `Verification rejected` |
| **Message** | Approval copy, or rejection copy including optional `reviewNotes`. |
| **relatedEntityType** | `User` |
| **relatedEntityId** | That user’s `_id` |
| **navigationIdentifier** | `verification:details` |
| **FCM** | After `Notification.create(...)`, the server calls `sendPushToUserForNotification(recipient, savedDoc, Device)` (same pattern as `job_interest`). |
| **Android channel** (FCM) | `jobpoper_jobs` (mapped in `getAndroidChannelId` for `verification_review`). |

**Mobile app:** tapping the push opens **Verify profile** (`VerificationDetailsScreen`) when `type` is `verification_review` or `navigationIdentifier` starts with `verification:`.

---

## FCM data payload (all pushed types)

When a push is sent, `data` includes (string values):

- `notificationId` — MongoDB notification `_id`
- `type` — e.g. `job_created`, `job_interest`, `verification_review`
- `title`, `body` — same as the in-app title/message
- `navigationIdentifier` — e.g. `job:...`, `verification:details` (if present on the document)
- `relatedEntityId` — when set on the notification
- `relatedEntityType` — when set on the notification (e.g. `Job`, `User`)

The client uses these to **sync UI** and **deep link** (e.g. job details, verification details, or the notifications list).

---

## Who must have a device token to get a push

- For **`job_created`** and **`job_interest`**, the backend uses **`Device` rows with `isActive: true`** for that `user`, plus a non-empty `pushNotificationToken` (not `pending` / invalid).
- For **`verification_review`**, the same user may be **logged out** on the device while an admin uses the app; logout sets `isActive: false` but **keeps** the FCM token on that user’s row so the push can still reach the phone. Only `verification_review` skips the `isActive: true` filter.
- **Registration:** mobile app `POST /api/devices` after login (FCM token from the device).
- If Firebase Admin is not configured on the server (`FIREBASE_SERVICE_ACCOUNT_PATH` / `FIREBASE_SERVICE_ACCOUNT`), no FCM is sent; in-app notifications may still be created.

---

*Last aligned with the codebase: notification creation in `jobController`, `authController`, `adminController`, and FCM in `pushNotificationService.js`.*
