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
    <section className="relative w-full h-[50vh] overflow-hidden flex items-center justify-center mt-10">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute w-full h-full bg-cover bg-center transition-all duration-700 ${index === current ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      {/* Navigation Buttons */}
      <button onClick={prevSlide} className="absolute left-4 text-white bg-black bg-opacity-50 rounded-full p-2">
        ❮
      </button>
      <button onClick={nextSlide} className="absolute right-4 text-white bg-black bg-opacity-50 rounded-full p-2">
        ❯
      </button>
    </section>
  );
}
