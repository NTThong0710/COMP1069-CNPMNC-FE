import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGoogle, FaApple } from "react-icons/fa";

const Register = () => {
    const [email, setEmail] = useState("");

    const handleRegister = (e) => {
        e.preventDefault();
        console.log("Register with:", { email });
        // 👉 Sau này sẽ gọi API đăng ký
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="bg-neutral-900 p-8 rounded-lg shadow-lg w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Đăng ký để bắt đầu nghe
                    </h2>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-3">
                            Địa chỉ email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="name@domain.com"
                            required
                        />
                    </div>

                    {/* Next Button */}
                    <Link to='/register1'>
                        <button
                            type="button"
                            className="w-full bg-green-500 text-black font-bold py-3 rounded-full hover:bg-green-400 transition duration-300"
                        >
                            Tiếp theo
                        </button>
                    </Link>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-neutral-700"></div>
                    <span className="px-4 text-neutral-400 text-sm">hoặc</span>
                    <div className="flex-1 border-t border-neutral-700"></div>
                </div>

                {/* Social Register Buttons */}
                <div className="space-y-3">
                    <button className="w-full bg-white text-black font-medium py-3 rounded-full hover:bg-neutral-200 transition duration-300 flex items-center justify-center gap-3">
                        <FaGoogle className="text-red-500" />
                        Đăng ký bằng Google
                    </button>
                </div>

                {/* Login Link */}
                <div className="text-center mt-6">
                    <p className="text-neutral-400 text-sm">
                        Đã có tài khoản?{" "}
                        <Link
                            to="/login"
                            className="text-white hover:text-green-500 font-medium underline transition duration-300"
                        >
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;