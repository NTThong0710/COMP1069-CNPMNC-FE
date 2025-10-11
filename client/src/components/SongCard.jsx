function SongCard({ image, title, artist }) {
  return (
    <div className="bg-neutral-800 p-4 rounded-lg hover:bg-neutral-700 transition cursor-pointer">
      <img src={image} alt={title} className="w-full h-auto rounded-md mb-4" />
      <p className="font-bold text-white">{title}</p>
      <p className="text-sm text-neutral-400">{artist}</p>
    </div>
  );
}
export default SongCard