// Centralized toast utility for consistent error/success handling across DimLight
import toast from "react-hot-toast";

/**
 * Normalize API errors and show appropriate toast
 * @param {Error} error - Axios or fetch error
 * @param {string} fallback - Default message if error can't be parsed
 */
export const showApiError = (error, fallback = "Something went wrong. Please try again.") => {
  const message = error?.response?.data?.message || error?.message || fallback;
  toast.error(message);
};

/**
 * Show success toast
 * @param {string} message - Success message
 * @param {number} duration - Display duration in ms (default: 3000)
 */
export const showSuccess = (message, duration = 3000) => {
  toast.success(message, { duration });
};

/**
 * Show error toast
 * @param {string} message - Error message
 * @param {number} duration - Display duration in ms (default: 4000)
 */
export const showError = (message, duration = 4000) => {
  toast.error(message, { duration });
};

/**
 * Show warning toast with ⚠️ icon
 * @param {string} message - Warning message
 * @param {number} duration - Display duration in ms (default: 4000)
 */
export const showWarning = (message, duration = 4000) => {
  toast(message, { 
    icon: "⚠️", 
    duration,
    className: "z-[9999]"
  });
};

/**
 * Show info toast with ℹ️ icon
 * @param {string} message - Info message
 * @param {number} duration - Display duration in ms (default: 3000)
 */
export const showInfo = (message, duration = 3000) => {
  toast(message, { 
    icon: "ℹ️", 
    duration,
    className: "z-[9999]"
  });
};

/**
 * Show loading toast (useful for long operations)
 * @param {string} message - Loading message
 * @returns {string} Toast ID for later dismissal
 */
export const showLoading = (message = "Loading...") => {
  return toast.loading(message);
};

/**
 * Dismiss a specific toast by ID
 * @param {string} toastId - Toast ID returned from showLoading or other toast function
 */
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

/**
 * Dismiss all toasts
 */
export const dismissAllToasts = () => {
  toast.remove();
};
