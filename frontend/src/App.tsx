import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import FuriaFanWebchat from './components/FuriaFanWebchat';
import Header from './components/Header';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ProtectedRoute from './routes/ProtectedRoute';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-pink-400">
      <Header />
      <div className="pt-[76px]">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <LandingPage />
                <FuriaFanWebchat />
              </>
            }
          />
          <Route path="/entrar" element={<Login />} />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
