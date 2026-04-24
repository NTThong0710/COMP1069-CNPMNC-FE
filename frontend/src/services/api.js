import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Retry original request with new token
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear storage and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;

// ============================================
// Auth APIs
// ============================================
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (data) => api.post('/auth/signup', data),
  refreshToken: (refreshToken) =>
    api.post('/auth/refresh-token', { refreshToken }),
  logout: () => api.post('/auth/logout'),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) =>
    api.post('/auth/reset-password', { token, password }),
};

// ============================================
// User APIs
// ============================================
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.patch('/users/profile', data),
  changePassword: (oldPassword, newPassword) =>
    api.post('/users/change-password', { oldPassword, newPassword }),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/users/upload-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ============================================
// Song APIs
// ============================================
export const songAPI = {
  getAllSongs: (params) => api.get('/songs', { params }),
  getSongById: (id) => api.get(`/songs/${id}`),
  searchSongs: (query, params) =>
    api.get(`/songs/search`, { params: { ...params, q: query } }),
  getTrendingSongs: () => api.get('/songs/trending'),
  createSong: (data) => api.post('/songs', data),
  updateSong: (id, data) => api.patch(`/songs/${id}`, data),
  deleteSong: (id) => api.delete(`/songs/${id}`),
  uploadSong: (file, metadata) => {
    const formData = new FormData();
    formData.append('song', file);
    Object.keys(metadata).forEach((key) => {
      formData.append(key, metadata[key]);
    });
    return api.post('/songs/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ============================================
// Album APIs
// ============================================
export const albumAPI = {
  getAllAlbums: (params) => api.get('/albums', { params }),
  getAlbumById: (id) => api.get(`/albums/${id}`),
  searchAlbums: (query) => api.get('/albums/search', { params: { q: query } }),
  createAlbum: (data) => api.post('/albums', data),
  updateAlbum: (id, data) => api.patch(`/albums/${id}`, data),
  deleteAlbum: (id) => api.delete(`/albums/${id}`),
  uploadCover: (id, file) => {
    const formData = new FormData();
    formData.append('cover', file);
    return api.post(`/albums/${id}/upload-cover`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ============================================
// Artist APIs
// ============================================
export const artistAPI = {
  getAllArtists: (params) => api.get('/artists', { params }),
  getArtistById: (id) => api.get(`/artists/${id}`),
  searchArtists: (query) =>
    api.get('/artists/search', { params: { q: query } }),
  getArtistSongs: (id, params) => api.get(`/artists/${id}/songs`, { params }),
  getArtistAlbums: (id, params) => api.get(`/artists/${id}/albums`, { params }),
};

// ============================================
// Playlist APIs
// ============================================
export const playlistAPI = {
  getMyPlaylists: (params) => api.get('/playlists/my-playlists', { params }),
  getPlaylistById: (id) => api.get(`/playlists/${id}`),
  createPlaylist: (data) => api.post('/playlists', data),
  updatePlaylist: (id, data) => api.patch(`/playlists/${id}`, data),
  deletePlaylist: (id) => api.delete(`/playlists/${id}`),
  addSongToPlaylist: (playlistId, songId) =>
    api.post(`/playlists/${playlistId}/songs`, { songId }),
  removeSongFromPlaylist: (playlistId, songId) =>
    api.delete(`/playlists/${playlistId}/songs/${songId}`),
  uploadPlaylistCover: (id, file) => {
    const formData = new FormData();
    formData.append('cover', file);
    return api.post(`/playlists/${id}/upload-cover`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ============================================
// Like APIs
// ============================================
export const likeAPI = {
  getLikedSongs: (params) => api.get('/likes/songs', { params }),
  likeSong: (songId) => api.post(`/likes/songs/${songId}`),
  unlikeSong: (songId) => api.delete(`/likes/songs/${songId}`),
  checkLikedSongs: (songIds) => api.post('/likes/check', { songIds }),
};

// ============================================
// Comment APIs
// ============================================
export const commentAPI = {
  getSongComments: (songId, params) =>
    api.get(`/comments/songs/${songId}`, { params }),
  createComment: (songId, data) => api.post(`/comments/songs/${songId}`, data),
  updateComment: (commentId, data) => api.patch(`/comments/${commentId}`, data),
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`),
  likeComment: (commentId) => api.post(`/comments/${commentId}/like`),
  unlikeComment: (commentId) => api.delete(`/comments/${commentId}/like`),
};

// ============================================
// History APIs
// ============================================
export const historyAPI = {
  getHistory: (params) => api.get('/history', { params }),
  addToHistory: (songId) => api.post('/history', { songId }),
  clearHistory: () => api.delete('/history'),
};

// ============================================
// Search APIs
// ============================================
export const searchAPI = {
  globalSearch: (query, params) =>
    api.get('/search', { params: { ...params, q: query } }),
};

// ============================================
// Recommendation APIs
// ============================================
export const recommendationAPI = {
  getRecommendations: (params) => api.get('/recommendations', { params }),
  getBasedOnSong: (songId, params) =>
    api.get(`/recommendations/song/${songId}`, { params }),
  getBasedOnArtist: (artistId, params) =>
    api.get(`/recommendations/artist/${artistId}`, { params }),
};
