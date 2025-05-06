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
            className="min-h-screen pt-[100px] px-6 pb-20 bg-white"
            style={{ fontFamily: 'Helvetica World, Arial, Helvetica, sans-serif' }}
        >
            <div className="w-full max-w-6xl mx-auto text-center mb-12">
                <h1 className="text-3xl font-bold text-[#0f172a]">Métricas do Chat</h1>
                <p className="text-md text-[#475569] mt-2">
                    Acompanhe seu desempenho e participação na comunidade FURIA.
                </p>
            </div>

            {/* Caixa scrollável com métricas */}
            <div
                className="bg-white rounded-2xl shadow-lg max-w-6xl mx-auto p-6 w-[95%] overflow-y-auto"
                style={{ maxHeight: '500px', marginTop: '30px' }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        maxWidth: '95%',
                        maxHeight: '600px',
                        overflowY: 'auto',
                        margin: '0 auto',
                        paddingLeft: '10px',
                    }}
                >


                    <MetricBox label="Total de Posts" value={metrics.totalPosts} />
                    <MetricBox label="Total de likes" value={metrics.totalLikes} />
                    <MetricBox label="Post com Mais Curtidas" value={metrics.topPost || 'Nenhuma mensagem encontrada'} />
                    <MetricBox label="Likes do Post com Mais curtidas" value={metrics.topPostLikes} />
                    <MetricBox label="Maior Streak" value={`${metrics.longestStreak} dias consecutivos`} />
                    <MetricBox label="Dias Ativos" value={metrics.activeDays} />
                    <MetricBox label="Data de Criação" value={new Date(metrics.createdAt).toLocaleDateString('pt-BR')} />
                    <MetricBox label="Total de Premiações" value={metrics.awardsCount} />
                    <MetricBox label="Perfil Completo" value={`${metrics.profileCompletion}%`} />
                </div>
            </div>
        </div>
    )
}

function MetricBox({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="bg-[#111827] text-[#f3f4f6] rounded-[2rem] shadow-[0_15px_35px_rgba(0,0,0,0.5)] w-[48%] h-[110px] flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.03] text-center mb-[20px] p-3">
            <p className="text-[22px] font-extrabold leading-tight text-[#a855f7]">{value}</p>
            <p className="text-sm font-medium mt-1 text-[#c084fc]">{label}</p>
        </div>
    )
}
