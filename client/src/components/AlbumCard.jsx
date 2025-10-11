// Component cho "Popular albums and singles"
function AlbumCard({ image, title, artist }) {
  return (
    <div className="bg-neutral-800 p-4 rounded-lg hover:bg-neutral-700 transition-colors duration-300 cursor-pointer group">
      <div className="relative mb-4">
        <img src={image} alt={title} className="w-full rounded-md shadow-lg" />
        {/* Có thể thêm nút Play ở đây */}
      </div>
      <h3 className="font-bold text-white truncate">{title}</h3>
      <p className="text-sm text-neutral-400 mt-1 truncate">{artist}</p>
    </div>
  );
}
export default AlbumCard