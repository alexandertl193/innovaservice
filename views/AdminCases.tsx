import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Input, Select, StatusBadge, PageLoader } from '../components/UI';
import { mockApi } from '../services/mockApi';
import { Case, CaseStatus } from '../types';
import { Eye, ArrowLeft, Send, CheckSquare, Truck, Archive } from 'lucide-react';

// --- Case List View ---
export const AdminCaseList: React.FC = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '' });

  const fetchCases = async () => {
    setLoading(true);
    const data = await mockApi.getCases(filters);
    setCases(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCases();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Casos</h1>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <Input 
             placeholder="Buscar por cliente, código..." 
             value={filters.search}
             onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
             className="md:w-96"
          />
          <Select 
             options={Object.values(CaseStatus).map(s => ({ value: s, label: s.replace(/_/g, ' ') }))}
             value={filters.status}
             onChange={e => setFilters(p => ({ ...p, status: e.target.value }))}
             className="md:w-64"
          />
          <Button onClick={fetchCases}>Filtrar</Button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center"><PageLoader /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Código</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cases.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-primary">{c.caseNumber}</td>
                    <td className="px-6 py-4">{c.client.lastName}, {c.client.firstName}</td>
                    <td className="px-6 py-4">{c.type}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                    <td className="px-6 py-4 text-right">
                       <button 
                         onClick={() => navigate(`/admin/cases/${c.id}`)}
                         className="text-gray-400 hover:text-primary transition-colors"
                       >
                         <Eye size={20} />
                       </button>
                    </td>
                  </tr>
                ))}
                {cases.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">No se encontraron casos</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

// --- Case Detail View ---
export const AdminCaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      mockApi.getCaseById(id).then(c => {
         setCaseData(c || null);
         setLoading(false);
      });
    }
  }, [id]);

  const handleStatusChange = async (newStatus: CaseStatus, comment: string) => {
    if (!caseData) return;
    setActionLoading(true);
    try {
      const updated = await mockApi.updateCaseStatus(caseData.id, newStatus, comment);
      setCaseData(updated);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!caseData) return <div>Caso no encontrado</div>;

  return (
    <div className="space-y-6">
       <button onClick={() => navigate('/admin/cases')} className="flex items-center text-gray-500 hover:text-primary transition-colors mb-4">
         <ArrowLeft size={18} className="mr-1" /> Volver a la lista
       </button>

       <div className="flex flex-col lg:flex-row gap-6">
         {/* Main Info */}
         <div className="flex-1 space-y-6">
            <Card className="p-6">
               <div className="flex justify-between items-start mb-6 border-b pb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Caso #{caseData.caseNumber}</h1>
                    <div className="flex items-center gap-2">
                       <span className="text-sm text-gray-500">{new Date(caseData.createdAt).toLocaleString()}</span>
                       <span className="text-gray-300">•</span>
                       <span className="font-medium text-gray-700">{caseData.type}</span>
                    </div>
                  </div>
                  <StatusBadge status={caseData.status} />
               </div>

               <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                     <h3 className="font-bold text-gray-900 mb-3 uppercase text-xs tracking-wider">Cliente</h3>
                     <p className="font-medium text-lg">{caseData.client.firstName} {caseData.client.lastName}</p>
                     <p className="text-gray-500">{caseData.client.docType}: {caseData.client.docNumber}</p>
                     <p className="text-gray-500">{caseData.client.email}</p>
                     <p className="text-gray-500">{caseData.client.phone}</p>
                  </div>
                  <div>
                     <h3 className="font-bold text-gray-900 mb-3 uppercase text-xs tracking-wider">Producto</h3>
                     <p className="font-medium">{caseData.product.brand} - {caseData.product.model}</p>
                     <p className="text-gray-500">{caseData.product.category}</p>
                  </div>
               </div>
            </Card>

            <Card className="p-6">
               <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Ubicación y Agenda</h3>
               <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="font-medium">{caseData.location.address}</p>
                    <p className="text-gray-500">{caseData.location.district}, {caseData.location.province}</p>
                    <p className="text-gray-400 italic mt-1">Ref: {caseData.location.reference}</p>
                  </div>
                  <div>
                    <div className="bg-purple-50 p-3 rounded-lg text-purple-900 border border-purple-100">
                      <p className="font-bold">Fecha Solicitada:</p>
                      <p>{caseData.schedule.date}</p>
                      <p>Turno: {caseData.schedule.slot}</p>
                    </div>
                  </div>
               </div>
            </Card>

            <Card className="p-6">
               <h3 className="font-bold text-gray-900 mb-4">Historial</h3>
               <div className="space-y-6 pl-2 border-l-2 border-gray-100">
                  {caseData.history.map((h, i) => (
                    <div key={i} className="relative pl-6">
                       <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-gray-200 border-2 border-white" />
                       <p className="text-sm font-medium text-gray-900">{h.action}</p>
                       <p className="text-xs text-gray-500">{new Date(h.date).toLocaleString()} por <span className="font-medium">{h.user}</span></p>
                    </div>
                  ))}
               </div>
            </Card>
         </div>

         {/* Sidebar Actions */}
         <div className="w-full lg:w-80 space-y-6">
            <Card className="p-6">
               <h3 className="font-bold text-gray-900 mb-4">Acciones Rápidas</h3>
               <div className="space-y-3">
                  {caseData.status === CaseStatus.NUEVO && (
                     <Button 
                       className="w-full justify-start" 
                       onClick={() => handleStatusChange(CaseStatus.PENDIENTE_VALIDACION, 'Iniciando validación')}
                       isLoading={actionLoading}
                     >
                       <CheckSquare size={16} className="mr-2" /> Validar Información
                     </Button>
                  )}
                  {caseData.status === CaseStatus.PENDIENTE_VALIDACION && (
                     <Button 
                       className="w-full justify-start" 
                       onClick={() => handleStatusChange(CaseStatus.PROGRAMADO, 'Fecha confirmada')}
                       isLoading={actionLoading}
                     >
                       <CheckSquare size={16} className="mr-2" /> Confirmar Programación
                     </Button>
                  )}
                  {caseData.status === CaseStatus.PROGRAMADO && (
                     <Button 
                       className="w-full justify-start" 
                       onClick={() => handleStatusChange(CaseStatus.TECNICO_EN_CAMINO, 'Técnico despachado')}
                       isLoading={actionLoading}
                     >
                       <Truck size={16} className="mr-2" /> Técnico en Camino
                     </Button>
                  )}
                   {caseData.status === CaseStatus.TECNICO_EN_CAMINO && (
                     <Button 
                       className="w-full justify-start" 
                       onClick={() => handleStatusChange(CaseStatus.ATENDIDO, 'Servicio finalizado')}
                       isLoading={actionLoading}
                     >
                       <CheckSquare size={16} className="mr-2" /> Marcar Atendido
                     </Button>
                  )}
                  {caseData.status === CaseStatus.ATENDIDO && (
                     <Button 
                       className="w-full justify-start" variant="outline"
                       onClick={() => handleStatusChange(CaseStatus.CERRADO, 'Caso cerrado administrativamente')}
                       isLoading={actionLoading}
                     >
                       <Archive size={16} className="mr-2" /> Cerrar Caso
                     </Button>
                  )}
                  
                  <div className="border-t pt-3 mt-3">
                     <Button variant="danger" className="w-full justify-start text-sm h-10" disabled>Cancelar Solicitud</Button>
                  </div>
               </div>
            </Card>
            
            <Card className="p-6">
               <h3 className="font-bold text-gray-900 mb-2">Notas Internas</h3>
               <textarea className="w-full border rounded-lg p-3 text-sm h-24 mb-2" placeholder="Escribir nota..." />
               <Button variant="secondary" className="w-full h-9 text-xs">Agregar Nota</Button>
            </Card>
         </div>
       </div>
    </div>
  );
};
