import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Bell, 
  Settings, 
  LogOut, 
  Menu,
  X
} from 'lucide-react';

// --- Client Layout ---
export const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-[#F6F7FB] font-sans text-gray-800">
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-sidebar rounded-lg flex items-center justify-center text-white font-bold">I</div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">Innova<span className="text-primary">Service</span></span>
        </Link>
        <div className="flex items-center space-x-4 text-sm">
          <Link to="/" className="text-gray-600 hover:text-primary transition-colors">Inicio</Link>
          <Link to="/tracking" className="text-gray-600 hover:text-primary transition-colors">Seguimiento</Link>
          <Link to="/admin" className="text-gray-400 hover:text-gray-600 text-xs">Acceso Interno</Link>
        </div>
      </div>
    </header>
    <main className="max-w-5xl mx-auto px-4 py-8">
      {children}
    </main>
  </div>
);

// --- Admin Layout ---
const AdminSidebarItem: React.FC<{ to: string; icon: React.ReactNode; label: string; active?: boolean }> = ({ to, icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all mb-1 ${
      active 
        ? 'bg-sidebar-hover text-white' 
        : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'
    }`}
  >
    <span className={active ? 'text-white' : 'text-gray-400'}>{icon}</span>
    <span className="font-medium text-sm">{label}</span>
  </Link>
);

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar flex-shrink-0 h-screen sticky top-0">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <span className="text-lg font-bold text-white tracking-tight">Innova<span className="text-primary font-normal">Panel</span></span>
        </div>
        
        <div className="flex-1 py-6 px-3">
          <div className="space-y-1">
            <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Principal</p>
            <AdminSidebarItem to="/admin" icon={<LayoutDashboard size={18} />} label="Resumen" active={location.pathname === '/admin'} />
            <AdminSidebarItem to="/admin/cases" icon={<FileText size={18} />} label="Gestión de Casos" active={location.pathname.startsWith('/admin/cases')} />
            <AdminSidebarItem to="/admin/schedule" icon={<Calendar size={18} />} label="Agenda" active={location.pathname === '/admin/schedule'} />
          </div>

          <div className="mt-8 space-y-1">
            <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Sistema</p>
            <AdminSidebarItem to="/admin/notifications" icon={<Bell size={18} />} label="Notificaciones" />
            <AdminSidebarItem to="/admin/settings" icon={<Settings size={18} />} label="Configuración" />
          </div>
        </div>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center space-x-3 text-sidebar-text hover:text-white w-full px-4 py-2 hover:bg-white/5 rounded-lg transition-colors text-sm">
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
          <div className="flex items-center md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600">
              <Menu size={24} />
            </button>
            <span className="ml-3 font-bold text-gray-800">InnovaPanel</span>
          </div>
          
          <div className="hidden md:block text-sm text-gray-500">
            Bienvenido, <span className="font-semibold text-gray-800">Agente Post-Venta</span>
          </div>

          <div className="flex items-center space-x-4">
             <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-primary font-bold text-xs border border-gray-200">
               AP
             </div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-sidebar md:hidden flex flex-col p-4">
             <div className="flex justify-between items-center mb-8">
                <span className="text-white font-bold text-lg">Menú</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-white"><X /></button>
             </div>
             <AdminSidebarItem to="/admin" icon={<LayoutDashboard size={18} />} label="Resumen" />
             <AdminSidebarItem to="/admin/cases" icon={<FileText size={18} />} label="Gestión de Casos" />
          </div>
        )}

        <div className="p-4 md:p-8 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};