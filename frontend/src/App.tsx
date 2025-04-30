import LandingPage from './components/LandingPage';
import FuriaFanWebchat from './components/FuriaFanWebchat';
import FanThreadChat from './components/FanThreadChat';


export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-pink-400">
      <LandingPage />
      <FuriaFanWebchat />
      <FanThreadChat />
    </div>
  );
}
