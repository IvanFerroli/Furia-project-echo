export interface Award {
    award_type: string
    awarded_at: string
  }
  
  export interface MappedAward {
    icon: string
    name: string
    date: string
  }
  
  export const awardMapper: Record<string, { icon: string; name: string }> = {
    full_profile: {
      icon: '🏆',
      name: 'Perfil Completo',
    },
    verified: {
      icon: '✅',
      name: 'Usuário Verificado',
    },
    daily_streak: {
      icon: '🔥',
      name: 'Streak Diário',
    },
    thread_king: {
      icon: '💬',
      name: 'Thread King',
    },
    top_likes: {
      icon: '📈',
      name: 'Mais Curtidas do Mês',
    },
    gold_rank: {
      icon: '💎',
      name: 'Gold Rank',
    },
    oldschool: {
      icon: '🛡️',
      name: 'Oldschool',
    },
  }
  
  export function mapAward(award: Award): MappedAward {
    const meta = awardMapper[award.award_type] || {
      icon: '🎖️',
      name: 'Conquista Desconhecida',
    }
  
    return {
      icon: meta.icon,
      name: meta.name,
      date: new Date(award.awarded_at).toLocaleDateString('pt-BR'),
    }
  }
  