import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaMusic, FaPodcast } from "react-icons/fa";
import { BsMusicNoteList } from "react-icons/bs";

import ArtistCard from "../../components/ArtistCard";
import SongCard from "../../components/SongCard";
import AlbumCard from "../../components/AlbumCard";
import LoginPromptModal from "../../components/LoginPromptModal";
import ScrollableSection from "../../components/ScrollableSection";
import { useAuth } from "../../context/AuthContext";

import LandingPage from './LandingPage';
const BASE_API_URL = import.meta.env.VITE_API_URL;

const formatDuration = (seconds) => {
  if (!seconds) return "0:00";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
};

export default function HomePage({ onSongSelect }) {
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
        // ... (Logic map data giữ nguyên như cũ) ...
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
              // Đảm bảo route này gọi vào hàm getMyPlaylists mới viết
              headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
              const data = await res.json();

              // Vì BE mới trả về { success: true, playlists: [...] }
              // Và dữ liệu MongoDB đã có sẵn _id, songs
              const rawPlaylists = data.playlists || [];

              // Map lại cho chắc chắn đúng format Modal cần
              const formattedPlaylists = rawPlaylists.map((pl) => ({
                _id: pl._id, // Mongo dùng _id
                name: pl.name,
                songs: pl.songs || [],
                // Nếu bạn có lưu ảnh playlist thì thêm vào, ko thì dùng icon mặc định
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
  }, [user, isLoggedIn]); // Thêm dependency isLoggedIn

  // Xử lý Click vào thẻ bài hát (Nghe nhạc)
  const handleItemClick = (item, playlist = [], index = 0) => {
    if (!isLoggedIn) {
      setSelectedCardImage(item.image || "");
      setIsLoginModalOpen(true);
    } else {
      // Nếu là album thì navigate
      if (!item.url && item.id && !playlist.length) {
        navigate(`/album/${item.id}`);
      }
      // Nếu là bài hát thì play
      else if (item.url && onSongSelect) {
        onSongSelect(item, playlist, index);
      }
    }
  };

  // Định nghĩa style cho thẻ
  const cardContainerClass =
    "w-32 sm:w-36 md:w-40 lg:w-48 xl:w-56 flex-shrink-0";

  // Hàm render song item
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
    <main className="p-4 md:p-4 lg:p-6 pb-24">
      {/* 0. DÀNH RIÊNG CHO BẠN */}
      {recommendedSongs.length > 0 && (
        <ScrollableSection title={`Dành riêng cho ${user?.username || "bạn"}`}>
          {recommendedSongs.map((song, index) =>
            renderSongItem(song, recommendedSongs, index)
          )}
        </ScrollableSection>
      )}

      {/* 1. BẢNG XẾP HẠNG */}
      <ScrollableSection title="Bảng xếp hạng thịnh hành">
        {topSongs.length > 0
          ? topSongs.map((song, index) => renderSongItem(song, topSongs, index))
          : !loading && (
            <p className="text-neutral-400">Chưa có bảng xếp hạng.</p>
          )}
      </ScrollableSection>

      {/* 2. NGHE NHIỀU NHẤT */}
      <ScrollableSection title="Nghe nhiều nhất">
        {loading ? (
          <p className="text-white animate-pulse">Loading...</p>
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
        {newReleases.length > 0
          ? newReleases.map((song, index) =>
            renderSongItem(song, newReleases, index)
          )
          : !loading && (
            <p className="text-neutral-400">Chưa có bài hát mới.</p>
          )}
      </ScrollableSection>

      {/* 4. NGHỆ SĨ (Giữ nguyên, không có nút add playlist) */}
      <ScrollableSection title="Nghệ sĩ nổi bật">
        {popularArtists.length > 0 &&
          popularArtists.map((artist) => (
            <div key={artist.id} className={cardContainerClass}>
              <ArtistCard {...artist} />
            </div>
          ))}
      </ScrollableSection>

      {/* 5. ALBUM */}
      <ScrollableSection title="Album phổ biến">
        {popularAlbums.map((album) => (
          <div key={album.id} className={cardContainerClass}>
            <div
              onClick={() => handleItemClick(album)}
              className="cursor-pointer"
            >
              <AlbumCard {...album} />
            </div>
          </div>
        ))}
      </ScrollableSection>

      {/* --- CÁC MODAL --- */}

      {/* Modal yêu cầu đăng nhập */}
      <LoginPromptModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        cardImage={selectedCardImage}
      />
    </main>
  );
}