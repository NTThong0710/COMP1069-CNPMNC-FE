import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register3 = () => {
    const [acceptMarketing, setAcceptMarketing] = useState(false);
    const [acceptDataSharing, setAcceptDataSharing] = useState(false);

    return (
        <div className="flex items-center justify-center min-h-screen bg-black py-8">
            <div className="bg-neutral-900 p-8 rounded-lg shadow-lg w-full max-w-md">
                {/* Progress and Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-neutral-600 rounded-full"></div>
                            <div className="w-2 h-2 bg-neutral-600 rounded-full"></div>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                    </div>
                    <h2 className="text-sm font-medium text-neutral-400 mb-1">Bước 3 của 3</h2>
                    <h1 className="text-2xl font-bold text-white">
                        Điều khoản & Điều kiện
                    </h1>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="flex items-start space-x-3">
                        <input
                            type="checkbox"
                            id="marketing"
                            checked={acceptMarketing}
                            onChange={() => setAcceptMarketing(!acceptMarketing)}
                            className="mt-0.5 w-4 h-4 text-green-500 bg-neutral-800 border-neutral-600 rounded focus:ring-green-500 focus:ring-1"
                        />
                        <label htmlFor="marketing" className="text-sm text-white leading-tight">
                            Tôi không muốn nhận tin nhắn tiếp thị từ Spotify
                        </label>
                    </div>

                    <div className="flex items-start space-x-3">
                        <input
                            type="checkbox"
                            id="dataSharing"
                            checked={acceptDataSharing}
                            onChange={() => setAcceptDataSharing(!acceptDataSharing)}
                            className="mt-0.5 w-7 h-7 text-green-500 bg-neutral-800 border-neutral-600 rounded focus:ring-green-500 focus:ring-1"
                        />
                        <label htmlFor="dataSharing" className="text-sm text-white leading-tight">
                            Chia sẻ dữ liệu đăng ký của tôi với các nhà cung cấp nội dung của Spotify cho mục đích tiếp thị
                        </label>
                    </div>
                </div>

                {/* Terms Text */}
                <div className="border-t border-neutral-700 pt-4 mb-6">
                    <p className="text-sm text-neutral-300 mb-4">
                        <span className="font-bold">Spotify là một dịch vụ được cá nhân hóa.</span>
                        {" "}Bằng việc nhấp vào nút Đăng ký, bạn đồng ý với Điều khoản và điều kiện đã đề cập.
                    </p>
                    <p className="text-sm text-neutral-300">
                        Bằng cách nhấp vào nút đăng ký, bạn xác nhận đã đọc thông tin về cách chúng tôi xử lý dữ liệu cá nhân của bạn trong Chính sách quyền riêng tư của chúng tôi.
                    </p>
                </div>

                {/* Cookie Policy - TEXT TỪ HÌNH ẢNH */}
                <div className="border-t border-neutral-700 pt-4 mb-6">
                    <p className="text-xs text-neutral-400 leading-relaxed">
                        Chúng tôi và <span className="font-bold">các đối tác của chúng tôi</span> sử dụng cookie và các công nghệ tương tự cho các mục đích bao gồm: hiển thị cho bạn quảng cáo dựa trên sở thích, đo lường, phân tích. Với việc sử dụng trang web và dịch vụ của chúng tôi, bạn đồng ý với việc chúng tôi sử dụng cookie như mô tả trong <span className="font-bold underline">Chính sách cookie</span>.
                    </p>
                </div>

                {/* Register Button */}
                <Link to='/complete'>
                    <button
                        className="w-full bg-green-500 text-black font-bold py-3 rounded-full hover:bg-green-400 transition duration-300 mt-4"
                    >
                        Đăng ký
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Register3;