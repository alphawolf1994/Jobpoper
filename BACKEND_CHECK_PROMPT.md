# Backend check prompt – nearby jobs API

Use this prompt when debugging why Hot jobs and Listed jobs are not showing in the app, or when handing off to a backend developer.

---

**Prompt: Debug "nearby jobs" API – app still shows no jobs**

The JobPoper mobile app shows **Hot jobs** and **Listed jobs** on the home screen. Both should show **nearby jobs posted by other users** (not the current user). The app is still showing "No hot jobs available in your area" and "No listed jobs available in your area" even after we fixed the **coordinates** requirement.

**What the app sends now**

The app calls:

1. **Hot jobs:** `GET /api/jobs/hot` with query params: `latitude` (number), `longitude` (number), `page` (default 1), `limit` (default 10), `sortOrder` (e.g. `desc`).
2. **Listed jobs:** `GET /api/jobs/normal` with the same query params.
3. **Search hot:** `GET /api/jobs/search/hot` with `latitude`, `longitude`, `search`, `page`, `limit`, `sortOrder` (and optionally `sortBy`).
4. **Search listed:** `GET /api/jobs/search/normal` with the same params.

Requests include `Authorization: Bearer <token>` when the user is logged in.

**What the app expects in the response**

- JSON: `{ "status": "success", "data": { "jobs": [ ... array of job objects ... ], "pagination": { "currentPage", "totalPages", "totalJobs", "hasNextPage", "hasPrevPage" } } }`.
- Each job must include at least: `_id`, `title`, `cost`, `jobType`, `scheduledDate`, `scheduledTime`, and `postedBy` (with `profile.fullName` and optionally `profile.profileImage` for the poster).

**What to verify on the backend**

1. Do `GET /api/jobs/hot` and `GET /api/jobs/normal` exist and accept **latitude** and **longitude** (and the other params above)? What exact query param names do you use (e.g. `lat`/`lng` vs `latitude`/`longitude`)?
2. When called with valid coordinates (e.g. for Vijayawada, India: latitude 16.5062, longitude 80.6480), do you return 200 with the above response shape, or do you return 4xx/5xx or a different JSON shape?
3. Do you **exclude the current user's jobs** and filter/rank by **distance from the given coordinates** so that "nearby jobs from other people" are returned?
4. If there are no jobs in range, do you return 200 with `"jobs": []` and valid `pagination`, or something else (e.g. error body or different structure)?
5. Do these endpoints require authentication? If the token is missing or invalid, what status and body do you return (e.g. 401 with a specific message)?

**How to test quickly**

- Call the API with a tool (e.g. Postman or curl) using the same base URL as the app and the same query params (and auth header if required), for example:
  - `GET /api/jobs/hot?latitude=16.5062&longitude=80.6480&page=1&limit=10&sortOrder=desc`
  - `GET /api/jobs/normal?latitude=16.5062&longitude=80.6480&page=1&limit=10&sortOrder=desc`
- Share the exact **status code** and **response body** (or a redacted sample) so we can confirm whether the issue is backend (empty data, wrong shape, wrong params) or something else (e.g. app not sending the right coordinates or not parsing the response).
