import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Navbar } from '../../components/ui/Navbar'; // Reutilización de componentes UI

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 font-['Arimo']">
      {/* Navbar consistente */}
      <Navbar />

      {/* Contenido Principal */}
      <div className="container mx-auto p-6 lg:p-8 flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Panel de Administración
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Gestiona la plataforma y los recursos globales.
            </p>
          </div>
          <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Rol: <span className="text-[#00A651]">Administrador</span>
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Tarjeta de Bienvenida */}
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg">Bienvenido, {user?.nombre}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Desde aquí podrás gestionar los eventos, validar usuarios y supervisar las métricas
                de la plataforma.
              </p>
            </CardContent>
          </Card>

          {/* Placeholder para Gestión de Eventos */}
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Gestión de Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 text-center">
                <div className="text-muted-foreground">
                  <p>Panel de gestión de eventos en construcción</p>
                  <span className="text-xs opacity-70">Próximamente disponible</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
