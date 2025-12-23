import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaMusic, FaPodcast } from "react-icons/fa";
import { BsMusicNoteList } from "react-icons/bs";
import { useOutletContext } from 'react-router-dom';

import ArtistCard from "../../components/ArtistCard";
import SongCard from "../../components/SongCard";
import AlbumCard from "../../components/AlbumCard";
import LoginPromptModal from "../../components/LoginPromptModal";
import ScrollableSection from "../../components/ScrollableSection";
import { useAuth } from "../../context/AuthContext";

import LandingPage from './LandingPage';
import SkeletonCard from "../../components/SkeletonCard";
const BASE_API_URL = import.meta.env.VITE_API_URL;

const formatDuration = (seconds) => {
  if (!seconds) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
};

// Hàm lấy lời chào theo thời gian (Sáng/Chiều/Tối)
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Chào buổi sáng";
  if (hour < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
};

export default function HomePage() {
  const { handleSelectSong: onSongSelect } = useOutletContext();
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const navigate = useNavigate();

  // State cho Login Modal
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedCardImage, setSelectedCardImage] = useState("");

  // Data States
  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [mostPlayedSongs, setMostPlayedSongs] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [topSongs, setTopSongs] = useState([]);
  const [popularArtists, setPopularArtists] = useState([]);
  const [popularAlbums, setPopularAlbums] = useState([]);
  const [myPlaylists, setMyPlaylists] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch Dữ liệu Trang chủ & Playlist của User
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      if (!BASE_API_URL) {
        setLoading(false);
        return;
      }

      try {
        const mapSongData = (song) => {
          const artistObj =
            typeof song.artist === "object" ? song.artist : null;
          return {
            id: song._id,
            title: song.title,
            artist: artistObj ? artistObj.name : "Unknown Artist",
            artistId: artistObj ? artistObj.artist_id || artistObj._id : null,
            artistImage: artistObj ? artistObj.avatar || artistObj.image : null,
            image:
              song.cover ||
              "https://placehold.co/150x150/282828/white?text=Song",
            url: song.url,
            duration: formatDuration(song.duration),
          };
        };

        const mapArtistData = (artist) => ({
          id: artist.artist_id || artist._id || artist.id,
          name: artist.name,
          image:
            artist.avatar ||
            artist.image ||
            "https://placehold.co/150x150/282828/white?text=Artist",
          type: "Artist",
        });

        // Gọi song song các API nhạc
        const fetchMusicData = async () => {
          // 0. Recommendations
          if (user && (user._id || user.id)) {
            const userId = user._id || user.id;
            try {
              const recRes = await fetch(
                `${BASE_API_URL}/users/${userId}/recommendations?limit=10&ml=1`
              );
              if (recRes.ok) {
                const recData = await recRes.json();
                setRecommendedSongs(
                  (recData.recommendations || []).map(mapSongData)
                );
              }
            } catch (e) {
              console.warn("Rec fetch failed");
            }
          }

          // 1. Most Played
          const mostPlayedRes = await fetch(
            `${BASE_API_URL}/songs/most-played?limit=10`
          );
          const mostPlayedData = await mostPlayedRes.json();
          setMostPlayedSongs((mostPlayedData.songs || []).map(mapSongData));

          // 2. New Releases
          const newReleaseRes = await fetch(
            `${BASE_API_URL}/songs/new-release?limit=10`
          );
          const newReleaseData = await newReleaseRes.json();
          setNewReleases((newReleaseData.songs || []).map(mapSongData));

          // 3. Top Songs
          const topSongsRes = await fetch(`${BASE_API_URL}/songs/top?limit=10`);
          const topSongsData = await topSongsRes.json();
          const topSongsArray = Array.isArray(topSongsData)
            ? topSongsData
            : topSongsData.songs || [];
          setTopSongs(topSongsArray.map(mapSongData));

          // 4. Artists
          try {
            const artistRes = await fetch(`${BASE_API_URL}/artists`);
            if (artistRes.ok) {
              const artistData = await artistRes.json();
              setPopularArtists(
                (artistData.data || artistData || []).map(mapArtistData)
              );
            }
          } catch (e) {
            console.warn("Artist fetch failed");
          }

          // 5. Albums
          try {
            const albumRes = await fetch(`${BASE_API_URL}/albums?limit=10`);
            if (albumRes.ok) {
              const albumData = await albumRes.json();
              const albums = albumData.results || [];
              setPopularAlbums(
                albums.map(album => ({
                  id: album.id,
                  image: album.image || "https://placehold.co/150x150/282828/white?text=Album",
                  title: album.name,
                  artist: album.artist_name || "Unknown Artist"
                }))
              );
            }
          } catch (e) {
            console.warn("Album fetch failed");
          }
        };

        // --- FETCH PLAYLIST CỦA USER ---
        const fetchUserPlaylists = async () => {
          if (!isLoggedIn) return;
          try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(`${BASE_API_URL}/playlists/me`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
              const data = await res.json();
              const rawPlaylists = data.playlists || [];
              const formattedPlaylists = rawPlaylists.map((pl) => ({
                _id: pl._id,
                name: pl.name,
                songs: pl.songs || [],
              }));
              setMyPlaylists(formattedPlaylists);
            }
          } catch (err) {
            console.error("Lỗi fetch playlist:", err);
          }
        };

        await Promise.all([fetchMusicData(), fetchUserPlaylists()]);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isLoggedIn]);

  // Xử lý Click vào thẻ bài hát
  const handleItemClick = (item, playlist = [], index = 0) => {
    if (!isLoggedIn) {
      setSelectedCardImage(item.image || "");
      setIsLoginModalOpen(true);
    } else {
      if (!item.url && item.id && !playlist.length) {
        navigate(`/album/${item.id}`);
      } else if (item.url && onSongSelect) {
        onSongSelect(item, playlist, index);
      }
    }
  };

  // Định nghĩa style cho thẻ
  const cardContainerClass =
    "w-32 sm:w-36 md:w-40 lg:w-48 xl:w-56 flex-shrink-0";

  const renderSongItem = (song, playlist, index) => (
    <div key={song.id} className={cardContainerClass}>
      <div
        onClick={() => handleItemClick(song, playlist, index)}
        className="cursor-pointer"
      >
        <SongCard {...song} />
      </div>
    </div>
  );

  if (!isLoggedIn) return <LandingPage />;
  

  return (
    // THÊM BACKGROUND GRADIENT Ở ĐÂY
    <main className="relative min-h-screen bg-neutral-900 pb-24 overflow-hidden animate-fade-in">
      {/* Lớp phủ Gradient mờ ảo phía trên cùng */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-indigo-900/60 to-neutral-900 z-0 pointer-events-none" />

      {/* Nội dung chính (thêm z-10 để nổi lên trên nền gradient) */}
      <div className="relative z-10 p-4 md:p-6 lg:p-8 space-y-8">
        
        {/* 0. DÀNH RIÊNG CHO BẠN */}
        {recommendedSongs.length > 0 && (
          <ScrollableSection 
            title={
                <span className="flex flex-col gap-1">
                    <span className="text-sm font-normal text-neutral-400 uppercase tracking-wider">{getGreeting()}</span>
                    <span>Dành riêng cho {user?.username || "bạn"}</span>
                </span>
            }
          >
            {recommendedSongs.map((song, index) =>
              renderSongItem(song, recommendedSongs, index)
            )}
          </ScrollableSection>
        )}
{/* 1. BÀI HÁT THỊNH HÀNH */}
        <ScrollableSection title="Bài hát thịnh hành">
          {loading ? (
            [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          ) : topSongs.length > 0 ? (
            topSongs.map((song, index) => renderSongItem(song, topSongs, index))
          ) : (
            <p className="text-neutral-400">Chưa có bài hát thịnh hành.</p>
          )}
        </ScrollableSection>

        {/* 2. TUYỂN TẬP HIT (Nghe nhiều nhất) */}
        <ScrollableSection title="Tuyển tập Hit nghe nhiều nhất">
          {loading ? (
            [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          ) : mostPlayedSongs.length > 0 ? (
            mostPlayedSongs.map((song, index) =>
              renderSongItem(song, mostPlayedSongs, index)
            )
          ) : (
            <p className="text-neutral-400">Chưa có dữ liệu.</p>
          )}
        </ScrollableSection>

        {/* 3. MỚI PHÁT HÀNH */}
        <ScrollableSection title="Mới phát hành">
          {loading ? (
            [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          ) : newReleases.length > 0 ? (
            newReleases.map((song, index) =>
              renderSongItem(song, newReleases, index)
            )
          ) : (
            <p className="text-neutral-400">Chưa có dữ liệu.</p>
          )}
        </ScrollableSection>

        {/* 4. NGHỆ SĨ (Thêm type="artist" để Skeleton tròn) */}
        <ScrollableSection title="Nghệ sĩ yêu thích">
          {loading ? (
            [...Array(6)].map((_, i) => <SkeletonCard key={i} type="artist" />)
          ) : popularArtists.length > 0 ? (
            popularArtists.map((artist) => (
              <div key={artist.id} className={cardContainerClass}>
                <ArtistCard {...artist} />
              </div>
            ))
          ) : (
            <p className="text-neutral-400">Chưa có dữ liệu.</p>
          )}
        </ScrollableSection>

        {/* 5. ALBUM */}
        <ScrollableSection title="Album đáng nghe">
          {loading ? (
            [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          ) : popularAlbums.length > 0 ? (
            popularAlbums.map((album) => (
              <div key={album.id} className={cardContainerClass}>
                <div
                  onClick={() => handleItemClick(album)}
                  className="cursor-pointer"
                >
                  <AlbumCard {...album} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-neutral-400">Chưa có dữ liệu.</p>
          )}
        </ScrollableSection>
      </div>

      {/* --- CÁC MODAL --- */}
      <LoginPromptModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        cardImage={selectedCardImage}
      />
    </main>
  );
}