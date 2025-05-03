import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getUserMetrics } from '../../services/getUserMetrics'
import { UserMetrics } from '../../types/UserMetrics'

export default function ProfileMetrics() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState<UserMetrics | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user) return
      try {
        const data = await getUserMetrics(user.uid)
        setMetrics(data)
      } catch (err) {
        console.error('Erro ao buscar métricas:', err)
      }
    }

    fetchMetrics()
  }, [user])

  if (!metrics) return null

  return (
    <div
      className="pt-[100px] w-[90%] max-w-5xl mx-auto bg-white flex flex-col gap-16 rounded-xl shadow-md px-10 py-14"
      style={{ fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif' }}
    >
      {/* Cabeçalho */}
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold text-zinc-800">Métricas do Chat</h1>
        <p className="text-sm text-zinc-500">
          Acompanhe seu desempenho e participação na comunidade FURIA.
        </p>
      </div>

      {/* Conteúdo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-[14px] text-[#333]">
        <div>
          <p className="font-semibold mb-1">Total de Posts</p>
          <p>{metrics.totalPosts}</p>
        </div>
        <div>
          <p className="font-semibold mb-1">Likes Recebidos</p>
          <p>{metrics.totalLikes}</p>
        </div>
        <div>
          <p className="font-semibold mb-1">Post com Mais Curtidas</p>
          <p>{metrics.topPost || '—'}</p>
        </div>
        <div>
          <p className="font-semibold mb-1">Maior Streak</p>
          <p>{metrics.longestStreak} dias consecutivos postando</p>
        </div>
        <div>
          <p className="font-semibold mb-1">Dias Ativos</p>
          <p>{metrics.activeDays}</p>
        </div>
        <div>
          <p className="font-semibold mb-1">Data de Criação</p>
          <p>{new Date(metrics.createdAt).toLocaleDateString('pt-BR')}</p>
        </div>
        <div>
          <p className="font-semibold mb-1">Total de Premiações</p>
          <p>{metrics.awardsCount}</p>
        </div>
      </div>

      {/* Barra de progresso */}
      <div>
        <p className="font-semibold text-sm mb-1">Progresso do Perfil</p>
        <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
          <div
            className="h-2 bg-green-500 transition-all duration-300"
            style={{ width: `${metrics.profileCompletion}%` }}
          ></div>
        </div>
        <p className="text-xs text-right mt-1 text-zinc-500">
          {metrics.profileCompletion}% completo
        </p>
      </div>
    </div>
  )
}
