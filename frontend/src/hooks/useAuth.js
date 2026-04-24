import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

/**
 * Hook để đăng nhập
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }) => authAPI.login(email, password),
    onSuccess: (response) => {
      const { accessToken, refreshToken, user } = response.data.data;

      // Lưu tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Cập nhật query cache
      queryClient.setQueryData(['user'], user);

      toast.success('Đăng nhập thành công!');
      navigate('/');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Đăng nhập thất bại!';
      toast.error(message);
    },
  });
};

/**
 * Hook để đăng ký
 */
export const useSignup = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => authAPI.signup(data),
    onSuccess: () => {
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.');
      navigate('/login');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Đăng ký thất bại!';
      toast.error(message);
    },
  });
};

/**
 * Hook để đăng xuất
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authAPI.logout(),
    onSuccess: () => {
      // Xóa tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      // Clear cache
      queryClient.clear();

      toast.success('Đăng xuất thành công!');
      navigate('/login');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Đăng xuất thất bại!';
      toast.error(message);
    },
  });
};

/**
 * Hook để xác thực email
 */
export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token) => authAPI.verifyEmail(token),
    onSuccess: () => {
      toast.success('Email đã được xác nhận!');
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Xác nhận email thất bại!';
      toast.error(message);
    },
  });
};

/**
 * Hook để quên mật khẩu
 */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email) => authAPI.forgotPassword(email),
    onSuccess: () => {
      toast.success('Kiểm tra email của bạn để đặt lại mật khẩu!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Không thể gửi email!';
      toast.error(message);
    },
  });
};

/**
 * Hook để đặt lại mật khẩu
 */
export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ token, password }) => authAPI.resetPassword(token, password),
    onSuccess: () => {
      toast.success('Mật khẩu đã được đặt lại thành công!');
      navigate('/login');
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Đặt lại mật khẩu thất bại!';
      toast.error(message);
    },
  });
};

/**
 * Hook để refresh token
 */
export const useRefreshToken = () => {
  return useMutation({
    mutationFn: (refreshToken) => authAPI.refreshToken(refreshToken),
    onSuccess: (response) => {
      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
    },
    onError: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    },
  });
};
