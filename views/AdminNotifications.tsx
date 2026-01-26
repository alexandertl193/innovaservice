import React, { useEffect, useState } from 'react';
import { Card, PageLoader, StatusBadge } from '../components/UI';
import { Case } from '../types';
import { mockApi } from '../services/mockApi';
import { Bell, Mail, MessageSquare, CheckCircle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'registration' | 'scheduled' | 'technician' | 'closed';
  caseId: string;
  caseNumber: string;
  clientName: string;
  message: string;
  date: string;
  sent: boolean;
}

export const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      const cases = await mockApi.getCases({});
      
      // Generar notificaciones simuladas basadas en el historial de casos
      const notifs: Notification[] = [];
      
      cases.forEach(c => {
        // Notificación de registro
        const registroEntry = c.history.find(h => h.action.includes('registrado'));
        if (registroEntry) {
          notifs.push({
            id: `reg-${c.id}`,
            type: 'registration',
            caseId: c.id,
            caseNumber: c.caseNumber,
            clientName: `${c.client.firstName} ${c.client.lastName}`,
            message: `Confirmación de registro de solicitud ${c.caseNumber}`,
            date: registroEntry.date,
            sent: true,
          });
        }

        // Notificación de programación
        const programadoEntry = c.history.find(h => 
          h.action.includes('Programación') || 
          h.action.includes('programada') ||
          c.status === 'PROGRAMADO'
        );
        if (programadoEntry && c.status !== 'NUEVO') {
          notifs.push({
            id: `sched-${c.id}`,
            type: 'scheduled',
            caseId: c.id,
            caseNumber: c.caseNumber,
            clientName: `${c.client.firstName} ${c.client.lastName}`,
            message: `Programación confirmada para ${c.schedule.date} (${c.schedule.slot})`,
            date: programadoEntry.date,
            sent: true,
          });
        }

        // Notificación de técnico en camino
        const tecnicoEntry = c.history.find(h => 
          h.action.includes('Técnico') || 
          h.action.includes('camino') ||
          c.status === 'TECNICO_EN_CAMINO'
        );
        if (tecnicoEntry) {
          notifs.push({
            id: `tech-${c.id}`,
            type: 'technician',
            caseId: c.id,
            caseNumber: c.caseNumber,
            clientName: `${c.client.firstName} ${c.client.lastName}`,
            message: `Técnico en camino para caso ${c.caseNumber}`,
            date: tecnicoEntry.date,
            sent: true,
          });
        }

        // Notificación de cierre
        const cierreEntry = c.history.find(h => 
          h.action.includes('cerrado') || 
          h.action.includes('Cerrar') ||
          c.status === 'CERRADO'
        );
        if (cierreEntry) {
          notifs.push({
            id: `close-${c.id}`,
            type: 'closed',
            caseId: c.id,
            caseNumber: c.caseNumber,
            clientName: `${c.client.firstName} ${c.client.lastName}`,
            message: `Caso ${c.caseNumber} cerrado. Encuesta NPS disponible.`,
            date: cierreEntry.date,
            sent: true,
          });
        }
      });

      // Ordenar por fecha (más recientes primero)
      notifs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setNotifications(notifs);
      setLoading(false);
    };

    loadNotifications();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'registration':
        return <CheckCircle className="text-blue-600" size={20} />;
      case 'scheduled':
        return <Mail className="text-purple-600" size={20} />;
      case 'technician':
        return <MessageSquare className="text-indigo-600" size={20} />;
      case 'closed':
        return <Bell className="text-green-600" size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'registration':
        return 'Registro';
      case 'scheduled':
        return 'Programación';
      case 'technician':
        return 'Técnico en Camino';
      case 'closed':
        return 'Cierre';
      default:
        return 'Notificación';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'registration':
        return 'bg-blue-50 border-blue-200';
      case 'scheduled':
        return 'bg-purple-50 border-purple-200';
      case 'technician':
        return 'bg-indigo-50 border-indigo-200';
      case 'closed':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
          <p className="text-sm text-gray-500 mt-1">
            Log de notificaciones simuladas enviadas a clientes
          </p>
        </div>
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Total: <span className="font-bold text-gray-900">{notifications.length}</span> notificaciones
          </p>
          <div className="text-xs text-gray-400">
            * Simulación: En producción estas notificaciones se enviarían por email/SMS
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay notificaciones registradas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(notif => (
              <div
                key={notif.id}
                className={`p-4 rounded-lg border ${getNotificationColor(notif.type)} transition-all hover:shadow-sm`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-gray-500 uppercase">
                            {getNotificationTypeLabel(notif.type)}
                          </span>
                          {notif.sent && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              Enviada
                            </span>
                          )}
                        </div>
                        <p className="font-medium text-gray-900">{notif.message}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Cliente: <span className="font-medium">{notif.clientName}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Caso: <span className="font-mono">{notif.caseNumber}</span>
                        </p>
                      </div>
                      <div className="text-xs text-gray-400 text-right whitespace-nowrap">
                        {new Date(notif.date).toLocaleString('es-PE', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
