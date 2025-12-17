import React, { useState, useEffect, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import { FaMusic, FaStar } from 'react-icons/fa';

const SoundWaveSection = memo(() => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [stars, setStars] = useState([]);
    const [trailOpacity, setTrailOpacity] = useState(0); // State độ mờ của bóng

    const lastStarTimeRef = useRef(0);
    const lastMouseTimeRef = useRef(Date.now());
    const opacityTimeoutRef = useRef(null);

    // --- EFFECT DỌN DẸP SAO CŨ ---
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            setStars((prevStars) => prevStars.filter(star => now - star.id < 1000));
        }, 100);
        return () => clearInterval(interval);
    }, []);

    // --- HÀM XỬ LÝ DI CHUỘT ---
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 1. Cập nhật vị trí nốt nhạc
        setMousePos({ x, y });

        // 2. TÍNH TOÁN HIỆN BÓNG MỜ (Logic mới)
        // Khi chuột di chuyển -> set opacity lên
        setTrailOpacity(1);

        // Xóa timeout cũ nếu có (để reset bộ đếm thời gian dừng)
        if (opacityTimeoutRef.current) {
            clearTimeout(opacityTimeoutRef.current);
        }

        // Sau 100ms không di chuyển -> Chuột coi như dừng -> Ẩn bóng
        opacityTimeoutRef.current = setTimeout(() => {
            setTrailOpacity(0);
        }, 100);

        // 3. Kìm hãm việc tạo sao
        const now = Date.now();
        if (now - lastStarTimeRef.current > 40) {
            const spreadX = (Math.random() * 160) - 80;
            const newStar = {
                id: now,
                x: x + spreadX,
                y: y,
                size: Math.random() * 8 + 4,
                rotation: Math.random() * 360,
            };
            setStars((prev) => [...prev.slice(-20), newStar]);
            lastStarTimeRef.current = now;
        }
    };

    return (
        <section
            onMouseMove={handleMouseMove}
            className="relative h-[600px] bg-black overflow-hidden flex flex-col items-center justify-center text-center px-4 z-10"
            style={{ borderBottomLeftRadius: '50% 50px', borderBottomRightRadius: '50% 50px' }}
        >
            <style>{`
                @keyframes float-blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                @keyframes particle-fade {
                    0% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(var(--tw-rotate)); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0) rotate(var(--tw-rotate)); }
                }
                .animate-blob { animation: float-blob 7s infinite; }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }
                .star-particle {
                    animation: particle-fade 1s forwards ease-out;
                    pointer-events: none;
                }
            `}</style>

            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

            {/* Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob will-change-transform"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000 will-change-transform"></div>
                <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-4000 will-change-transform"></div>
            </div>

            <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden">
                {stars.map(star => (
                    <div
                        key={star.id}
                        className="star-particle absolute text-yellow-300/70 drop-shadow-[0_0_5px_rgba(253,224,71,0.8)] will-change-transform"
                        style={{
                            left: star.x,
                            top: star.y,
                            fontSize: `${star.size}px`,
                            '--tw-rotate': `${star.rotation}deg`,
                        }}
                    >
                        <FaStar />
                    </div>
                ))}

                {/* --- RENDER CÁC NỐT NHẠC --- */}

                {/* 1. NỐT CHÍNH (LUÔN HIỆN) */}
                <div className="absolute will-change-transform"
                    style={{
                        transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0) translate(-50%, -50%) scale(1)`,
                        transition: 'transform 0.05s linear' // Nhanh nhất để bám sát chuột
                    }}>
                    <div className="relative">
                        <div className="absolute inset-0 bg-purple-500 blur-[50px] opacity-60 rounded-full w-32 h-32 -translate-x-1/4 -translate-y-1/4 animate-pulse"></div>
                        <FaMusic size={120} className="text-purple-300 drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]" />
                    </div>
                </div>

                {/* 2. CÁC NỐT BÓNG (CHỈ HIỆN KHI DI CHUYỂN) */}
                {/* Bóng trái (-60px) */}
                <div className="absolute will-change-transform"
                    style={{
                        transform: `translate3d(${mousePos.x - 60}px, ${mousePos.y + 20}px, 0) translate(-50%, -50%) scale(0.85)`,
                        transition: 'transform 0.15s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.2s ease', // Chậm hơn nốt chính
                        opacity: trailOpacity * 0.6 // Độ mờ phụ thuộc vào việc di chuyển
                    }}>
                    <FaMusic size={120} className="text-purple-400/50 blur-[1px]" />
                </div>

                {/* Bóng phải (+60px) */}
                <div className="absolute will-change-transform"
                    style={{
                        transform: `translate3d(${mousePos.x + 60}px, ${mousePos.y - 20}px, 0) translate(-50%, -50%) scale(0.75)`,
                        transition: 'transform 0.25s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.2s ease', // Chậm nhất
                        opacity: trailOpacity * 0.4
                    }}>
                    <FaMusic size={120} className="text-purple-500/30 blur-[2px]" />
                </div>

            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 pointer-events-none z-0"></div>

            <div className="z-20 relative max-w-6.2xl mx-auto mt-6">
                <h2 className="text-4xl md:text-6xl font-black mb-8 leading-normal drop-shadow-2xl max-w-none">
                    Bạn tìm kiếm một bài nhạc?<br />
                    Tuyệt vời!!! Bạn sẽ tìm thấy "ẻm" ở đây <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
                        đỉnh cao của nghe nhạc
                    </span>
                </h2>
                <Link to="/search">
                    <button className="bg-white text-black font-bold text-lg px-8 py-4 rounded-full hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(162,56,255,0.6)]">
                        Khám phá ngay thôi nào
                    </button>
                </Link>
            </div>
        </section>
    );
});

export default SoundWaveSection;