import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/Form';
import { createEvento } from '../../services/eventos.service';
import { toast } from 'sonner';

// Esquema de validación con Zod - Campos alineados con EventCreationRequest del backend
const eventoSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(150, 'El nombre no puede exceder 150 caracteres'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').max(2000, 'La descripción no puede exceder 2000 caracteres').optional().or(z.literal('')),
  imagenUrl: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  fechaInicio: z.string().refine((val) => !isNaN(Date.parse(val)), 'Fecha inválida'),
  lugar: z.string().min(3, 'El lugar es requerido'),
  objetivoRecaudacion: z.coerce.number().nonnegative('El objetivo debe ser un número no negativo').optional(),
});

type EventoFormData = z.infer<typeof eventoSchema>;

const CrearEvento = () => {
  const navigate = useNavigate();
  const form = useForm<EventoFormData>({
    resolver: zodResolver(eventoSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      imagenUrl: '',
      fechaInicio: '',
      lugar: '',
      objetivoRecaudacion: 0,
    },
  });

  const onSubmit = async (data: EventoFormData) => {
    // Convertir la fecha a formato ISO 8601 con zona horaria (OffsetDateTime)
    const fechaInicio = new Date(data.fechaInicio).toISOString();

    const promise = createEvento({
      nombre: data.nombre,
      descripcion: data.descripcion || undefined,
      fechaInicio,
      lugar: data.lugar,
      objetivoRecaudacion: data.objetivoRecaudacion || undefined,
      imagenUrl: data.imagenUrl || undefined,
    });

    toast.promise(promise, {
      loading: 'Creando evento...',
      success: (nuevoEvento) => {
        navigate('/admin');
        return `¡Evento "${nuevoEvento.nombre}" creado como borrador!`;
      },
      error: 'Error al crear el evento.',
    });
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-green-600 mb-8">
        Formulario de creación de eventos
      </h1>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {/* Columna Izquierda */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del evento</FormLabel>
                      <FormControl>
                        <Input placeholder="Introduzca un nombre" {...field} />
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
                      <FormLabel>Descripción del evento</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Texto donde describa al evento" className="h-48" {...field} />
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
                      <FormLabel>URL de la imagen</FormLabel>
                      <FormControl>
                        <Input placeholder="https://.../imagen.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Columna Derecha */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="fechaInicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha y Hora de Inicio</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lugar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lugar de evento</FormLabel>
                      <FormControl>
                        <Input placeholder="Dirección" {...field} />
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
                      <FormLabel>Objetivo de recaudación (€)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Acciones */}
            <div className="mt-12 pt-8 border-t dark:border-gray-700 flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creando...' : 'Crear Evento'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CrearEvento;
