export default function ProfileDashboard() {
    return (
      <div
        className="pt-[100px] w-[90%] max-w-5xl mx-auto bg-white flex flex-col gap-12 rounded-xl shadow-md px-10 py-14"
        style={{ fontFamily: 'Helvetica World, Arial, Helvetica, sans-serif' }}
      >
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-zinc-800">Dashboard Administrativo</h1>
          <p className="text-sm text-zinc-500">
            Painel exclusivo para acompanhar dados gerais da comunidade FURIA.
          </p>
        </div>
  
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg bg-zinc-100">
            <p className="text-sm font-medium text-zinc-500">Total de Usuários</p>
            <p className="text-2xl font-bold text-zinc-800">345</p>
          </div>
  
          <div className="p-6 rounded-lg bg-zinc-100">
            <p className="text-sm font-medium text-zinc-500">Posts Enviados</p>
            <p className="text-2xl font-bold text-zinc-800">1.203</p>
          </div>
  
          <div className="p-6 rounded-lg bg-zinc-100">
            <p className="text-sm font-medium text-zinc-500">Likes Distribuídos</p>
            <p className="text-2xl font-bold text-zinc-800">4.726</p>
          </div>
  
          <div className="p-6 rounded-lg bg-zinc-100">
            <p className="text-sm font-medium text-zinc-500">Curtidas no Post Mais Popular</p>
            <p className="text-2xl font-bold text-zinc-800">112</p>
          </div>
        </div>
  
        <div className="text-sm text-zinc-500">
          <p className="mt-6">* Dados simulados. Integração com backend em breve.</p>
        </div>
      </div>
    )
  }