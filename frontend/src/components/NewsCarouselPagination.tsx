interface NewsCarouselPaginationProps {
  total: number;
  current: number;
}

export default function NewsCarouselPagination({
  total,
  current,
}: NewsCarouselPaginationProps) {
  return (
    <div className="absolute top-[790px] left-1/2 -translate-x-1/2 z-50 flex gap-4">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`w-[14px] h-[14px] rounded-full ${
            current === index ? 'bg-white' : 'bg-white'
          } shadow-md border border-gray-400 flex items-center justify-center transition-all`}
        >
          {current === index && (
            <div className="w-[6px] h-[6px] rounded-full border-[4px] border-white" />
          )}
        </div>
      ))}
    </div>
  );
}
