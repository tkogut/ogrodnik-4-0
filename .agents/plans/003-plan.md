# [SEQ-PRO] Plan 003 - Blokada Potwierdzania Przyszłych Zadań

## Goals
- [x] Add a business logic check: block confirmation of future tasks relative to the device's real current date.
- [x] Show a descriptive locked card message if the active task is in the future.
- [x] Provide a developer/testing toggle in the simulation panel to unlock future task confirmations for audit and testing on June 15th.
- [x] Update `src/App.jsx` using terminal streams.
- [x] Rebuild locally and verify.
- [x] Pull and deploy to VPS.

## Steps
1. **Create Plan 003** [x]
   - Create Plan 003.
2. **Implement Future Check & Lock Switch in `src/App.jsx`** [x]
   - Create helper `isFutureDate(date)`.
   - Add state `allowFutureConfirm` defaulting to `false`.
   - Add toggle checkbox in the simulator panel.
   - Update Today Card task completion panel to lock future tasks when `isFutureDate(currentDate) && !allowFutureConfirm`.
3. **Local Compilation Check** [x]
   - Run `npm run build`.
4. **VPS Deploy** [x]
   - Push to Git, pull, and rebuild on VPS.
5. **Auditor Report** [x]
   - Verify lock behavior on the live domain.
