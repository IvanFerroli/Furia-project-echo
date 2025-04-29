import Header from './Header';

export default function LandingPage() {
  return (
    <main className="flex flex-col flex-1 bg-purple-400 pt-[76px] overflow-x-hidden">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-white">Landing Page Content</h1>
      </div>
    </main>
  );
}
