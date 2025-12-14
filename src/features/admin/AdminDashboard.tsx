import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Navbar } from '../../components/ui/Navbar';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 font-['Arimo']">
      {/* Navbar Sticky */}
      <Navbar />

      {/* Contenido Principal */}
      <div className="container mx-auto p-6 flex-1">
        <h1 className="mb-6 text-3xl font-bold">Panel de Administración</h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Bienvenido, {user?.nombre}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Desde aquí podrás gestionar los eventos y usuarios de la plataforma.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestión de Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
                Tabla de eventos próximamente...
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
