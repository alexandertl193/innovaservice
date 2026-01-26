export enum CaseType {
  RECLAMO = 'RECLAMO',
  INSTALACION = 'INSTALACION',
}

export enum CaseStatus {
  NUEVO = 'NUEVO',
  PENDIENTE_VALIDACION = 'PENDIENTE_VALIDACION',
  PROGRAMADO = 'PROGRAMADO',
  TECNICO_EN_CAMINO = 'TECNICO_EN_CAMINO',
  ATENDIDO = 'ATENDIDO',
  CERRADO = 'CERRADO',
  CANCELADO = 'CANCELADO',
}

export interface ClientData {
  firstName: string;
  lastName: string;
  docType: 'DNI' | 'RUC';
  docNumber: string;
  email: string;
  phone: string;
}

export interface ProductData {
  category: string;
  brand: string;
  model: string;
  typology?: string; // Tipología del producto
  serialNumber?: string;
  purchaseDate?: string;
}

export interface LocationData {
  department: string;
  province: string;
  district: string;
  address: string;
  reference: string;
  lat: number;
  lng: number;
}

export interface ScheduleData {
  date: string;
  slot: 'AM' | 'PM';
}

export interface Case {
  id: string;
  caseNumber: string; // INN-202X-XXXXXX
  type: CaseType;
  status: CaseStatus;
  client: ClientData;
  product: ProductData;
  location: LocationData;
  schedule: ScheduleData;
  createdAt: string;
  updatedAt: string;
  history: CaseHistory[];
  npsScore?: number;
  internalNotes?: InternalNote[];
}

export interface InternalNote {
  id: string;
  date: string;
  content: string;
  user: string;
}

export interface CaseHistory {
  date: string;
  action: string;
  user: string; // 'System' | 'Client' | 'Agent Name'
}

// KPI Types
export interface DashboardStats {
  totalReclamos: number;
  totalInstalaciones: number;
  avgResponseTime: number; // hours (tiempo promedio de programación)
  npsScore: number;
  openCases: number;
  closedCases: number;
  casesByMonth?: { month: string; reclamos: number; instalaciones: number }[];
  avgAtencionTime?: number; // hours (tiempo promedio de atención)
}

// UI Types
export interface StepProps {
  onNext: () => void;
  onBack: () => void;
  updateData: (data: Partial<Record<string, unknown>>) => void;
  data: Record<string, unknown>;
}