import React from "react";

const SkeletonCard = () => {
  return (
    <div className="w-32 sm:w-36 md:w-40 lg:w-48 xl:w-56 flex-shrink-0 flex flex-col gap-3 animate-pulse">
      {/* Khung ảnh */}
      <div className="w-full aspect-square bg-neutral-800 rounded-lg"></div>
      
      {/* Khung text tiêu đề */}
      <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
      
      {/* Khung text phụ */}
      <div className="h-3 bg-neutral-800 rounded w-1/2"></div>
    </div>
  );
};

export default SkeletonCard;