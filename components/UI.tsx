import React, { useState, useMemo } from 'react';
import { CaseStatus } from '../types';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const baseStyle = "h-[44px] px-6 rounded-[10px] font-medium transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";
  
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
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({ label, error, required, className = '', id, ...props }) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-[12px] font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input 
        id={inputId}
        className={`w-full h-[44px] px-4 rounded-[10px] border bg-white text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none ${error ? 'border-red-300 bg-red-50' : 'border-gray-200'} ${className}`}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && <span id={`${inputId}-error`} className="text-xs text-red-500 mt-1" role="alert">{error}</span>}
    </div>
  );
};

// --- Select ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  required?: boolean;
}

export const Select: React.FC<SelectProps> = ({ label, error, options, required, className = '', id, ...props }) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-[12px] font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <select 
          id={selectId}
          className={`w-full h-[44px] px-4 rounded-[10px] border bg-white text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none ${error ? 'border-red-300 bg-red-50' : 'border-gray-200'} ${className}`}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          <option value="">Seleccione una opción</option>
          {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none" aria-hidden="true">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
      {error && <span id={`${selectId}-error`} className="text-xs text-red-500 mt-1" role="alert">{error}</span>}
    </div>
  );
};

// --- Textarea ---
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', id, ...props }) => {
  const id_ = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id_} className="block text-[12px] font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
          {label}
        </label>
      )}
      <textarea
        id={id_}
        className={`w-full min-h-[120px] px-4 py-3 rounded-[10px] border bg-white text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-y ${error ? 'border-red-300 bg-red-50' : 'border-gray-200'} ${className}`}
        aria-invalid={error ? 'true' : undefined}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1" role="alert">{error}</span>}
    </div>
  );
};

// --- FileInput ---
interface FileInputProps {
  label?: string;
  accept?: string;
  onChange: (files: FileList | null) => void;
  value?: File | null;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export const FileInput: React.FC<FileInputProps> = ({ label, accept = 'image/*,.pdf', onChange, value, placeholder = 'Seleccione archivo....', className = '', required }) => {
  const inputId = `file-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <div className={`w-full ${className}`}>
      {(label || required) && (
        <label htmlFor={inputId} className="block text-[12px] font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <label
        htmlFor={inputId}
        className="flex w-full h-[44px] px-4 rounded-[10px] border border-gray-200 bg-white text-gray-500 items-center cursor-pointer hover:bg-gray-50 transition-colors focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary"
      >
        <input
          id={inputId}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => onChange(e.target.files)}
        />
        <span className="truncate">{value ? value.name : placeholder}</span>
      </label>
    </div>
  );
};

// --- DateRangeCalendar ---
const WEEKDAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

interface DateRangeCalendarProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
  minDate?: string;
  className?: string;
}

export const DateRangeCalendar: React.FC<DateRangeCalendarProps> = ({
  startDate,
  endDate,
  onChange,
  minDate = new Date().toISOString().split('T')[0],
  className = ''
}) => {
  const min = useMemo(() => (minDate ? new Date(minDate + 'T12:00:00') : new Date()), [minDate]);
  const initialView = useMemo(() => {
    if (startDate) return new Date(startDate + 'T12:00:00');
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }, [startDate]);
  const [viewMonth, setViewMonth] = useState(initialView);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const cells: { date: Date; label: number; isCurrentMonth: boolean }[] = [];
  for (let i = 0; i < startPad; i++) {
    const d = new Date(year, month, -startPad + i + 1);
    cells.push({ date: d, label: d.getDate(), isCurrentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), label: d, isCurrentMonth: true });
  }
  const rest = 7 - (cells.length % 7);
  if (rest < 7) {
    for (let i = 1; i <= rest; i++) {
      cells.push({ date: new Date(year, month + 1, i), label: i, isCurrentMonth: false });
    }
  }

  const toYmd = (d: Date) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const isDisabled = (d: Date) => d < new Date(min.getFullYear(), min.getMonth(), min.getDate());
  const isInRange = (d: Date) => {
    if (!startDate || !endDate) return false;
    const t = d.getTime();
    const s = new Date(startDate + 'T12:00:00').getTime();
    const e = new Date(endDate + 'T12:00:00').getTime();
    return t >= s && t <= e;
  };
  const isStart = (d: Date) => startDate && toYmd(d) === startDate;
  const isEnd = (d: Date) => endDate && toYmd(d) === endDate;

  const handleDayClick = (d: Date) => {
    if (!d.getMonth) return;
    const ymd = toYmd(d);
    if (isDisabled(d)) return;
    if (!startDate || (startDate && endDate)) {
      onChange(ymd, '');
    } else {
      if (ymd < startDate) onChange(ymd, '');
      else onChange(startDate, ymd);
    }
  };

  const prevMonth = () => setViewMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setViewMonth(new Date(year, month + 1, 1));

  return (
    <div className={`bg-white rounded-[14px] border border-gray-200 overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
        <button type="button" onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600" aria-label="Mes anterior">
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm font-semibold text-gray-800">{MONTHS[month]} {year}</span>
        <button type="button" onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600" aria-label="Mes siguiente">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="p-3">
        <div className="grid grid-cols-7 gap-0.5 mb-2">
          {WEEKDAYS.map(w => (
            <div key={w} className="text-center text-[11px] font-medium text-gray-500 py-1">{w}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((cell, i) => {
            const disabled = cell.isCurrentMonth && isDisabled(cell.date);
            const inRange = cell.isCurrentMonth && isInRange(cell.date) && !isStart(cell.date) && !isEnd(cell.date);
            const start = cell.isCurrentMonth && isStart(cell.date);
            const end = cell.isCurrentMonth && isEnd(cell.date);
            return (
              <button
                key={i}
                type="button"
                disabled={disabled}
                onClick={() => handleDayClick(cell.date)}
                className={`
                  w-8 h-8 text-sm rounded-lg flex items-center justify-center
                  ${!cell.isCurrentMonth ? 'text-gray-300' : ''}
                  ${disabled ? 'cursor-not-allowed text-gray-300' : 'hover:bg-primary/10'}
                  ${inRange ? 'bg-primary/20 text-primary font-medium' : ''}
                  ${start || end ? 'bg-primary text-white font-semibold' : ''}
                  ${cell.isCurrentMonth && !disabled && !start && !end && !inRange ? 'text-gray-700' : ''}
                `}
              >
                {cell.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

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
