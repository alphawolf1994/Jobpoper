# Push notifications for Jobpoper (parity with Receni)

This document describes how **Receni** implements Firebase Cloud Messaging (FCM) with a **.NET** API, and what **you** need to provide and implement so **Jobpoper** can match that behavior: **in-app notification records plus push** on both **Android** and **iOS**, including **foreground** and **background/quit** delivery.

**Reference app (Receni):** `../Receni/ReceniApp` (Expo) + `../Receni/ReceniBackend` (.NET).  
**Your app:** `Jobpoper` (Expo) + `jobpoper_backend` (Node.js).

---

## 1. How Receni does it (summary)

| Layer | What Receni uses |
|--------|------------------|
| **Client** | **Not** Expo’s push service. It uses **`@react-native-firebase/app`** and **`@react-native-firebase/messaging`** to obtain an **FCM registration token** and handle messages. |
| **Android channels** | **`@notifee/react-native`** creates channels whose IDs must match the backend (see `androidNotificationChannels.ts`). |
| **Entry file** | `index.js` calls `setBackgroundMessageHandler` **before** `registerRootComponent` (required for background handling). |
| **Foreground** | `FcmHandler.tsx` uses `onMessage` — when the app is open, the **OS does not show a system banner**; Receni shows **`Alert.alert`** and updates **Redux** with the same notification id as the server. |
| **Background / quit** | FCM **notification** payloads are shown by the system; tap opens the app; `onNotificationOpenedApp` + `getInitialNotification` run for navigation. |
| **Token → server** | After permission, the app gets FCM token and **`POST /api/devices`** with `pushNotificationToken` and device metadata (`deviceService.ts`). |
| **Server** | **Firebase Admin SDK** (`.NET`) with a **service account JSON**; sends FCM to stored tokens. **iOS and Android both use FCM** (APNs is integrated via Firebase for iOS). |
| **In-app + push** | `NotificationService.CreateNotificationAsync` **saves** a row, then **fires push** with **data** including `notificationId` and `type` so the app can align UI with the API (`NotificationService.cs`). |

Your Jobpoper backend (Node) should mirror that **pattern**: create the Mongo `Notification` document, then call FCM with a **data** payload that includes the same **`_id`** (or a stable `notificationId` string) and any **`navigationIdentifier`** you already use in `NotificationScreen.tsx`.

---

## 2. What you need from accounts and consoles

### 2.1 Firebase (one project for Jobpoper)

1. Create or use a **Firebase** project.
2. Add an **Android** app: package name must match Jobpoper’s (today `com.anonymous.Jobpoper` in `app.json` — **change only if you intentionally change the application id**).
3. Add an **iOS** app: **Bundle ID** must match Jobpoper’s (today `com.anonymous.jobpoper` in `app.json`).
4. Download:
   - **`google-services.json`** (Android) — place in your app repo (e.g. `firebase/google-services.json`).
   - **`GoogleService-Info.plist`** (iOS) — e.g. `firebase/GoogleService-Info.plist`.
5. **Cloud Messaging**:
   - **Android:** no extra upload beyond `google-services.json` for basic FCM.
   - **iOS:** In Firebase **Project settings → Cloud Messaging → Apple app configuration**, upload your **APNs authentication key** (.p8) **or** certificates, and set **Key ID**, **Team ID**, **Bundle ID**. Without this, **iOS will not receive FCM**.

### 2.2 Google Cloud (server)

1. In the **same** Firebase/GCP project, open **IAM & Admin → Service accounts**.
2. Create a key for the Firebase Admin SDK (or use the existing “firebase-adminsdk” service account) and download **JSON** (kept **secret**, never commit).
3. This JSON is what your **Node backend** uses to send FCM (equivalent to Receni’s `firebase-credentials.json` / `CredentialsPath` in `appsettings.json`).

### 2.3 Apple Developer (iOS)

1. **App ID** with **Push Notifications** capability enabled for your bundle id.
2. **APNs key** (.p8) in Apple Developer → Keys — used in **Firebase** (see 2.1.5).
3. For **TestFlight / App Store** builds, ensure **production** APNs is configured in Firebase; for **Xcode dev** builds, **development** may be used — mismatches are a common reason iOS “doesn’t get pushes.”
4. Receni sets `aps-environment` in `app.config.js` `entitlements` (development) — for release you typically use **production** in signed release builds (EAS/Xcode can manage this).

### 2.4 Android

1. **No** separate “FCM server key” in legacy APIs if you use Firebase Admin SDK with the service account JSON.
2. **Android 13+:** the app must request **`POST_NOTIFICATIONS`** at runtime (Receni does this in `deviceService.ts`).

---

## 3. Mobile app (Jobpoper) — technical requirements

### 3.1 You cannot rely on Expo Go for this stack

`@react-native-firebase/*` needs **native code**. You must use a **development build** or **release build**:

- `npx expo prebuild` and then `expo run:android` / `expo run:ios`, or
- **EAS Build** with a profile that includes the native Firebase and Notifee code.

Receni’s `app.config.js` already wires:

- `plugins`: `@react-native-firebase/app`, `@react-native-firebase/messaging`, `expo-build-properties` (iOS `useFrameworks: 'static'`), and a custom **`withFirebaseConfig`** to copy config files at prebuild.

You will need the **same class of setup** in Jobpoper (either merge equivalent entries into `app.json` or switch to `app.config.js`).

### 3.2 NPM packages to add (aligned with Receni)

- `@react-native-firebase/app`
- `@react-native-firebase/messaging`
- `@notifee/react-native` (if you want Android **channels** and future local notifications)
- `expo-build-properties` (iOS static frameworks; required for common RNFB setups on Expo 54+)

Optional but used in Receni: `expo-device`, `expo-application` for device metadata on registration.

### 3.3 Config files in repo (paths are up to you; Receni uses `ReceniApp/firebase/`)

- `firebase/google-services.json`
- `firebase/GoogleService-Info.plist`  
  **Do not commit secrets that aren’t needed in the app** — these plist/json files are **client** configs (they’re in the shipped app). The **server** uses the **separate** service account JSON.

### 3.4 iOS / Android project settings (after prebuild)

- **Android `applicationId`** = Firebase Android app package; **`google-services.json` in `android/app/`** (or applied via plugin).
- **iOS** bundle id = Firebase iOS app; **GoogleService-Info.plist** in the Xcode project.
- **iOS entitlements:** Push / **aps-environment** as per your build type.
- **Android manifest permissions:** e.g. `POST_NOTIFICATIONS`, `VIBRATE`, `RECEIVE_BOOT_COMPLETED` as needed (Receni lists them in `app.config.js`).

### 3.5 Code behavior to match Receni

1. **`index.tsx` (or `index.js`)**  
   - Import and call `registerBackgroundHandler()` (using `setBackgroundMessageHandler`) **before** `registerRootComponent`, guarded by a “Firebase is available” check (see Receni `index.js` + `firebaseAvailability.ts`).

2. **Root `App` component**  
   - Mount a small **`FcmHandler`-style** component that:
     - `onMessage` → foreground: update your Redux notification slice **and** show a visible UI (Receni uses `Alert.alert`; you may prefer **Toast** or in-app banner — but **FCM will not show a system tray banner in foreground** for the same message unless you add local notifications).
     - `onNotificationOpenedApp` / `getInitialNotification` → **navigation** (e.g. your `NotificationScreen` or target route using `navigationIdentifier`).

3. **Android**  
   - On startup, `createChannel` IDs that **match** what your **Node** backend puts on the FCM `android.notification.channelId` (Receni + `PushNotificationService.GetAndroidChannelIdForData`).

4. **Payload contract**  
   - Always send **`data`** with at least:  
     - `notificationId` — your Mongo id as string (Receni uses int id; yours can be `notification._id.toString()`),  
     - `type` — your notification type,  
     - optional: `title`, `body` if you use data-only in some code paths,  
     - your **`navigationIdentifier`** for deep linking.  
   - Receni’s `FcmHandler` **requires** `notificationId` in `data` to sync Redux; design Jobpoper the same so foreground state matches the API.

5. **Device registration (new API on Node)**  
   - jobpoper_backend does **not** yet mirror Receni’s `Devices` table + `POST /api/devices`. You (or your team) need:  
   - A **user devices** model: `userId`, stable `deviceId`, `platform`, `pushNotificationToken` (FCM), optional `appVersion`.  
   - **Register** on login and **refresh** when the FCM token changes (`onTokenRefresh`).  
   - **Unregister** on logout to avoid sending to the wrong user.

### 3.6 Foreground vs background (expectations)

| App state | What happens |
|-----------|----------------|
| **Foreground** | FCM is delivered to `onMessage` — **user often won’t see a system notification**; you must show **in-app** UI (alert/toast) and update your list, like Receni. |
| **Background** | FCM with a **notification** block is **displayed by the OS** (when allowed). `setBackgroundMessageHandler` runs in limited cases (often for **data-only** messages; behavior varies by OEM). |
| **Quit (cold start)** | Tapping a notification: use `getInitialNotification` then navigate after a short delay so your navigator is mounted. |

To mirror “everything in the notifications screen also goes to push,” the **server** must send FCM for **every** notification you create in the DB, using the same title/body and the **same ids** in `data`.

---

## 4. Backend (jobpoper_backend — Node) — what to implement

Receni (.NET) uses `FirebaseAdmin` and `SendEachAsync` with `Notification` + `Data` + Android `ChannelId` + `Apns` config.

For Node, plan for:

1. **Install** `firebase-admin` and **initialize** with `GOOGLE_APPLICATION_CREDENTIALS` pointing to your service account JSON (or `credential: cert(...)` with env vars). **Do not** commit the JSON to git; use **secrets** in production.

2. **On create notification** (e.g. wherever you `insertMany` / `create` a `Notification` in Mongo), after `save` success, **enqueue or call** a function like:
   - `sendToUserFcm(userId, title, message, { notificationId, type, navigationIdentifier, ... })`
   - Load all **active device tokens** for that user and send with `admin.messaging().sendEachForMulticast` or a loop of `send`.

3. **FCM message shape (match app expectations)**  
   - `notification: { title, body }`  
   - `data: { notificationId, type, ... }` — **string values only** in FCM data map.  
   - `android: { priority: 'high', notification: { channelId: '...' } }`  
   - `apns: { payload: { aps: { ... } } }` as needed (Firebase Admin can fill defaults when `notification` is set).

4. **Token cleanup:** On `messaging/registration-token-not-registered` or invalid token errors, remove that token from the DB.

---

## 5. Checklist: “What is required from me”

### Accounts & files

- [ ] Firebase project with **Android + iOS** apps registered; **`google-services.json`** + **`GoogleService-Info.plist`** in the app project.
- [ ] **Service account JSON** for the server (GCP/IAM) — only on the backend / CI secrets.
- [ ] **Apple** APNs key (.p8) uploaded to Firebase; App ID with **Push Notifications**; correct **bundle id** in Firebase and Xcode.
- [ ] Decide final **package name** and **bundle id** and keep them consistent across `app.json`, Firebase, and stores.

### Mobile project

- [ ] Switch to a **config that supports Config Plugins** (`app.config.js` recommended for Firebase plugins).
- [ ] Add **RNFB + Notifee** (or equivalent) and a **prebuild** workflow; stop expecting **Expo Go** to test native push.
- [ ] Add **notification permission** flows (iOS: `requestPermission`) and **Android 13+** `POST_NOTIFICATIONS`.
- [ ] Implement **FCM token registration** API calls to your **Node** backend; handle **token refresh** and **logout** unregister.
- [ ] Implement **`FcmHandler` + `index` background handler** and align **Redux** with `notificationId` in push **data**.

### Backend

- [ ] Store **FCM tokens** per user device.
- [ ] Use **`firebase-admin`** to send after each in-app notification is created.
- [ ] Use a **data payload** contract shared with the app (ids + `navigationIdentifier`).

### Testing

- [ ] **Real device** for iOS; Android emulator with **Google Play** image for FCM.
- [ ] Test: app **foreground** (in-app / alert), **background**, and **killed** + tap notification.
- [ ] Fix common issues: wrong Firebase iOS APNs env, **invalid/expired** token, **mismatched** `notificationId` in `data` vs API.

---

## 6. Quick file map in Receni (for copy-paste exploration)

| Purpose | Receni path |
|---------|-------------|
| Expo plugins + entitlements + Firebase paths | `ReceniApp/app.config.js` |
| Prebuild: copy Firebase configs + Notifee Maven tweak | `ReceniApp/plugins/withFirebaseConfig.js` |
| FCM before App mount | `ReceniApp/index.js` |
| Foreground/background open | `ReceniApp/src/services/notifications/FcmHandler.tsx` |
| Background handler | `ReceniApp/src/services/notifications/pushNotificationHandler.ts` |
| Android channels | `ReceniApp/src/services/notifications/androidNotificationChannels.ts` |
| FCM token + `POST` device | `ReceniApp/src/services/devices/deviceService.ts` |
| API: create notification + send push | `ReceniBackend/src/Receni.Api/Services/NotificationService.cs` |
| FCM send (Firebase Admin) | `ReceniBackend/src/Receni.Api/Services/PushNotificationService.cs` |
| App push settings | `ReceniBackend/src/Receni.Api/appsettings.json` → `PushNotificationSettings` |

---

*Generated for Jobpoper so you can mirror Receni’s push + in-app flow; implementation in Jobpoper and jobpoper_backend is still to be done following this contract.*

---

## 7. After implementation (what *you* must add)

### Files to obtain (not in this repo)

| File | Where to get it | Where to put it in this project |
|------|-------------------|---------------------------------|
| **`google-services.json`** | Firebase → Project settings → Your **Android** app | `Jobpoper/firebase/google-services.json` |
| **`GoogleService-Info.plist`** | Firebase → Project settings → Your **iOS** app | `Jobpoper/firebase/GoogleService-Info.plist` |
| **Service account JSON** (server) | Google Cloud / Firebase → **IAM** → service account → **Create key** (JSON) | **Only** on the server: path in `.env` as `FIREBASE_SERVICE_ACCOUNT_PATH` (or use `FIREBASE_SERVICE_ACCOUNT` as base64 JSON) — **do not** commit to git |
| **APNs key (.p8)** (iOS) | [Apple Developer](https://developer.apple.com) → Keys | Upload in **Firebase** → Project settings → Cloud Messaging → **Apple app** configuration |

### Env vars (jobpoper_backend)

Set in `.env` (or your host’s secrets):

- `FIREBASE_SERVICE_ACCOUNT_PATH` — absolute or relative path to the **service account JSON** file, **or**
- `FIREBASE_SERVICE_ACCOUNT` — entire JSON as a string, or **base64**-encoded JSON (see `pushNotificationService.js`).

No FCM key in the app: the **backend** sends pushes using this credential.

### Commands to run (after config files exist)

```bash
cd Jobpoper
npx expo prebuild
npx expo run:android   # or: npx expo run:ios
```

Use a **development build**; **Expo Go** will not load `@react-native-firebase/*`.

### What was added in code (reference)

- **App:** `app.config.js` (wraps `app.json` + Firebase plugins), `plugins/withFirebaseConfig.js`, `index.tsx` (background FCM handler), `src/App.tsx` (`navigationRef`, `FcmHandler`, `PushDeviceSync`, Android channels).
- **Client services:** `src/services/notifications/*`, `src/services/devices/deviceService.ts`, `src/navigation/navigationRef.ts`, `src/components/PushDeviceSync.tsx`.
- **Redux:** `addNotificationFromPush` / `incrementUnreadCount` in `notificationSlice`; `logoutUser` calls `unregisterCurrentDevice` before the logout API.
- **Backend:** `POST /api/devices`, `DELETE /api/devices/:deviceId`, `models/Device.js`, `services/pushNotificationService.js`; `jobController` sends FCM after creating job/interest notifications when credentials are set.
