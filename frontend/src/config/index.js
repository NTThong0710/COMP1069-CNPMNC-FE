/**
 * Lấy biến môi trường
 */
export const getEnvVar = (key, defaultValue = '') => {
  return import.meta.env[key] || defaultValue;
};

/**
 * API Configuration
 */
export const API_CONFIG = {
  baseURL: getEnvVar('VITE_API_URL', 'http://localhost:5000/api'),
  socketURL: getEnvVar('VITE_SOCKET_URL', 'http://localhost:5000'),
  timeout: 10000,
};

/**
 * External Services Configuration
 */
export const EXTERNAL_SERVICES = {
  cloudinary: {
    cloudName: getEnvVar('VITE_CLOUDINARY_CLOUD_NAME', 'your_cloudinary_name'),
  },
  google: {
    clientId: getEnvVar(
      'VITE_GOOGLE_CLIENT_ID',
      '913701457590-e5mhedvc0l1os7e4r5tofk5okpd14u34.apps.googleusercontent.com',
    ),
  },
  spotify: {
    clientId: getEnvVar(
      'VITE_SPOTIFY_CLIENT_ID',
      'e66e9f955c114e9e9c92c974d464dd9f',
    ),
  },
};

/**
 * App Configuration
 */
export const APP_CONFIG = {
  name: getEnvVar('VITE_APP_NAME', 'Music Web'),
  version: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  maxUploadSize: parseInt(getEnvVar('VITE_MAX_UPLOAD_SIZE', '52428800')), // 50MB
  env: getEnvVar('VITE_ENV', 'development'),
  debug: getEnvVar('VITE_DEBUG', 'false') === 'true',
};

/**
 * React Query Configuration
 */
export const REACT_QUERY_CONFIG = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
};

/**
 * Storage Keys
 */
export const STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  user: 'user',
  theme: 'theme',
  language: 'language',
};

/**
 * Pagination
 */
export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 20,
  maxLimit: 100,
};

/**
 * Player Configuration
 */
export const PLAYER_CONFIG = {
  autoPlay: false,
  volume: 0.5,
  playbackRate: 1,
  loop: false,
};

/**
 * Validation Rules
 */
export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: {
    minLength: 8,
    hasUppercase: /[A-Z]/,
    hasLowercase: /[a-z]/,
    hasNumber: /\d/,
    hasSpecial: /[!@#$%^&*]/,
  },
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_-]+$/,
  },
};

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_SIGNUP: '/auth/signup',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_REFRESH_TOKEN: '/auth/refresh-token',
  AUTH_VERIFY_EMAIL: '/auth/verify-email',
  AUTH_FORGOT_PASSWORD: '/auth/forgot-password',
  AUTH_RESET_PASSWORD: '/auth/reset-password',

  // Users
  USER_PROFILE: '/users/profile',
  USER_UPDATE_PROFILE: '/users/profile',
  USER_CHANGE_PASSWORD: '/users/change-password',
  USER_UPLOAD_AVATAR: '/users/upload-avatar',

  // Songs
  SONGS: '/songs',
  SONGS_SEARCH: '/songs/search',
  SONGS_TRENDING: '/songs/trending',
  SONGS_UPLOAD: '/songs/upload',

  // Albums
  ALBUMS: '/albums',
  ALBUMS_SEARCH: '/albums/search',

  // Artists
  ARTISTS: '/artists',
  ARTISTS_SEARCH: '/artists/search',

  // Playlists
  PLAYLISTS: '/playlists',
  PLAYLISTS_MY: '/playlists/my-playlists',

  // Likes
  LIKES_SONGS: '/likes/songs',
  LIKES_CHECK: '/likes/check',

  // Comments
  COMMENTS: '/comments',

  // History
  HISTORY: '/history',

  // Search
  SEARCH: '/search',

  // Recommendations
  RECOMMENDATIONS: '/recommendations',
};
