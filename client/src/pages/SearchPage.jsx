// src/pages/SearchPage.jsx

import CategoryCard from '../components/CategoryCard';

export default function SearchPage() {
  const categories = [
    { title: 'Podcasts', color: '#27856A', image: 'https://i.scdn.co/image/ab6765630000ba8a07153686523c9147b30e0b23' },
    { title: 'Audiobooks', color: '#1E3264', image: 'https://i.scdn.co/image/ab67706f000000029c233c631754b2d9731dfb19' },
    { title: 'Made For You', color: '#8D67AB', image: 'https://i.scdn.co/image/ab67706f00000002b5c009345037c6f2c01d7131' },
    { title: 'Charts', color: '#777777', image: 'https://charts-images.scdn.co/assets/locale_en/regional/weekly/region_global_default.jpg' },
    { title: 'New Releases', color: '#E8115B', image: 'https://i.scdn.co/image/ab67706f0000000270a728d1f7df29be285ace87' },
    { title: 'Discover', color: '#8D67AB', image: 'https://i.scdn.co/image/ab67706f00000002b0fe40a6b1357f833d7b931c' },
    { title: 'Live Events', color: '#7358F4', image: 'https://concerts.spotifycdn.com/images/live-events_category-image.jpg' },
    { title: 'Hip-Hop', color: '#BC5900', image: 'https://i.scdn.co/image/ab67706f000000029bb6afb3ea8e5e71050a4392' },
    { title: 'Pop', color: '#E13300', image: 'https://i.scdn.co/image/ab67706f00000002fbee723d726b23d9c7c4e518' },
    { title: 'Country', color: '#E13300', image: 'https://i.scdn.co/image/ab67706f00000002758a47265a10384210d1054b' },
  ];

  return (
    <main className="p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Browse all</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {categories.map((cat, index) => (
          <CategoryCard key={index} title={cat.title} color={cat.color} image={cat.image} />
        ))}
      </div>
    </main>
  );
}