export default function ProfileMetrics() {
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
            <p>152</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Likes Recebidos</p>
            <p>497</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Post com Mais Curtidas</p>
            <p>"GG EZ pra eles, HF pra nós" (71 likes)</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Maior Streak</p>
            <p>9 dias consecutivos postando</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Dias Ativos</p>
            <p>23</p>
          </div>
          <div>
            <p className="font-semibold mb-1">Data de Criação</p>
            <p>2025-04-23</p>
          </div>
        </div>
  
        {/* Barra de progresso */}
        <div>
          <p className="font-semibold text-sm mb-1">Progresso do Perfil</p>
          <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
            <div
              className="h-2 bg-green-500 transition-all duration-300"
              style={{ width: '75%' }}
            ></div>
          </div>
          <p className="text-xs text-right mt-1 text-zinc-500">75% completo</p>
        </div>
      </div>
    )
  }
  