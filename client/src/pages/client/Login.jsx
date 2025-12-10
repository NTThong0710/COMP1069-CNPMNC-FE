import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

// === BƯỚC 1: NHẬP EMAIL ===
const Step1_EnterEmail = ({ onNext }) => {
  const [email, setEmail] = useState("");

  // --- HÀM XỬ LÝ GOOGLE LOGIN ---
  const handleGoogleLogin = () => {
  const apiBase = import.meta.env.VITE_API_URL;
  window.open(`${apiBase}/api/auth/google`, "_self");
};


  return (
    <form onSubmit={(e) => { e.preventDefault(); onNext(email); }}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Log in to Nhom8</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Email or username</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            placeholder="Email or username"
            required
            autoFocus
          />
        </div>
        <button type="submit" className="w-full bg-green-500 text-black font-bold py-3 rounded-full hover:bg-green-400 transition transform hover:scale-105">
          Next
        </button>
      </div>

      {/* Social buttons mock */}
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-neutral-700"></div>
        <span className="px-4 text-neutral-400 text-sm">or</span>
        <div className="flex-1 border-t border-neutral-700"></div>
      </div>

      <div className="space-y-3">
        <button type="button" onClick={handleGoogleLogin} className="w-full bg-white text-black font-medium py-3 rounded-full hover:bg-neutral-200 transition flex items-center justify-center gap-3">
          <FaGoogle className="text-red-500" /> Continue with Google
        </button>
        <button type="button" className="w-full bg-[#1877F2] text-white font-medium py-3 rounded-full hover:bg-[#166fe5] transition flex items-center justify-center gap-3">
          <FaFacebook className="text-white" /> Continue with Facebook
        </button>
      </div>
    </form>
  );
};

// === BƯỚC 3: NHẬP PASSWORD (Đã fix lỗi loading) ===
const Step3_EnterPassword = ({ email, onBack }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // ✅ KHAI BÁO STATE LOADING (Fix lỗi ReferenceError)
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Bắt đầu loading

    const result = await login(email, password);

    if (result.success) {
      // ✅ Điều hướng dựa trên ROLE
      if (result.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError(result.message);
      setLoading(false); // Tắt loading nếu lỗi
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Enter password</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-500 text-sm rounded flex items-center">
          ⚠️ {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Email or username</label>
          <input
            type="text"
            value={email}
            readOnly
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-400 cursor-not-allowed"
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-white mb-2">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            placeholder="Password"
            required
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-10 text-neutral-400 hover:text-white"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading} // Disable nút khi đang loading
          className="w-full bg-green-500 text-black font-bold py-3 rounded-full hover:bg-green-400 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </div>

      <button
        onClick={onBack}
        type="button"
        disabled={loading}
        className="text-center w-full text-neutral-400 font-bold text-sm mt-8 hover:text-white underline transition"
      >
        Back
      </button>
    </form>
  );
};

// === COMPONENT CHÍNH ===
export default function Login() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');

  const handleNext = (e) => {
    setEmail(e);
    setStep(3); // Nhảy thẳng sang bước nhập Pass (Bỏ qua bước 2 OTP)
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-neutral-900 p-8 rounded-lg shadow-lg w-full max-w-lg border border-neutral-800">

        {step === 1 && <Step1_EnterEmail onNext={handleNext} />}
        {step === 3 && <Step3_EnterPassword email={email} onBack={() => setStep(1)} />}

        {step === 1 && (
          <div className="text-center mt-8 pt-6 border-t border-neutral-800">
            <p className="text-neutral-400 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-white hover:text-green-500 font-medium underline transition duration-300">
                Sign up for Nhom8
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}