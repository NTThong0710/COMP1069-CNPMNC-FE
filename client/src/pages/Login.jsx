import React, { useState } from "react";
import InputField from "../components/InputField";
import { Link } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Login with:", { email, password });
        // 👉 Sau này sẽ gọi API: axios.post("/api/login", { email, password })
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded-2xl shadow-md w-80"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>

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

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Đăng nhập
                </button>

                <p className="text-sm text-center mt-4">
                    Chưa có tài khoản?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Đăng ký
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
