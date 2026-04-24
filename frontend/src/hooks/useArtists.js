import { useQuery } from '@tanstack/react-query';
import { artistAPI } from '../services/api';

/**
 * Hook để lấy danh sách nghệ sĩ
 */
export const useArtists = (params = {}) => {
  return useQuery({
    queryKey: ['artists', params],
    queryFn: () => artistAPI.getAllArtists(params),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook để lấy nghệ sĩ theo ID
 */
export const useArtistById = (id) => {
  return useQuery({
    queryKey: ['artist', id],
    queryFn: () => artistAPI.getArtistById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Hook để tìm kiếm nghệ sĩ
 */
export const useSearchArtists = (query) => {
  return useQuery({
    queryKey: ['search-artists', query],
    queryFn: () => artistAPI.searchArtists(query),
    enabled: !!query,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook để lấy bài hát của nghệ sĩ
 */
export const useArtistSongs = (id, params = {}) => {
  return useQuery({
    queryKey: ['artist-songs', id, params],
    queryFn: () => artistAPI.getArtistSongs(id, params),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook để lấy album của nghệ sĩ
 */
export const useArtistAlbums = (id, params = {}) => {
  return useQuery({
    queryKey: ['artist-albums', id, params],
    queryFn: () => artistAPI.getArtistAlbums(id, params),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
