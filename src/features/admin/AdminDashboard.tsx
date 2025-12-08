import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/index';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-6">
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
  );
}
