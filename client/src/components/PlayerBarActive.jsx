// src/components/PlayerBarActive.jsx

import { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaRandom, FaRedo, FaVolumeUp } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const floorSeconds = Math.floor(seconds);
  const minutes = Math.floor(floorSeconds / 60);
  const remainingSeconds = floorSeconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

export default function PlayerBarActive({
  song,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  isShuffleActive,
  isRepeatActive,
  onToggleShuffle,
  onToggleRepeat,
}) {
  const [trackProgress, setTrackProgress] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const volumeBarRef = useRef(null);

  // === ĐÂY LÀ PHẦN ĐÃ ĐƯỢC SỬA LỖI ===
  useEffect(() => {
    // Luôn kiểm tra ref.current có tồn tại không trước khi dùng!
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => console.error("Audio play failed:", error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (song && audioRef.current) {
      audioRef.current.src = song.url;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [song]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const onTimeUpdate = () => {
    if (audioRef.current) setTrackProgress(audioRef.current.currentTime);
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) setTrackDuration(audioRef.current.duration);
  };

  const onSongEnd = () => {
    if (isRepeatActive) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      onNext();
    }
  };

  const handleSeek = (e) => {
    if (!trackDuration || !audioRef.current) return;
    const progressBar = progressBarRef.current;
    const { left, width } = progressBar.getBoundingClientRect();
    const clickX = e.clientX - left;
    const seekTime = (clickX / width) * trackDuration;
    audioRef.current.currentTime = seekTime;
    setTrackProgress(seekTime);
  };

  const handleVolumeChange = (e) => {
    const volumeBar = volumeBarRef.current;
    const { left, width } = volumeBar.getBoundingClientRect();
    const clickX = e.clientX - left;
    let newVolume = clickX / width;
    if (newVolume < 0) newVolume = 0;
    if (newVolume > 1) newVolume = 1;
    setVolume(newVolume);
  };

  if (!song) {
    return <div className="bg-black h-[72px] border-t border-neutral-800"></div>;
  }

  const progressPercent = trackDuration ? (trackProgress / trackDuration) * 100 : 0;
  const volumePercent = volume * 100;

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onSongEnd}
      />
      <div className="bg-black text-white px-4 py-2 flex items-center justify-between border-t border-neutral-800 h-[72px]">
        {/* ... JSX còn lại của bạn không thay đổi ... */}
        {/* 1. Song Info */}
        <div className="flex items-center gap-3 w-1/4">
          <img src={song.imageUrl || "https://via.placeholder.com/56"} alt={song.title} className="w-14 h-14 rounded-md" />
          <div>
            <span className="font-semibold text-sm block cursor-pointer hover:underline">{song.title}</span>
            <span className="text-xs text-neutral-400 block cursor-pointer hover:underline">{song.artist}</span>
          </div>
          <button className="text-neutral-400 hover:text-white" aria-label="Save to your library"> <FiPlus size={20} /> </button>
        </div>

        {/* 2. Player Controls */}
        <div className="flex flex-col items-center gap-1 w-2/5">
          <div className="flex items-center gap-4 text-neutral-300">
            <button onClick={onToggleShuffle} className={`hover:text-white ${isShuffleActive ? 'text-green-500' : ''}`} aria-label="Shuffle"> <FaRandom /> </button>
            <button onClick={onPrev} className="hover:text-white" aria-label="Previous song"> <FaStepBackward size={20} /> </button>
            <button onClick={onPlayPause} className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center hover:scale-105" aria-label={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? <FaPause /> : <FaPlay className="ml-0.5" />}
            </button>
            <button onClick={onNext} className="hover:text-white" aria-label="Next song"> <FaStepForward size={20} /> </button>
            <button onClick={onToggleRepeat} className={`hover:text-white ${isRepeatActive ? 'text-green-500' : ''}`} aria-label="Repeat"> <FaRedo /> </button>
          </div>
          <div className="flex items-center gap-2 w-full mt-1">
            <span className="text-xs text-neutral-400 w-10 text-right">{formatTime(trackProgress)}</span>
            <div ref={progressBarRef} onClick={handleSeek} className="w-full bg-neutral-600 rounded-full h-1 group cursor-pointer">
              <div className="bg-white h-1 rounded-full group-hover:bg-green-500 relative" style={{ width: `${progressPercent}%` }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
            <span className="text-xs text-neutral-400 w-10">{formatTime(trackDuration)}</span>
          </div>
        </div>

        {/* 3. Volume Controls */}
        <div className="flex items-center gap-3 w-1/4 justify-end text-neutral-300">
          <button className="hover:text-white" aria-label="Volume"> <FaVolumeUp /> </button>
          <div ref={volumeBarRef} onClick={handleVolumeChange} className="w-24 bg-neutral-600 rounded-full h-1 group cursor-pointer">
            <div className="bg-white h-1 rounded-full group-hover:bg-green-500 relative" style={{ width: `${volumePercent}%` }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}