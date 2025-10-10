import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGoogle, FaFacebook } from "react-icons/fa";

const Login = () => {
    const [email, setEmail] = useState("");

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="bg-neutral-900 p-8 rounded-lg shadow-lg w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Chào mừng bạn quay trở lại
                    </h2>
                </div>

                <div className="space-y-4">
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Email hoặc tên người dùng
                        </label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Email hoặc tên người dùng"
                            required
                        />
                    </div>

                    {/* Continue Button */}
                    <Link
                        to='/login1'
                    >
                        <button
                            type="button"
                            className="w-full bg-green-500 text-black font-bold py-3 rounded-full hover:bg-green-400 transition duration-300"
                        >
                            Tiếp tục
                        </button>
                    </Link>
                </div>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-neutral-700"></div>
                    <span className="px-4 text-neutral-400 text-sm">hoặc</span>
                    <div className="flex-1 border-t border-neutral-700"></div>
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-3">
                    <button className="w-full bg-white text-black font-medium py-3 rounded-full hover:bg-neutral-200 transition duration-300 flex items-center justify-center gap-3">
                        <FaGoogle className="text-red-500" />
                        Tiếp tục bằng Google
                    </button>

                    <button className="w-full bg-blue-600 text-white font-medium py-3 rounded-full hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-3">
                        <FaFacebook className="text-white" />
                        Tiếp tục bằng Facebook
                    </button>
                </div>

                {/* Register Link */}
                <div className="text-center mt-8 pt-6 border-t border-neutral-800">
                    <p className="text-neutral-400 text-sm">
                        Chưa có tài khoản?{" "}
                        <Link
                            to="/register"
                            className="text-white hover:text-green-500 font-medium underline transition duration-300"
                        >
                            Đăng ký
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;