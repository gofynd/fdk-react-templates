import { useMemo } from "react";
import { getUserAutofillData } from "../utils";

/**
 * Custom hook for handling address form autofill functionality
 * @param {Object} user - User object from authentication
 * @param {boolean} isGuestUser - Whether the current user is a guest
 * @returns {Object} Autofill data and utility functions
 */
export const useAddressAutofill = (user, isGuestUser) => {
  // Memoized user autofill data
  const autofillData = useMemo(
    () => getUserAutofillData(user, isGuestUser),
    [user, isGuestUser]
  );

  // Check if autofill data is available
  const hasAutofillData = useMemo(() => {
    return !!(autofillData.name || autofillData.phone || autofillData.email);
  }, [autofillData]);

  return {
    autofillData,
    hasAutofillData,
  };
};
