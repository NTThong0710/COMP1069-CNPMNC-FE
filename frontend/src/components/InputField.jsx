import React, { useState } from "react";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";


const InputField = ({ label, type, value, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1">{label}</label>

            <div className="relative">
                <input
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none pr-10"
                    required
                />

                {/* 👁 Nút ẩn/hiện mật khẩu */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    >
                        {showPassword ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default InputField;
