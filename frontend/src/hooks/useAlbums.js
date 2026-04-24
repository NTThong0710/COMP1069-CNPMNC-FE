import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { albumAPI } from '../services/api';

/**
 * Hook để lấy danh sách album
 */
export const useAlbums = (params = {}) => {
  return useQuery({
    queryKey: ['albums', params],
    queryFn: () => albumAPI.getAllAlbums(params),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook để lấy album theo ID
 */
export const useAlbumById = (id) => {
  return useQuery({
    queryKey: ['album', id],
    queryFn: () => albumAPI.getAlbumById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Hook để tìm kiếm album
 */
export const useSearchAlbums = (query) => {
  return useQuery({
    queryKey: ['search-albums', query],
    queryFn: () => albumAPI.searchAlbums(query),
    enabled: !!query,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook để tạo album
 */
export const useCreateAlbum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => albumAPI.createAlbum(data),
    onSuccess: () => {
      toast.success('Album đã được tạo thành công!');
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Tạo album thất bại!';
      toast.error(message);
    },
  });
};

/**
 * Hook để cập nhật album
 */
export const useUpdateAlbum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => albumAPI.updateAlbum(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Album đã được cập nhật!');
      queryClient.invalidateQueries({ queryKey: ['album', id] });
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Cập nhật album thất bại!';
      toast.error(message);
    },
  });
};

/**
 * Hook để xóa album
 */
export const useDeleteAlbum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => albumAPI.deleteAlbum(id),
    onSuccess: () => {
      toast.success('Album đã được xóa!');
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Xóa album thất bại!';
      toast.error(message);
    },
  });
};

/**
 * Hook để upload cover album
 */
export const useUploadAlbumCover = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }) => albumAPI.uploadCover(id, file),
    onSuccess: (_, { id }) => {
      toast.success('Cover album đã được upload!');
      queryClient.invalidateQueries({ queryKey: ['album', id] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Upload cover thất bại!';
      toast.error(message);
    },
  });
};
