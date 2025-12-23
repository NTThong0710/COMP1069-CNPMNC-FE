// src/components/CategoryCard.jsx

export default function CategoryCard({ title, color, image }) {
  return (
    <div 
      className="h-48 rounded-lg p-4 relative overflow-hidden cursor-pointer"
      style={{ backgroundColor: color }} // Set màu nền động
    >
      <h3 className="text-2xl font-bold text-white">{title}</h3>
      <img 
        src={image} 
        alt={title} 
        className="w-24 h-24 absolute -bottom-4 -right-4 rotate-[25deg] shadow-xl"
      />
    </div>
  );
}