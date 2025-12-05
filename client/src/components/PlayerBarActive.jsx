    import React, { useState, useRef, useEffect, memo } from 'react';
    import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaRandom, FaRedo, FaVolumeUp, FaVolumeMute, FaRegHeart, FaHeart } from 'react-icons/fa';
    import { FiPlus } from 'react-icons/fi';
    import { useAuth } from "../context/AuthContext"; 
    import { useNavigate } from 'react-router-dom'; 
    import { Mic2, List } from 'lucide-react';
    import { useQueue } from "../context/QueueContext";
    import QueuePanel from './QueuePanel';

    const BASE_API_URL = import.meta.env.VITE_API_URL;

    const formatTime = (timeInSeconds) => {
        if (isNaN(timeInSeconds) || timeInSeconds < 0) return "0:00";
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    function PlayerBarActive({ 
        song, isPlaying, onPlayPause, onNext, onPrev, 
        isShuffleActive, onToggleShuffle, isRepeatActive, onToggleRepeat,
        queue = [], queueCount = 0, onPlayFromQueue
    }) {
        const navigate = useNavigate();
        const { user, updateUser, triggerRefreshLikedSongs } = useAuth(); 
        const { removeFromQueue, clearQueue } = useQueue();
        
        const audioRef = useRef(new Audio());
        const progressBarRef = useRef(null);
        const volumeBarRef = useRef(null);

        const [trackProgress, setTrackProgress] = useState(0);
        const [trackDuration, setTrackDuration] = useState(0);
        const [volume, setVolume] = useState(100);
        const [isMuted, setIsMuted] = useState(false);
        const [isLiked, setIsLiked] = useState(false);
        const [showQueue, setShowQueue] = useState(false);

        // Check Like
        useEffect(() => {
    if (user && song) {

        const currentId = song.id || song._id;

        const isSongLiked = user.likedSongs?.some((item) => {
            if (typeof item === "string") {
                return item === currentId;
            }
        
            return (
                item._id?.toString() === currentId.toString() || 
                item.spotifyId?.toString() === currentId.toString()
            );
        });

        setIsLiked(!!isSongLiked);
    } else {
        setIsLiked(false);
    }
}, [song, user]); // Phụ thuộc vào song và user

        const handleToggleLike = async () => {
            if (!user) return alert("Vui lòng đăng nhập để thích bài hát!");
            const newStatus = !isLiked;
            setIsLiked(newStatus);
            try {
                const token = localStorage.getItem("accessToken");
                const songId = song.id || song._id;
                const res = await fetch(`${BASE_API_URL}/songs/${songId}/like`, {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
                });
                if (res.ok) {
                    const data = await res.json();
                    const updatedUser = { ...user, likedSongs: data.likedSongs };
                    updateUser(updatedUser);
                    triggerRefreshLikedSongs();
                } else { setIsLiked(!newStatus); }
            } catch (error) { setIsLiked(!newStatus); }
        };

        // Audio Logic
        const onSongEnd = () => {
            if (isRepeatActive) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
            } else {
                onNext();
            }
        };

        const onTimeUpdate = () => {
            if (audioRef.current) setTrackProgress(audioRef.current.currentTime);
        };

        const onLoadedMetadata = () => {
            if (audioRef.current) setTrackDuration(audioRef.current.duration || 0);
        };

        useEffect(() => {
            const audio = audioRef.current;
            if (!audio) return;
            if (song && song.url) {
                const newSrc = song.url.startsWith('http') ? song.url : window.location.origin + song.url;
                if (audio.src !== newSrc) {
                    audio.pause();
                    audio.src = newSrc;
                    audio.load();
                    audio.currentTime = 0;
                    setTrackProgress(0);
                    if (isPlaying) {
                        const playPromise = audio.play();
                        if (playPromise !== undefined) playPromise.catch(() => {});
                    }
                } else {
                    isPlaying ? audio.play().catch(() => {}) : audio.pause();
                }
            }
        }, [song, isPlaying]);

        useEffect(() => {
            return () => { if (audioRef.current) audioRef.current.pause(); }
        }, []); 

        useEffect(() => {
            const audio = audioRef.current;
            if (!audio) return;
            audio.volume = volume / 100;
            audio.addEventListener("timeupdate", onTimeUpdate);
            audio.addEventListener("loadedmetadata", onLoadedMetadata);
            audio.addEventListener("ended", onSongEnd);
            return () => {
                audio.removeEventListener("timeupdate", onTimeUpdate);
                audio.removeEventListener("loadedmetadata", onLoadedMetadata);
                audio.removeEventListener("ended", onSongEnd);
            };
        }, [onNext, isRepeatActive]);

        const handleSeek = (e) => {
            if (!progressBarRef.current || !audioRef.current || trackDuration === 0) return;
            const rect = progressBarRef.current.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            const newTime = percent * trackDuration;
            audioRef.current.currentTime = newTime;
            setTrackProgress(newTime);
        };

        const handleVolumeChange = (e) => {
            if (!volumeBarRef.current || !audioRef.current) return;
            const rect = volumeBarRef.current.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            let newVolume = Math.max(0, Math.min(100, Math.round(percent * 100)));
            setVolume(newVolume);
            audioRef.current.volume = newVolume / 100;
            setIsMuted(newVolume === 0);
        };

        const toggleMute = () => {
            if (!audioRef.current) return;
            if (isMuted) {
                const vol = volume > 0 ? volume : 100;
                audioRef.current.volume = vol / 100;
                setVolume(vol);
                setIsMuted(false);
            } else {
                audioRef.current.volume = 0;
                setVolume(0);
                setIsMuted(true);
            }
        };

        if (!song) return <div className="bg-black h-20 md:h-[72px] border-t border-neutral-800"></div>;

        const progressPercent = trackDuration > 0 ? (trackProgress / trackDuration) * 100 : 0;
        const volumePercent = volume;

        return (
            <div className="bg-black text-white px-2 md:px-4 py-2 flex items-center justify-between border-t border-neutral-800 h-20 md:h-[72px] relative z-50">
                
                {/* 1. Song Info */}
                {/* Trên Mobile: w-2/6 (khoảng 33%) để chừa chỗ cho Controls */}
                <div className="flex items-center gap-2 md:gap-3 w-2/6 md:w-1/4 overflow-hidden">
                    <img 
                        src={song.image || song.albumImage} 
                        alt={song.title} 
                        onClick={() => navigate(`/song/${song.id || song._id}`)}
                        className="w-10 h-10 md:w-14 md:h-14 rounded-md cursor-pointer hover:opacity-80 transition flex-shrink-0" 
                    />
                    <div className="min-w-0 flex-1">
                        <span 
                            onClick={() => navigate(`/song/${song.id || song._id}`)}
                            className="font-semibold text-sm block cursor-pointer hover:underline truncate"
                        >
                            {song.title}
                        </span>
                        <span className="text-xs text-neutral-400 block cursor-pointer hover:underline truncate">
                            {song.artist}
                        </span>
                    </div>
                    
                    {/* Like Button (Ẩn trên mobile nhỏ quá thì hiện ở SongPage, nhưng ở đây tui giữ lại) */}
                    <button 
                        onClick={handleToggleLike}
                        aria-label={isLiked ? "Unlike song" : "Like song"}
                        className={` sm:block hover:scale-105 transition ${isLiked ? 'text-green-500' : 'text-neutral-400 hover:text-white'}`}
                    >
                        {isLiked ? <FaHeart /> : <FaRegHeart />}
                    </button>
                </div>

                {/* 2. Player Controls */}
                {/* Trên Mobile: w-4/6 (khoảng 66%) để đủ chỗ cho 5 nút */}
                <div className="flex flex-col items-center justify-center gap-1 w-4/6 md:w-2/5">
                    
                    {/* Dòng nút điều khiển */}
                    <div className="flex items-center gap-3 md:gap-6 text-neutral-300">
                        
                        {/* Nút Shuffle (Luôn hiện) - Size nhỏ hơn trên mobile */}
                        <button 
                            onClick={onToggleShuffle}
                            aria-label={isShuffleActive ? "Shuffle is on" : "Turn on shuffle"}
                            className={`hover:text-white transition ${isShuffleActive ? 'text-green-500' : ''}`}
                        >
                            <FaRandom size={14} className="md:w-4 md:h-4" />
                        </button>
                        
                        <button onClick={onPrev} aria-label="Previous song" className="hover:text-white">
                            <FaStepBackward size={18} className="md:w-5 md:h-5"/>
                        </button>
                        
                        <button onClick={onPlayPause} aria-label={isPlaying ? "Pause" : "Play"} className="bg-white text-black w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center hover:scale-105 transition">
                            {isPlaying ? <FaPause size={14} /> : <FaPlay className="ml-0.5" size={14} />}
                        </button>
                        
                        <button onClick={onNext} aria-label="Next song" className="hover:text-white">
                            <FaStepForward size={18} className="md:w-5 md:h-5"/>
                        </button>
                        
                        {/* Nút Repeat (Luôn hiện) */}
                        <button 
                            onClick={onToggleRepeat}
                            aria-label={isRepeatActive ? "Repeat is on" : "Turn on repeat"}
                            className={`hover:text-white transition ${isRepeatActive ? 'text-green-500' : ''}`}
                        >
                            <FaRedo size={14} className="md:w-4 md:h-4" />
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-2 w-full mt-1">
                        <span className="text-xs text-neutral-400 w-8 md:w-10 text-right hidden sm:block">{formatTime(trackProgress)}</span>
                        
                        <div ref={progressBarRef} onClick={handleSeek} className="w-full bg-neutral-600 rounded-full h-1 group cursor-pointer relative">
                            <div className="bg-white h-1 rounded-full group-hover:bg-green-500 relative" style={{ width: `${progressPercent}%` }}>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 md:group-hover:opacity-100 transition-opacity"></div>
                            </div>
                        </div>
                        
                        <span className="text-xs text-neutral-400 w-8 md:w-10 hidden sm:block">{formatTime(trackDuration)}</span>
                    </div>
                </div>

                {/* 3. Volume & Extra (ẨN HOÀN TOÀN TRÊN MOBILE < 768px) */}
                <div className="hidden md:flex items-center gap-3 w-1/4 justify-end text-neutral-300">
                    <button onClick={() => navigate(`/song/${song.id || song._id}`)} aria-label="View song details" className="hover:text-white p-2">
                        <Mic2 size={18} />
                    </button>
                    <div className="relative group">
                        <button 
                            onClick={() => setShowQueue(!showQueue)} 
                            aria-label="Show queue"
                            title="Queue"
                            className="hover:text-white p-2 relative transition hover:bg-white/10 rounded-lg"
                        >
                            <List size={18} />
                            {queueCount > 0 && (
                                <span className="absolute top-0 right-0 bg-green-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                    {queueCount > 99 ? '99+' : queueCount}
                                </span>
                            )}
                        </button>
                        
                        {/* Queue Panel */}
                        {showQueue && (
                            <QueuePanel
                                queue={queue}
                                onRemoveFromQueue={removeFromQueue}
                                onClearQueue={clearQueue}
                                onPlayFromQueue={onPlayFromQueue}
                                currentSong={song}
                                onClose={() => setShowQueue(false)}
                            />
                        )}
                    </div>
                    <button className="hover:text-white" onClick={toggleMute} aria-label={isMuted || volume === 0 ? "Unmute" : "Mute"}>
                        {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                    </button>
                    <div ref={volumeBarRef} onClick={handleVolumeChange} className="w-24 bg-neutral-600 rounded-full h-1 group cursor-pointer">
                        <div className="bg-white h-1 rounded-full group-hover:bg-green-500 relative" style={{ width: `${volumePercent}%` }}>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    </div>
                </div>
                
            </div>
        );
    }

    export default memo(PlayerBarActive);