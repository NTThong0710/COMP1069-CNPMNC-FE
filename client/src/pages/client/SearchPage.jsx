import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Components
import CategoryCard from '../../components/CategoryCard';
import ScrollableSection from '../../components/ScrollableSection';
import SongCard from '../../components/SongCard';
import ArtistCard from '../../components/ArtistCard';
import AlbumCard from '../../components/AlbumCard';

const BASE_API_URL = import.meta.env.VITE_API_URL;

// Hàm format thời gian
const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

export default function SearchPage({ onSongSelect }) {
    const location = useLocation();
    
    // Lấy từ khóa từ URL (?q=...)
    const query = new URLSearchParams(location.search).get('q') || '';

    const [searchResults, setSearchResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Danh mục tĩnh (Browse All)
    const categories = [
        { title: 'Podcasts', color: '#27856A', image: 'https://i.scdn.co/image/ab6765630000ba8a07153686523c9147b30e0b23' },
        { title: 'Audiobooks', color: '#1E3264', image: 'https://i.scdn.co/image/ab67706f000000029c233c631754b2d9731dfb19' },
        { title: 'Hip-Hop', color: '#BC5900', image: 'https://i.scdn.co/image/ab67706f000000029bb6afb3ea8e5e71050a4392' },
        { title: 'Pop', color: '#E13300', image: 'https://i.scdn.co/image/ab67706f00000002fbee723d726b23d9c7c4e518' },
        { title: 'K-Pop', color: '#E8115B', image: 'https://i.scdn.co/image/ab67706f000000022487c691582e4c29dd8a3d89' },
    ];
    const cardWidth = "w-[18.5%]";

    // === GỌI API SEARCH ===
    useEffect(() => {
        if (!query) {
            setSearchResults(null);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            setError(null);

            if (!BASE_API_URL) {
                setLoading(false);
                return;
            }

            try {
                // Gọi endpoint: /api/search?q=...&type=all
                const response = await fetch(`${BASE_API_URL}/search?q=${encodeURIComponent(query)}&type=all&limit=10`);
                
                if (!response.ok) throw new Error("Lỗi tìm kiếm");

                const rawData = await response.json();
                // Cấu trúc Backend: rawData.results.songs.data
                const results = rawData.results || {};

                // === MAP DỮ LIỆU ===
                const mappedResults = {
                    songs: (results.songs?.data || []).map(song => ({
                        id: song._id,
                        title: song.title,
                        // Backend populate artist -> trả về object -> lấy .name
                        artist: song.artist?.name || 'Unknown Artist',
                        // Backend trả về 'cover', Frontend dùng 'image'
                        image: song.cover || 'https://placehold.co/150x150/282828/white?text=Song',
                        url: song.url,
                        duration: formatDuration(song.duration),
                    })),

                    artists: (results.artists?.data || []).map(artist => ({
                        // Ưu tiên artist_id Jamendo để link không bị lỗi 404
                        id: artist.artist_id || artist._id, 
                        name: artist.name,
                        image: artist.avatar || artist.image || 'https://placehold.co/150x150/282828/white?text=Artist',
                        type: 'Artist'
                    })),

                    albums: (results.albums?.data || []).map(album => ({
                        id: album._id,
                        title: album.title,
                        // Album cũng populate artist -> lấy .name
                        artist: album.artist?.name || 'Unknown Artist',
                        image: album.cover || 'https://placehold.co/150x150/282828/white?text=Album',
                    })),
                };

                setSearchResults(mappedResults);
            } catch (err) {
                console.error("Search Error:", err);
                setError("Không thể tải kết quả tìm kiếm.");
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]); // Chạy lại khi query thay đổi

    // === RENDER ===
    
    // 1. Khi đang tìm kiếm
    if (loading) {
        return (
            <main className="p-6">
                <h1 className="text-2xl font-bold text-white animate-pulse">Đang tìm kiếm cho "{query}"...</h1>
            </main>
        );
    }

    // 2. Khi chưa nhập gì -> Hiện Browse All
    if (!query) {
        return (
            <main className="p-6">
                <h1 className="text-2xl font-bold text-white mb-6">Duyệt tìm tất cả</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {categories.map((cat, index) => (
                        <CategoryCard key={index} {...cat} />
                    ))}
                </div>
            </main>
        );
    }

    // 3. Hiển thị kết quả
    const hasSongs = searchResults?.songs?.length > 0;
    const hasArtists = searchResults?.artists?.length > 0;
    const hasAlbums = searchResults?.albums?.length > 0;
    const hasResults = hasSongs || hasArtists || hasAlbums;

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Kết quả cho "{query}"</h1>
            
            {!hasResults && !error && (
                <p className="text-neutral-400">Không tìm thấy kết quả nào phù hợp.</p>
            )}

            {/* SONGS */}
            {hasSongs && (
                <ScrollableSection title="Bài hát" isStatic={true}>
                    {searchResults.songs.map((song, index) => (
                        <div key={song.id} className={`flex-shrink-0 ${cardWidth}`}>
                            <div onClick={() => onSongSelect(song, searchResults.songs, index)} className="cursor-pointer">
                                <SongCard {...song} />
                            </div>
                        </div>
                    ))}
                </ScrollableSection>
            )}

            {/* ARTISTS */}
            {hasArtists && (
                <ScrollableSection title="Nghệ sĩ" isStatic={true}>
                    {searchResults.artists.map((artist) => (
                        <div key={artist.id} className={`flex-shrink-0 ${cardWidth}`}>
                            <ArtistCard {...artist} id={artist.id} />
                        </div>
                    ))}
                </ScrollableSection>
            )}

            {/* ALBUMS */}
            {hasAlbums && (
                <ScrollableSection title="Albums" isStatic={true}>
                    {searchResults.albums.map((album) => (
                        <div key={album.id} className={`flex-shrink-0 ${cardWidth}`}>
                            <AlbumCard {...album} />
                        </div>
                    ))}
                </ScrollableSection>
            )}
        </main>
    );
}