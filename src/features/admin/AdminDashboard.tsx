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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Gestión de Eventos</h1>
        <Button asChild>
          <Link to="/creacion-eventos">
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Evento
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Card de Bienvenida (opcional, se puede quitar si prefieres) */}
        <Card className="bg-white dark:bg-slate-800 border-0 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">Bienvenido, {user?.nombre}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 dark:text-gray-400">
              Desde aquí podrás gestionar los eventos de la plataforma.
            </p>
          </CardContent>
        </Card>

        {/* Lista de Eventos */}
        <Card className="bg-white dark:bg-slate-800 border-0 dark:border-slate-700">
          <CardContent className="p-6">
            <ListaEventos />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
