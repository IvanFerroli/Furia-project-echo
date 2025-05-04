import Header from './Header'
import NewsCarousel from './NewsCarousel'
import FanThreadChat from './FanThreadChat'
import { useAuth } from '../contexts/AuthContext' // ✅ adicionado

export default function LandingPage() {
  const { user } = useAuth() // ✅ agora você tem acesso ao user

  return (
    <main className="flex flex-col flex-1 bg-purple-400 overflow-x-hidden">
      <Header />
      <NewsCarousel />
      {user && <FanThreadChat />} {/* ✅ renderiza só se logado */}
    </main>
  )
}
