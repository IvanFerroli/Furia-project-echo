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
      className="pt-[100px] w-[90%] max-w-5xl mx-auto bg-white flex flex-col gap-12 rounded-xl shadow-md px-10 py-14"
      style={{ fontFamily: 'Helvetica World, Arial, Helvetica, sans-serif' }}
    >
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold text-zinc-800">Premiações</h1>
        <p className="text-sm text-zinc-500">
          Essas são as conquistas que você já desbloqueou interagindo com a comunidade FURIA.
        </p>
      </div>

      <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        {awards.map((award, index) => (
          <li
            key={index}
            className="flex flex-col gap-2 border border-zinc-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
          >
            <span className="text-3xl">{award.icon}</span>
            <div>
              <p className="text-sm font-semibold text-zinc-800">{award.name}</p>
              <p className="text-xs text-zinc-500">{award.date}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
