// Component cho "Featured Charts"
function ChartCard({ title, subtitle, description, bgColor }) {
  // bg-gradient-to-br from-purple-800 to-purple-500
  const bgStyle = {
    background: `linear-gradient(135deg, ${bgColor[0]} 0%, ${bgColor[1]} 100%)`,
  };
  return (
    <div style={bgStyle} className="p-4 rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer h-full flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-white text-2xl">{title}</h3>
        {subtitle && <p className="text-sm font-semibold text-neutral-200 mt-1">{subtitle}</p>}
      </div>
      <p className="text-xs text-neutral-300 mt-4">{description}</p>
    </div>
  );
}
export default ChartCard