import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Plus,
  Calendar,
  MapPin,
  ScanLine,
  Settings,
  Users,
  TrendingUp,
  Ticket,
  ArrowUpRight,
} from 'lucide-react';
import ListaEventos from './ListaEventos';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function AdminDashboard() {
  const { user } = useAuth();

  const adminActions = [
    {
      title: 'Crear Evento',
      desc: 'Publicar nuevo evento',
      icon: Plus,
      href: '/creacion-eventos',
      bgClass:
        'bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700',
      iconBg: 'bg-white/20',
      disabled: false,
    },
    {
      title: 'Mapa de Asientos',
      desc: 'Gestionar zonas y butacas',
      icon: MapPin,
      href: '/admin/asientos',
      bgClass:
        'bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700',
      iconBg: 'bg-white/20',
      disabled: false,
    },
    {
      title: 'Validar Entradas',
      desc: 'Acceder al escáner QR',
      icon: ScanLine,
      href: '/admin/scanner',
      bgClass:
        'bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700',
      iconBg: 'bg-white/20',
      disabled: false,
    },
    {
      title: 'Configuración',
      desc: 'Ajustes del sistema (Próx.)',
      icon: Settings,
      href: '#',
      bgClass:
        'bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-700 dark:to-slate-800 opacity-50 grayscale',
      iconBg: 'bg-white/20',
      disabled: true,
    },
  ];

  const stats = [
    {
      label: 'Ingresos Totales',
      value: '12.450€',
      trend: '+12%',
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      label: 'Entradas Vendidas',
      value: '843',
      trend: '+5%',
      icon: Ticket,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Usuarios Registrados',
      value: '1.205',
      trend: '+18%',
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-['Arimo']">
      {/* 1. HEADER DE BIENVENIDA */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Panel de Administración
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-base">
            Bienvenido,{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-200">{user?.nombre}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium border border-slate-200 dark:border-slate-700 shadow-sm">
          <Calendar size={16} className="text-[#00a651]" />
          <span>
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* 2. GRID DE ACCIONES RÁPIDAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminActions.map((action, idx) => {
          const content = (
            <>
              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div
                  className={`p-3 w-fit rounded-xl backdrop-blur-sm ${action.iconBg} text-white shadow-inner`}
                >
                  <action.icon size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 tracking-tight">
                    {action.title}
                  </h3>
                  <p className="text-sm text-white/90 font-medium opacity-90">{action.desc}</p>
                </div>
              </div>
              <action.icon className="absolute -bottom-6 -right-6 w-40 h-40 opacity-10 text-white transform rotate-12 group-hover:scale-110 transition-transform duration-500" />
            </>
          );

          return action.disabled ? (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-2xl p-6 ${action.bgClass} cursor-not-allowed select-none`}
            >
              {content}
            </div>
          ) : (
            <Link
              key={idx}
              to={action.href}
              className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 ${action.bgClass}`}
            >
              {content}
            </Link>
          );
        })}
      </div>

      {/* 3. RESUMEN DE ESTADÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <Card
            key={idx}
            className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 cursor-default"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {stat.value}
                  </h4>
                  <span className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                    <ArrowUpRight size={12} className="mr-0.5" /> {stat.trend}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 4. GESTIÓN DE EVENTOS */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#00a651] rounded-full"></div>
            Eventos Recientes
          </h2>
          <Button
            asChild
            className="bg-[#00a651] hover:bg-[#008a43] text-white font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <Link to="/creacion-eventos" className="flex items-center gap-2">
              <Plus size={18} />
              Crear Nuevo Evento
            </Link>
          </Button>
        </div>

        {/* CONTENEDOR DE LA LISTA */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <ListaEventos />
        </div>
      </div>
    </div>
  );
}
