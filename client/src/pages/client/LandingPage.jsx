import React, { useState, useEffect, useRef } from 'react'; // Thêm useRef
import { Link, useOutletContext } from 'react-router-dom';
import { BsMusicNoteList } from 'react-icons/bs';
import SoundWaveSection from '../../components/SoundWaveSection';
import { FaMusic, FaPodcast, FaHeart, FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const LandingPage = () => {
    const [isSticky, setIsSticky] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [stars, setStars] = useState([]);

    // Dùng useRef để lưu trạng thái hiện tại, tránh closure trong event listener
    const isStickyRef = useRef(false);

    const { setShowMainHeader } = useOutletContext() || {};

    useEffect(() => {
        if (setShowMainHeader) setShowMainHeader(true);

        const scrollContainer = document.querySelector('.main-content-scroll');
        const target = scrollContainer || window;

        const handleScroll = () => {
            const currentScroll = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
            const threshold = window.innerHeight * 0.9;
            const shouldShowSticky = currentScroll > threshold;

            // CHỈ CẬP NHẬT KHI TRẠNG THÁI THAY ĐỔI (Tối ưu hiệu năng)
            if (isStickyRef.current !== shouldShowSticky) {
                isStickyRef.current = shouldShowSticky;
                setIsSticky(shouldShowSticky);
                if (setShowMainHeader) setShowMainHeader(!shouldShowSticky);
            }
        };

        target.addEventListener('scroll', handleScroll);

        return () => {
            target.removeEventListener('scroll', handleScroll);
            if (setShowMainHeader) setShowMainHeader(true);
        };
    }, [setShowMainHeader]);

    // ... (Giữ nguyên logic sao và mouse move cũ của bạn) ...
    useEffect(() => {
        const interval = setInterval(() => {
            setStars((prevStars) => prevStars.filter(star => Date.now() - star.id < 1000));
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePos({ x, y });
        const spreadX = (Math.random() * 200) - 100;
        const newStar = {
            id: Date.now(),
            x: x + spreadX,
            y: y,
            size: Math.random() * 8 + 4,
            rotation: Math.random() * 360,
        };
        setStars((prev) => [...prev.slice(-40), newStar]);
    };

    return (
        // --- SỬA ĐỔI QUAN TRỌNG TẠI ĐÂY ---
        // 1. Xóa class 'animate-fade-in' ở div cha ngoài cùng để không làm hỏng position: fixed
        <div className="text-white min-h-full relative bg-black font-sans">

            {/* === STICKY HEADER (Nằm ngoài khối animate) === */}
            <div
                className={`fixed z-50 left-0 right-0 mx-auto w-[90%] md:w-fit max-w-4xl top-6 rounded-full bg-gradient-to-r from-[#D9A9FF] to-[#F2C6FF] py-2 px-4 md:px-8 flex justify-between items-center shadow-2xl transition-all duration-500 ease-in-out ${isSticky ? 'translate-y-0 opacity-100' : '-translate-y-32 opacity-0 pointer-events-none'}`}
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm shadow-sm flex-shrink-0">💎</div>
                    <span className="font-bold text-sm md:text-lg text-black truncate">NGHE NHẠC CÙNG CHÚNG TÔI </span>
                </div>
                <Link to="/register">
                    <button className="bg-black text-white hover:bg-neutral-800 font-bold text-xs md:text-sm px-6 py-3 rounded-full transition-colors shadow-lg whitespace-nowrap ml-4">HÃY THỬ NHÉ!!!</button>
                </Link>
            </div>

            {/* 2. Tạo một div con bọc toàn bộ nội dung còn lại và gán 'animate-fade-in' vào đây */}
            <div className="animate-fade-in">

                {/* === 1. HERO SECTION === */}
                <section
                    className="flex flex-col items-center justify-center text-center px-4 bg-gradient-to-r from-purple-800 to-blue-600 h-screen relative z-10"
                    style={{ borderBottomLeftRadius: '50% 50px', borderBottomRightRadius: '50% 50px' }}
                >
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight max-w-5xl drop-shadow-lg">HÃY ĐỂ ÂM NHẠC CHẠM ĐẾN TRÁI TIM CỦA BẠN</h1>
                    <p className="text-lg md:text-2xl mb-12 max-w-2xl mx-auto opacity-90 font-medium">Chúng tôi có hàng triệu bài hát cho bạn.</p>
                    <Link to="/register">
                        <button className="bg-[#1ED760] text-black font-extrabold text-base md:text-xl px-10 py-5 rounded-full hover:scale-105 transition-transform tracking-widest shadow-xl hover:shadow-green-500/20">Miễn phí không tốn tiền</button>
                    </Link>
                </section>

                {/* === 3. FEATURES SECTION === */}
                <section className="py-20 px-4 md:px-8 bg-neutral-900/50">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Tại sao lại là chúng tôi?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto px-4">
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 mb-6 bg-neutral-900 rounded-full flex items-center justify-center group-hover:bg-neutral-800 transition-colors border border-white/10"><FaMusic className="w-10 h-10 text-[#1ED760]" /></div>
                            <h3 className="text-xl font-bold mb-3">Nghe theo sở thích của bạn.</h3>
                            <p className="text-neutral-400">Nghe những bài nhạc, và khám phá các thể loại mới.</p>
                        </div>
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 mb-6 bg-neutral-900 rounded-full flex items-center justify-center group-hover:bg-neutral-800 transition-colors border border-white/10"><BsMusicNoteList className="w-10 h-10 text-[#1ED760]" /></div>
                            <h3 className="text-xl font-bold mb-3">Tạo playlists dễ dàng.</h3>
                            <p className="text-neutral-400">Chúng tôi sẽ giúp bạn tạo playlists. Hoặc bạn có thể nghe những playlist được tạo bởi các chuyên gia âm nhạc.</p>
                        </div>
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 mb-6 bg-neutral-900 rounded-full flex items-center justify-center group-hover:bg-neutral-800 transition-colors border border-white/10"><FaPodcast className="w-10 h-10 text-[#1ED760]" /></div>
                            <h3 className="text-xl font-bold mb-3">Hãy làm cho nó trở nên của riêng bạn.</h3>
                            <p className="text-neutral-400">Hãy cho chúng tôi biết bạn thích gì, và chúng tôi sẽ gợi ý âm nhạc dành riêng cho bạn.</p>
                        </div>
                    </div>
                </section>

                {/* === 4. SOUND WAVE SECTION (FULL EFFECT) === */}
                <SoundWaveSection />

                {/* === 5. GLOBAL REACH SECTION === */}
                <section className="py-18 px-4 bg-white text-center mt-[-50px] pt-32 pb-18">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight text-black">Trái tim của âm nhạc
                            <br className="hidden md:block" /> vang vọng khắp thế giới.</h2>
                        <p className="text-neutral-500 text-lg md:text-xl mb-16 font-medium">Âm nhạc là không phân biệt, kể cả màu da, sắc tộc, giới tính, bệnh nhân, tội phạm....</p>
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                            {[
                                { seed: "Felix", bg: "bg-pink-100" }, { seed: "Aneka", bg: "bg-purple-100" }, { seed: "Zoe", bg: "bg-orange-100" },
                                { seed: "Jack", bg: "bg-blue-100" }, { seed: "Bear", bg: "bg-green-100" }, { seed: "Leo", bg: "bg-red-100" },
                            ].map((avatar, i) => (
                                <div key={i} className="group relative transition-transform hover:scale-110 duration-300 cursor-pointer">
                                    <div className={`absolute inset-0 rounded-full ${avatar.bg} scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                    <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${avatar.seed}&mouth=smile`} alt="User Avatar" className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-xl relative z-10" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* === 6. MARQUEE TEXT === */}
                <section
                    className="bg-white pb-12 pt-2 overflow-hidden relative z-10"
                    style={{ borderBottomLeftRadius: '50% 50px', borderBottomRightRadius: '50% 50px' }}
                >
                    <style>{`
                        @keyframes marquee { 
                            0% { transform: translateX(0); } 
                            100% { transform: translateX(-50%); } 
                        } 
                        @keyframes marquee-reverse { 
                            0% { transform: translateX(-50%); } 
                            100% { transform: translateX(0); } 
                        }
                        .animate-marquee { 
                            display: flex; 
                            width: fit-content; 
                            animation: marquee 30s linear infinite; 
                        }
                        .animate-marquee-reverse { 
                            display: flex; 
                            width: fit-content; 
                            animation: marquee-reverse 35s linear infinite; 
                        }
                    `}</style>

                    <div className="w-full overflow-hidden mb-20">
                        <div className="animate-marquee flex items-center whitespace-nowrap">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex items-center gap-8 mx-4">
                                    <span className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter">đừng buồn nữa, hãy nghe nhạc đi</span>
                                    <FaHeart className="text-4xl md:text-6xl text-[#A238FF] animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative w-full max-w-5xl mx-auto h-[500px] hidden md:block">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                            <div className="bg-[#121216] text-white p-6 rounded-2xl shadow-2xl flex flex-col items-center w-64 border border-gray-800 hover:scale-105 transition-transform duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-[#1ED760] rounded-full flex items-center justify-center text-black font-bold"><FaMusic /></div>
                                    <span className="text-gray-400">to</span>
                                    <div className="w-10 h-10 bg-[#A238FF] rounded-full flex items-center justify-center font-bold">💎</div>
                                </div>
                                <div className="text-3xl font-bold mb-5"></div>
                                <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                                    <div className="bg-gradient-to-r from-[#1ED760] to-[#A238FF] h-full w-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                        <img src="https://picsum.photos/300/300?random=1" className="absolute top-0 left-[15%] w-32 h-32 rounded-xl shadow-xl rotate-[-12deg] z-10 hover:z-40 hover:scale-110 transition-all duration-300" />
                        <img src="https://picsum.photos/300/300?random=2" className="absolute top-[20%] left-[5%] w-24 h-24 rounded-lg shadow-lg rotate-[6deg] opacity-80 hover:opacity-100 hover:scale-110 transition-all" />
                        <img src="https://picsum.photos/300/300?random=3" className="absolute top-[5%] right-[18%] w-40 h-40 rounded-2xl shadow-2xl rotate-[15deg] z-20 hover:z-40 hover:scale-110 transition-all" />
                        <img src="https://picsum.photos/300/300?random=4" className="absolute top-[25%] right-[8%] w-28 h-28 rounded-xl shadow-lg rotate-[-8deg] opacity-90 hover:opacity-100 hover:scale-110 transition-all" />
                        <img src="https://picsum.photos/300/300?random=5" className="absolute bottom-[10%] left-[20%] w-36 h-36 rounded-xl shadow-xl rotate-[5deg] z-20 hover:z-40 hover:scale-110 transition-all" />
                        <img src="https://picsum.photos/300/300?random=6" className="absolute bottom-[25%] left-[8%] w-20 h-20 rounded-lg shadow-md rotate-[-15deg] opacity-70 hover:opacity-100 hover:scale-110 transition-all" />
                        <img src="https://picsum.photos/300/300?random=7" className="absolute bottom-[5%] right-[25%] w-32 h-32 rounded-xl shadow-lg rotate-[-10deg] z-10 hover:z-40 hover:scale-110 transition-all" />
                        <img src="https://picsum.photos/300/300?random=8" className="absolute bottom-[20%] right-[12%] w-24 h-24 rounded-lg shadow-lg rotate-[8deg] opacity-80 hover:opacity-100 hover:scale-110 transition-all" />
                        <img src="https://picsum.photos/300/300?random=9" className="absolute top-[10%] left-[40%] w-16 h-16 rounded-md shadow-sm rotate-[-20deg] opacity-60 hover:opacity-100 transition-all" />
                        <img src="https://picsum.photos/300/300?random=10" className="absolute bottom-[15%] right-[45%] w-14 h-14 rounded-md shadow-sm rotate-[20deg] opacity-60 hover:opacity-100 transition-all" />
                    </div>

                    <div className="grid grid-cols-2 md:hidden gap-4 px-4 mt-8">
                        {[1, 2, 3, 4].map(i => (
                            <img key={i} src={`https://picsum.photos/300/300?random=${i}`} className="w-full rounded-xl shadow-lg" />
                        ))}
                    </div>

                    <p className="text-center text-neutral-500 mt-12 px-4 max-w-2xl mx-auto">
                        Chúng tôi luôn sẵn sàng đồng hành cùng bạn
                    </p>
                </section>

                {/* === 7. REAL FOOTER === */}
                <footer className="bg-[#121216] text-gray-400 py-16 px-4 md:px-8 pt-24 mt-[-50px] relative z-0">
                    <div className="max-w-5xl mx-auto mb-20">
                        <div className="bg-gradient-to-r from-[#A238FF] to-[#6a00ff] rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between text-center md:text-left relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl transition-all group-hover:scale-150"></div>
                            <div className="relative z-10">
                                <h2 className="text-2xl md:text-3xl font-black text-white mb-3 flex items-center justify-center md:justify-start gap-3">
                                    HÃY ỦNG HỘ CHÚNG TÔI <FaHeart className="text-white animate-bounce" />
                                </h2>
                                <p className="text-white/90 font-medium text-base md:text-lg max-w-xl">
                                    Sự ủng hộ của bạn là nguồn động lực to lớn để team tiếp tục duy trì server và phát triển thêm nhiều tính năng mới.
                                </p>
                            </div>
                            <Link to="/donate" className="relative z-10 mt-8 md:mt-0 shrink-0">
                                <button className="bg-white text-[#6a00ff] font-black text-lg px-8 py-4 rounded-full shadow-xl hover:scale-105 hover:bg-gray-50 transition-all transform duration-200">
                                    DONATE NGAY
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                            <div className="flex items-center gap-2 mb-6 md:mb-0">
                                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white">💎</div>
                                <span className="font-bold text-xl text-white">Music App</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16 text-sm">
                            <div>
                                <h3 className="text-white font-bold mb-4">Useful links</h3>
                                <ul className="space-y-3">
                                    <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Download the app</li>
                                    <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Offers</li>
                                    <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Reviews</li>
                                    <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Use a promo code</li>
                                    <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Help Center</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-4">Features</h3>
                                <ul className="space-y-3">
                                    <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Flow</li>
                                    <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Song identifier</li>
                                    <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Transfer your music</li>
                                    <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Lyrics</li>
                                    <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Offline mode</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-4">Live the Music</h3>
                                <ul className="space-y-3">
                                    <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Explore the catalogue</li>
                                    <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Top songs</li>
                                    <li className="hover:text-[#A238FF] cursor-pointer transition-colors">New releases</li>
                                    <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Music Blog</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-4">About us</h3>
                                <ul className="space-y-3">
                                    <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Press & News</li>
                                    <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Careers</li>
                                    <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Investors</li>
                                    <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Brand Partnerships</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-4">Legal</h3>
                                <ul className="space-y-3">
                                    <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Terms and Conditions</li>
                                    <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Privacy policy</li>
                                    <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Cookies</li>
                                    <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Accessibility</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
                            <div className="flex gap-6 mb-4 md:mb-0">
                                <div className="w-10 h-10 bg-[#23232D] rounded-full flex items-center justify-center hover:bg-[#A238FF] hover:text-white transition-all cursor-pointer">
                                    <FaFacebookF />
                                </div>
                                <div className="w-10 h-10 bg-[#23232D] rounded-full flex items-center justify-center hover:bg-[#A238FF] hover:text-white transition-all cursor-pointer">
                                    <FaInstagram />
                                </div>
                                <div className="w-10 h-10 bg-[#23232D] rounded-full flex items-center justify-center hover:bg-[#A238FF] hover:text-white transition-all cursor-pointer">
                                    <FaTwitter />
                                </div>
                                <div className="w-10 h-10 bg-[#23232D] rounded-full flex items-center justify-center hover:bg-[#A238FF] hover:text-white transition-all cursor-pointer">
                                    <FaYoutube />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500">
                                © 2025 NHOM 8.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;