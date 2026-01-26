import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Input, StatusBadge, PageLoader } from '../components/UI';
import { mockApi } from '../services/mockApi';
import { Case } from '../types';
import { CheckCircle, Search, ArrowRight, Home } from 'lucide-react';

// --- Landing Page ---
export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Centro de Servicios Innova</h1>
        <p className="text-lg text-gray-600">
          Gestiona tus reclamos e instalaciones de forma rápida y sencilla. Estamos aquí para ayudarte.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        <Card className="p-8 hover:shadow-lg transition-shadow border-t-4 border-t-primary cursor-pointer group">
          <div className="h-full flex flex-col items-start">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">Nueva Solicitud</h2>
            <p className="text-gray-500 mb-6 flex-1">Registra un reclamo técnico o solicita la instalación de tus productos Vainsa/Italgrif.</p>
            <Link to="/wizard" className="w-full">
              <Button className="w-full">Iniciar Trámite <ArrowRight className="ml-2 w-4 h-4" /></Button>
            </Link>
          </div>
        </Card>

        <Card className="p-8 hover:shadow-lg transition-shadow border-t-4 border-t-purple-400">
          <div className="h-full flex flex-col items-start">
             <h2 className="text-2xl font-bold text-gray-800 mb-2">Seguimiento</h2>
             <p className="text-gray-500 mb-6 flex-1">Consulta el estado actual de tu solicitud usando tu número de caso y documento.</p>
             <Link to="/tracking" className="w-full">
               <Button variant="outline" className="w-full">Consultar Estado</Button>
             </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- Success Page ---
export const SuccessPage: React.FC = () => {
  const location = useLocation();
  const caseData = location.state?.caseData as Case;

  if (!caseData) return <div className="p-8 text-center">No hay información de caso.</div>;

  return (
    <div className="max-w-xl mx-auto py-12">
       <Card className="p-10 text-center">
         <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
            <CheckCircle size={48} />
         </div>
         <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Solicitud Registrada!</h1>
         <p className="text-gray-600 mb-8">
           Hemos recibido tu solicitud correctamente. Nuestro equipo validará la información en breve.
         </p>

         <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
            <p className="text-sm text-gray-500 uppercase font-bold mb-1">Código de Seguimiento</p>
            <p className="text-3xl font-mono font-bold text-primary tracking-wider">{caseData.caseNumber}</p>
         </div>

         <div className="space-y-3">
            <Link to="/tracking">
              <Button className="w-full">Ver Estado de mi Caso</Button>
            </Link>
            <Link to="/">
              <Button variant="secondary" className="w-full">Volver al Inicio</Button>
            </Link>
         </div>
       </Card>
    </div>
  );
};

// --- Tracking Page ---
export const TrackingPage: React.FC = () => {
  const [search, setSearch] = useState({ caseNumber: '', docNumber: '' });
  const [result, setResult] = useState<Case | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const found = await mockApi.getCaseByNumberAndDoc(search.caseNumber, search.docNumber);
      setResult(found);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Seguimiento de Caso</h1>
      
      <Card className="p-6 mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
           <Input 
             label="Número de Caso" 
             placeholder="Ej: INN-2024-..." 
             value={search.caseNumber}
             onChange={e => setSearch(p => ({ ...p, caseNumber: e.target.value }))}
             required
           />
           <Input 
             label="Documento (DNI/RUC)" 
             placeholder="Mismo usado en registro" 
             value={search.docNumber}
             onChange={e => setSearch(p => ({ ...p, docNumber: e.target.value }))}
             required
           />
           <Button type="submit" className="md:col-span-2 mt-2" isLoading={loading}>
             <Search size={18} className="mr-2" /> Buscar Caso
           </Button>
        </form>
      </Card>

      {loading && <PageLoader />}

      {!loading && searched && !result && (
        <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
           <p className="text-gray-500">No se encontró ningún caso con esos datos.</p>
        </div>
      )}

      {!loading && result && (
        <Card className="p-0 overflow-hidden">
           <div className="bg-primary p-6 text-white flex justify-between items-center">
              <div>
                <p className="text-primary-100 text-sm">Caso #{result.caseNumber}</p>
                <h2 className="text-xl font-bold">{result.type}</h2>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded text-sm font-medium backdrop-blur-sm">
                 {result.status.replace(/_/g, ' ')}
              </div>
           </div>
           
           <div className="p-6">
              <div className="mb-6">
                 <h3 className="font-bold text-gray-900 mb-3 border-b pb-2">Línea de Tiempo</h3>
                 <div className="space-y-4">
                    {result.history.map((h, i) => (
                      <div key={i} className="flex gap-4">
                         <div className="flex flex-col items-center">
                            <div className="w-3 h-3 bg-primary rounded-full mt-1.5" />
                            {i < result.history.length - 1 && <div className="w-0.5 bg-gray-200 flex-1 my-1" />}
                         </div>
                         <div className="pb-4">
                            <p className="text-sm font-medium text-gray-900">{h.action}</p>
                            <p className="text-xs text-gray-500">{new Date(h.date).toLocaleString()} - {h.user}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                 <div>
                   <span className="text-gray-500 block">Producto</span>
                   <span className="font-medium">{result.product.brand} - {result.product.model}</span>
                 </div>
                 <div>
                   <span className="text-gray-500 block">Fecha Programada</span>
                   <span className="font-medium">{result.schedule.date} ({result.schedule.slot})</span>
                 </div>
              </div>
           </div>
        </Card>
      )}
    </div>
  );
};