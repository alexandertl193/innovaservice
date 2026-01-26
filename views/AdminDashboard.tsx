import React, { useEffect, useState } from 'react';
import { Card, PageLoader } from '../components/UI';
import { mockApi } from '../services/mockApi';
import { DashboardStats } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';

const KPICard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <Card className="p-6 flex items-center justify-between">
     <div>
       <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
       <p className="text-2xl font-bold text-gray-900">{value}</p>
     </div>
     <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
        {icon}
     </div>
  </Card>
);

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.getDashboardStats().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) return <PageLoader />;

  const pieData = [
    { name: 'Abiertos', value: stats.openCases },
    { name: 'Cerrados', value: stats.closedCases },
  ];
  const COLORS = ['#7C3AED', '#10B981'];

  const barData = [
    { name: 'Reclamos', count: stats.totalReclamos },
    { name: 'Instalaciones', count: stats.totalInstalaciones },
  ];

  // Datos por mes para gráfico
  const monthlyData = stats.casesByMonth 
    ? stats.casesByMonth
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-6) // Últimos 6 meses
        .map(item => ({
          month: new Date(item.month + '-01').toLocaleDateString('es-PE', { month: 'short', year: '2-digit' }),
          Reclamos: item.reclamos,
          Instalaciones: item.instalaciones,
        }))
    : [];

  return (
    <div className="space-y-6">
       <h1 className="text-2xl font-bold text-gray-900">Resumen General</h1>
       
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <KPICard title="Total Reclamos" value={stats.totalReclamos} icon={<FileText className="text-orange-600" />} color="bg-orange-100" />
          <KPICard title="Total Instalaciones" value={stats.totalInstalaciones} icon={<Users className="text-blue-600" />} color="bg-blue-100" />
          <KPICard title="NPS Promedio" value={stats.npsScore} icon={<CheckCircle className="text-green-600" />} color="bg-green-100" />
          <KPICard title="Tiempo Prom. Programación" value={`${stats.avgResponseTime}h`} icon={<Clock className="text-purple-600" />} color="bg-purple-100" />
          {stats.avgAtencionTime && (
            <KPICard title="Tiempo Prom. Atención" value={`${stats.avgAtencionTime}h`} icon={<Clock className="text-indigo-600" />} color="bg-indigo-100" />
          )}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {monthlyData.length > 0 ? (
            <Card className="p-6 h-[400px]">
               <h3 className="text-lg font-bold mb-6">Casos por Mes (Últimos 6 meses)</h3>
               <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={monthlyData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                     <XAxis dataKey="month" tick={{fill: '#6B7280', fontSize: 12}} axisLine={false} />
                     <YAxis tick={{fill: '#6B7280'}} axisLine={false} />
                     <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                     <Legend />
                     <Bar dataKey="Reclamos" fill="#EF4444" radius={[4, 4, 0, 0]} />
                     <Bar dataKey="Instalaciones" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </Card>
          ) : (
            <Card className="p-6 h-[400px]">
               <h3 className="text-lg font-bold mb-6">Volumen por Tipo de Servicio</h3>
               <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={barData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                     <XAxis dataKey="name" tick={{fill: '#6B7280'}} axisLine={false} />
                     <YAxis tick={{fill: '#6B7280'}} axisLine={false} />
                     <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                     <Bar dataKey="count" fill="#7C3AED" radius={[4, 4, 0, 0]} barSize={60} />
                  </BarChart>
               </ResponsiveContainer>
            </Card>
          )}

          <Card className="p-6 h-[400px]">
             <h3 className="text-lg font-bold mb-6">Estado de Casos</h3>
             <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                   <Pie
                     data={pieData}
                     cx="50%"
                     cy="50%"
                     innerRadius={80}
                     outerRadius={120}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {pieData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip />
                   <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
             </ResponsiveContainer>
          </Card>
       </div>
    </div>
  );
};