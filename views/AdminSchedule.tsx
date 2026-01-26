import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, StatusBadge, PageLoader } from '../components/UI';
import { mockApi } from '../services/mockApi';
import { Case, CaseStatus } from '../types';
import { Calendar, Clock, MapPin, User, Eye, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface ScheduleGroup {
  date: string;
  cases: Case[];
}

export const AdminSchedule: React.FC = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');

  const fetchCases = async () => {
    setLoading(true);
    const data = await mockApi.getCases({});
    // Filtrar solo casos programados o con fecha asignada
    const scheduledCases = data.filter(c => 
      c.status === CaseStatus.PROGRAMADO || 
      c.status === CaseStatus.TECNICO_EN_CAMINO ||
      (c.schedule && c.schedule.date)
    );
    setCases(scheduledCases);
    setLoading(false);
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const groupCasesByDate = (cases: Case[]): ScheduleGroup[] => {
    const grouped = cases.reduce((acc, c) => {
      const date = c.schedule.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(c);
      return acc;
    }, {} as Record<string, Case[]>);

    return Object.entries(grouped)
      .map(([date, cases]) => ({ date, cases: cases.sort((a, b) => {
        // Ordenar por slot (AM primero) y luego por número de caso
        if (a.schedule.slot !== b.schedule.slot) {
          return a.schedule.slot === 'AM' ? -1 : 1;
        }
        return a.caseNumber.localeCompare(b.caseNumber);
      }) }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const getWeekDates = (date: string): string[] => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar al lunes
    const monday = new Date(d.setDate(diff));
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      week.push(date.toISOString().split('T')[0]);
    }
    return week;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const formatDateLong = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getSlotLabel = (slot: string): string => {
    return slot === 'AM' ? 'Mañana (8:00 - 13:00)' : 'Tarde (14:00 - 18:00)';
  };

  const getSlotColor = (slot: string): string => {
    return slot === 'AM' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-orange-50 text-orange-700 border-orange-200';
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const current = new Date(selectedDate);
    if (viewMode === 'day') {
      current.setDate(current.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      current.setDate(current.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      current.setMonth(current.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  if (loading) return <PageLoader />;

  const groupedCases = groupCasesByDate(cases);
  const weekDates = viewMode === 'week' ? getWeekDates(selectedDate) : [];
  const today = new Date().toISOString().split('T')[0];

  const filteredGroups = viewMode === 'day' 
    ? groupedCases.filter(g => g.date === selectedDate)
    : viewMode === 'week'
    ? groupedCases.filter(g => weekDates.includes(g.date))
    : groupedCases;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Agenda de Servicios</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant={viewMode === 'day' ? 'primary' : 'outline'} 
            onClick={() => setViewMode('day')}
            className="h-9 text-sm"
          >
            Día
          </Button>
          <Button 
            variant={viewMode === 'week' ? 'primary' : 'outline'} 
            onClick={() => setViewMode('week')}
            className="h-9 text-sm"
          >
            Semana
          </Button>
          <Button 
            variant={viewMode === 'month' ? 'primary' : 'outline'} 
            onClick={() => setViewMode('month')}
            className="h-9 text-sm"
          >
            Mes
          </Button>
        </div>
      </div>

      {/* Filtros y Navegación */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 flex items-center gap-2">
            <button 
              onClick={() => navigateDate('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <Input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="flex-1"
            />
            <button 
              onClick={() => navigateDate('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} />
            </button>
            <Button 
              variant="secondary" 
              onClick={() => setSelectedDate(today)}
              className="h-[44px]"
            >
              Hoy
            </Button>
          </div>
          <Button onClick={fetchCases} variant="outline">
            <Filter size={18} className="mr-2" /> Actualizar
          </Button>
        </div>
      </Card>

      {/* Vista de Semana - Grid */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-7 gap-2 mb-6">
          {weekDates.map(date => {
            const dayCases = groupedCases.find(g => g.date === date)?.cases || [];
            const isToday = date === today;
            return (
              <Card key={date} className={`p-3 ${isToday ? 'border-2 border-primary' : ''}`}>
                <div className={`text-center mb-2 ${isToday ? 'text-primary font-bold' : 'text-gray-500'}`}>
                  <p className="text-xs uppercase">{formatDate(date).split(' ')[0]}</p>
                  <p className="text-lg font-bold">{formatDate(date).split(' ')[1]}</p>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-center text-gray-400">
                    {dayCases.length} {dayCases.length === 1 ? 'caso' : 'casos'}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Lista de Casos */}
      {filteredGroups.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium mb-2">No hay casos programados</p>
          <p className="text-gray-400 text-sm">
            {viewMode === 'day' 
              ? `para el ${formatDateLong(selectedDate)}`
              : viewMode === 'week'
              ? 'en esta semana'
              : 'en este período'}
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredGroups.map(group => (
            <Card key={group.date} className="overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-purple-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-primary" size={20} />
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{formatDateLong(group.date)}</h3>
                      <p className="text-sm text-gray-500">{group.cases.length} {group.cases.length === 1 ? 'caso programado' : 'casos programados'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {group.cases.map(caseItem => (
                  <div key={caseItem.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row gap-4">
                      {/* Información Principal */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-bold text-primary text-lg">{caseItem.caseNumber}</span>
                              <StatusBadge status={caseItem.status} />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-1">{caseItem.type}</h4>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1.5">
                                <User size={16} className="text-gray-400" />
                                <span>{caseItem.client.firstName} {caseItem.client.lastName}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <MapPin size={16} className="text-gray-400" />
                                <span>{caseItem.location.district}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Horario y Detalles */}
                        <div className="flex flex-wrap gap-3">
                          <div className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${getSlotColor(caseItem.schedule.slot)}`}>
                            <div className="flex items-center gap-1.5">
                              <Clock size={14} />
                              {getSlotLabel(caseItem.schedule.slot)}
                            </div>
                          </div>
                          <div className="px-3 py-1.5 rounded-lg bg-gray-50 text-sm text-gray-700 border border-gray-200">
                            <span className="font-medium">{caseItem.product.brand}</span> - {caseItem.product.model}
                          </div>
                        </div>

                        {/* Dirección Completa */}
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <p className="font-medium text-gray-900 mb-1">Dirección:</p>
                          <p>{caseItem.location.address}</p>
                          {caseItem.location.reference && (
                            <p className="text-xs text-gray-500 mt-1">Ref: {caseItem.location.reference}</p>
                          )}
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="lg:w-48 flex lg:flex-col gap-2">
                        <Button 
                          variant="outline" 
                          className="w-full justify-center"
                          onClick={() => navigate(`/admin/cases/${caseItem.id}`)}
                        >
                          <Eye size={16} className="mr-2" /> Ver Detalles
                        </Button>
                        {caseItem.status === CaseStatus.PROGRAMADO && (
                          <Button 
                            variant="primary"
                            className="w-full justify-center"
                            onClick={async () => {
                              await mockApi.updateCaseStatus(caseItem.id, CaseStatus.TECNICO_EN_CAMINO, 'Técnico despachado');
                              fetchCases();
                            }}
                          >
                            <Clock size={16} className="mr-2" /> En Camino
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Resumen */}
      {filteredGroups.length > 0 && (
        <Card className="p-4 bg-gray-50">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-gray-500">Total de casos: </span>
                <span className="font-bold text-gray-900">{filteredGroups.reduce((sum, g) => sum + g.cases.length, 0)}</span>
              </div>
              <div>
                <span className="text-gray-500">Mañana: </span>
                <span className="font-bold text-blue-700">
                  {filteredGroups.reduce((sum, g) => sum + g.cases.filter(c => c.schedule.slot === 'AM').length, 0)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Tarde: </span>
                <span className="font-bold text-orange-700">
                  {filteredGroups.reduce((sum, g) => sum + g.cases.filter(c => c.schedule.slot === 'PM').length, 0)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
