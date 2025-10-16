import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaGoogle, FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";

// BƯỚC 1: NHẬP EMAIL
const Step1_EnterEmail = ({ onNext }) => {
  const [email, setEmail] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Chào mừng bạn quay trở lại</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Email hoặc tên người dùng</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Email hoặc tên người dùng"
            required
            autoFocus
          />
        </div>
        <button type="submit" className="w-full bg-green-500 text-black font-bold py-3 rounded-full hover:bg-green-400 transition duration-300">
          Tiếp tục
        </button>
      </div>
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-neutral-700"></div>
        <span className="px-4 text-neutral-400 text-sm">hoặc</span>
        <div className="flex-1 border-t border-neutral-700"></div>
      </div>
      <div className="space-y-3">
        <button type="button" className="w-full bg-white text-black font-medium py-3 rounded-full hover:bg-neutral-200 transition duration-300 flex items-center justify-center gap-3">
          <FaGoogle className="text-red-500" /> Tiếp tục bằng Google
        </button>
        <button type="button" className="w-full bg-blue-600 text-white font-medium py-3 rounded-full hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-3">
          <FaFacebook /> Tiếp tục bằng Facebook
        </button>
      </div>
    </form>
  );
};

// BƯỚC 2: NHẬP MÃ XÁC THỰC
const Step2_VerifyCode = ({ email, onLoginWithPassword }) => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [cooldown, setCooldown] = useState(0);
    const inputsRef = useRef([]);

    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleResend = () => {
        console.log("Resending code...");
        setCooldown(30);
    };

    const handleInputChange = (index, value) => {
        if (value.length > 1 || !/^\d*$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Nhập mã xác thực</h2>
                <p className="text-neutral-400">
                    Nhập mã gồm 6 chữ số được gửi đến <span className="text-white font-medium">{email}</span>.
                </p>
            </div>
            <div className="flex justify-between space-x-3 mb-6">
                {code.map((digit, index) => (
                    <input
                        key={index}
                        ref={el => inputsRef.current[index] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-14 h-16 text-center text-2xl font-semibold bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                ))}
            </div>
            <p className="text-center text-sm text-neutral-400 mb-6">
                Không nhận được mã?{' '}
                <button onClick={handleResend} disabled={cooldown > 0} className="font-medium text-white hover:text-green-500 underline disabled:text-neutral-500 disabled:no-underline">
                    {cooldown > 0 ? `Gửi lại sau ${cooldown}s` : "Gửi lại mã"}
                </button>
            </p>
            <button type="submit" className="w-full bg-green-500 text-black font-bold py-3 rounded-full hover:bg-green-400 transition duration-300 mb-6">
                Xác nhận
            </button>
            <div className="flex items-center my-6">
                <div className="flex-1 border-t border-neutral-700"></div>
                <span className="px-4 text-neutral-400 text-sm">hoặc</span>
                <div className="flex-1 border-t border-neutral-700"></div>
            </div>
            <button onClick={onLoginWithPassword} type="button" className="w-full border border-neutral-700 text-white font-medium py-3 rounded-full hover:border-white transition duration-300">
                Đăng nhập bằng mật khẩu
            </button>
        </div>
    );
};

// BƯỚC 3: NHẬP MẬT KHẨU
const Step3_EnterPassword = ({ email, onBack }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="w-[400px]">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Nhập mật khẩu</h2>
        </div>
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-white mb-2">Email hoặc tên người dùng</label>
                <input type="text" value={email} readOnly className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-400 cursor-not-allowed"/>
            </div>
            <div className="relative">
                <label className="block text-sm font-medium text-white mb-2">Mật khẩu</label>
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Mật khẩu"
                    required
                    autoFocus
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-10 text-neutral-400 hover:text-white">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
            <button type="submit" className="w-full bg-green-500 text-black font-bold py-3 rounded-full hover:bg-green-400 transition duration-300">
                Đăng nhập
            </button>
        </div>
        <button onClick={onBack} type="button" className="text-center w-full text-neutral-400 font-bold text-sm mt-8 hover:text-white underline">
            Quay lại
        </button>
    </form>
  );
};

// COMPONENT LOGIN CHÍNH
export default function Login() {
  const [step, setStep] = useState(1);
  const [userEmail, setUserEmail] = useState('');

  const handleNextFromEmail = (email) => {
    setUserEmail(email);
    setStep(2);
  };

  const handleGoToPassword = () => {
    setStep(3);
  };

  const handleGoBack = () => {
    setStep(1);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-neutral-900 p-8 rounded-lg shadow-lg w-full max-w-lg">
        {step === 1 && <Step1_EnterEmail onNext={handleNextFromEmail} />}
        {step === 2 && <Step2_VerifyCode email={userEmail} onLoginWithPassword={handleGoToPassword} />}
        {step === 3 && <Step3_EnterPassword email={userEmail} onBack={handleGoBack} />}
        
        {step === 1 && (
            <div className="text-center mt-8 pt-6 border-t border-neutral-800">
                <p className="text-neutral-400 text-sm">
                    Chưa có tài khoản?{" "}
                    <Link to="/register" className="text-white hover:text-green-500 font-medium underline transition duration-300">
                    Đăng ký
                    </Link>
                </p>
            </div>
        )}
      </div>
    </div>
  );
}