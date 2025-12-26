import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';

const BASE_API_URL = import.meta.env.VITE_API_URL;

export const usePlaylists = () => {
    const { user } = useAuth();
    const token = localStorage.getItem("accessToken");

    return useQuery({
        queryKey: ['playlists', user?._id],
        queryFn: async () => {
            if (!user || !token) return [];
            const res = await fetch(`${BASE_API_URL}/playlists/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch playlists');
            const data = await res.json();
            return data.playlists || [];
        },
        enabled: !!user && !!token,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useCreatePlaylist = () => {
    const queryClient = useQueryClient();
    const token = localStorage.getItem("accessToken");

    return useMutation({
        mutationFn: async (name) => {
            const res = await fetch(`${BASE_API_URL}/playlists`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name, description: "", songs: [] }),
            });
            if (!res.ok) throw new Error('Failed to create playlist');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['playlists'] });
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
    });
};

export const useDeletePlaylist = () => {
    const queryClient = useQueryClient();
    const token = localStorage.getItem("accessToken");

    return useMutation({
        mutationFn: async (id) => {
            const res = await fetch(`${BASE_API_URL}/playlists/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to delete playlist');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['playlists'] });
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
    });
};

