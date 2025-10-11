// Component cho "Popular radio"
function RadioCard({ image, title, artists, bgColor }) {
  // bg-gradient-to-br from-purple-800 to-purple-500
  const bgStyle = {
    background: `linear-gradient(135deg, ${bgColor[0]} 0%, ${bgColor[1]} 100%)`,
  };

  return (
    <div style={bgStyle} className="p-4 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer relative overflow-hidden">
      <div className="absolute top-2 right-2 bg-black bg-opacity-50 px-2 py-1 rounded-full text-xs font-bold">RADIO</div>
      <img src={image} alt={title} className="w-24 h-24 rounded-full shadow-lg mx-auto mb-3 border-2 border-white/20" />
      <h3 className="font-bold text-white text-xl text-center truncate">{title}</h3>
      <p className="text-sm text-neutral-300 mt-1 text-center truncate">{artists}</p>
    </div>
  );
}
export default RadioCard