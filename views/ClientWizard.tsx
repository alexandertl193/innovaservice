import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Select, MockMap } from '../components/UI';
import { CaseType, Case } from '../types';
import { mockApi } from '../services/mockApi';
import { Check, ChevronRight, AlertCircle, Wrench, FileWarning, Calendar } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Tipo de Solicitud' },
  { id: 2, title: 'Datos Generales' },
  { id: 3, title: 'Ubicación' },
  { id: 4, title: 'Agendamiento' }
];

export const ClientWizard: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    type: '' as CaseType | '',
    firstName: '',
    lastName: '',
    docType: 'DNI',
    docNumber: '',
    email: '',
    phone: '',
    productCategory: '',
    productBrand: '',
    productModel: '',
    department: 'Lima',
    province: 'Lima',
    district: '',
    address: '',
    reference: '',
    lat: -12.0464,
    lng: -77.0428,
    scheduleDate: '',
    scheduleSlot: '',
  });

  const updateData = (data: any) => setFormData(prev => ({ ...prev, ...data }));

  const validateStep = (step: number) => {
    setError(null);
    if (step === 1) {
      if (!formData.type) return "Seleccione un tipo de solicitud";
    }
    if (step === 2) {
      if (!formData.firstName || !formData.lastName) return "Nombre completo requerido";
      if (!formData.docNumber) return "Documento requerido";
      if (formData.docType === 'DNI' && !/^\d{8}$/.test(formData.docNumber)) return "DNI debe tener 8 dígitos";
      if (formData.docType === 'RUC' && !/^\d{11}$/.test(formData.docNumber)) return "RUC debe tener 11 dígitos";
      if (!formData.email || !formData.email.includes('@')) return "Email inválido";
      if (!formData.phone || !/^\d{9}$/.test(formData.phone)) return "Celular debe tener 9 dígitos";
      if (!formData.productCategory || !formData.productBrand) return "Datos del producto requeridos";
    }
    if (step === 3) {
      if (!formData.district || !formData.address) return "Dirección requerida";
    }
    if (step === 4) {
      if (!formData.scheduleDate || !formData.scheduleSlot) return "Seleccione fecha y horario";
    }
    return null;
  };

  const handleNext = async () => {
    const err = validateStep(currentStep);
    if (err) {
      setError(err);
      return;
    }

    if (currentStep === 4) {
      handleSubmit();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const newCase = await mockApi.createCase({
        type: formData.type as CaseType,
        client: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          docType: formData.docType as 'DNI' | 'RUC',
          docNumber: formData.docNumber,
          email: formData.email,
          phone: formData.phone,
        },
        product: {
          category: formData.productCategory,
          brand: formData.productBrand,
          model: formData.productModel,
        },
        location: {
          department: formData.department,
          province: formData.province,
          district: formData.district,
          address: formData.address,
          reference: formData.reference,
          lat: formData.lat,
          lng: formData.lng,
        },
        schedule: {
          date: formData.scheduleDate,
          slot: formData.scheduleSlot as 'AM' | 'PM',
        }
      });
      navigate('/success', { state: { caseData: newCase } });
    } catch (e) {
      setError("Error al registrar el caso. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10" />
          {STEPS.map((step) => {
            const active = step.id <= currentStep;
            return (
              <div key={step.id} className="flex flex-col items-center bg-[#F6F7FB] px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${active ? 'bg-primary text-white ring-4 ring-primary/20' : 'bg-gray-300 text-gray-500'}`}>
                  {active && step.id < currentStep ? <Check size={16} /> : step.id}
                </div>
                <span className={`text-xs mt-2 font-medium ${active ? 'text-primary' : 'text-gray-400'}`}>{step.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      <Card className="p-8">
        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg flex items-center text-sm border border-red-100">
            <AlertCircle size={18} className="mr-2" />
            {error}
          </div>
        )}

        {/* Step 1: Type Selection */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => updateData({ type: CaseType.RECLAMO })}
              className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center text-center hover:shadow-md ${formData.type === CaseType.RECLAMO ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/50'}`}
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                <FileWarning size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Registrar Reclamo</h3>
              <p className="text-sm text-gray-500 mt-2">Reportar una falla o problema con un producto adquirido.</p>
            </button>

            <button
              onClick={() => updateData({ type: CaseType.INSTALACION })}
              className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center text-center hover:shadow-md ${formData.type === CaseType.INSTALACION ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/50'}`}
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-primary mb-4">
                <Wrench size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Solicitar Instalación</h3>
              <p className="text-sm text-gray-500 mt-2">Programar la visita de un técnico para instalar su producto.</p>
            </button>
          </div>
        )}

        {/* Step 2: Data */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="font-bold text-gray-800 border-b pb-2">Datos del Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nombres" value={formData.firstName} onChange={e => updateData({ firstName: e.target.value })} />
              <Input label="Apellidos" value={formData.lastName} onChange={e => updateData({ lastName: e.target.value })} />
              <div className="flex gap-2">
                <Select className="w-[100px]" options={[{ value: 'DNI', label: 'DNI' }, { value: 'RUC', label: 'RUC' }]} value={formData.docType} onChange={e => updateData({ docType: e.target.value })} />
                <Input className="flex-1" label="Documento" value={formData.docNumber} onChange={e => updateData({ docNumber: e.target.value })} />
              </div>
              <Input label="Celular" value={formData.phone} onChange={e => updateData({ phone: e.target.value })} maxLength={9} />
              <Input label="Email" type="email" className="md:col-span-2" value={formData.email} onChange={e => updateData({ email: e.target.value })} />
            </div>

            <h3 className="font-bold text-gray-800 border-b pb-2 pt-4">Datos del Producto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select label="Categoría" options={[{ value: 'Griferia', label: 'Grifería' }, { value: 'Sanitarios', label: 'Sanitarios' }, { value: 'Accesorios', label: 'Accesorios' }]} value={formData.productCategory} onChange={e => updateData({ productCategory: e.target.value })} />
              <Select label="Marca" options={[{ value: 'Vainsa', label: 'Vainsa' }, { value: 'Italgrif', label: 'Italgrif' }]} value={formData.productBrand} onChange={e => updateData({ productBrand: e.target.value })} />
              <Input label="Modelo / Código" className="md:col-span-2" value={formData.productModel} onChange={e => updateData({ productModel: e.target.value })} />
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {currentStep === 3 && (
          <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <Input label="Departamento" value={formData.department} disabled className="bg-gray-50" />
               <Input label="Provincia" value={formData.province} disabled className="bg-gray-50" />
               <Select label="Distrito" options={[{ value: 'Miraflores', label: 'Miraflores' }, { value: 'Surco', label: 'Surco' }, { value: 'San Isidro', label: 'San Isidro' }, { value: 'La Molina', label: 'La Molina' }]} value={formData.district} onChange={e => updateData({ district: e.target.value })} />
             </div>
             <Input label="Dirección Exacta" value={formData.address} onChange={e => updateData({ address: e.target.value })} />
             <Input label="Referencia" value={formData.reference} onChange={e => updateData({ reference: e.target.value })} />
             
             <div className="pt-2">
               <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Ubicación en Mapa (Referencial)</label>
               <MockMap lat={formData.lat} lng={formData.lng} onChange={(lat, lng) => updateData({ lat, lng })} />
             </div>
          </div>
        )}

        {/* Step 4: Schedule */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="font-bold text-gray-800">Seleccione Disponibilidad</h3>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-sm text-yellow-800 flex items-start">
               <Calendar className="mr-2 flex-shrink-0" size={18} />
               Los horarios mostrados son referenciales y serán confirmados por nuestro equipo en las próximas 24 horas.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <Input type="date" label="Fecha Preferida" min={new Date().toISOString().split('T')[0]} value={formData.scheduleDate} onChange={e => updateData({ scheduleDate: e.target.value })} />
               <div className="md:col-span-2">
                 <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Bloque Horario</label>
                 <div className="flex gap-4">
                    <button 
                      onClick={() => updateData({ scheduleSlot: 'AM' })}
                      className={`flex-1 py-3 rounded-lg border text-sm font-medium ${formData.scheduleSlot === 'AM' ? 'bg-primary text-white border-primary' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                    >
                      Mañana (8:00 - 13:00)
                    </button>
                    <button 
                      onClick={() => updateData({ scheduleSlot: 'PM' })}
                      className={`flex-1 py-3 rounded-lg border text-sm font-medium ${formData.scheduleSlot === 'PM' ? 'bg-primary text-white border-primary' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                    >
                      Tarde (14:00 - 18:00)
                    </button>
                 </div>
               </div>
            </div>

            <div className="mt-8 border-t pt-6">
               <h4 className="font-bold text-gray-900 mb-4">Resumen de Solicitud</h4>
               <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
                 <div className="flex justify-between"><span className="text-gray-500">Tipo:</span> <span className="font-medium">{formData.type}</span></div>
                 <div className="flex justify-between"><span className="text-gray-500">Cliente:</span> <span className="font-medium">{formData.firstName} {formData.lastName}</span></div>
                 <div className="flex justify-between"><span className="text-gray-500">Contacto:</span> <span className="font-medium">{formData.phone}</span></div>
                 <div className="flex justify-between"><span className="text-gray-500">Producto:</span> <span className="font-medium">{formData.productBrand} - {formData.productModel}</span></div>
                 <div className="flex justify-between"><span className="text-gray-500">Fecha:</span> <span className="font-medium">{formData.scheduleDate} ({formData.scheduleSlot})</span></div>
               </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-4 border-t">
           <Button 
             variant="outline" 
             onClick={() => currentStep > 1 ? setCurrentStep(p => p - 1) : navigate('/')}
             disabled={isLoading}
            >
             {currentStep === 1 ? 'Cancelar' : 'Atrás'}
           </Button>

           <Button onClick={handleNext} isLoading={isLoading}>
             {currentStep === 4 ? 'Confirmar Registro' : 'Siguiente'} <ChevronRight className="ml-2 w-4 h-4" />
           </Button>
        </div>
      </Card>
    </div>
  );
};
