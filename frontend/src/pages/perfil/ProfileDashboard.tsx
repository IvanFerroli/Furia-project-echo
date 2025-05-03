import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
  } from 'recharts';
  
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#ffbb28'];
  
  const mockStats = {
    totalUsers: 345,
    totalPosts: 1203,
    totalLikes: 4726,
    topPostLikes: 112,
    ageGroups: [
      { name: '18-24', value: 40 },
      { name: '25-34', value: 35 },
      { name: '35-44', value: 15 },
      { name: '45+', value: 10 },
    ],
    states: [
      { name: 'SP', value: 50 },
      { name: 'RJ', value: 20 },
      { name: 'MG', value: 15 },
      { name: 'Outros', value: 15 },
    ],
    hashtags: [
      { name: '#goFURIA', value: 120 },
      { name: '#FURIAWIN', value: 95 },
      { name: '#caralhoFURIA', value: 80 },
      { name: '#FURIAgg', value: 60 },
      { name: '#mandanoPique', value: 45 },
    ],
    streakActivity: [
      { date: '01/05', streak: 3 },
      { date: '02/05', streak: 5 },
      { date: '03/05', streak: 2 },
      { date: '04/05', streak: 8 },
      { date: '05/05', streak: 6 },
    ],
  };
  
  export default function ProfileDashboard() {
    return (
      <div
        className="min-h-screen p-10 bg-gradient-to-br from-[#121212] to-[#1F2937] text-white"
        style={{ fontFamily: 'Helvetica World, Arial, sans-serif' }}
      >
        <h1 className="text-4xl font-bold mb-6">Dashboard Administrativo</h1>
        <p className="mb-10">Painel exclusivo para acompanhar dados gerais da comunidade FURIA.</p>
  
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Stat label="Total Usuários" value={mockStats.totalUsers} />
          <Stat label="Total Posts" value={mockStats.totalPosts} />
          <Stat label="Likes Distribuídos" value={mockStats.totalLikes} />
          <Stat label="Curtidas Post Top" value={mockStats.topPostLikes} />
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartBlock title="Faixa Etária">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={mockStats.ageGroups}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {mockStats.ageGroups.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartBlock>
  
          <ChartBlock title="Distribuição por Estado">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={mockStats.states}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {mockStats.states.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartBlock>
  
          <ChartBlock title="Top Hashtags">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mockStats.hashtags}>
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip />
                <Bar dataKey="value" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </ChartBlock>
  
          <ChartBlock title="Streak de Atividade">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={mockStats.streakActivity}>
                <XAxis dataKey="date" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip />
                <Area type="monotone" dataKey="streak" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartBlock>
        </div>
  
        <p className="text-sm mt-10 text-gray-400">
          * Dados simulados. Integração com backend em breve.
        </p>
      </div>
    );
  }
  
  function Stat({ label, value }: { label: string; value: number }) {
    return (
      <div className="p-4 rounded-lg bg-[#374151] shadow-lg text-center">
        <p className="text-lg font-semibold text-gray-300">{label}</p>
        <p className="text-3xl font-bold text-white mt-2">{value}</p>
      </div>
    );
  }
  
  function ChartBlock({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div className="p-6 bg-[#374151] rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-300 mb-4">{title}</h2>
        {children}
      </div>
    );
  }
  