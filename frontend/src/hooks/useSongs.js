import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { songAPI } from '../services/api';

/**
 * Hook để lấy danh sách bài hát
 */
export const useSongs = (params = {}) => {
  return useQuery({
    queryKey: ['songs', params],
    queryFn: () => songAPI.getAllSongs(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook để lấy bài hát theo ID
 */
export const useSongById = (id) => {
  return useQuery({
    queryKey: ['song', id],
    queryFn: () => songAPI.getSongById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook để tìm kiếm bài hát
 */
export const useSearchSongs = (query, params = {}) => {
  return useQuery({
    queryKey: ['search-songs', query, params],
    queryFn: () => songAPI.searchSongs(query, params),
    enabled: !!query,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook để lấy bài hát trending
 */
export const useTrendingSongs = () => {
  return useQuery({
    queryKey: ['trending-songs'],
    queryFn: () => songAPI.getTrendingSongs(),
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Hook để upload bài hát
 */
export const useUploadSong = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, metadata }) => songAPI.uploadSong(file, metadata),
    onSuccess: () => {
      toast.success('Bài hát đã được upload thành công!');
      queryClient.invalidateQueries({ queryKey: ['songs'] });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Upload bài hát thất bại!';
      toast.error(message);
    },
  });
};

/**
 * Hook để xóa bài hát
 */
export const useDeleteSong = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => songAPI.deleteSong(id),
    onSuccess: () => {
      toast.success('Bài hát đã được xóa!');
      queryClient.invalidateQueries({ queryKey: ['songs'] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Xóa bài hát thất bại!';
      toast.error(message);
    },
  });
};

/**
 * Hook để cập nhật bài hát
 */
export const useUpdateSong = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => songAPI.updateSong(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Bài hát đã được cập nhật!');
      queryClient.invalidateQueries({ queryKey: ['song', id] });
      queryClient.invalidateQueries({ queryKey: ['songs'] });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Cập nhật bài hát thất bại!';
      toast.error(message);
    },
  });
};
