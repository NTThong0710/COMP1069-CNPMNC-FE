import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsMusicNoteList } from 'react-icons/bs';
import { GoHome } from "react-icons/go";
import { FaMusic, FaPodcast, FaCheck, FaHeart, FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaApple, FaGooglePlay } from 'react-icons/fa';

const LandingPage = () => {
    const [isSticky, setIsSticky] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const scrollContainer = document.querySelector('.main-content-scroll');
        const target = scrollContainer || window;

        const handleScroll = () => {
            const currentScroll = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
            const threshold = window.innerHeight * 0.9;
            setIsSticky(currentScroll > threshold);
        };

        target.addEventListener('scroll', handleScroll);
        return () => target.removeEventListener('scroll', handleScroll);
    }, []);

    const handleMouseMove = (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        setMousePos({ x, y });
    };

    return (
        <div className="text-white min-h-full relative bg-black font-sans">

            {/* === STICKY HEADER === */}
            <div
                className={`fixed z-50 left-0 right-0 mx-auto w-[90%] md:w-fit max-w-4xl top-6 rounded-full bg-gradient-to-r from-[#D9A9FF] to-[#F2C6FF] py-2 px-4 md:px-8 flex justify-between items-center shadow-2xl transition-all duration-500 ease-in-out ${isSticky ? 'translate-y-0 opacity-100' : '-translate-y-32 opacity-0 pointer-events-none'}`}
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm shadow-sm flex-shrink-0">💎</div>
                    <span className="font-bold text-sm md:text-lg text-black truncate">Live the music with NHOM 8</span>
                </div>
                <Link to="/register">
                    <button className="bg-black text-white hover:bg-neutral-800 font-bold text-xs md:text-sm px-6 py-3 rounded-full transition-colors shadow-lg whitespace-nowrap ml-4">Try for free</button>
                </Link>
            </div>

            {/* === 1. HERO SECTION === */}
            <section
                className="flex flex-col items-center justify-center text-center px-4 bg-gradient-to-r from-purple-800 to-blue-600 h-screen relative z-10"
                style={{ borderBottomLeftRadius: '50% 50px', borderBottomRightRadius: '50% 50px' }}
            >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight max-w-5xl drop-shadow-lg">LET MUSIC HEAL YOUR HEART</h1>
                <p className="text-lg md:text-2xl mb-12 max-w-2xl mx-auto opacity-90 font-medium">Millions of songs and podcasts. No credit card needed.</p>
                <Link to="/register">
                    <button className="bg-[#1ED760] text-black font-extrabold text-base md:text-xl px-10 py-5 rounded-full hover:scale-105 transition-transform tracking-widest shadow-xl hover:shadow-green-500/20">CREATE ACCOUNT FREE</button>
                </Link>
            </section>

            {/* === 2. PRICING SECTION === */}
            <section className="py-24 px-4 bg-black text-center min-h-screen flex flex-col justify-center">
                <h2 className="text-4xl md:text-6xl font-black mb-16 leading-tight">Choose the offer<br className="hidden md:block" /> that works for you</h2>
                <div className="bg-white text-black max-w-sm mx-auto rounded-3xl p-8 relative overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300">
                    <div className="inline-block bg-[#A238FF] text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wide mb-6">Premium</div>
                    <h3 className="text-4xl font-black mb-2">1 MONTH FREE</h3>
                    <p className="text-gray-500 font-medium mb-8">then $11.99/month</p>
                    <Link to="/register">
                        <button className="w-full bg-[#A238FF] text-white font-bold text-lg py-3 rounded-full mb-8 hover:bg-[#8b2df0] transition-colors shadow-lg shadow-purple-200">Try for free</button>
                    </Link>
                    <ul className="text-left space-y-4 text-sm md:text-base font-medium text-gray-800">
                        <li className="flex items-start gap-3"><FaCheck className="text-[#A238FF] mt-1 flex-shrink-0" /><span>Over 120 million songs</span></li>
                        <li className="flex items-start gap-3"><FaCheck className="text-[#A238FF] mt-1 flex-shrink-0" /><span>Mixes and playlists just for you</span></li>
                        <li className="flex items-start gap-3"><FaCheck className="text-[#A238FF] mt-1 flex-shrink-0" /><span>Lyrics with translation</span></li>
                        <li className="flex items-start gap-3"><FaCheck className="text-[#A238FF] mt-1 flex-shrink-0" /><span>Ad-free music</span></li>
                        <li className="flex items-start gap-3"><FaCheck className="text-[#A238FF] mt-1 flex-shrink-0" /><span>Offline listening</span></li>
                    </ul>
                </div>
            </section>

            {/* === 3. FEATURES SECTION === */}
            <section className="py-20 px-4 md:px-8 bg-neutral-900/50">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why Our Website?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto px-4">
                    <div className="flex flex-col items-center text-center group">
                        <div className="w-24 h-24 mb-6 bg-neutral-900 rounded-full flex items-center justify-center group-hover:bg-neutral-800 transition-colors border border-white/10"><FaMusic className="w-10 h-10 text-[#1ED760]" /></div>
                        <h3 className="text-xl font-bold mb-3">Play your favorites.</h3>
                        <p className="text-neutral-400">Listen to the songs you love, and discover new music and podcasts.</p>
                    </div>
                    <div className="flex flex-col items-center text-center group">
                        <div className="w-24 h-24 mb-6 bg-neutral-900 rounded-full flex items-center justify-center group-hover:bg-neutral-800 transition-colors border border-white/10"><BsMusicNoteList className="w-10 h-10 text-[#1ED760]" /></div>
                        <h3 className="text-xl font-bold mb-3">Playlists made easy.</h3>
                        <p className="text-neutral-400">We'll help you make playlists. Or enjoy playlists made by music experts.</p>
                    </div>
                    <div className="flex flex-col items-center text-center group">
                        <div className="w-24 h-24 mb-6 bg-neutral-900 rounded-full flex items-center justify-center group-hover:bg-neutral-800 transition-colors border border-white/10"><FaPodcast className="w-10 h-10 text-[#1ED760]" /></div>
                        <h3 className="text-xl font-bold mb-3">Make it yours.</h3>
                        <p className="text-neutral-400">Tell us what you like, and we'll recommend music for you.</p>
                    </div>
                </div>
            </section>

            {/* === 4. SOUND WAVE SECTION === */}
            <section
                onMouseMove={handleMouseMove}
                className="relative h-[600px] bg-black overflow-hidden flex flex-col items-center justify-center text-center px-4 cursor-crosshair z-10"
                style={{ borderBottomLeftRadius: '50% 50px', borderBottomRightRadius: '50% 50px' }}
            >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-100">
                    <svg width="100%" height="100%" viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                        <defs>
                            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#A238FF" stopOpacity="0.3" />
                                <stop offset="50%" stopColor="#A238FF" stopOpacity="1" />
                                <stop offset="100%" stopColor="#A238FF" stopOpacity="0.3" />
                            </linearGradient>
                        </defs>
                        <g fill="none" stroke="url(#waveGradient)">
                            {[...Array(15)].map((_, i) => {
                                const baseX = 110 + i * 70;
                                const normalized = (i / 14) * Math.PI;
                                const ry = 60 + Math.sin(normalized) * 220;
                                const rx = 35 + Math.sin(normalized) * 15;
                                const moveX = mousePos.x * (Math.sin(normalized) * 80);
                                return (
                                    <ellipse key={i} cx={baseX} cy="300" rx={rx} ry={ry} strokeWidth={2} style={{ transform: `translate(${moveX}px, 0px)`, transition: 'transform 0.1s linear' }} />
                                );
                            })}
                        </g>
                    </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none"></div>
                <div className="z-10 relative max-w-4xl mx-auto mt-6">
                    <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight drop-shadow-2xl">Looking for a song?<br />You'll find it on Deezer with <br /><span className="text-[#A238FF]">high-quality sound!</span></h2>
                    <Link to="/search">
                        <button className="bg-white text-black font-bold text-lg px-8 py-4 rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(162,56,255,0.4)]">Explore our catalogue</button>
                    </Link>
                </div>
            </section>

            {/* === 5. GLOBAL REACH SECTION === */}
            <section
                className="py-24 px-4 bg-white text-center mt-[-50px] pt-32 pb-24"
            >
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight text-black">The heart of music that<br className="hidden md:block" /> beats all over the world</h2>
                    <p className="text-neutral-500 text-lg md:text-xl mb-16 font-medium">Our app is available in 180+ countries and is translated into 26 languages</p>
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

            {/* === 6. MARQUEE TEXT (ĐÃ SỬA: CONG Ở ĐÁY) === */}
            <section
                className="bg-white py-12 overflow-hidden relative z-10"
                // 👇 THÊM ĐƯỜNG CONG TẠI ĐÂY
                style={{ borderBottomLeftRadius: '50% 50px', borderBottomRightRadius: '50% 50px' }}
            >
                <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-marquee { display: flex; width: fit-content; animation: marquee 20s linear infinite; }`}</style>
                <div className="w-full overflow-hidden">
                    <div className="animate-marquee flex items-center whitespace-nowrap">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-center gap-8 mx-4">
                                <span className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter">by 10 million music lovers</span>
                                <FaHeart className="text-4xl md:text-6xl text-[#A238FF] animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === 7. REAL FOOTER === */}
            {/* THÊM: mt-[-50px] để kéo Footer lên nằm lấp dưới đường cong của Section trên */}
            <footer className="bg-[#121216] text-gray-400 py-16 px-4 md:px-8 pt-24 mt-[-50px] relative z-0">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                        <div className="flex items-center gap-2 mb-6 md:mb-0">
                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white">💎</div>
                            <span className="font-bold text-xl text-white">Music App</span>
                        </div>
                        <div className="flex gap-4">
                            <button className="flex items-center gap-2 bg-[#23232D] hover:bg-[#32323d] text-white px-4 py-2 rounded-md transition-colors border border-gray-700">
                                <FaApple className="text-xl" />
                                <div className="text-left leading-tight"><div className="text-[10px] font-medium">Download on the</div><div className="text-sm font-bold">App Store</div></div>
                            </button>
                            <button className="flex items-center gap-2 bg-[#23232D] hover:bg-[#32323d] text-white px-4 py-2 rounded-md transition-colors border border-gray-700">
                                <FaGooglePlay className="text-xl" />
                                <div className="text-left leading-tight"><div className="text-[10px] font-medium">GET IT ON</div><div className="text-sm font-bold">Google Play</div></div>
                            </button>
                        </div>
                    </div>
                    {/* Phần 2: Các cột Link (Grid Layout) */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16 text-sm">
                        {/* Cột 1 */}
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

                        {/* Cột 2 */}
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

                        {/* Cột 3 */}
                        <div>
                            <h3 className="text-white font-bold mb-4">Live the Music</h3>
                            <ul className="space-y-3">
                                <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Explore the catalogue</li>
                                <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Top songs</li>
                                <li className="hover:text-[#A238FF] cursor-pointer transition-colors">New releases</li>
                                <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Music Blog</li>
                            </ul>
                        </div>

                        {/* Cột 4 */}
                        <div>
                            <h3 className="text-white font-bold mb-4">About us</h3>
                            <ul className="space-y-3">
                                <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Press & News</li>
                                <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Careers</li>
                                <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Investors</li>
                                <li className="hover:text-[#A238FF] cursor-pointer transition-colors">Brand Partnerships</li>
                            </ul>
                        </div>

                        {/* Cột 5 */}
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

                    {/* Phần 3: Mạng xã hội & Copyright */}
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
    );
};

export default LandingPage;