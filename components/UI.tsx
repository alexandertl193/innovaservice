import React from 'react';
import { CaseStatus } from '../types';
import { Loader2 } from 'lucide-react';

// --- Card ---
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-[14px] shadow-sm border border-[#E6E8EF] ${className}`}>
    {children}
  </div>
);

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', isLoading, className = '', ...props 
}) => {
  const baseStyle = "h-[44px] px-6 rounded-[10px] font-medium transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-[12px] font-medium text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>}
    <input 
      className={`w-full h-[44px] px-4 rounded-[10px] border bg-white text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none ${error ? 'border-red-300 bg-red-50' : 'border-gray-200'} ${className}`}
      {...props}
    />
    {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
  </div>
);

// --- Select ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-[12px] font-medium text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>}
    <div className="relative">
      <select 
        className={`w-full h-[44px] px-4 rounded-[10px] border bg-white text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none ${error ? 'border-red-300 bg-red-50' : 'border-gray-200'} ${className}`}
        {...props}
      >
        <option value="">Seleccione una opción</option>
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>
    {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
  </div>
);

// --- Status Badge ---
export const StatusBadge: React.FC<{ status: CaseStatus }> = ({ status }) => {
  const styles = {
    [CaseStatus.NUEVO]: "bg-blue-100 text-blue-700",
    [CaseStatus.PENDIENTE_VALIDACION]: "bg-yellow-100 text-yellow-700",
    [CaseStatus.PROGRAMADO]: "bg-purple-100 text-purple-700",
    [CaseStatus.TECNICO_EN_CAMINO]: "bg-indigo-100 text-indigo-700",
    [CaseStatus.ATENDIDO]: "bg-teal-100 text-teal-700",
    [CaseStatus.CERRADO]: "bg-success-bg text-success",
    [CaseStatus.CANCELADO]: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${styles[status]}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};

// --- Loading Spinner (Full Page) ---
export const PageLoader = () => (
  <div className="flex h-full w-full items-center justify-center min-h-[400px]">
    <Loader2 className="w-10 h-10 text-primary animate-spin" />
  </div>
);

// --- Mock Map ---
export const MockMap: React.FC<{ lat: number; lng: number; onChange: (lat: number, lng: number) => void }> = ({ lat, lng, onChange }) => {
  return (
    <div 
      className="w-full h-[300px] bg-gray-100 rounded-[14px] relative overflow-hidden cursor-crosshair border border-gray-300 group"
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // Simulate lat/lng based on %
        const simulatedLat = -12.0 + (y / 300);
        const simulatedLng = -77.0 + (x / rect.width);
        onChange(simulatedLat, simulatedLng);
      }}
    >
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#6B7280 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />
      <div className="absolute top-4 left-4 bg-white/90 p-2 rounded text-xs text-gray-500 pointer-events-none shadow-sm">
        Click en el mapa para ajustar ubicación
      </div>
      
      {/* Pin */}
      <div 
        className="absolute w-8 h-8 -ml-4 -mt-8 text-primary transition-all duration-300"
        style={{ 
          top: lat === 0 ? '50%' : `${(lat + 12.0) * 300}px`, 
          left: lng === 0 ? '50%' : `${(lng + 77.0) * 100}%`
        }}
      >
        <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
      </div>
    </div>
  );
};
