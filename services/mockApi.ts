import { Case, CaseStatus, CaseType, DashboardStats } from '../types';

// Initial Mock Data
const MOCK_CASES: Case[] = [
  {
    id: '1',
    caseNumber: 'INN-2024-001201',
    type: CaseType.INSTALACION,
    status: CaseStatus.NUEVO,
    client: {
      firstName: 'Carlos',
      lastName: 'Mendez',
      docType: 'DNI',
      docNumber: '45678901',
      email: 'carlos.m@gmail.com',
      phone: '987654321',
    },
    product: {
      category: 'Grifería',
      brand: 'Vainsa',
      model: 'Avante Monocomando',
      purchaseDate: '2024-05-10',
    },
    location: {
      department: 'Lima',
      province: 'Lima',
      district: 'Miraflores',
      address: 'Av. Pardo 123 Dpto 401',
      reference: 'Frente a Saga',
      lat: -12.119,
      lng: -77.029,
    },
    schedule: {
      date: '2024-05-20',
      slot: 'AM',
    },
    createdAt: '2024-05-15T10:00:00Z',
    updatedAt: '2024-05-15T10:00:00Z',
    history: [{ date: '2024-05-15T10:00:00Z', action: 'Caso registrado', user: 'Cliente' }],
  },
  {
    id: '2',
    caseNumber: 'INN-2024-001198',
    type: CaseType.RECLAMO,
    status: CaseStatus.PROGRAMADO,
    client: {
      firstName: 'Maria',
      lastName: 'Lopez',
      docType: 'RUC',
      docNumber: '10234567891',
      email: 'mlopez@empresa.com',
      phone: '998877665',
    },
    product: {
      category: 'Sanitarios',
      brand: 'Italgrif',
      model: 'One Piece Smart',
    },
    location: {
      department: 'Lima',
      province: 'Lima',
      district: 'San Isidro',
      address: 'Calle Los Laureles 450',
      reference: '',
      lat: -12.09,
      lng: -77.04,
    },
    schedule: {
      date: '2024-05-18',
      slot: 'PM',
    },
    createdAt: '2024-05-12T09:30:00Z',
    updatedAt: '2024-05-13T14:00:00Z',
    history: [
      { date: '2024-05-12T09:30:00Z', action: 'Caso registrado', user: 'Cliente' },
      { date: '2024-05-13T14:00:00Z', action: 'Visita programada', user: 'Agente PostVenta' },
    ],
  },
  {
    id: '3',
    caseNumber: 'INN-2024-001050',
    type: CaseType.RECLAMO,
    status: CaseStatus.CERRADO,
    client: {
      firstName: 'Juan',
      lastName: 'Perez',
      docType: 'DNI',
      docNumber: '76543210',
      email: 'juan.p@hotmail.com',
      phone: '912345678',
    },
    product: {
      category: 'Grifería',
      brand: 'Vainsa',
      model: 'Linea K',
    },
    location: {
      department: 'Lima',
      province: 'Lima',
      district: 'Surco',
      address: 'Jr. Montebello 120',
      reference: 'Alt cdra 5 Caminos del Inca',
      lat: -12.13,
      lng: -76.98,
    },
    schedule: {
      date: '2024-05-01',
      slot: 'AM',
    },
    createdAt: '2024-04-28T11:00:00Z',
    updatedAt: '2024-05-02T16:00:00Z',
    npsScore: 9,
    history: [
      { date: '2024-04-28T11:00:00Z', action: 'Caso registrado', user: 'Cliente' },
      { date: '2024-05-02T16:00:00Z', action: 'Caso cerrado', user: 'Agente PostVenta' },
    ],
  },
];

// Helper to simulate delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  // Client Methods
  createCase: async (data: Omit<Case, 'id' | 'caseNumber' | 'createdAt' | 'updatedAt' | 'history' | 'status'>): Promise<Case> => {
    await delay(1500);
    const newCase: Case = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      caseNumber: `INN-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      status: CaseStatus.NUEVO,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [{ date: new Date().toISOString(), action: 'Caso registrado vía Web', user: 'Cliente' }],
    };
    MOCK_CASES.unshift(newCase);
    return newCase;
  },

  getCaseByNumberAndDoc: async (caseNumber: string, docNumber: string): Promise<Case | null> => {
    await delay(1000);
    const found = MOCK_CASES.find(c => c.caseNumber === caseNumber && c.client.docNumber === docNumber);
    return found || null;
  },

  // Admin Methods
  getCases: async (filters: any): Promise<Case[]> => {
    await delay(800);
    let filtered = [...MOCK_CASES];
    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    if (filters.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.caseNumber.toLowerCase().includes(s) || 
        c.client.lastName.toLowerCase().includes(s) ||
        c.client.docNumber.includes(s)
      );
    }
    return filtered;
  },

  getCaseById: async (id: string): Promise<Case | undefined> => {
    await delay(500);
    return MOCK_CASES.find(c => c.id === id);
  },

  updateCaseStatus: async (id: string, status: CaseStatus, comment: string): Promise<Case> => {
    await delay(1000);
    const caseIndex = MOCK_CASES.findIndex(c => c.id === id);
    if (caseIndex === -1) throw new Error("Case not found");

    const updatedCase = {
      ...MOCK_CASES[caseIndex],
      status,
      updatedAt: new Date().toISOString(),
      history: [
        ...MOCK_CASES[caseIndex].history,
        { date: new Date().toISOString(), action: `Estado actualizado a ${status}. ${comment}`, user: 'Agente PostVenta' }
      ]
    };
    MOCK_CASES[caseIndex] = updatedCase;
    return updatedCase;
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(1000);
    return {
      totalReclamos: MOCK_CASES.filter(c => c.type === CaseType.RECLAMO).length,
      totalInstalaciones: MOCK_CASES.filter(c => c.type === CaseType.INSTALACION).length,
      avgResponseTime: 24,
      npsScore: 8.5,
      openCases: MOCK_CASES.filter(c => c.status !== CaseStatus.CERRADO && c.status !== CaseStatus.CANCELADO).length,
      closedCases: MOCK_CASES.filter(c => c.status === CaseStatus.CERRADO).length,
    };
  }
};