import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';

const BASE_API_URL = import.meta.env.VITE_API_URL;

export const useHistory = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const userId = user?._id || user?.id;
    const token = localStorage.getItem("accessToken");

    const historyQuery = useQuery({
        queryKey: ['history', userId],
        queryFn: async () => {
            if (!userId || !token) return [];
            const res = await fetch(`${BASE_API_URL}/history/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch history');
            const data = await res.json();
            return data.success ? data.data : [];
        },
        enabled: !!userId && !!token,
        staleTime: 1000 * 60 * 2, // 2 minutes
    });

    const clearHistoryMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch(`${BASE_API_URL}/history/${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to clear history');
            return res.json();
        },
        onSuccess: () => {
            queryClient.setQueryData(['history', userId], []); // Optimistic update
            queryClient.invalidateQueries(['history', userId]);
        }
    });

    return { ...historyQuery, clearHistory: clearHistoryMutation.mutateAsync };
};
