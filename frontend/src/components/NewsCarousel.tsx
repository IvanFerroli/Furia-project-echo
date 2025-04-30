import { useState } from 'react';

const images = [
  '/banner-1.webp',
  '/banner-2.webp',
];

export default function NewsCarousel() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    
    <section
      className="relative h-[1062px] pt-[76px] flex items-center justify-center"
      style={{ width: '100%', overflowX: 'clip' }}
    >

      {/* Slides */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute w-full h-full bg-no-repeat bg-center bg-contain transition-all duration-700 ${index === current ? 'opacity-100' : 'opacity-0'
            }`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      {/* Navigation + Pagination Wrapper */}
      <div className="absolute left-0 top-[1006px] w-full flex justify-between bg-black items-center px-6 z-20 h-[14px]">
        {/* Arrows */}
        <button
          onClick={prevSlide}
          className="text-white bg-black/50 p-2 rounded-full hover:bg-black"
        >
          ❮
        </button>

        {/* Bullets */}
        <div className="flex gap-3">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full flex items-center justify-center ${current === index ? 'bg-black' : 'bg-gray-400'
                }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${current === index ? 'bg-white' : 'bg-gray-200'
                  }`}
              />
            </div>
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="text-white bg-black/50 p-2 rounded-full hover:bg-black"
        >
          ❯
        </button>
      </div>

    </section>
  );
}
