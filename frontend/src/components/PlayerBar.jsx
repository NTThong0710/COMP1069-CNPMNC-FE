import { Link } from "react-router-dom";

// src/components/PlayerBar.jsx
export default function PlayerBar() {
  return (
    <div className="bg-gradient-to-r from-purple-800 to-blue-500 text-white p-4 flex justify-between items-center">
      <div>
        <p className="font-bold text-sm uppercase">Preview of Spotify</p>
        <p className="text-sm">Sign up to get unlimited songs and podcasts with occasional ads.</p>
      </div>
      <Link to='/register'><button className="bg-white text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition">Sign up free</button></Link>
    </div>
  );
}