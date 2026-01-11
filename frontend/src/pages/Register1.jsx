import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register1 = () => {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Password set:", { password });

    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Kiểm tra điều kiện mật khẩu
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumberOrSpecial = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 10;

    const isPasswordValid = hasLetter && hasNumberOrSpecial && hasMinLength;

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="bg-neutral-900 p-8 rounded-lg shadow-lg w-full max-w-md">
                {/* Progress and Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
                            <div className="w-2 h-2 bg-neutral-600 rounded-full"></div>
                        </div>
                    </div>
                    <h2 className="text-sm font-medium text-neutral-400 mb-1">Bước 1 của 3</h2>
                    <h1 className="text-2xl font-bold text-white">
                        Tạo mật khẩu
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-3">
                            Mật khẩu
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
                                placeholder="Mật khẩu"
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-white text-sm"
                            >
                                {showPassword ? "Ẩn" : "Hiện"}
                            </button>
                        </div>
                    </div>

                    {/* Password Requirements */}
                    <div className="bg-neutral-800 p-4 rounded">
                        <h3 className="text-white text-sm font-medium mb-3">
                            Mật khẩu của bạn phải có ít nhất
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li className={`flex items-center ${hasLetter ? 'text-green-500' : 'text-neutral-400'}`}>
                                <span className="w-2 h-2 rounded-full bg-current mr-3"></span>
                                1 chữ cái
                            </li>
                            <li className={`flex items-center ${hasNumberOrSpecial ? 'text-green-500' : 'text-neutral-400'}`}>
                                <span className="w-2 h-2 rounded-full bg-current mr-3"></span>
                                1 chữ số hoặc ký tự đặc biệt (ví dụ: # ? ! &)
                            </li>
                            <li className={`flex items-center ${hasMinLength ? 'text-green-500' : 'text-neutral-400'}`}>
                                <span className="w-2 h-2 rounded-full bg-current mr-3"></span>
                                10 ký tự
                            </li>
                        </ul>
                    </div>

                    {/* Next Button */}
                    <Link to='/register2'>
                        <button
                            type="submit"
                            disabled={!isPasswordValid}
                            aria-label="Go to next register step"
                            className={`w-full font-bold py-3 rounded-full transition duration-300 ${isPasswordValid
                                ? 'bg-green-500 text-black hover:bg-green-400'
                                : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                                }`}
                        >
                            Tiếp theo
                        </button>
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default Register1;