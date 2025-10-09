// src/pages/HomePage.jsx
import ArtistCard from '../components/ArtistCard';

function SongCard({ image, title, artist }) {
  return (
    <div className="bg-neutral-800 p-4 rounded-lg hover:bg-neutral-700 transition cursor-pointer">
      <img src={image} alt={title} className="w-full h-auto rounded-md mb-4" />
      <p className="font-bold text-white">{title}</p>
      <p className="text-sm text-neutral-400">{artist}</p>
    </div>
  );
}

export default function HomePage() {
  const trendingSongs = [{ image: 'https://i.scdn.co/image/ab67616d00001e02c521a8377995c64375b43b67', title: 'The Fate of Ophelia', artist: 'Taylor Swift' }, { image: 'https://i.scdn.co/image/ab67616d00001e02927b20398f6a9a811c035614', title: 'NGƯỜI NHƯ ANH', artist: 'Anh Tú "Voi Bản Đôn"' }, { image: 'https://i.scdn.co/image/ab67616d00001e0281c79e2b1b453e0078734208', title: 'Không Buông', artist: 'Hngle, Ari' }];
  const popularArtists = [{ image: 'https://i.scdn.co/image/ab67616100005174026dd7153229a06637b51e51', name: 'Sơn Tùng M-TP', type: 'Artist' }, { image: 'https://i.scdn.co/image/ab67616100005174989ed068a0443d344d564b19', name: 'SOOBIN', type: 'Artist' }, { image: 'https://i.scdn.co/image/ab67616100005174a781a74d478705756a1b6360', name: 'HIEUTHUHAI', type: 'Artist' }];

  return (
    <main className="p-6">
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-bold text-white">Trending songs</h2><a href="#" className="text-sm font-bold text-neutral-400 hover:underline">Show all</a></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">{trendingSongs.map((song, index) => (<SongCard key={index} {...song} />))}</div>
      </section>
      <section>
        <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-bold text-white">Popular artists</h2><a href="#" className="text-sm font-bold text-neutral-400 hover:underline">Show all</a></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">{popularArtists.map((artist, index) => (<ArtistCard key={index} {...artist} />))}</div>
      </section>
    </main>
  );
}