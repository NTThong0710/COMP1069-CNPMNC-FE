// src/components/ArtistCard.jsx
export default function ArtistCard({ image, name, type }) {
  return (
    <div className="bg-neutral-800 p-4 rounded-lg hover:bg-neutral-700 transition cursor-pointer flex flex-col items-center text-center">
      <img src={image} alt={name} className="w-32 h-32 rounded-full mb-4 object-cover" />
      <p className="font-bold text-white">{name}</p>
      <p className="text-sm text-neutral-400">{type}</p>
    </div>
  );
}