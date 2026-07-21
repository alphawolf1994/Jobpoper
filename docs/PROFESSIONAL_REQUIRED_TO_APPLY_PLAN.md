# Plan: Require Professional Profile Before Contact / Show Interest

## What I understand

On **Task Detail**, a non-owner seeking work sees one bottom action depending on the task type:

| Task setting (`responsePreference`) | Button |
|---|---|
| Direct contact | **Contact** |
| Show interest | **Show Interest** |

Today those actions do **not** require the current user to be a Professional / Worker.

Your requirement:

> To apply for / respond to a task (Contact **or** Show Interest), the user **must** have Professional / Worker enabled.  
> If they are not a professional, show a popup asking them to complete their professional profile, with a button that opens **User Details** where they can enable Professional / Worker and fill the other info.

This is a **gate before applying**, similar to how Show Interest already gates on verification (and pickup preferences for Pickup jobs).

---

## Current behavior (relevant)

**File:** `Jobpoper/src/navigation/screens/JobDetailsScreen.tsx`

- **Contact** (`handleContact`): opens phone dialer / contact alert. No professional check.
- **Show Interest** (`handleShowInterest`): already checks:
  1. Identity verification (`user.isVerified`) → verification sheet
  2. Pickup prefs (Pickup jobs only) → pickup preferences sheet  
  Then opens the Express Interest sheet.

**Professional toggle lives on:** `UserDetailsScreen`  
- “Are you a Professional / Worker?”  
- When Yes: categories, bio, experience, work images, Worker ID, etc.  
- Persisted as `user.isProfessional` (+ `professionalProfile`).

**Backend:** `showInterestInJob` currently does **not** reject non-professionals.  
Contact is client-side only (no apply API).

---

## Proposed behavior

When user taps **Contact** or **Show Interest**:

1. If viewer is task owner → unchanged (button already hidden for owner).
2. If `user.isProfessional !== true`:
   - Show popup (existing `showAlert` / AlertModal style, consistent with app).
   - Message (final copy can be tuned):  
     **Title:** “Professional Profile Required”  
     **Message:** “Please complete your Professional / Worker profile before contacting or showing interest on tasks.”
   - Buttons:
     - **Cancel** (secondary)
     - **Complete Profile** (primary) → navigate to `UserDetailsScreen`
3. If user **is** professional → continue existing Contact / Show Interest flow (including verification + pickup prefs for Show Interest).

**Order of checks for Show Interest (recommended):**

1. Professional / Worker enabled ← **new**
2. Identity verified (existing)
3. Pickup prefs if Pickup job (existing)
4. Open Express Interest sheet

**Order for Contact:**

1. Professional / Worker enabled ← **new**
2. Existing contact / dialer flow

---

## How I will implement it

### Frontend (main work)

1. Add a small helper in `JobDetailsScreen` (or shared util), e.g. `ensureProfessionalOrPrompt()`:
   - Returns `true` if `user?.isProfessional`
   - Otherwise shows the alert and returns `false`
2. Call it at the start of `handleContact` and `handleShowInterest`.
3. Navigate with existing stack route: `navigation.navigate('UserDetailsScreen')` (same as Profile screen already does).

### Backend (recommended, small but important)

4. In `POST /jobs/:id/interest` (`showInterestInJob`), reject if `!req.user.isProfessional` with a clear 403 message.  
   This prevents bypassing the UI gate via API.

Contact does not need a backend change (no apply endpoint).

### Out of scope (unless you ask)

- Forcing full professional fields (categories/bio) beyond `isProfessional === true`
- Changing Post Job / Verify Worker flows
- Blocking browsing of tasks for non-professionals (only Contact / Show Interest)

---

## Acceptance criteria

- Non-professional taps Contact → popup → Complete Profile → User Details.
- Non-professional taps Show Interest → same popup (before verification sheet).
- Professional user → Contact / Show Interest works as today.
- Backend interest API rejects non-professionals.
- Owner viewing their own task → no change.

---

## Files likely touched

| Area | File |
|---|---|
| UI gate + popup | `Jobpoper/src/navigation/screens/JobDetailsScreen.tsx` |
| API guard | `jobpoper_backend/controllers/jobController.js` (`showInterestInJob`) |

---

## Open questions (defaults if you don’t answer)

1. **Strictness:** Gate on `isProfessional === true` only, **or** also require at least one service category / bio?  
   → **Default:** `isProfessional === true` only (they complete details on User Details).
2. **Verification order:** Professional check before verification check?  
   → **Default:** Yes (professional first).

---

## Status

**Approved and implemented** (frontend gate + backend interest API guard).
