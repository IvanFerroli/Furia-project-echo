import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import FuriaFanWebchat from './components/FuriaFanWebchat';
import Header from './components/Header';
import Login from './pages/Login';
import ProtectedRoute from './routes/ProtectedRoute';

// Novo layout de perfil + subrotas
import ProfileLayout from './pages/perfil/ProfileLayout';
import ProfileInfo from './pages/perfil/ProfileInfo';
import ProfileAwards from './pages/perfil/ProfileAwards';
import ProfileMetrics from './pages/perfil/ProfileMetrics';

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

          {/* Rota protegida com subrotas */}
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <ProfileLayout />
              </ProtectedRoute>
            }
          >
            <Route path="info" element={<ProfileInfo />} />
            <Route path="awards" element={<ProfileAwards />} />
            <Route path="metricas" element={<ProfileMetrics />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}
