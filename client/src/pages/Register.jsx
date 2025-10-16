import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";

// BƯỚC 1: NHẬP EMAIL (Giao diện từ Register.jsx)
const Step1_EnterEmail = ({ formData, handleFormChange, onNext }) => (
    <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Đăng ký để bắt đầu nghe</h2>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-white mb-3">Địa chỉ email</label>
                <input
                    type="email" name="email" value={formData.email} onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="name@domain.com" required autoFocus
                />
            </div>
            <button type="submit" className="w-full bg-green-500 text-black font-bold py-3 rounded-full hover:bg-green-400 transition duration-300">
                Tiếp theo
            </button>
        </form>
        <div className="flex items-center my-6">
            <div className="flex-1 border-t border-neutral-700"></div>
            <span className="px-4 text-neutral-400 text-sm">hoặc</span>
            <div className="flex-1 border-t border-neutral-700"></div>
        </div>
        <div className="space-y-3">
            <button type="button" className="w-full bg-white text-black font-medium py-3 rounded-full hover:bg-neutral-200 transition duration-300 flex items-center justify-center gap-3">
                <FaGoogle className="text-red-500" /> Đăng ký bằng Google
            </button>
        </div>
    </div>
);

// BƯỚC 2: TẠO MẬT KHẨU (Giao diện từ Register1.jsx)
const Step2_CreatePassword = ({ formData, handleFormChange, onNext }) => {
    const [showPassword, setShowPassword] = useState(false);
    const { password } = formData;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumberOrSpecial = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 10;
    const isPasswordValid = hasLetter && hasNumberOrSpecial && hasMinLength;

    return (
        <div className="w-full max-w-md  max-h-[80vh]">
            <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                    <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-neutral-600 rounded-full"></div>
                    </div>
                </div>
                <h2 className="text-sm font-medium text-neutral-400 mb-1">Bước 1 của 3</h2>
                <h1 className="text-2xl font-bold text-white">Tạo mật khẩu</h1>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-white mb-3">Mật khẩu</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"} name="password" value={password} onChange={handleFormChange}
                            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                            placeholder="Mật khẩu" required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-white text-sm">
                            {showPassword ? "Ẩn" : "Hiện"}
                        </button>
                    </div>
                </div>
                <div className="bg-neutral-800 p-4 rounded">
                    <h3 className="text-white text-sm font-medium mb-3">Mật khẩu của bạn phải có ít nhất</h3>
                    <ul className="space-y-2 text-sm">
                        <li className={`flex items-center ${hasLetter ? 'text-green-500' : 'text-neutral-400'}`}><span className="w-2 h-2 rounded-full bg-current mr-3"></span>1 chữ cái</li>
                        <li className={`flex items-center ${hasNumberOrSpecial ? 'text-green-500' : 'text-neutral-400'}`}><span className="w-2 h-2 rounded-full bg-current mr-3"></span>1 chữ số hoặc ký tự đặc biệt (ví dụ: # ? ! &)</li>
                        <li className={`flex items-center ${hasMinLength ? 'text-green-500' : 'text-neutral-400'}`}><span className="w-2 h-2 rounded-full bg-current mr-3"></span>10 ký tự</li>
                    </ul>
                </div>
                <button type="submit" disabled={!isPasswordValid} className={`w-full font-bold py-3 rounded-full transition duration-300 ${isPasswordValid ? 'bg-green-500 text-black hover:bg-green-400' : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'}`}>
                    Tiếp theo
                </button>
            </form>
        </div>
    );
};

// BƯỚC 3: NHẬP THÔNG TIN CÁ NHÂN (Giao diện từ Register2.jsx)
const Step3_ProfileDetails = ({ formData, handleFormChange, onNext }) => {
    const { name, day, month, year, gender } = formData;
    const [showOtherGender, setShowOtherGender] = useState(false);

    const handleGenderSelect = (selectedGender) => {
        handleFormChange({ target: { name: 'gender', value: selectedGender } });
        setShowOtherGender(selectedGender === "other");
    };

    return (
        <div className="w-full max-w-md max-h-[80vh] overflow-y-auto scrollbar-hide">
            <div className="text-center mb-8">
                <div className="flex justify-center mb-4"><div className="flex space-x-2"><div className="w-2 h-2 bg-neutral-600 rounded-full"></div><div className="w-2 h-2 bg-green-500 rounded-full"></div><div className="w-2 h-2 bg-neutral-600 rounded-full"></div></div></div>
                <h2 className="text-sm font-medium text-neutral-400 mb-2">Bước 2 của 3</h2>
                <h1 className="text-2xl font-bold text-white">Giới thiệu thông tin về bản thân bạn</h1>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-white mb-3">Tên</label>
                    <p className="text-neutral-400 text-xs mb-3">Tên này sẽ xuất hiện trên hồ sơ của bạn</p>
                    <input type="text" name="name" value={name} onChange={handleFormChange} className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Nhập tên của bạn" required />
                </div>
                <div>
                    <div className="flex items-center justify-between mb-3"><label className="block text-sm font-medium text-white">Ngày sinh</label></div>
                    <div className="grid grid-cols-3 gap-3">
                        <select name="day" value={day} onChange={handleFormChange} className="w-full px-3 py-3 bg-neutral-800 border border-neutral-700 rounded text-white" required>
                            <option value="">Ngày</option>
                            {Array.from({ length: 31 }, (_, i) => (<option key={i + 1} value={i + 1}>{i + 1}</option>))}
                        </select>
                        <select name="month" value={month} onChange={handleFormChange} className="w-full px-3 py-3 bg-neutral-800 border border-neutral-700 rounded text-white" required>
                            <option value="">Tháng</option>
                            {Array.from({ length: 12 }, (_, i) => (<option key={i + 1} value={i + 1}>Tháng {i + 1}</option>))}
                        </select>
                        <select name="year" value={year} onChange={handleFormChange} className="w-full px-3 py-3 bg-neutral-800 border border-neutral-700 rounded text-white" required>
                            <option value="">Năm</option>
                            {Array.from({ length: 100 }, (_, i) => { const year = new Date().getFullYear() - i; return (<option key={year} value={year}>{year}</option>); })}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-white mb-3">Giới tính</label>
                    <p className="text-neutral-400 text-xs mb-4">Giới tính của bạn giúp chúng tôi cung cấp nội dung đề xuất và quảng cáo phù hợp với bạn.</p>
                    <div className="space-y-2">
                        {["Nam", "Nữ", "Phi nhị giới"].map((option) => (<button key={option} type="button" onClick={() => handleGenderSelect(option.toLowerCase())} className={`w-full text-left px-4 py-3 rounded border transition duration-300 ${gender === option.toLowerCase() ? "border-green-500 bg-green-500 bg-opacity-10 text-white" : "border-neutral-700 bg-neutral-800 text-white hover:border-neutral-500"}`}>{option}</button>))}
                        <button type="button" onClick={() => handleGenderSelect("other")} className={`w-full text-left px-4 py-3 rounded border transition duration-300 ${gender === "other" ? "border-green-500 bg-green-500 bg-opacity-10 text-white" : "border-neutral-700 bg-neutral-800 text-white hover:border-neutral-500"}`}><div className="font-medium">Giới tính khác</div><div className="text-xs text-neutral-400">Không muốn nêu cụ thể</div></button>
                    </div>
                    {showOtherGender && (<div className="mt-3"><input type="text" value={formData.otherGender} onChange={(e) => handleFormChange({ target: { name: 'otherGender', value: e.target.value } })} className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded text-white" placeholder="Nhập giới tính của bạn" required /></div>)}
                </div>
                <button type="submit" className="w-full bg-green-500 text-black font-bold py-3 rounded-full hover:bg-green-400 transition duration-300">Tiếp theo</button>
            </form>
        </div>
    );
};

// BƯỚC 4: ĐIỀU KHOẢN (Giao diện từ Register3.jsx)
const Step4_TermsAndConditions = ({ onSubmit }) => {
    const [acceptMarketing, setAcceptMarketing] = useState(false);
    const [acceptDataSharing, setAcceptDataSharing] = useState(false);

    return (
        <div className="w-full max-w-md  max-h-[80vh] overflow-y-auto scrollbar-hide">
            <div className="text-center mb-8">
                <div className="flex justify-center mb-4"><div className="flex space-x-2"><div className="w-2 h-2 bg-neutral-600 rounded-full"></div><div className="w-2 h-2 bg-neutral-600 rounded-full"></div><div className="w-2 h-2 bg-green-500 rounded-full"></div></div></div>
                <h2 className="text-sm font-medium text-neutral-400 mb-1">Bước 3 của 3</h2>
                <h1 className="text-2xl font-bold text-white">Điều khoản & Điều kiện</h1>
            </div>
            <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                    <input type="checkbox" id="marketing" checked={acceptMarketing} onChange={() => setAcceptMarketing(!acceptMarketing)} className="mt-0.5 w-4 h-4 text-green-500 bg-neutral-800 border-neutral-600 rounded focus:ring-green-500 focus:ring-1" />
                    <label htmlFor="marketing" className="text-sm text-white leading-tight">Tôi không muốn nhận tin nhắn tiếp thị từ Spotify</label>
                </div>
                <div className="flex items-start space-x-3">
                    <input type="checkbox" id="dataSharing" checked={acceptDataSharing} onChange={() => setAcceptDataSharing(!acceptDataSharing)} className="mt-0.5 w-7 h-7 text-green-500 bg-neutral-800 border-neutral-600 rounded focus:ring-green-500 focus:ring-1" />
                    <label htmlFor="dataSharing" className="text-sm text-white leading-tight">Chia sẻ dữ liệu đăng ký của tôi với các nhà cung cấp nội dung của Spotify cho mục đích tiếp thị</label>
                </div>
            </div>
            <div className="border-t border-neutral-700 pt-4 mb-6">
                <p className="text-sm text-neutral-300 mb-4"><span className="font-bold">Spotify là một dịch vụ được cá nhân hóa.</span>{" "}Bằng việc nhấp vào nút Đăng ký, bạn đồng ý với Điều khoản và điều kiện đã đề cập.</p>
                <p className="text-sm text-neutral-300">Bằng cách nhấp vào nút đăng ký, bạn xác nhận đã đọc thông tin về cách chúng tôi xử lý dữ liệu cá nhân của bạn trong Chính sách quyền riêng tư của chúng tôi.</p>
            </div>
            <div className="border-t border-neutral-700 pt-4 mb-6">
                <p className="text-xs text-neutral-400 leading-relaxed">Chúng tôi và <span className="font-bold">các đối tác của chúng tôi</span> sử dụng cookie và các công nghệ tương tự cho các mục đích bao gồm: hiển thị cho bạn quảng cáo dựa trên sở thích, đo lường, phân tích. Với việc sử dụng trang web và dịch vụ của chúng tôi, bạn đồng ý với việc chúng tôi sử dụng cookie như mô tả trong <span className="font-bold underline">Chính sách cookie</span>.</p>
            </div>
            <button onClick={onSubmit} className="w-full bg-green-500 text-black font-bold py-3 rounded-full hover:bg-green-400 transition duration-300 mt-4">
                Đăng ký
            </button>
        </div>
    );
};

// COMPONENT REGISTER CHÍNH
export default function Register() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '', password: '', name: '', day: '', month: '', year: '', gender: '', otherGender: '',
    });

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handleSubmit = () => {
        console.log("Đăng ký với dữ liệu:", formData);
        // Logic gọi API đăng ký ở đây
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Step1_EnterEmail formData={formData} handleFormChange={handleFormChange} onNext={handleNext} />;
            case 2:
                return <Step2_CreatePassword formData={formData} handleFormChange={handleFormChange} onNext={handleNext} />;
            case 3:
                return <Step3_ProfileDetails formData={formData} handleFormChange={handleFormChange} onNext={handleNext} />;
            case 4:
                return <Step4_TermsAndConditions onSubmit={handleSubmit} />;
            default:
                return <Step1_EnterEmail formData={formData} handleFormChange={handleFormChange} onNext={handleNext} />;
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black py-8">
            <div className="bg-neutral-900 p-8 rounded-lg shadow-lg w-full max-w-md">
                {renderStep()}
                {step === 1 && (
                    <div className="text-center mt-6 pt-6 border-t border-neutral-800">
                        <p className="text-neutral-400 text-sm">
                            Đã có tài khoản?{" "}
                            <Link to="/login" className="text-white hover:text-green-500 font-medium underline transition">
                                Đăng nhập
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}