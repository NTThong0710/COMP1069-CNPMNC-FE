import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic2 } from 'lucide-react'; 
import { useAuth } from '../../context/AuthContext';
import { useOutletContext } from 'react-router-dom';

import { ArtistInfoSection, QueueSection, SimilarSongsSection } from '../../components/RightSidebar';

// ✅ Import Component Comment đã tách
import CommentSection from '../../components/CommentSection';

const BASE_API_URL = import.meta.env.VITE_API_URL;

export default function SongPage() {
    const { handleSelectSong: onSongSelect } = useOutletContext();
    const { songId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [song, setSong] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch chi tiết bài hát
    useEffect(() => {
        const fetchSongDetails = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${BASE_API_URL}/songs/${songId}`);
                if (res.ok) {
                    const data = await res.json();
                    setSong(data);
                }
            } catch (error) {
                console.error("Failed to fetch song details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (songId) fetchSongDetails();
    }, [songId]);

    // Hàm xử lý hiển thị Lyric
    const renderLyrics = (lyricText) => {
        if (!lyricText) return <p className="text-neutral-400 italic">Chưa có lời bài hát.</p>;

        return lyricText.split(/\r?\n/).map((line, index) => (
            <p 
                key={index} 
                className="text-2xl md:text-4xl font-bold text-white/70 hover:text-white transition-colors mb-6 cursor-default"
            >
                {line || <br/>} 
            </p>
        ));
    };

    if (loading) return <div className="min-h-screen bg-neutral-900 text-white p-8">Loading...</div>;
    if (!song) return <div className="min-h-screen bg-neutral-900 text-white p-8">Song not found</div>;

    return (
        <main className={`relative min-h-screen bg-neutral-900 overflow-hidden pb-10`}>
            
            {/* BACKGROUND BLUR */}
            <div 
                className="absolute inset-0 z-0 opacity-40 blur-[100px] scale-110"
                style={{ 
                    backgroundImage: `url(${song.cover})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center' 
                }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/30 via-black/60 to-[#121212]" />

            {/* CONTENT */}
            <div className="relative z-10 p-4 md:p-8 h-full flex flex-col">
                
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center text-white hover:bg-white/10 mb-8 transition"
                >
                    <ArrowLeft size={24} />
                </button>

                <div className="flex flex-col lg:flex-row gap-10 h-full">
                    
                    {/* LEFT: Song Info (Fixed on Desktop, Top on Mobile) */}
                    <div className="flex-1 max-w-md flex flex-col gap-6">
                        <div className="aspect-square w-full max-w-[400px] rounded-xl shadow-2xl overflow-hidden mx-auto lg:mx-0">
                            <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-center lg:text-left">
                            <h1 className="text-3xl md:text-5xl font-black text-white mb-2">{song.title}</h1>
                            <p className="text-lg md:text-xl text-neutral-300 font-medium">
                                {typeof song.artist === 'object' ? song.artist.name : "Unknown Artist"}
                                <span className="mx-2">•</span>
                                {typeof song.album === 'object' ? song.album.title : "Single"}
                            </p>
                        </div>
                    
                    </div>

                    {/* RIGHT: Lyrics & Comments (Scrollable) */}
                    <div className="flex-1 h-full min-h-[500px]">
                        <div className="h-[calc(100vh-150px)] overflow-y-auto scrollbar-hide pb-48 lg:pb-36">
                            
                            {/* 1. LYRICS SECTION */}
                            <section>
                                <h2 className="text-white font-bold text-xl mb-6 flex items-center gap-2 sticky top-0 bg-transparent backdrop-blur-sm py-2 z-10">
                                    <Mic2 /> Lyrics
                                </h2>
                                <div className="pb-10">
                                    {renderLyrics(song.lyric)}
                                </div>
                                
                                <div className="mt-4 text-neutral-400 text-sm mb-10">
                                    <p>Lyrics provided by Jamendo / User contribution</p>
                                </div>
                            </section>

                           {/* ✅ 2. MOBILE ONLY SECTIONS (Chỉ hiện trên Mobile/Tablet) */}
                            {/* Dùng class lg:hidden để ẩn khi lên Desktop (vì Desktop đã có RightSidebar) */}
                            <div className="lg:hidden space-y-6 border-t border-white/10 pt-6">
                                
                                {/* About Artist */}
                                <ArtistInfoSection song={song} />

                                {/* Next Queue */}
                                <QueueSection />

                                {/* Similar Songs (Nhớ truyền onSongSelect) */}
                                <SimilarSongsSection songId={song._id} onSongSelect={onSongSelect} />
                                
                            </div>

                            {/* 3. COMMENT SECTION (Luôn hiện ở SongPage trên Mobile, ẩn trên Desktop) */}
                            <section className="border-t border-white/10 pt-8 lg:hidden">
                                <h2 className="text-white font-bold text-xl mb-4">Discussion</h2>
                                <CommentSection songId={song.id || song._id} />
                            </section>

                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}