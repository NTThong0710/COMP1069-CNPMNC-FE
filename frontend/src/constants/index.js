/**
 * Message Constants
 */
export const MESSAGES = {
  // Success
  SUCCESS_LOGIN: 'Đăng nhập thành công!',
  SUCCESS_SIGNUP: 'Đăng ký thành công!',
  SUCCESS_LOGOUT: 'Đăng xuất thành công!',
  SUCCESS_UPDATE_PROFILE: 'Cập nhật hồ sơ thành công!',
  SUCCESS_UPLOAD_AVATAR: 'Upload ảnh đại diện thành công!',
  SUCCESS_CHANGE_PASSWORD: 'Đổi mật khẩu thành công!',
  SUCCESS_CREATE_PLAYLIST: 'Tạo playlist thành công!',
  SUCCESS_ADD_TO_PLAYLIST: 'Thêm vào playlist thành công!',
  SUCCESS_REMOVE_FROM_PLAYLIST: 'Xóa khỏi playlist thành công!',
  SUCCESS_LIKE_SONG: 'Thêm vào bài yêu thích!',
  SUCCESS_UNLIKE_SONG: 'Xóa khỏi bài yêu thích!',

  // Error
  ERROR_LOGIN: 'Đăng nhập thất bại!',
  ERROR_SIGNUP: 'Đăng ký thất bại!',
  ERROR_INVALID_EMAIL: 'Email không hợp lệ!',
  ERROR_INVALID_PASSWORD: 'Mật khẩu không hợp lệ!',
  ERROR_PASSWORD_MISMATCH: 'Mật khẩu xác nhận không trùng khớp!',
  ERROR_FILE_TOO_LARGE: 'File quá lớn!',
  ERROR_INVALID_FILE_TYPE: 'Loại file không hợp lệ!',
  ERROR_NETWORK: 'Lỗi kết nối mạng!',
  ERROR_SERVER: 'Lỗi máy chủ!',
  ERROR_NOT_FOUND: 'Không tìm thấy!',
  ERROR_UNAUTHORIZED: 'Bạn không có quyền thực hiện hành động này!',
  ERROR_FORBIDDEN: 'Hành động bị cấm!',

  // Info
  INFO_LOADING: 'Đang tải...',
  INFO_EMPTY: 'Không có dữ liệu!',
  INFO_CONFIRM_DELETE: 'Bạn có chắc chắn muốn xóa?',
};

/**
 * Status Constants
 */
export const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

/**
 * User Roles
 */
export const USER_ROLES = {
  USER: 'user',
  ARTIST: 'artist',
  ADMIN: 'admin',
};

/**
 * Sort Options
 */
export const SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  POPULAR: 'popular',
  TRENDING: 'trending',
  ALPHABETICAL: 'alphabetical',
};

/**
 * Filter Options
 */
export const FILTER_OPTIONS = {
  ALL: 'all',
  FAVORITE: 'favorite',
  DOWNLOADED: 'downloaded',
  RECENT: 'recent',
};

/**
 * Time Range
 */
export const TIME_RANGE = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
  ALL_TIME: 'allTime',
};

/**
 * Playlist Visibility
 */
export const PLAYLIST_VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  COLLABORATIVE: 'collaborative',
};

/**
 * Player Mode
 */
export const PLAYER_MODE = {
  NORMAL: 'normal',
  REPEAT_ONE: 'repeatOne',
  REPEAT_ALL: 'repeatAll',
  SHUFFLE: 'shuffle',
};

/**
 * Audio Quality
 */
export const AUDIO_QUALITY = {
  LOW: '128',
  MEDIUM: '256',
  HIGH: '320',
  LOSSLESS: 'lossless',
};

/**
 * Notification Types
 */
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

/**
 * API Error Codes
 */
export const API_ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

/**
 * Route Paths
 */
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  VERIFY_EMAIL: '/verify-email/:token',

  // Protected routes
  PROFILE: '/profile',
  SETTINGS: '/settings',
  LIKED_SONGS: '/liked-songs',
  MY_PLAYLISTS: '/my-playlists',
  HISTORY: '/history',

  // Entity routes
  SONG: '/song/:id',
  ALBUM: '/album/:id',
  ARTIST: '/artist/:id',
  PLAYLIST: '/playlist/:id',

  // Admin routes
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_SONGS: '/admin/songs',
  ADMIN_ALBUMS: '/admin/albums',
  ADMIN_ARTISTS: '/admin/artists',
  ADMIN_USERS: '/admin/users',

  // Other
  SEARCH: '/search',
  DISCOVER: '/discover',
  DONATE: '/donate',
};

/**
 * Default Values
 */
export const DEFAULTS = {
  AVATAR_URL: 'https://via.placeholder.com/150',
  COVER_URL: 'https://via.placeholder.com/500',
  THEME: 'dark',
  LANGUAGE: 'vi',
  PAGE_SIZE: 20,
  VOLUME: 0.7,
};

/**
 * Regular Expressions
 */
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([ a-z.]{2,6})(\/[\w .-]*)*\/?$/,
  PHONE: /^(\+\d{1,3}[- ]?)?\d{10,}$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,20}$/,
};

/**
 * Local Storage Keys
 */
export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  PLAYER_STATE: 'playerState',
  QUEUE: 'queue',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

/**
 * Cache Duration (in milliseconds)
 */
export const CACHE_DURATION = {
  SHORT: 1 * 60 * 1000, // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 30 * 60 * 1000, // 30 minutes
  VERY_LONG: 60 * 60 * 1000, // 1 hour
};

/**
 * Breakpoints (Tailwind)
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
};

/**
 * Colors
 */
export const COLORS = {
  PRIMARY: '#ff6b6b',
  SECONDARY: '#4ecdc4',
  SUCCESS: '#51cf66',
  WARNING: '#ffd43b',
  ERROR: '#ff6b6b',
  INFO: '#4dabf7',
  DARK: '#1a1a1a',
  LIGHT: '#ffffff',
};
