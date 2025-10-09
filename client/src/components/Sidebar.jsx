// src/components/Sidebar.jsx
import { Link } from 'react-router-dom';
import { GoHome, GoSearch, GoBook } from "react-icons/go";
import { FiPlus } from "react-icons/fi";

function PlaylistItem({ image, title, subtitle }) {
  return (
    <a href="#" className="flex items-center gap-3 p-2 rounded-md hover:bg-neutral-800 transition">
      <img src={image} alt={title} className="w-12 h-12 rounded-md object-cover" />
      <div>
        <p className="font-semibold text-white text-sm truncate">{title}</p>
        <p className="text-xs text-neutral-400">{subtitle}</p>
      </div>
    </a>
  );
}

export default function Sidebar({ isLoggedIn }) {
  const userLibrary = [
    { image: 'https://i.scdn.co/image/ab67706f00000002162a0542915598284534714f', title: 'Liked Songs', subtitle: 'Playlist • 1 song' },
    { image: 'https://i.scdn.co/image/ab67616d00004851299227f33963534e12c1a403', title: 'Có em', subtitle: 'Album • Madihu, WOKEUP' },
    { image: 'https://i.scdn.co/image/ab67616d000048510e1e6b528827a4e612984536', title: 'Vũ', subtitle: 'Artist' },
    { image: 'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228', title: 'Lana Del Rey Radio', subtitle: 'Playlist' },
  ];

  return (
    <div className="w-96 flex-shrink-0 bg-black p-2 flex flex-col gap-2">
      <div className="bg-neutral-900 rounded-lg p-4 flex flex-col gap-4">
        <Link to="/" className="flex items-center gap-4 text-white font-bold">
          <GoHome size={24} />
          <span>Home</span>
        </Link>
        <Link to="/search" className="flex items-center gap-4 text-neutral-400 hover:text-white transition font-bold">
          <GoSearch size={24} />
          <span>Search</span>
        </Link>
      </div>

      <div className="bg-neutral-900 rounded-lg flex-1 flex flex-col">
        <div className="flex justify-between items-center p-4">
          <a href="#" className="flex items-center gap-2 text-neutral-400 hover:text-white transition font-bold"><GoBook size={24} /><span>Your Library</span></a>
          <button className="text-neutral-400 hover:text-white transition"><FiPlus size={20} /></button>
        </div>
        
        {isLoggedIn ? (
          <div className="overflow-y-auto px-2">
            {userLibrary.map((item, index) => (
              <PlaylistItem key={index} image={item.image} title={item.title} subtitle={item.subtitle} />
            ))}
          </div>
        ) : (
          <div className="bg-neutral-800 rounded-lg p-4 m-2 text-white">
            <p className="font-bold text-sm mb-1">Create your first playlist</p>
            <p className="text-xs mb-4">It's easy, we'll help you</p>
            <button className="bg-white text-black text-xs font-bold px-4 py-1.5 rounded-full hover:scale-105 transition">Create playlist</button>
          </div>
        )}
      </div>
    </div>
  );
}