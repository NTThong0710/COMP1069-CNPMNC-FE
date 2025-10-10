import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

const Login2 = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const location = useLocation();

    useEffect(() => {
        // Lấy email từ URL parameters khi component mount
        const urlParams = new URLSearchParams(location.search);
        const emailFromUrl = urlParams.get('email');

        if (emailFromUrl) {
            setEmail(decodeURIComponent(emailFromUrl));
        }
    }, [location]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Email:', email);
        console.log('Mật khẩu:', password);
        // Xử lý đăng nhập ở đây
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-gray-800 py-8 px-6 shadow-2xl sm:rounded-lg sm:px-10 border border-gray-700">
                    {/* Tiêu đề */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2">
                            Đăng nhập bằng mật khẩu
                        </h1>
                    </div>

                    {/* Form đăng nhập */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email hoặc tên người dùng
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập email hoặc tên người dùng"
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Mật khẩu
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập mật khẩu"
                                />
                            </div>
                        </div>

                        {/* Nút đăng nhập */}
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                        >
                            Đăng nhập
                        </button>
                    </form>

                    {/* Phân cách */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-600" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-800 text-gray-400">Hoặc</span>
                            </div>
                        </div>

                        {/* Đăng nhập không cần mật khẩu */}
                        <div className="mt-6">
                            <Link to="/login1">
                                <button className="w-full flex justify-center py-3 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200">
                                    Đăng nhập không cần mật khẩu
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Footer với thông tin bảo mật */}
                    <div className="mt-8 pt-6 border-t border-gray-700">
                        <p className="text-xs text-center text-gray-400">
                            Trang web này được bảo vệ bằng nPCAPTCHA và tuân theo{' '}
                            <span className="block">Chính sách quyền riêng tư và</span>
                            <span>Điều khoản dịch vụ của Google.</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login2;