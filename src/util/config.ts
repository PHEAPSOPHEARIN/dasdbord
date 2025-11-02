// Application Configuration
// Central configuration file for the application

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || "http://localhost:3001",
  VERSION: "v1",
  TIMEOUT: 30000, // 30 seconds
} as const;

/**
 * Full API URL with version
 */
export const API_URL = `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}`;

/**
 * LocalStorage Keys
 */
export const STORAGE_KEYS = {
  TOKEN: "company_token",
  USER: "company_user",
  REFRESH_TOKEN: "company_refresh_token",
  THEME: "app_theme",
  LANGUAGE: "app_language",
} as const;

/**
 * API Endpoints
 */
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh-token",
    VERIFY_EMAIL: "/auth/verify-email",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    CHANGE_PASSWORD: "/auth/change-password",
  },

  // Users
  USERS: {
    ME: "/users/me",
    LIST: "/users",
    DETAIL: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    AVATAR: "/users/me/avatar",
  },

  // Dashboard
  DASHBOARD: {
    STATS: "/dashboard/stats",
    RECENT_ACTIVITY: "/dashboard/recent-activity",
    ANALYTICS: "/dashboard/analytics",
  },

  // Add more endpoints as needed
} as const;

/**
 * HTTP Methods
 */
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Application Configuration
 */
export const APP_CONFIG = {
  NAME: "My Dashboard",
  VERSION: "1.0.0",
  DESCRIPTION: "Company Dashboard Application",
  AUTHOR: "Your Company",
  SUPPORT_EMAIL: "support@company.com",
  COPYRIGHT: `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
} as const;

/**
 * Pagination Configuration
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

/**
 * Date & Time Formats
 */
export const DATE_FORMATS = {
  SHORT: "MM/DD/YYYY",
  LONG: "MMMM DD, YYYY",
  WITH_TIME: "MM/DD/YYYY HH:mm",
  TIME_ONLY: "HH:mm:ss",
  ISO: "YYYY-MM-DDTHH:mm:ss.SSSZ",
} as const;

/**
 * Validation Rules
 */
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL_CHAR: false,
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
  },
  EMAIL: {
    MAX_LENGTH: 255,
  },
} as const;

/**
 * File Upload Configuration
 */
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
} as const;

/**
 * Feature Flags
 */
export const FEATURES = {
  DARK_MODE: true,
  NOTIFICATIONS: true,
  ANALYTICS: false,
  DEBUG_MODE: process.env.NODE_ENV === "development",
  MAINTENANCE_MODE: false,
} as const;

/**
 * Theme Configuration
 */
export const THEME = {
  DEFAULT: "light",
  OPTIONS: ["light", "dark", "auto"],
} as const;

/**
 * Routes Configuration
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  NOT_FOUND: "/404",
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized. Please login again.",
  FORBIDDEN: "You don't have permission to access this resource.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  SERVER_ERROR: "Something went wrong on our end. Please try again later.",
  TIMEOUT: "Request timeout. Please try again.",
  UNKNOWN: "An unknown error occurred.",
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN: "Login successful!",
  LOGOUT: "Logout successful!",
  REGISTER: "Registration successful!",
  UPDATE: "Updated successfully!",
  DELETE: "Deleted successfully!",
  UPLOAD: "Upload successful!",
  PASSWORD_RESET: "Password reset email sent!",
  PASSWORD_CHANGED: "Password changed successfully!",
} as const;

/**
 * Regular Expressions
 */
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-()]+$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
} as const;

/**
 * Environment Variables
 */
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  API_URL: process.env.REACT_APP_API_BASE_URL,
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_TEST: process.env.NODE_ENV === "test",
} as const;