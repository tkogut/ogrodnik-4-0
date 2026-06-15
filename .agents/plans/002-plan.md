# [SEQ-PRO] Plan 002 - Powiadomienia Push i Potwierdzenia Zadań

## Goals
- [x] Add Local Notifications functionality using the Web Notifications API.
- [x] Implement a test notification trigger with a 5-second delay to demonstrate the PWA push functionality on Android.
- [x] Create a "Potwierdź wykonanie" (Confirm execution) button for the daily task.
- [x] Persist the task completion state in `localStorage` by date.
- [x] Update the UI to visually reflect completed tasks on both the main TODAY card and the 3-day preview calendar.

## Steps
1. **Update Design Tokens / Plans** [x]
   - Write this plan file.
2. **Implement Notification Logic inside `src/App.jsx`** [x]
   - Request browser notification permissions.
   - Implement the `showLocalNotification` handler.
   - Add a configuration panel for notification preferences.
3. **Implement Task Completion Logic** [x]
   - Track completed tasks using `localStorage` keyed by `YYYY-MM-DD`.
   - Add a confirm button with micro-animations.
   - Render checkmarks in the calendar preview for completed days.
4. **Local Verification** [x]
   - Compile code with `npm run build` to verify clean build.
5. **VPS Deployment** [x]
   - Push updates to git and pull/rebuild on VPS.
6. **Audit Check** [x]
   - Verify push notification permissions work and state persists offline.
