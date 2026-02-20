# Backend: Notify nearby users when a new job is created

## Problem

When a user posts a new job, **nearby users are not receiving notifications**. The mobile app expects notifications of type `job_created` to appear in the notifications list so users can discover new gigs in their area.

## Expected behavior

When a job is **created** (POST `/api/jobs` succeeds):

1. **Find nearby users**  
   Using the job’s location (address and/or coordinates if available), determine which users are “nearby” (e.g. within a radius or in the same area/city). Exclude the job poster.

2. **Create in-app notifications**  
   For each nearby user, create a notification record with:
   - `type`: `"job_created"`
   - `recipient`: that user’s ID
   - `title`: e.g. `"New job near you"`
   - `message`: e.g. job title or a short description
   - `relatedEntityType` / `relatedEntityId`: job (or whatever your schema uses) so the app can open the job (e.g. `navigationIdentifier`: `"job:<jobId>"` if that’s how the app routes)

3. **Optional: push notifications**  
   If you support FCM/APNs, send a push to those users so they get notified even when the app is in the background.

## App contract

- The app **does not** call any “notify nearby” endpoint; it only creates the job via POST `/api/jobs`.
- Notifications are **read** via GET `/api/notifications`; the app expects `type: "job_created"` for new-job alerts.
- So the “notify nearby users” logic must run **on the backend** after the job is successfully saved (e.g. in the same request handler after creating the job, or via a queue/worker).

## What to implement on the backend

- In the **job creation flow** (after saving the new job):
  - Resolve the job’s location to coordinates if you only have an address.
  - Query users whose location is near that point (and who are not the creator).
  - For each such user, create a notification with `type: "job_created"` and the job reference.
  - Optionally trigger push notifications for those users.

If notifications are already created for other events (e.g. `job_interest`) but not for new jobs, add the same pattern for `job_created` when a job is created and ensure nearby-user selection uses the same or similar logic as your “nearby jobs” APIs (e.g. same radius or area rules).
