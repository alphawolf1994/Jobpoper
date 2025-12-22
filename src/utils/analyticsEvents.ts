/**
 * Analytics Event Names
 * Centralized constants for all Firebase Analytics events
 */

export const ANALYTICS_EVENTS = {
  // User Authentication Events
  USER_SIGNUP: 'user_signup',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  PASSWORD_RESET: 'password_reset',
  
  // Job Events
  JOB_SEARCH: 'job_search',
  JOB_VIEW: 'job_view',
  JOB_APPLY: 'job_apply',
  JOB_SAVE: 'job_save',
  JOB_SHARE: 'job_share',
  JOB_FILTER: 'job_filter',
  
  // Location Events
  LOCATION_ENABLED: 'location_enabled',
  LOCATION_DENIED: 'location_denied',
  LOCATION_CHANGED: 'location_changed',
  MAP_INTERACTION: 'map_interaction',
  
  // Profile Events
  PROFILE_UPDATE: 'profile_update',
  PROFILE_VIEW: 'profile_view',
  
  // Settings Events
  SETTINGS_CHANGED: 'settings_changed',
  NOTIFICATION_ENABLED: 'notification_enabled',
  NOTIFICATION_DISABLED: 'notification_disabled',
  
  // Error Events
  API_ERROR: 'api_error',
  VALIDATION_ERROR: 'validation_error',
  APP_CRASH: 'app_crash',
  
  // Performance Events
  APP_LOAD: 'app_load',
  SCREEN_LOAD: 'screen_load',
} as const;

/**
 * User Property Names
 */
export const USER_PROPERTIES = {
  USER_TYPE: 'user_type',
  REGISTRATION_DATE: 'registration_date',
  LOCATION_CITY: 'location_city',
  LOCATION_COUNTRY: 'location_country',
  APP_VERSION: 'app_version',
  PLATFORM: 'platform',
} as const;

/**
 * Screen Names for tracking
 */
export const SCREEN_NAMES = {
  HOME: 'Home',
  JOB_LIST: 'JobList',
  JOB_DETAILS: 'JobDetails',
  SEARCH: 'Search',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  LOGIN: 'Login',
  SIGNUP: 'Signup',
  MAP: 'Map',
} as const;
