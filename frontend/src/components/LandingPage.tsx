import Header from './Header';
import NewsCarousel from './NewsCarousel';
import FanThreadChat from './FanThreadChat';
export default function LandingPage() {
  return (
    <main className="flex flex-col flex-1 bg-purple-400 overflow-x-hidden">
      <Header />
      <NewsCarousel />
      <FanThreadChat />
    </main>
  );
}

