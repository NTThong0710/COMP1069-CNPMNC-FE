import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Bỏ FaGoogle
import { useAuth } from "../../context/AuthContext";

// Các component con (Step1, Step2...) giống bro gửi, tui đã rút gọn để tập trung logic chính
// Bro có thể copy lại UI đẹp của bro vào, chỉ cần chú ý phần gọi hàm register

// === BƯỚC 1: EMAIL (Đã thay logo Google SVG) ===
const Step1_Email = ({ formData, onChange, onNext }) => (
    <form onSubmit={(e) => { e.preventDefault(); onNext() }} className="space-y-4">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Sign up to start listening</h2>
        <div><label className="text-white text-sm font-bold">Email address</label><input type="email" name="email" value={formData.email} onChange={onChange} className="w-full p-3 rounded bg-neutral-800 text-white border border-neutral-700 focus:border-green-500 outline-none" required /></div>
        <button type="submit" className="w-full bg-green-500 text-black font-bold py-3 rounded-full hover:bg-green-400">Next</button>
        <div className="text-center"><span className="text-neutral-400">or</span></div>

        {/* --- ĐÃ SỬA: Logo Google SVG chuẩn --- */}
        <button type="button" aria-label="Sign up with Google" className="w-full bg-white text-black font-bold py-3 rounded-full flex justify-center gap-3">
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            Sign up with Google
        </button>
    </form>
);

const Step2_Password = ({ formData, onChange, onNext }) => {
    const [show, setShow] = useState(false);
    return (
        <form onSubmit={(e) => { e.preventDefault(); onNext() }} className="space-y-4">
            <h2 className="text-2xl font-bold text-white text-center">Create a password</h2>
            <div className="relative">
                <label className="text-white text-sm font-bold">Password</label>
                <input type={show ? "text" : "password"} name="password" value={formData.password} onChange={onChange} className="w-full p-3 rounded bg-neutral-800 text-white border border-neutral-700 focus:border-green-500 outline-none" required minLength={6} />
                <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-9 text-neutral-400">{show ? <FaEyeSlash /> : <FaEye />}</button>
            </div>
            <button type="submit" className="w-full bg-green-500 text-black font-bold py-3 rounded-full hover:bg-green-400">Next</button>
        </form>
    );
};

const Step3_Profile = ({ formData, onChange, onNext }) => (
    <form onSubmit={(e) => { e.preventDefault(); onNext() }} className="space-y-4">
        <h2 className="text-2xl font-bold text-white text-center">Tell us about yourself</h2>
        <div><label className="text-white text-sm font-bold">Name</label><input type="text" name="name" value={formData.name} onChange={onChange} className="w-full p-3 rounded bg-neutral-800 text-white border border-neutral-700 focus:border-green-500 outline-none" required /></div>
        {/* Gender & DOB UI bro có thể thêm vào đây, nhưng backend chưa dùng tới nên tui ẩn cho gọn */}
        <button type="submit" className="w-full bg-green-500 text-black font-bold py-3 rounded-full hover:bg-green-400">Next</button>
    </form>
);

const Step4_Terms = ({ onSubmit }) => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">Terms & Conditions</h2>
        <div className="text-sm text-neutral-400 bg-neutral-800 p-4 rounded">By clicking Sign up, you agree to our Terms...</div>
        <button onClick={onSubmit} className="w-full bg-green-500 text-black font-bold py-3 rounded-full hover:bg-green-400">Sign up</button>
    </div>
);

export default function Register() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        // Map 'name' -> 'username'
        const payload = {
            username: formData.name,
            email: formData.email,
            password: formData.password
        };
        const res = await register(payload);
        if (res.success) navigate('/');
        else setError(res.message);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black py-8">
            <div className="bg-neutral-900 p-8 rounded-lg shadow-lg w-full max-w-md">
                {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-500 text-sm rounded">{error}</div>}

                {step === 1 && <Step1_Email formData={formData} onChange={handleChange} onNext={() => setStep(2)} />}
                {step === 2 && <Step2_Password formData={formData} onChange={handleChange} onNext={() => setStep(3)} />}
                {step === 3 && <Step3_Profile formData={formData} onChange={handleChange} onNext={() => setStep(4)} />}
                {step === 4 && <Step4_Terms onSubmit={handleSubmit} />}

                {step === 1 && <div className="text-center mt-6 pt-6 border-t border-neutral-800"><p className="text-neutral-400 text-sm">Have an account? <Link to="/login" className="text-white hover:text-green-500 font-medium underline">Log in</Link></p></div>}
            </div>
        </div>
    );
}