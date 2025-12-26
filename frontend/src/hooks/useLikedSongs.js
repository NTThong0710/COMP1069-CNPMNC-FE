import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';

const BASE_API_URL = import.meta.env.VITE_API_URL;

export const useLikedSongs = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const userId = user?._id || user?.id;
    const token = localStorage.getItem("accessToken");

    return useQuery({
        queryKey: ['likedSongs', userId],
        queryFn: async () => {
            if (!userId || !token) return [];
            const res = await fetch(`${BASE_API_URL}/users/${userId}/likes`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch liked songs');
            const data = await res.json();
            return data.likeSongs || [];
        },
        enabled: !!userId && !!token,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
