import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, Button, Input, PageLoader } from '../components/UI';
import { mockApi } from '../services/mockApi';
import { Case, CaseStatus, CaseType } from '../types';
import { CheckCircle, Search, ArrowRight, Star } from 'lucide-react';

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

// Formatear fecha para resumen: d/M/yyyy
const formatResumenDate = (iso: string) => {
  const d = new Date(iso + 'T12:00:00');
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

// --- Success Page ---
export const SuccessPage: React.FC = () => {
  const location = useLocation();
  const caseData = location.state?.caseData as Case;
  const HORAS_CONFIRMACION = 24;

  if (!caseData) return <div className="p-8 text-center">No hay información de caso.</div>;

  const { client, product, location: loc, schedule, type, clientComments } = caseData;
  const nombreCompleto = `${client.firstName} ${client.lastName}`.trim();
  const direccionCompleta = [loc.address, loc.district?.toUpperCase(), loc.province?.toUpperCase(), loc.department?.toUpperCase()]
    .filter(Boolean)
    .join(', ');
  const rangoFechas = schedule.endDate
    ? `${formatResumenDate(schedule.date)} - ${formatResumenDate(schedule.endDate)}`
    : `${formatResumenDate(schedule.date)} (${schedule.slot})`;

  // Misma estructura de resumen para Reclamo e Instalación: mismos campos en el mismo orden; se ocultan filas opcionales si no hay dato
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
         {/* Columna izquierda: éxito, código y acciones — igual para ambos */}
         <Card className="p-10 text-center">
           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
              <CheckCircle size={48} />
           </div>
           <h1 className="text-2xl font-bold text-gray-900 mb-2">Registro exitoso</h1>
           <p className="text-gray-600 mb-6">
             Hemos recibido tu solicitud correctamente. Nuestro equipo validará la información en breve.
           </p>

           <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100">
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

         {/* Columna derecha: Resumen — misma plantilla para Reclamo e Instalación */}
         <div className="bg-[#1e3a5f] text-white rounded-[14px] shadow-sm border border-[#E6E8EF] p-6 text-left">
           <h2 className="text-lg font-bold mb-4">Resumen</h2>
           <dl className="space-y-3 text-sm">
             <div><dt className="text-white/80">Nombre completo</dt><dd className="font-medium">{nombreCompleto}</dd></div>
             <div><dt className="text-white/80">Tipo de documento</dt><dd className="font-medium">{client.docType}</dd></div>
             <div><dt className="text-white/80">Número del documento</dt><dd className="font-medium">{client.docNumber}</dd></div>
             <div><dt className="text-white/80">Dirección</dt><dd className="font-medium">{direccionCompleta}</dd></div>
             {loc.reference ? <div><dt className="text-white/80">Referencia</dt><dd className="font-medium">{loc.reference}</dd></div> : null}
             <div><dt className="text-white/80">Tipo de servicio</dt><dd className="font-medium">{type === CaseType.INSTALACION ? 'Instalación' : 'Reclamo'}</dd></div>
             <div><dt className="text-white/80">Categoría de producto</dt><dd className="font-medium text-emerald-300">{product.category}</dd></div>
             <div><dt className="text-white/80">Marca o marcas</dt><dd className="font-medium text-emerald-300">{product.brand}</dd></div>
             {product.wherePurchased ? <div><dt className="text-white/80">Tienda donde compró</dt><dd className="font-medium text-emerald-300">{product.wherePurchased}</dd></div> : null}
             {product.faultType ? <div><dt className="text-white/80">Tipo de falla</dt><dd className="font-medium text-emerald-300">{product.faultType}</dd></div> : null}
             {product.fault ? <div><dt className="text-white/80">Falla</dt><dd className="font-medium text-emerald-300">{product.fault}</dd></div> : null}
             {(product.recentlyInstalled !== undefined && product.recentlyInstalled !== null) ? <div><dt className="text-white/80">Recién instalado</dt><dd className="font-medium">{product.recentlyInstalled ? 'Sí' : 'No'}</dd></div> : null}
             {(product.timeValue || product.timeUnit) ? <div><dt className="text-white/80">Tiempo</dt><dd className="font-medium">{product.timeValue || '—'} {product.timeUnit || ''}</dd></div> : null}
             <div>
               <dt className="text-white/80">{schedule.endDate ? 'Rango de fecha seleccionado' : 'Fecha seleccionada'}</dt>
               <dd className="font-medium">{rangoFechas}</dd>
             </div>
             {clientComments ? <div><dt className="text-white/80">Comentarios</dt><dd className="font-medium text-white/95">{clientComments}</dd></div> : null}
           </dl>
           <hr className="border-white/20 my-4" />
           <p className="text-sm text-white/90">
             Estamos procesando su solicitud, y máximo en <strong className="text-emerald-300">[{HORAS_CONFIRMACION}]</strong> horas le llegará un WhatsApp confirmando la fecha de atención.
           </p>
         </div>
       </div>
    </div>
  );
};

// --- Tracking Page ---
export const TrackingPage: React.FC = () => {
  const [search, setSearch] = useState({ caseNumber: '', docNumber: '' });
  const [result, setResult] = useState<Case | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showNPS, setShowNPS] = useState(false);
  const [npsScore, setNpsScore] = useState<number | null>(null);
  const [npsLoading, setNpsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    setShowNPS(false);
    try {
      const found = await mockApi.getCaseByNumberAndDoc(search.caseNumber, search.docNumber);
      setResult(found);
      // Mostrar encuesta NPS si el caso está cerrado y no tiene NPS
      if (found && found.status === CaseStatus.CERRADO && !found.npsScore) {
        setShowNPS(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitNPS = async () => {
    if (!result || npsScore === null) return;
    setNpsLoading(true);
    try {
      const updated = await mockApi.updateCaseNPS(result.id, npsScore);
      setResult(updated);
      setShowNPS(false);
    } finally {
      setNpsLoading(false);
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
        <>
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

                {result.status === CaseStatus.CERRADO && result.npsScore && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 font-medium mb-1">Encuesta NPS completada</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-700">{result.npsScore}</span>
                      <span className="text-sm text-green-600">/ 10</span>
                      <div className="flex gap-1 ml-2">
                        {[...Array(10)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={i < result.npsScore ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
             </div>
          </Card>

          {showNPS && result.status === CaseStatus.CERRADO && !result.npsScore && (
            <Card className="p-6 mt-6 border-2 border-primary">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">¿Cómo calificarías nuestro servicio?</h3>
                <p className="text-sm text-gray-600">Tu opinión nos ayuda a mejorar</p>
              </div>

              <div className="mb-6">
                <div className="flex justify-center gap-2 mb-4">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                    <button
                      key={score}
                      onClick={() => setNpsScore(score)}
                      className={`w-12 h-12 rounded-lg border-2 font-bold text-sm transition-all ${
                        npsScore === score
                          ? 'bg-primary text-white border-primary scale-110'
                          : 'bg-white border-gray-300 hover:border-primary hover:bg-primary/5'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
                {npsScore !== null && (
                  <p className="text-center text-sm text-gray-600">
                    {npsScore <= 6 ? '😞 Necesitamos mejorar' : npsScore <= 8 ? '😊 Bien' : '😄 Excelente'}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setShowNPS(false);
                    setNpsScore(null);
                  }}
                >
                  Omitir
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleSubmitNPS}
                  isLoading={npsLoading}
                  disabled={npsScore === null}
                >
                  Enviar Calificación
                </Button>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};