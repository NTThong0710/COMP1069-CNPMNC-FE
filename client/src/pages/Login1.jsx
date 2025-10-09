import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login1 = () => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [email, setEmail] = useState('v******4@g*l.com');

    const handleInputChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            // Tự động chuyển sang ô tiếp theo
            if (value && index < 5) {
                document.getElementById(`code-input-${index + 1}`).focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            // Nếu ô hiện tại trống và nhấn backspace, quay lại ô trước đó
            document.getElementById(`code-input-${index - 1}`).focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const verificationCode = code.join('');
        console.log('Mã xác thực:', verificationCode);
        // Xử lý đăng nhập ở đây
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {/* Tiêu đề */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Nhập mã xác thực
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Nhập mã gồm 6 chữ số mà bạn nhận được qua địa chỉ
                        </p>
                        <p className="text-sm font-medium text-gray-900">{email}</p>
                    </div>

                    {/* Form nhập mã */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mã xác thực
                            </label>
                            <div className="flex justify-between space-x-2">
                                {code.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`code-input-${index}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Nút đăng nhập */}
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Đăng nhập
                        </button>
                    </form>

                    {/* Phân cách */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Hoặc</span>
                            </div>
                        </div>

                        {/* Đăng nhập bằng mật khẩu */}
                        <div className="mt-6">
                            <Link to={`/login2?email=${encodeURIComponent(email)}`}
                                className="block">
                                <button className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Đăng nhập bằng mật khẩu
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Liên kết hỗ trợ */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Không nhận được mã?{' '}
                            <button className="font-medium text-blue-600 hover:text-blue-500">
                                Gửi lại mã
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login1;