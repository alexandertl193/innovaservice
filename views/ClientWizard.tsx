import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Select, MockMap, FileInput, Textarea, DateRangeCalendar } from '../components/UI';
import { CaseType } from '../types';
import { mockApi } from '../services/mockApi';
import { Check, ChevronRight, AlertCircle, Wrench, FileWarning } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Tipo de Servicio' },
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
    fullName: '', // instalación: "Nombres y apellidos"
    docType: 'DNI',
    docNumber: '',
    email: '',
    phone: '',
    phone2: '', // instalación
    productCategory: '',
    productBrand: '',
    productModel: '',
    productTypology: '',
    productSerialNumber: '',
    productPurchaseDate: '',
    quantityProducts: '', // instalación
    wherePurchased: '',   // instalación: ¿Dónde compraste?
    productPhotoFile: null as File | null,
    saleReceiptFile: null as File | null,
    // Reclamo paso 2
    faultType: '',
    fault: '',
    recentlyInstalled: false,
    timeValue: '',
    timeUnit: '',
    department: 'Lima',
    province: 'Lima',
    district: '',
    address: '',
    reference: '',
    lat: -12.0464,
    lng: -77.0428,
    scheduleDate: '',
    scheduleSlot: '',
    // Instalación paso 4
    scheduleStartDate: '',
    scheduleEndDate: '',
    comments: '',
    privacyAccepted: false,
  });

  const updateData = (data: Partial<typeof formData>) => setFormData(prev => ({ ...prev, ...data }));

  const validateStep = (step: number) => {
    setError(null);
    if (step === 1) {
      if (!formData.type) return "Seleccione un tipo de solicitud";
    }
    if (step === 2) {
      if (formData.type === CaseType.INSTALACION) {
        if (!formData.fullName?.trim()) return "Nombres y apellidos requeridos";
        if (!formData.docType || !formData.docNumber) return "Tipo y número de documento requeridos";
        if (formData.docType === 'DNI' && !/^\d{8}$/.test(formData.docNumber)) return "DNI debe tener 8 dígitos";
        if (formData.docType === 'RUC' && !/^\d{11}$/.test(formData.docNumber)) return "RUC debe tener 11 dígitos";
        if (!formData.phone || !/^\d{9}$/.test(formData.phone)) return "Teléfono 1 debe tener 9 dígitos";
        if (formData.email && !formData.email.includes('@')) return "Email inválido";
        if (!formData.productBrand) return "Marca requerida";
        if (!formData.productCategory) return "Tipo producto requerido";
        const qty = parseInt(formData.quantityProducts || '0', 10);
        if (!formData.quantityProducts || isNaN(qty) || qty < 1) return "Cantidad de productos requerida (mínimo 1)";
        if (!formData.wherePurchased) return "Indique dónde compró sus productos";
      } else {
        // Reclamo
        if (!formData.fullName?.trim()) return "Nombres y apellidos requeridos";
        if (!formData.docType || !formData.docNumber) return "Tipo y número de documento requeridos";
        if (formData.docType === 'DNI' && !/^\d{8}$/.test(formData.docNumber)) return "DNI debe tener 8 dígitos";
        if (formData.docType === 'RUC' && !/^\d{11}$/.test(formData.docNumber)) return "RUC debe tener 11 dígitos";
        if (!formData.phone || !/^\d{9}$/.test(formData.phone)) return "Teléfono 1 debe tener 9 dígitos";
        if (formData.email && !formData.email.includes('@')) return "Email inválido";
        if (!formData.productCategory) return "Tipo producto requerido";
        if (!formData.productBrand) return "Marca requerida";
        const qty = parseInt(formData.quantityProducts || '0', 10);
        if (!formData.quantityProducts || isNaN(qty) || qty < 1) return "Cantidad de productos requerida (mínimo 1)";
        if (!formData.productPhotoFile) return "Adjunte foto de sus productos";
        if (!formData.faultType) return "Seleccione el tipo de falla";
        if (!formData.timeValue?.trim() || !formData.timeUnit) return "Indique el tiempo (número y Meses/Años)";
      }
    }
    if (step === 3) {
      if (!formData.district || !formData.address) return "Dirección requerida";
    }
    if (step === 4) {
      if (!formData.scheduleStartDate || !formData.scheduleEndDate) return "Seleccione el rango de fechas deseado";
      if (formData.scheduleStartDate > formData.scheduleEndDate) return "La fecha final debe ser igual o posterior a la inicial";
      if (!formData.privacyAccepted) return "Debe aceptar la política de privacidad";
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
      const isInstalacion = formData.type === CaseType.INSTALACION;
      const fullName = (formData.type === CaseType.INSTALACION || formData.type === CaseType.RECLAMO) ? (formData.fullName || '').trim() : '';
      const [firstName, ...rest] = fullName ? fullName.split(/\s+/) : [formData.firstName, formData.lastName];
      const lastName = fullName ? (rest.join(' ') || firstName) : (rest[0] ?? '');

      const newCase = await mockApi.createCase({
        type: formData.type as CaseType,
        client: {
          firstName: firstName || formData.firstName,
          lastName: lastName || formData.lastName,
          docType: formData.docType as 'DNI' | 'RUC',
          docNumber: formData.docNumber,
          email: formData.email || '',
          phone: formData.phone,
          ...(formData.phone2 ? { phone2: formData.phone2 } : {}),
        },
        product: {
          category: formData.productCategory,
          brand: formData.productBrand,
          model: isInstalacion ? (formData.productModel || `${formData.quantityProducts || 1} unidad(es)`) : (formData.productModel || formData.productCategory),
          typology: formData.productTypology || undefined,
          serialNumber: formData.productSerialNumber || undefined,
          purchaseDate: formData.productPurchaseDate || undefined,
          ...(isInstalacion ? {
            quantityProducts: parseInt(formData.quantityProducts || '1', 10) || 1,
            wherePurchased: formData.wherePurchased || undefined,
          } : {}),
          ...(!isInstalacion ? {
            quantityProducts: parseInt(formData.quantityProducts || '1', 10) || 1,
            faultType: formData.faultType || undefined,
            fault: formData.fault || undefined,
            recentlyInstalled: formData.recentlyInstalled,
            timeValue: formData.timeValue || undefined,
            timeUnit: formData.timeUnit || undefined,
          } : {}),
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
        schedule: { date: formData.scheduleStartDate, endDate: formData.scheduleEndDate, slot: 'AM' as const },
        ...(formData.comments ? { clientComments: formData.comments } : {}),
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
          <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10 hidden md:block" />
          {STEPS.map((step) => {
            const active = step.id <= currentStep;
            return (
              <div key={step.id} className="flex flex-col items-center bg-[#F6F7FB] px-1 md:px-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${active ? 'bg-primary text-white ring-4 ring-primary/20' : 'bg-gray-300 text-gray-500'}`}>
                  {active && step.id < currentStep ? <Check size={16} /> : step.id}
                </div>
                <span className={`text-xs mt-2 font-medium hidden md:block ${active ? 'text-primary' : 'text-gray-400'}`}>{step.title}</span>
                <span className={`text-[10px] mt-1 font-medium md:hidden ${active ? 'text-primary' : 'text-gray-400'}`}>{step.id}</span>
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

        {/* Step 2: Data — Reclamo vs Instalación */}
        {currentStep === 2 && formData.type === CaseType.INSTALACION && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nombres y apellidos" value={formData.fullName} onChange={e => updateData({ fullName: e.target.value })} required className="md:col-span-2" />
              <Select label="Tipo de documento" options={[{ value: 'DNI', label: 'DNI' }, { value: 'RUC', label: 'RUC' }]} value={formData.docType} onChange={e => updateData({ docType: e.target.value })} required />
              <Input label="Número del documento" value={formData.docNumber} onChange={e => updateData({ docNumber: e.target.value })} required />
              <Input label="Teléfono 1" value={formData.phone} onChange={e => updateData({ phone: e.target.value })} maxLength={9} required />
              <Input label="Teléfono 2" value={formData.phone2} onChange={e => updateData({ phone2: e.target.value })} maxLength={9} />
              <Input label="Email" type="email" value={formData.email} onChange={e => updateData({ email: e.target.value })} />
              <Select label="Marca" options={[{ value: 'Vainsa', label: 'Vainsa' }, { value: 'Italgrif', label: 'Italgrif' }]} value={formData.productBrand} onChange={e => updateData({ productBrand: e.target.value })} required />
              <Select label="Tipo producto" options={[{ value: 'Griferia', label: 'Grifería' }, { value: 'Sanitarios', label: 'Sanitarios' }, { value: 'Accesorios', label: 'Accesorios' }]} value={formData.productCategory} onChange={e => updateData({ productCategory: e.target.value })} required />
              <Input label="Cantidad productos" type="number" min={1} value={formData.quantityProducts} onChange={e => updateData({ quantityProducts: e.target.value })} required />
            </div>
            <FileInput label="Adjuntar foto de tus productos" value={formData.productPhotoFile} onChange={files => updateData({ productPhotoFile: files?.length ? files[0] : null })} />
            <div className="relative">
              <Select label="¿Dónde compraste tus productos?" options={[{ value: 'Tienda fisica', label: 'Tienda física' }, { value: 'E-commerce', label: 'E-commerce / Web' }, { value: 'Mayorista', label: 'Mayorista' }, { value: 'Otro', label: 'Otro' }]} value={formData.wherePurchased} onChange={e => updateData({ wherePurchased: e.target.value })} required />
            </div>
            <FileInput label="Adjuntar boleta venta" value={formData.saleReceiptFile} onChange={files => updateData({ saleReceiptFile: files?.length ? files[0] : null })} />
          </div>
        )}

        {currentStep === 2 && formData.type === CaseType.RECLAMO && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nombres y apellidos" value={formData.fullName} onChange={e => updateData({ fullName: e.target.value })} required className="md:col-span-2" />
              <Select label="Tipo de documento" options={[{ value: 'DNI', label: 'DNI' }, { value: 'RUC', label: 'RUC' }]} value={formData.docType} onChange={e => updateData({ docType: e.target.value })} required />
              <Input label="Número del documento" value={formData.docNumber} onChange={e => updateData({ docNumber: e.target.value })} required />
              <Input label="Teléfono 1" value={formData.phone} onChange={e => updateData({ phone: e.target.value })} maxLength={9} required />
              <Input label="Teléfono 2" value={formData.phone2} onChange={e => updateData({ phone2: e.target.value })} maxLength={9} />
              <Input label="Email" type="email" value={formData.email} onChange={e => updateData({ email: e.target.value })} className="md:col-span-2" />
              <Select label="Tipo producto" options={[{ value: 'Griferia', label: 'Grifería' }, { value: 'Sanitarios', label: 'Sanitarios' }, { value: 'Accesorios', label: 'Accesorios' }]} value={formData.productCategory} onChange={e => updateData({ productCategory: e.target.value })} required />
              <Select label="Marca" options={[{ value: 'Vainsa', label: 'Vainsa' }, { value: 'Italgrif', label: 'Italgrif' }]} value={formData.productBrand} onChange={e => updateData({ productBrand: e.target.value })} required />
              <Input label="Cantidad productos" type="number" min={1} value={formData.quantityProducts} onChange={e => updateData({ quantityProducts: e.target.value })} required />
            </div>
            <FileInput label="Adjuntar foto de tus productos" value={formData.productPhotoFile} onChange={files => updateData({ productPhotoFile: files?.length ? files[0] : null })} required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select label="Tipo de falla" options={[{ value: 'Fuga', label: 'Fuga' }, { value: 'Goteo', label: 'Goteo' }, { value: 'No cierra bien', label: 'No cierra bien' }, { value: 'No abre bien', label: 'No abre bien' }, { value: 'Pieza rota', label: 'Pieza rota' }, { value: 'Otro', label: 'Otro' }]} value={formData.faultType} onChange={e => updateData({ faultType: e.target.value })} required />
              <Select label="Falla" options={[{ value: 'Detalle 1', label: 'Detalle 1' }, { value: 'Detalle 2', label: 'Detalle 2' }, { value: 'Otro', label: 'Otro' }]} value={formData.fault} onChange={e => updateData({ fault: e.target.value })} />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={formData.recentlyInstalled} onChange={e => updateData({ recentlyInstalled: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <span className="text-sm font-medium text-gray-700"><span className="text-red-500 mr-0.5">*</span> Recién Instalado</span>
            </label>
            <div className="flex flex-wrap items-end gap-3">
              <span className="text-sm font-medium text-gray-700 w-full md:w-auto"><span className="text-red-500 mr-0.5">*</span> Tiempo</span>
              <Input type="text" placeholder="XX" value={formData.timeValue} onChange={e => updateData({ timeValue: e.target.value })} className="w-20" maxLength={4} />
              <Select label="" options={[{ value: 'Meses', label: 'Meses' }, { value: 'Años', label: 'Años' }]} value={formData.timeUnit} onChange={e => updateData({ timeUnit: e.target.value })} className="w-[140px]" />
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

        {/* Step 4: Agendamiento — igual para Reclamo e Instalación */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Cuéntanos más sobre el estado de tu producto y el servicio que requieres:</h3>
                <Textarea
                  label=""
                  placeholder="Describe el estado del producto, accesos, condiciones del espacio, etc."
                  value={formData.comments}
                  onChange={e => updateData({ comments: e.target.value })}
                  className="min-h-[160px]"
                />
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800">
                  ¿En qué rango de fechas deseas el servicio?<span className="text-red-500 ml-0.5">*</span>
                </h3>
                <DateRangeCalendar
                  startDate={formData.scheduleStartDate}
                  endDate={formData.scheduleEndDate}
                  onChange={(start, end) => updateData({ scheduleStartDate: start, scheduleEndDate: end })}
                  minDate={new Date().toISOString().split('T')[0]}
                />
                <p className="text-xs text-gray-500">Seleccione la fecha inicial y la fecha final</p>
                <p className="text-xs text-gray-600">(*) Fecha tentativa, sujeta a confirmación en base a disponibilidad de cupos por día y distrito de residencia.</p>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.privacyAccepted}
                    onChange={e => updateData({ privacyAccepted: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">
                    He leído y acepto la{' '}
                    <a href="#politica-privacidad" className="text-primary underline hover:no-underline" onClick={(e) => e.preventDefault()}>política de privacidad</a>
                  </span>
                </label>
              </div>
            </div>

            <div className="mt-8 border-t pt-6">
               <h4 className="font-bold text-gray-900 mb-4">Resumen de Solicitud</h4>
               <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
                 <div className="flex justify-between"><span className="text-gray-500">Tipo:</span> <span className="font-medium">{formData.type}</span></div>
                 <div className="flex justify-between"><span className="text-gray-500">Cliente:</span> <span className="font-medium">{formData.fullName}</span></div>
                 <div className="flex justify-between"><span className="text-gray-500">Contacto:</span> <span className="font-medium">{formData.phone}{formData.phone2 ? ` / ${formData.phone2}` : ''}</span></div>
                 <div className="flex justify-between"><span className="text-gray-500">Producto:</span> <span className="font-medium">{formData.productBrand} - {formData.productCategory} ({formData.quantityProducts || 1} und.)</span></div>
                 {formData.type === CaseType.INSTALACION && formData.wherePurchased && <div className="flex justify-between"><span className="text-gray-500">Comprado en:</span> <span className="font-medium">{formData.wherePurchased}</span></div>}
                 {formData.type === CaseType.RECLAMO && formData.faultType && <div className="flex justify-between"><span className="text-gray-500">Tipo de falla:</span> <span className="font-medium">{formData.faultType}</span></div>}
                 {formData.type === CaseType.RECLAMO && formData.fault && <div className="flex justify-between"><span className="text-gray-500">Falla:</span> <span className="font-medium">{formData.fault}</span></div>}
                 {formData.type === CaseType.RECLAMO && <div className="flex justify-between"><span className="text-gray-500">Recién instalado:</span> <span className="font-medium">{formData.recentlyInstalled ? 'Sí' : 'No'}</span></div>}
                 {formData.type === CaseType.RECLAMO && (formData.timeValue || formData.timeUnit) && <div className="flex justify-between"><span className="text-gray-500">Tiempo:</span> <span className="font-medium">{formData.timeValue || '—'} {formData.timeUnit || ''}</span></div>}
                 <div className="flex justify-between"><span className="text-gray-500">Rango de fechas:</span> <span className="font-medium">{formData.scheduleStartDate} – {formData.scheduleEndDate}</span></div>
                 {formData.comments && <div className="pt-2 border-t"><span className="text-gray-500 block mb-1">Comentarios:</span> <span className="text-gray-700">{formData.comments}</span></div>}
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
