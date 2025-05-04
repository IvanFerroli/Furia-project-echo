import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getUserAwards } from '../../services/getUserAwards'
import { Award, MappedAward, mapAward } from '../../types/Award'

export default function ProfileAwards() {
  const { user } = useAuth()
  const [awards, setAwards] = useState<MappedAward[]>([])

  useEffect(() => {
    const fetchAwards = async () => {
      if (!user) return

      try {
        const rawAwards: Award[] = await getUserAwards(user.uid)
        const mapped = rawAwards.map(mapAward)
        setAwards(mapped)
      } catch (error) {
        console.error('Erro ao buscar awards:', error)
      }
    }

    fetchAwards()
  }, [user])

  return (
    <div
      className="min-h-screen pt-[100px] px-6 pb-20 bg-white"
      style={{ fontFamily: 'Helvetica World, Arial, Helvetica, sans-serif' }}
    >
      <div className="w-full max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold text-[#0f172a]">Premiações</h1>
        <p className="text-md text-[#475569] mt-2">
          Essas são as conquistas que você já desbloqueou interagindo com a comunidade FURIA.
        </p>
      </div>

      <div
        style={{ height: 'auto', width: '95%', marginTop: '30px'  }}
        className="flex flex-wrap justify-between gap-10 bg-white p-6 rounded-2xl shadow-lg max-w-6xl mx-auto"
      >
        {awards.map((award, index) => (
          <div
            key={index}
            className="bg-[#111827] text-[#f3f4f6] rounded-[2rem] shadow-[0_15px_35px_rgba(0,0,0,0.5)] w-[48%] h-[275px] flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.03]"
          >
            <span className="text-[96px]">{award.icon}</span>
            <p className="text-xl font-bold text-[#a855f7] mt-2">{award.name}</p>
            <p className="text-sm text-[#c084fc] mt-1">{award.date}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
