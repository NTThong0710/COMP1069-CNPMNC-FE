import React, { useRef, useState, useEffect } from 'react';

// Icons cho nút điều hướng
const ChevronLeftIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);

// Component chính
export default function ScrollableSection({ title, children }) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = (el) => {
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 5); // Thêm 5px sai số
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollButtons(container); // Kiểm tra lần đầu
      const handleResize = () => checkScrollButtons(container);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [children]); // Chạy lại khi children thay đổi (nếu dữ liệu được tải động)

  const handleNavClick = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8; // Cuộn 80%
      container.scrollTo({
        left: direction === 'left' ? container.scrollLeft - scrollAmount : container.scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white hover:underline cursor-pointer">{title}</h2>
        <div className='flex items-center gap-4'>
          <a href="#" className="text-sm font-bold text-neutral-400 hover:underline">
            Show all
          </a>
          <div className="flex gap-2">
            <button
              onClick={() => handleNavClick('left')}
              disabled={!canScrollLeft}
              className="bg-neutral-800/70 p-1 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            >
              <ChevronLeftIcon className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={() => handleNavClick('right')}
              disabled={!canScrollRight}
              className="bg-neutral-800/70 p-1 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            >
              <ChevronRightIcon className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={() => checkScrollButtons(scrollContainerRef.current)}
        className="flex overflow-x-auto gap-4 scrollbar-hide" // `scrollbar-hide` để ẩn thanh cuộn
      >
        {children}
      </div>
    </section>
  );
}