import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Normalize axios/API errors into a consistent shape
export function normalizeApiError(error) {
  const status = error?.response?.status;
  const message = error?.response?.data?.message || error?.message || "Unexpected error";
  let type = "error";
  if (status === 429) type = "warning";
  if (status === 400) type = "warning";
  return { type, status, message };
}

// Calculate password strength with real criteria
export function calculatePasswordStrength(password) {
  if (!password) {
    return { score: 0, label: "Weak", suggestions: ["Add a password"], details: {} };
  }

  const suggestions = [];
  let score = 0;

  const length = password.length;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  // Length scoring
  if (length >= 8) score += 25; else suggestions.push("Use at least 8 characters");
  if (length >= 12) score += 10;
  if (length >= 16) score += 5;

  // Character variety
  const variety = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length;
  score += variety * 12; // up to 48
  if (!hasUpper) suggestions.push("Add uppercase letters");
  if (!hasLower) suggestions.push("Add lowercase letters");
  if (!hasDigit) suggestions.push("Add numbers");
  if (!hasSymbol) suggestions.push("Add special symbols (!@#$%)");

  // Repetition penalty
  const repeats = /(.)\1{2,}/.test(password);
  if (repeats) { score -= 10; suggestions.push("Avoid repeated characters"); }

  // Common patterns penalty
  const lowerPwd = password.toLowerCase();
  const commonPatterns = [
    "password", "1234", "qwerty", "letmein", "admin", "welcome", "iloveyou", "dimlight"
  ];
  if (commonPatterns.some(p => lowerPwd.includes(p))) {
    score -= 25;
    suggestions.push("Avoid common patterns or dictionary words");
  }

  // Entropy estimate
  const poolSize = (hasLower ? 26 : 0) + (hasUpper ? 26 : 0) + (hasDigit ? 10 : 0) + (hasSymbol ? 32 : 0);
  const entropy = poolSize > 0 ? Math.log2(poolSize) * length : 0;
  score += Math.min(20, Math.floor(entropy / 5));

  // Clamp score 0-100
  score = Math.max(0, Math.min(100, score));

  let label = "Weak";
  if (score >= 80) label = "Very Strong";
  else if (score >= 60) label = "Strong";
  else if (score >= 40) label = "Fair";

  return { score, label, suggestions, details: { length, variety, entropy } };
}
