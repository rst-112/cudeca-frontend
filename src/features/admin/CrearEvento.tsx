import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Label } from '../../components/ui/Label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/Form';
import { createEvento } from '../../services/eventos.service';
import { toast } from 'sonner';

// Esquema de validación con Zod
const eventoSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  imagenUrl: z.string().url('Debe ser una URL válida'),
  fecha: z.string().refine((val) => !isNaN(Date.parse(val)), 'Fecha inválida'),
  ubicacion: z.string().min(3, 'La ubicación es requerida'),
  capacidad: z.coerce.number().int().positive('La capacidad debe ser un número positivo'),
  objetivo: z.coerce.number().positive('El objetivo debe ser un número positivo'),
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
      fecha: '',
      ubicacion: '',
      capacidad: 0,
      objetivo: 0,
    },
  });

  const onSubmit = async (data: EventoFormData) => {
    const promise = createEvento({
      ...data,
      fecha: new Date(data.fecha).toISOString(),
      // Valores por defecto para los campos que no están en el formulario
      estado: 'BORRADOR',
      recaudado: 0,
      categoria: 'Otro',
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
                  name="fecha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha y Hora</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ubicacion"
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
                  name="capacidad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacidad máxima</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="objetivo"
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
