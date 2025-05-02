import { useAuth } from '../../contexts/AuthContext'
import { useState, useEffect } from 'react'

export default function ProfileInfo() {
    const { user } = useAuth()

    const [nickname, setNickname] = useState('')
    const [photo, setPhoto] = useState('')
    const [bio, setBio] = useState('')
    const [city, setCity] = useState('')
    const [birthdate, setBirthdate] = useState('')
    const [cpf, setCpf] = useState('')

    const [isCpfValid, setIsCpfValid] = useState(false)
    const [completion, setCompletion] = useState(0)

    useEffect(() => {
        if (user) {
            setNickname(user.displayName || '')
            setPhoto(user.photoURL || '')
        }
    }, [user])

    useEffect(() => {
        const fields = [nickname, photo, bio, city, birthdate]
        const filledFields = fields.filter(Boolean).length
        const progress = Math.round((filledFields / fields.length) * 100)

        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
        const validCpf = cpf.length === 0 || cpfRegex.test(cpf)

        setIsCpfValid(validCpf)
        setCompletion(validCpf ? progress : Math.min(progress, 99))
    }, [nickname, photo, bio, city, birthdate, cpf])

    const handleSave = () => {
        console.log('Perfil salvo:', {
            nickname,
            photo,
            bio,
            city,
            birthdate,
            cpf
        })
        alert('Perfil salvo com sucesso (simulado)')
    }

    return (
        <div
            className="pt-[100px] w-[90%] max-w-5xl mx-auto bg-white flex flex-col gap-16 rounded-xl shadow-md px-10 py-14"
            style={{ fontFamily: '"Helvetica World", Arial, Helvetica, sans-serif' }}
        >

            {/* Cabeçalho */}
            <div className="space-y-3">
                <h1 className="text-2xl font-semibold text-zinc-800">Informações do Perfil</h1>
                <p className="text-sm text-zinc-500">
                    Edite seu nome, avatar e dados adicionais abaixo.
                </p>
            </div>

            {/* Barra de progresso */}
            <div>
                <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
                    <div
                        className="h-2 bg-green-500 transition-all duration-300"
                        style={{ width: `${completion}%` }}
                    ></div>
                </div>
                <p className="text-xs text-right mt-1 text-zinc-500">
                    Progresso do perfil: {completion}%
                </p>
            </div>

            {/* Conteúdo em duas colunas */}
            <div className="flex flex-col min-[500px]:flex-row justify-between gap-y-12">

                {/* Coluna esquerda */}
                <aside className="flex flex-col gap-6 w-full min-[500px]:w-[45%]" style={{ gap: '36px' }}>
                    <div className="flex flex-col gap-2">
                        <label className="text-[12px] text-[#333] font-normal">Nickname</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="h-10 px-4 text-[12px] border border-black rounded-sm"
                            placeholder="Ex: Fnxzera"
                            style={{ padding: '10px 10px' }}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[12px] text-[#333] font-normal">Foto personalizada (URL)</label>
                        <input
                            type="text"
                            value={photo}
                            onChange={(e) => setPhoto(e.target.value)}
                            className="h-10 px-4 text-[12px] border border-black rounded-sm"
                            placeholder="https://..."
                            style={{ padding: '10px 10px' }}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[12px] text-[#333] font-normal">Biografia</label>
                        <textarea
                            rows={6}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="p-4 text-[12px] border border-black rounded-sm resize-none"
                            placeholder="Conte um pouco sobre você..."
                            style={{ padding: '10px 10px' }}
                        />
                    </div>
                </aside>
                {/* Coluna direita */}
                <aside className="flex flex-col gap-6 w-full min-[500px]:w-[45%]" style={{ gap: '36px' }}>
                    <div className="flex flex-col gap-2">
                        <label className="text-[12px] text-[#333] font-normal">Cidade</label>
                        <input
                            type="text"
                            value={city}    
                            onChange={(e) => setCity(e.target.value)}
                            className="h-10 px-4 text-[12px] border border-black rounded-sm"
                            placeholder="Ex: São Paulo"
                            style={{ padding: '10px 10px' }}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[12px] text-[#333] font-normal">Data de Nascimento</label>
                        <input
                            type="date"
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}
                            className="h-10 px-4 text-[12px] border border-black rounded-sm"
                            style={{ padding: '10px 10px' }}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[12px] text-[#333] font-normal">CPF (opcional)</label>
                        <input
                            type="text"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            className={`h-10 px-4 text-[12px] border rounded-sm ${cpf.length > 0 && !isCpfValid ? 'border-red-500' : 'border-black'
                                }`}
                            placeholder="000.000.000-00"
                            style={{ padding: '10px 10px' }}
                        />
                        {cpf.length > 0 && !isCpfValid && (
                            <span className="text-xs text-red-500">Formato inválido</span>
                        )}
                    </div>

                    <button
                        onClick={handleSave}
                        className="mt-4 w-full h-10 text-[12px] font-semibold uppercase tracking-wide transition-all duration-300 ease-in-out hover:scale-[1.01] active:scale-[0.98] rounded-sm"
                        style={{
                            backgroundColor: '#000',
                            color: '#fff',
                            border: '0',
                            outline: '0',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                            padding: '10px 10px' 
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#222'
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#000'
                        }}
                    >
                        Salvar Perfil
                    </button>

                    {completion === 100 && (
                        <div className="text-center text-green-600 text-sm font-semibold">
                            🏆 Perfil completo desbloqueado!
                        </div>
                    )}
                </aside>

            </div>
        </div>
    )

}      
