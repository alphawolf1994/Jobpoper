# Referral Feature — Testing Guide

Use this checklist after deploying the backend changes and before client marketing starts.

---

## 0. Pre-flight (do this first)

### Backend

```bash
cd jobpoper_backend
npm install          # installs express-rate-limit + pdfkit (required)
```

Then backfill referral codes for **existing** users (new signups get a code automatically):

```bash
# Safe preview — no writes
node scripts/backfillReferralCodes.js --dry-run

# Real run
node scripts/backfillReferralCodes.js
```

Confirm:

- Script prints `Assigned N` and `Remaining without code: 0`
- Server starts without errors
- `GET /api/health` still works

### Frontend config

In `app.json` → `expo.extra`:

| Key | Current | Action |
|-----|---------|--------|
| `playStoreUrl` | `...id=com.anonymous.Jobpoper` | OK if that is the live Play package |
| `appStoreUrl` | `...id0000000000` | **Replace with real App Store ID before release** |
| `fallbackStoreUrl` | `https://makemytask.app/download` | Confirm this page exists |

Rebuild / reload the app after changing `app.json`.

---

## 1. New signup → auto referral code

1. Register a **new** user (phone OTP → PIN).
2. Complete nothing yet; call `GET /api/auth/me` (or open Profile after login).
3. Confirm response includes `referralCode` — 5 chars, uppercase `A–Z` / `0–9` (same format as task/worker ID, but **not** equal to that user’s `workerId`).
4. Open **Profile → Referral Program**.
5. Confirm the same code is shown under “Your referral code”.

**Pass if:** every new account has a unique code; app never crashes if code is momentarily missing (shows “Generating…” then self-heals via `/referrals/me`).

---

## 2. Existing users (after backfill)

1. Log in as a user who existed **before** this feature.
2. Open Referral Program.
3. Confirm a code is present (from backfill or lazy assign on `/referrals/me`).

**Pass if:** no old user is stuck without a code; login / jobs / profile still work as before.

---

## 3. Complete Profile — referral code (optional)

Use two devices / two accounts: **Referrer (A)** and **Invitee (B)**.

### 3a. Without code (regression)

1. Register user B.
2. On Complete Profile, leave Referral Code empty.
3. Submit normal name, email, location.

**Pass if:** profile completes; B is **not** in A’s referral list; no rate-limit errors.

### 3b. With valid code

1. Copy A’s code from Referral Program.
2. Register B → Complete Profile → enter A’s code.
3. Submit.

**Pass if:**

- Profile succeeds
- A’s Referral Program shows B (name, masked email/phone, joined date, status)
- Admin → User A detail → Referral Information → B appears with **full** contact details
- Admin → User B detail → “Referred By” shows A

### 3c. Invalid / edge codes

| Input | Expected |
|-------|----------|
| Wrong 5-char code | Inline error; profile **not** saved; user can clear field and retry |
| Own code (self) | “You cannot use your own referral code” |
| 1–4 characters | Client blocks: “must be 5 characters” |
| Empty | Completes normally (optional) |
| Blocked referrer’s code | Invalid (same as unknown code) |

**Important:** A bad referral code rejects the **whole** complete-profile request. Tester must clear or fix the code to proceed.

---

## 4. Referral Program screen (user app)

1. Open **Profile → Referral Program**.
2. **Copy** — paste elsewhere; code matches.
3. **Share** — system share sheet opens; message includes:
   - Invite text + code
   - Store link: Play link on Android, App Store link on iOS
4. Pull to refresh; list updates.
5. If many referrals exist, scroll to load more (pagination).

**Pass if:** no payment / commission / “earn money” copy anywhere in the app (marketing payout stays admin-only / offline).

---

## 5. Admin panel

1. Open any user detail.
2. **Referral Information** card shows:
   - Their referral code
   - Total referrals
   - Referred by (if any) — tap navigates to that user’s detail
3. Referred users list (unmasked email/phone).
4. **Export Referral List (PDF)** when total > 0:
   - Browser/PDF opens
   - Filename like `referrals-{CODE}-{date}.pdf`
   - Rows match the on-screen list
5. Export disabled when total is 0.
6. Empty list copy: “This user has not referred anyone yet.”

**Pass if:** client can verify referrals from admin alone (no screenshot workflow needed).

---

## 6. Rate limiting (what it is — and what it is not)

Rate limits were added **only** for referral abuse protection. They do **not** throttle normal login, job create, or profile-without-referral.

| Limit | Where | Threshold |
|-------|--------|-----------|
| Validate code | `GET /referrals/validate/:code` | 10 / minute / user |
| Complete profile **with** referral code | `PUT /auth/complete-profile` | 5 / hour / user |
| Complete profile **without** code | same route | **No** extra limit |
| PDF export | `GET /admin/users/:id/referrals/export` | 10 / hour / IP |

**How to spot it:** HTTP `429` + `code: "RATE_LIMITED"`.

If `express-rate-limit` is not installed, limits silently no-op (server still runs). Run `npm install` so they are actually active.

---

## 7. Regression — existing workflows must still work

Run these on a build that includes referral changes:

| Flow | Check |
|------|--------|
| Login / logout | Works |
| Register without ever touching referral | Works |
| Complete profile (no referral field used) | Works |
| Create job / apply / complete job | Works |
| Worker ID still assigned for professionals | Unchanged; independent of referral code |
| Admin user list / block user / verification review | Works |
| Admin jobs / reports | Works |
| Change PIN / forgot PIN | Works |
| Delete account | Works |

**API compatibility note:** Existing auth/admin responses gained optional fields (`referralCode`, nested `referral` on admin detail). Old clients that ignore unknown fields should keep working.

---

## 8. Quick API smoke tests (optional)

Replace `TOKEN` / IDs as needed.

```bash
# Own summary
curl -H "Authorization: Bearer TOKEN" https://YOUR_API/api/referrals/me

# My referrals
curl -H "Authorization: Bearer TOKEN" "https://YOUR_API/api/referrals/my-referrals?page=1&limit=20"

# Soft validate
curl -H "Authorization: Bearer TOKEN" https://YOUR_API/api/referrals/validate/ABC12

# Admin list
curl -H "Authorization: Bearer ADMIN_TOKEN" https://YOUR_API/api/admin/users/USER_ID/referrals

# Export token then open PDF URL in browser
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  https://YOUR_API/api/admin/users/USER_ID/referrals/export-token
# → open: /api/admin/users/USER_ID/referrals/export?t=THAT_TOKEN
```

---

## 9. Deploy order (recommended)

1. `npm install` on backend
2. Deploy backend (indexes create on User model)
3. Run `backfillReferralCodes.js` on production DB
4. Ship app build with store URLs fixed
5. Smoke-test sections 1–7 above
6. Only then start marketing payouts from admin PDF / list

---

## 10. Known non-blockers (aware, not launch-stoppers)

- Soft validate API exists but Complete Profile validates only on submit (no live “code OK” hint).
- Frontend handles `REFERRAL_ALREADY_SET`; backend currently succeeds quietly if attribution was already set — dead branch, harmless.
- App Store URL placeholder must be fixed before sharing on iOS.
- PDF export needs `pdfkit` installed; otherwise export returns `PDF_LIB_MISSING`.
