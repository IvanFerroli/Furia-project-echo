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
            className="min-h-screen p-10 bg-white text-black"

            style={{ fontFamily: 'Helvetica World, Arial, sans-serif' }}
        >
            <h1 className="text-4xl font-bold mb-6">Dashboard Administrativo</h1>
            <p className="mb-10">Painel exclusivo para acompanhar dados gerais da comunidade FURIA.</p>

            <div style={{ marginTop: '30px' }}>
                <ChartBlock>
                    <div className="w-full flex flex-col items-center">
                        <ResponsiveContainer width="90%" height={250}>
                            <BarChart data={mockStats.hashtags}>
                                <XAxis dataKey="name" stroke="#fff" />
                                <YAxis stroke="#fff" />
                                <Tooltip />
                                <Bar dataKey="value" fill="#a855f7" />
                            </BarChart>
                        </ResponsiveContainer>
                        <p className="text-lg text-[#a855f7] mt-2">Hashtags Mais Usadas</p>
                    </div>

                    <div className="w-full flex flex-col items-center">
                        <ResponsiveContainer width="90%" height={250}>
                            <AreaChart data={mockStats.streakActivity}>
                                <XAxis dataKey="date" stroke="#fff" />
                                <YAxis stroke="#fff" />
                                <Tooltip />
                                <Area type="monotone" dataKey="streak" stroke="#4ade80" fill="#4ade80" />
                            </AreaChart>
                        </ResponsiveContainer>
                        <p className="text-lg text-[#4ade80] mt-2">Streak de Atividade</p>
                    </div>
                </ChartBlock>
            </div>

            <div
                style={{ height: '600px', width: '95%', marginTop: '30px' }}
                className="flex flex-wrap justify-between gap-10 bg-white p-6 rounded-2xl shadow-lg mb-10 max-w-6xl mx-auto"
            >
                <StatBox label="Total Usuários" value={mockStats.totalUsers} />
                <StatBox label="Total Posts" value={mockStats.totalPosts} />
                <StatBox label="Likes Distribuídos" value={mockStats.totalLikes} />
                <StatBox label="Curtidas Post Top" value={mockStats.topPostLikes} />
            </div>




            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div
                    style={{ height: '400px', width: '95%', marginTop: '20px' }}
                    className="flex flex-wrap justify-between gap-10 bg-white p-6 rounded-2xl shadow-lg mb-10 mx-auto"
                >
                    <ChartCard title="Faixa Etária">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={mockStats.ageGroups} dataKey="value" nameKey="name" outerRadius={70} label>
                                    {mockStats.ageGroups.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title="Distribuição por Estado">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={mockStats.states} dataKey="value" nameKey="name" outerRadius={70} label>
                                    {mockStats.states.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>




            </div>

            <p className="text-sm mt-10 text-gray-400">
                * Dados simulados. Integração com backend em breve.
            </p>
        </div>
    );
}

function StatBox({ label, value }: { label: string; value: number }) {
    return (
        <div className="bg-[#111827] text-[#f3f4f6] rounded-[2rem] shadow-[0_15px_35px_rgba(0,0,0,0.5)] w-[48%] h-[275px] flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.03]">
            <p className="text-[72px] font-extrabold leading-tight text-[#a855f7]">{value}</p>
            <p className="text-xl font-medium mt-6 text-[#c084fc]">{label}</p>
        </div>
    );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-[#1e1e1e] text-[#8884d8] rounded-[2rem] shadow-[0_15px_35px_rgba(0,0,0,0.5)] w-[48%] h-[370px] flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.03]">
            <div className="w-full h-[400px] flex items-center justify-center">
                {children}
            </div>
            <p style={{ height: '100px' }} className="text-xl font-medium mt-6">{title}</p>
        </div>
    );
}



function ChartBlock({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-[#0f172a] text-[#f3f4f6] rounded-[2rem] shadow-[0_15px_35px_rgba(0,0,0,0.5)] w-[95%] h-[650px] mx-auto mb-10 flex flex-col justify-evenly items-center transition-all duration-300 hover:scale-[1.01]">
            {children}
        </div>
    );
}

