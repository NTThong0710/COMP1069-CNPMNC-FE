import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';

const BASE_API_URL = import.meta.env.VITE_API_URL;

export const useUserProfile = () => {
    const { user } = useAuth();
    const token = localStorage.getItem("accessToken");

    return useQuery({
        queryKey: ['userProfile', user?._id || user?.id],
        queryFn: async () => {
            if (!token) return null;
            const res = await fetch(`${BASE_API_URL}/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to fetch profile');
            return res.json();
        },
        enabled: !!user && !!token,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
