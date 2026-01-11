import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register2 = () => {
    const [name, setName] = useState("");
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [gender, setGender] = useState("");
    const [otherGender, setOtherGender] = useState("");
    const [showOtherGender, setShowOtherGender] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Personal info:", {
            name,
            birthday: { day, month, year },
            gender: showOtherGender ? otherGender : gender,
        });
    };

    const handleGenderSelect = (selectedGender) => {
        setGender(selectedGender);
        if (selectedGender !== "other") {
            setShowOtherGender(false);
            setOtherGender("");
        } else {
            setShowOtherGender(true);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black py-8">
            <div className="bg-neutral-900 p-8 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-hide"> {/* 👈 THÊM scrollbar-hide */}

                {/* Progress and Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-neutral-600 rounded-full"></div>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div className="w-2 h-2 bg-neutral-600 rounded-full"></div>
                        </div>
                    </div>
                    <h2 className="text-sm font-medium text-neutral-400 mb-2">Bước 2 của 3</h2>
                    <h1 className="text-2xl font-bold text-white">
                        Giới thiệu thông tin về bản thân bạn
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-3">
                            Tên
                        </label>
                        <p className="text-neutral-400 text-xs mb-3">
                            Tên này sẽ xuất hiện trên hồ sơ của bạn
                        </p>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Nhập tên của bạn"
                            required
                        />
                    </div>

                    {/* Birthday Section */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-white">
                                Ngày sinh
                            </label>
                            <button
                                type="button"
                                aria-label="Learn why we need your birthday"
                                className="text-neutral-400 hover:text-white text-xs underline"
                            >
                                Tại sao chúng tôi cần biết ngày sinh của bạn? Tìm hiểu thêm.
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {/* Day */}
                            <div>
                                <select
                                    value={day}
                                    onChange={(e) => setDay(e.target.value)}
                                    className="w-full px-3 py-3 bg-neutral-800 border border-neutral-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Ngày</option>
                                    {Array.from({ length: 31 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {i + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Month */}
                            <div>
                                <select
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    className="w-full px-3 py-3 bg-neutral-800 border border-neutral-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Tháng</option>
                                    <option value="1">Tháng 1</option>
                                    <option value="2">Tháng 2</option>
                                    <option value="3">Tháng 3</option>
                                    <option value="4">Tháng 4</option>
                                    <option value="5">Tháng 5</option>
                                    <option value="6">Tháng 6</option>
                                    <option value="7">Tháng 7</option>
                                    <option value="8">Tháng 8</option>
                                    <option value="9">Tháng 9</option>
                                    <option value="10">Tháng 10</option>
                                    <option value="11">Tháng 11</option>
                                    <option value="12">Tháng 12</option>
                                </select>
                            </div>

                            {/* Year */}
                            <div>
                                <select
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className="w-full px-3 py-3 bg-neutral-800 border border-neutral-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Năm</option>
                                    {Array.from({ length: 100 }, (_, i) => {
                                        const year = new Date().getFullYear() - i;
                                        return (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Gender Section */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-3">
                            Giới tính
                        </label>
                        <p className="text-neutral-400 text-xs mb-4">
                            Giới tính của bạn giúp chúng tôi cung cấp nội dung đề xuất và quảng cáo phù hợp với bạn.
                        </p>

                        <div className="space-y-2">
                            {["Nam", "Nữ", "Phi nhị giới"].map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => handleGenderSelect(option.toLowerCase())}
                                    aria-label={`Select gender ${option}`}
                                    className={`w-full text-left px-4 py-3 rounded border transition duration-300 ${gender === option.toLowerCase()
                                        ? "border-green-500 bg-green-500 bg-opacity-10 text-white"
                                        : "border-neutral-700 bg-neutral-800 text-white hover:border-neutral-500"
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}

                            <button
                                type="button"
                                onClick={() => handleGenderSelect("other")}
                                aria-label="Select other gender"
                                className={`w-full text-left px-4 py-3 rounded border transition duration-300 ${gender === "other"
                                    ? "border-green-500 bg-green-500 bg-opacity-10 text-white"
                                    : "border-neutral-700 bg-neutral-800 text-white hover:border-neutral-500"
                                    }`}
                            >
                                <div className="font-medium">Giới tính khác</div>
                                <div className="text-xs text-neutral-400">Không muốn nêu cụ thể</div>
                            </button>
                        </div>

                        {/* Other Gender Input */}
                        {showOtherGender && (
                            <div className="mt-3">
                                <input
                                    type="text"
                                    value={otherGender}
                                    onChange={(e) => setOtherGender(e.target.value)}
                                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Nhập giới tính của bạn"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    {/* Next Button */}
                    <Link to='/register3'>
                        <button
                            type="submit"
                            aria-label="Go to next register step"
                            className="w-full bg-green-500 text-black font-bold py-3 rounded-full hover:bg-green-400 transition duration-300"
                        >
                            Tiếp theo
                        </button>
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default Register2;