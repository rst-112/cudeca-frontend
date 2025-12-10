import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PlusCircle } from 'lucide-react';
import ListaEventos from './ListaEventos';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestión de Eventos</h1>
        <Button asChild>
          <Link to="/admin/eventos/crear">
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Evento
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Card de Bienvenida (opcional, se puede quitar si prefieres) */}
        <Card>
          <CardHeader>
            <CardTitle>Bienvenido, {user?.nombre}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Desde aquí podrás gestionar los eventos de la plataforma.
            </p>
          </CardContent>
        </Card>

        {/* Lista de Eventos */}
        <Card>
          <CardContent className="p-6">
            <ListaEventos />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
