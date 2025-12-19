/**
 * Z-Index Layer System
 * Standardized z-index values for consistent layering across the app
 * 
 * Usage:
 * import { zIndex } from '@/lib/zIndex';
 * <div className={zIndex.modal}>...</div>
 */

export const zIndex = {
  // Base layers
  base: 'z-0',
  backdrop: 'z-40',
  
  // Navigation
  sidebar: 'z-50',
  mobileHeader: 'z-50',
  
  // Overlays
  tooltip: 'z-100',
  dropdown: 'z-150',
  
  // Modals
  modalBackdrop: 'z-[199]',
  modal: 'z-[200]',
  modalContent: 'z-[201]',
  
  // Notifications (always on top)
  toast: 'z-[9999]',
};

/**
 * Numeric z-index values (for inline styles or calculations)
 */
export const zIndexValues = {
  base: 0,
  backdrop: 40,
  sidebar: 50,
  mobileHeader: 50,
  tooltip: 100,
  dropdown: 150,
  modalBackdrop: 199,
  modal: 200,
  modalContent: 201,
  toast: 9999,
};
