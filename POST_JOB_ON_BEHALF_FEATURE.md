# Post Job on Behalf of Another Person — Feature Plan

> **Status:** Implemented

---

## What I Understand

You want to grow JobPoper’s job listings by letting **any logged-in user** (including admins) create jobs that originally came from **WhatsApp groups** or other channels — for people who **are not registered** on JobPoper.

### Current behavior

- When someone posts a job, `postedBy` is always the logged-in app user.
- On **Job Details**, viewers see that user’s name and can **Contact** them via `contactInfo` (derived from `postedBy.phoneNumber`).
- The **Admin Job Detail** screen shows the same `postedBy` user as the job owner.

### Desired behavior

1. At the **bottom of the Post Job screen** (before the submit button), add an optional **checkbox**.
2. When checked, show **two inputs**:
   - **Name** — the person who actually needs the job
   - **Phone number** — that person’s contact number
3. When another user opens **Job Details** for that job:
   - The **Contact** action should use the **external person’s phone**, not the poster’s.
   - The visible contact / “who needs this job” info should reflect the **external person**, not the app user who submitted the form.
4. In the **mobile Admin Job Detail** screen, show **both**:
   - Who posted it in the app (`postedBy`)
   - The external person’s name & phone (the real job seeker)
5. **Purpose:** Seed the marketplace with real jobs from WhatsApp while keeping attribution clear for admins.

---

## Checkbox Label (Approved)

> **Post job for another person**

Helper text:

> Use this when the job seeker is not on JobPoper (e.g. from a WhatsApp group). Their contact will be shown to interested workers instead of yours.

---

## Data Model (Backend)

Fields on `Job` (`jobpoper_backend/models/Job.js`):

```javascript
postedOnBehalf: { type: Boolean, default: false },
externalContact: {
  name: { type: String, trim: true, maxlength: 100 },
  phoneNumber: { type: String, trim: true, maxlength: 20 },
},
```

The `contactInfo` virtual returns `externalContact.phoneNumber` when `postedOnBehalf` is true.

---

## API Changes (Backend)

| Method | Path | Change |
|--------|------|--------|
| POST | `/api/jobs` | Accept `postedOnBehalf`, `externalContactName`, `externalContactPhone` |
| PUT | `/api/jobs/:id` | Same fields on update; clearing checkbox removes external contact |
| GET | `/api/jobs/:id` | Returns `postedOnBehalf` + `externalContact` |
| GET | Admin job endpoints | Included in `buildAdminJob` / `buildAdminJobDetail` |

---

## Mobile App Changes

| Screen | Change |
|--------|--------|
| `PostJobScreen.tsx` | Checkbox + job seeker name/phone inputs before submit |
| `JobDetailsScreen.tsx` | Show external person as job seeker; Contact uses their phone |
| `AdminJobDetailScreen.tsx` | “Job Seeker (External Contact)” + “Posted By (App User)” sections |

---

## What Stays the Same

- `postedBy` remains the logged-in user (My Jobs, edit/delete, admin audit)
- Show Interest still goes to the app poster (external person has no account)
- Push notification text unchanged for v1

---

## Test Plan

- [ ] Post job **without** checkbox → behaves exactly as today
- [ ] Post job **with** checkbox but empty name/phone → validation error
- [ ] Post job **with** checkbox + valid name/phone → success
- [ ] Job details as **another user** → Contact shows external phone
- [ ] Edit job: toggle checkbox off → external contact cleared
- [ ] Admin job detail → shows both Job Seeker and Posted By
