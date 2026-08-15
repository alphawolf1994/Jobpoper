import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { GateReason, openGate } from "../redux/slices/phoneVerificationSlice";
import PhoneVerifySheet, {
  PhoneVerifySheetHandle,
} from "../components/PhoneVerifySheet";

/**
 * Gate an action behind phone verification.
 *
 * Usage:
 *
 *   const { ensurePhoneVerified, phoneSheet } = useRequirePhoneVerified();
 *
 *   const handlePost = () => {
 *     if (!ensurePhoneVerified("post_job", handlePost)) return;
 *     ...actually post...
 *   };
 *
 *   // and render {phoneSheet} somewhere in the screen's JSX
 *
 * Returns true when the user is already verified (caller proceeds immediately).
 * Returns false when the sheet has been opened — the caller must bail out. The
 * action passed in is re-invoked automatically once verification succeeds, so
 * the user does not have to tap the button a second time.
 *
 * The pending action is held in a ref rather than redux because it closes over
 * local component state (form values, the selected job) and is not serialisable.
 */
export const useRequirePhoneVerified = (options?: {
  /** Called if the user dismisses the sheet without verifying. */
  onDismiss?: () => void;
  /** Mirror the sheet's visibility, e.g. to hide a sticky footer CTA. */
  onVisibilityChange?: (visible: boolean) => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const sheetRef = useRef<PhoneVerifySheetHandle>(null);
  const pendingActionRef = useRef<(() => void) | null>(null);

  const isPhoneVerified = useSelector(
    (state: RootState) => state.auth.user?.isPhoneVerified
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  /**
   * Mirrored into refs so `ensurePhoneVerified` can stay referentially stable
   * AND always read current values.
   *
   * This is load-bearing, not a micro-optimisation. The pending action we
   * replay after verification is a closure captured *before* the user verified.
   * If the gate check read the closed-over `isPhoneVerified`, the replayed
   * action would still see `false`, reopen the sheet, verify, replay, reopen —
   * an infinite loop. Reading through a ref means the replay sees the fresh
   * `true` and proceeds.
   */
  const isPhoneVerifiedRef = useRef(isPhoneVerified);
  const isAuthenticatedRef = useRef(isAuthenticated);

  useEffect(() => {
    isPhoneVerifiedRef.current = isPhoneVerified;
    isAuthenticatedRef.current = isAuthenticated;
  }, [isPhoneVerified, isAuthenticated]);

  const ensurePhoneVerified = useCallback(
    (reason: GateReason, action?: () => void): boolean => {
      // Not logged in: this gate is not the right place to intervene — the
      // screen's own auth handling deals with it. Never block here.
      if (!isAuthenticatedRef.current) return true;

      if (isPhoneVerifiedRef.current) return true;

      pendingActionRef.current = action ?? null;
      dispatch(openGate(reason));
      sheetRef.current?.open();
      return false;
    },
    [dispatch]
  );

  const handleVerified = useCallback(() => {
    // The sheet fires this after a successful verify. Update the ref eagerly
    // rather than waiting for the effect above, so the replayed action below
    // definitely sees the new value even within this same tick.
    isPhoneVerifiedRef.current = true;

    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    action?.();
  }, []);

  const handleDismiss = useCallback(() => {
    // Discard the pending action — nothing should run behind the user's back.
    pendingActionRef.current = null;
    options?.onDismiss?.();
  }, [options]);

  const phoneSheet = (
    <PhoneVerifySheet
      ref={sheetRef}
      onVerified={handleVerified}
      onDismiss={handleDismiss}
      onVisibilityChange={options?.onVisibilityChange}
    />
  );

  return {
    ensurePhoneVerified,
    phoneSheet,
    /** True when the user still needs to verify — useful for pre-emptive UI hints. */
    needsPhoneVerification: isAuthenticated && !isPhoneVerified,
    /** Escape hatch for screens that need to close the sheet imperatively. */
    closePhoneSheet: () => sheetRef.current?.close(),
  };
};

export default useRequirePhoneVerified;
