import { useEffect, useState } from 'react';
import NewsCarouselPagination from './NewsCarouselPagination';

// Dynamically import all banners regardless of format
const bannerModules = import.meta.glob('/src/assets/img/banner-*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
});

// Sort banners by file name to preserve order
const images = Object.entries(bannerModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, path]) => path as string);

export default function NewsCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section
        className="relative h-[1062px] pt-[76px] flex items-center justify-center"
        style={{ width: '100%', overflowX: 'visible' }}
      >
        {/* Slides wrapper */}
        <div
          className="absolute w-full h-full flex transition-transform duration-700 ease-in-out z-10"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((img, index) => (
            <div
              key={index}
              className="w-full h-full flex-shrink-0 bg-no-repeat bg-top bg-contain"
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>
      </section>

      {/* Pagination outside the slide area */}
      <NewsCarouselPagination total={images.length} current={current} />
    </>
  );
}
