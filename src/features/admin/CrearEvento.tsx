import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/Form';
import { createEvento, type EventCreationRequest } from '../../services/eventos.service';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const eventoSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().optional(),
  imagenUrl: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  fechaInicio: z.string().refine((val) => !isNaN(Date.parse(val)), 'Fecha inválida'),
  fechaFin: z.string().optional(),
  lugar: z.string().min(3, 'El lugar es requerido'),
  objetivoRecaudacion: z.coerce.number().nonnegative('El objetivo debe ser positivo').optional(),
});

type EventoFormData = z.infer<typeof eventoSchema>;

export default function CrearEvento() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'general' | 'tickets'>('general');

  const form = useForm<EventoFormData>({
    resolver: zodResolver(eventoSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      imagenUrl: '',
      fechaInicio: '',
      fechaFin: '',
      lugar: '',
      objetivoRecaudacion: 0,
    },
  });

  const onSubmit = async (data: EventoFormData) => {
    try {
      const eventData: EventCreationRequest = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        fechaInicio: new Date(data.fechaInicio).toISOString(),
        fechaFin: data.fechaFin ? new Date(data.fechaFin).toISOString() : undefined,
        lugar: data.lugar,
        objetivoRecaudacion: data.objetivoRecaudacion,
        imagenUrl: data.imagenUrl,
      };

      await createEvento(eventData);
      toast.success('Evento creado correctamente');
      navigate('/admin');
    } catch (error) {
      console.error(error);
      toast.error('Error al crear el evento');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 -m-8 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin')}
            className="hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Crear Nuevo Evento
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Completa la información para publicar un nuevo evento
            </p>
          </div>
        </div>

        {/* Tabs simplificadas */}
        <div className="bg-white dark:bg-slate-900 rounded-t-2xl border-b border-slate-200 dark:border-slate-800 flex gap-8 px-6">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-4 px-1 font-semibold transition-colors border-b-2 ${
              activeTab === 'general'
                ? 'border-[#00a651] text-[#00a651]'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            Información General
          </button>
          <button
            onClick={() => {
              toast.info('Guarda el evento primero para añadir entradas');
            }}
            className="py-4 px-1 font-semibold transition-colors border-b-2 border-transparent text-slate-400 dark:text-slate-600 cursor-not-allowed"
          >
            Tipos de Entrada (Guardar primero)
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-b-2xl shadow-lg border border-slate-200 dark:border-slate-800">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Columna Izquierda */}
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del evento</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Concierto Benéfico" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="descripcion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Detalles del evento..."
                            className="h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="imagenUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de imagen</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Columna Derecha */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fechaInicio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inicio</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fechaFin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fin (Opcional)</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="lugar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lugar / Ubicación</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Palacio de Congresos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="objetivoRecaudacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Objetivo (€)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="5000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-8 border-t border-slate-200 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin')}
                  className="px-6 h-11 font-semibold"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-[#00a651] hover:bg-[#008a43] px-8 h-11 font-semibold shadow-lg hover:shadow-xl"
                >
                  Crear Evento
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
