import { useEffect, useState } from 'react'

const mockAwards = [
  { icon: '🔥', name: 'Daily Streak Warrior', date: '2025-04-30' },
  { icon: '🏆', name: 'Full Built', date: '2025-05-01' },
  { icon: '🛡️', name: 'Oldschool', date: '2025-04-25' },
  { icon: '✅', name: 'Verified User', date: '2025-04-29' },
  { icon: '💬', name: 'Thread King', date: '2025-04-28' },
  { icon: '💎', name: 'Gold Rank', date: '2025-04-27' },
  { icon: '📈', name: 'Top Likes of the Month', date: '2025-04-26' },
]

export default function ProfileAwards() {
    type Award = {
        icon: string
        name: string
        date: string
      }
      
      const [awards, setAwards] = useState<Award[]>([])
      

  useEffect(() => {
    // Simulating async fetch
    setTimeout(() => setAwards(mockAwards), 300)
  }, [])

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
              <p className="text-xs text-zinc-500">{new Date(award.date).toLocaleDateString('pt-BR')}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}