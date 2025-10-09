import React, { useState } from "react";
import InputField from "../components/InputField";
import { Link } from "react-router-dom";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp!");
            return;
        }

        setError("");
        console.log("Register:", { email, password });

        // 👉 Sau này gọi API thật ở đây
        // axios.post("/api/register", { email, password })
    };

    return (
        <div className="flex items-center justify-center h-screen w-full bg-gray-100">
            <form
                onSubmit={handleRegister}
                className="bg-white p-8 rounded-2xl shadow-md w-80"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Đăng ký</h2>

                <InputField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <InputField
                    label="Mật khẩu"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <InputField
                    label="Xác nhận mật khẩu"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                    Đăng ký
                </button>

                <p className="text-sm text-center mt-4">
                    Đã có tài khoản?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Đăng nhập
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
