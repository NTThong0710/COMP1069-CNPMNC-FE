import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaMusic, FaCheckCircle, FaSpinner } from 'react-icons/fa';

const DonatePage = () => {
    // Lấy URL API từ biến môi trường
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState(''); // <--- THÊM STATE NÀY
    const [qrUrl, setQrUrl] = useState('');
    const [orderCode, setOrderCode] = useState(null);
    const [isPaid, setIsPaid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Hàm gọi API tạo đơn
    const handleCreateOrder = async () => {
        if (!amount || Number(amount) < 1000) {
            alert("Vui lòng nhập số tiền tối thiểu 1.000đ");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/payment/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: Number(amount),
                    message: message // <--- GỬI LỜI NHẮN LÊN SERVER
                })
            });

            const data = await res.json();

            if (data.success) {
                setOrderCode(data.orderCode);
                setQrUrl(data.qrUrl);
                setIsPaid(false);
            } else {
                alert("Lỗi tạo đơn: " + data.message);
            }
        } catch (error) {
            console.error("Lỗi kết nối:", error);
            alert("Không thể kết nối đến Server.");
        } finally {
            setIsLoading(false);
        }
    };

    // Polling check trạng thái (2s/lần)
    useEffect(() => {
        let interval;

        // Chỉ bắt đầu vòng lặp khi CÓ mã đơn và CHƯA thanh toán
        if (orderCode && !isPaid) {
            interval = setInterval(async () => {
                try {
                    // Gọi nhẹ API để check
                    const res = await fetch(`${API_URL}/payment/check/${orderCode}`);
                    const data = await res.json();

                    if (data.status === 'PAID') {
                        setIsPaid(true);      // 1. Cập nhật trạng thái đã thanh toán
                        setQrUrl('');         // 2. Xóa QR đi để UI chuyển màn hình ngay
                        setOrderCode(null);   // 3. Xóa mã đơn để chắc chắn vòng lặp không chạy lại
                        clearInterval(interval); // 4. Ngắt vòng lặp ngay lập tức
                    }
                } catch (err) {
                    console.error("Lỗi check status", err);
                }
            }, 2000);
        }

        // Cleanup function: React tự động chạy hàm này khi component unmount 
        // hoặc khi dependencies (isPaid) thay đổi.
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [orderCode, isPaid, API_URL]);

    const handleQuickSelect = (val) => {
        setAmount(val);
        setQrUrl('');
        setOrderCode(null);
    };

    return (
        <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">

            {/* Background Effect */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-0 bg-[#1e1e24] rounded-3xl shadow-2xl overflow-hidden border border-white/5 relative z-10 min-h-[600px]">

                {/* === CỘT TRÁI: FORM NHẬP LIỆU === */}
                <div className="p-8 md:p-12 flex flex-col justify-center relative">
                    {isPaid && <div className="absolute inset-0 bg-black/80 z-20 backdrop-blur-[2px] flex items-center justify-center rounded-l-3xl">
                        <div className="text-center">
                            <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-3" />
                            <p className="font-bold text-xl text-green-400">Đã nhận được tiền!</p>
                            <p className="text-gray-400 text-sm mt-1">Cảm ơn lời nhắn của bạn ❤️</p>
                        </div>
                    </div>}

                    <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors w-fit">
                        <FaArrowLeft className="mr-2" /> Quay lại trang chủ
                    </Link>

                    <h1 className="text-3xl md:text-4xl font-black mb-2 flex items-center gap-3">
                        Donate <FaHeart className="text-[#A238FF] animate-pulse" />
                    </h1>
                    <p className="text-gray-400 mb-8">
                        Mời team một ly cà phê để chúng mình có động lực code tiếp nhé!
                    </p>

                    {/* Ô NHẬP TIỀN */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-300 mb-2">Số tiền (VND)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => { setAmount(e.target.value); setQrUrl(''); }}
                            placeholder="VD: 20000"
                            className="w-full bg-[#2a2a30] border border-gray-700 text-white rounded-xl p-4 text-lg focus:outline-none focus:border-[#A238FF] font-bold transition-all"
                        />
                        <div className="flex gap-3 mt-3 overflow-x-auto pb-2 custom-scrollbar">
                            {[10000, 20000, 50000, 100000].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => handleQuickSelect(val)}
                                    className="px-4 py-2 bg-[#2a2a30] hover:bg-[#A238FF] rounded-lg text-sm transition-colors border border-white/5 whitespace-nowrap"
                                >
                                    {val.toLocaleString('vi-VN')}đ
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Ô NHẬP LỜI NHẮN (ĐÃ THÊM MỚI) */}
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-gray-300 mb-2">Lời nhắn yêu thương</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Nhắn gửi đôi lời tới Admin..."
                            rows="3"
                            className="w-full bg-[#2a2a30] border border-gray-700 text-white rounded-xl p-4 focus:outline-none focus:border-[#A238FF] transition-all resize-none"
                        ></textarea>
                    </div>

                    <button
                        onClick={handleCreateOrder}
                        disabled={isLoading || isPaid}
                        className="w-full bg-white text-[#6a00ff] font-black text-lg py-4 rounded-xl shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {isLoading ? "Đang tạo mã..." : "TẠO MÃ QR"}
                    </button>
                </div>

                {/* === CỘT PHẢI: HIỂN THỊ QR === */}
                <div className="bg-gradient-to-br from-[#A238FF] to-[#6a00ff] p-8 md:p-12 flex flex-col items-center justify-center text-center relative transition-all duration-500">
                    <FaMusic className="absolute top-10 right-10 text-white/20 text-6xl rotate-12" />

                    {isPaid ? (
                        <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center animate-fade-in-up transform scale-105">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <FaCheckCircle className="text-5xl text-green-500 animate-bounce" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-800 mb-2">Thanh toán thành công!</h2>
                            <p className="text-gray-600 mb-6">Cảm ơn bạn đã ủng hộ team Music App ❤️</p>
                            <Link to="/">
                                <button className="bg-[#121212] text-white font-bold py-3 px-8 rounded-full hover:bg-black transition-all">
                                    Về trang chủ
                                </button>
                            </Link>
                            <button onClick={() => { setIsPaid(false); setQrUrl(''); setAmount(''); setMessage(''); }} className="mt-4 text-sm text-gray-400 hover:text-[#A238FF] underline">
                                Donate tiếp?
                            </button>
                        </div>
                    ) : qrUrl ? (
                        <div className="flex flex-col items-center animate-fade-in-up">
                            <div className="bg-white p-4 rounded-2xl shadow-2xl mb-4">
                                <h3 className="text-gray-800 font-bold mb-2 text-xs uppercase tracking-widest">Quét mã để thanh toán</h3>
                                <div className="w-64 h-64 bg-gray-100 mb-2 rounded-lg overflow-hidden">
                                    <img src={qrUrl} alt="QR Code" className="w-full h-full object-contain" />
                                </div>
                                <div className="text-[#6a00ff] font-black text-xl">
                                    {Number(amount).toLocaleString('vi-VN')} VND
                                </div>
                                {/* Hiển thị nội dung CK bắt buộc */}
                                <div className="mt-2 text-xs text-gray-500 border-t pt-2">
                                    Nội dung CK: <strong className="text-red-500 font-mono text-sm">{orderCode}</strong>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-white/80 bg-black/20 px-4 py-2 rounded-full">
                                <FaSpinner className="animate-spin" />
                                <span className="text-sm font-medium">Đang chờ bạn chuyển khoản...</span>
                            </div>
                            <p className="text-white/60 text-xs mt-4 max-w-xs">
                                *Vui lòng giữ nguyên nội dung chuyển khoản <strong>{orderCode}</strong> để hệ thống tự động xác nhận.
                            </p>
                        </div>
                    ) : (
                        <div className="text-white text-center opacity-80 max-w-xs">
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <FaHeart className="text-3xl animate-pulse" />
                            </div>
                            <p>Nhập số tiền và lời nhắn rồi bấm <strong>TẠO MÃ QR</strong> nhé!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DonatePage;
