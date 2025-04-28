import FuriaFanWebchat from './components/FuriaFanWebchat';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center">
      <LandingPage />
      <FuriaFanWebchat />
    </div>
  );
}

export default App;
