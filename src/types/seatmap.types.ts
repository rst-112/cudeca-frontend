/**
 * Tipos para el sistema de Mapa de Asientos interactivo
 * Alineado con el modelo de backend: EstadoAsiento, Asiento, ZonaRecinto
 * @see cudeca-backend/src/main/java/com/cudeca/model/evento/Asiento.java
 * @see cudeca-backend/src/main/resources/db/migration/V1__Initial_Schema.sql (línea 208-225)
 */

// Estados alineados con el enum del backend (estado_asiento)
export type EstadoAsiento = 'LIBRE' | 'OCUPADO' | 'SELECCIONADO' | 'BLOQUEADO' | 'VENDIDO';

// Formas disponibles para representar diferentes tipos de asientos
export type FormaAsiento = 'circulo' | 'cuadrado' | 'rectangulo' | 'triangulo';

// Tipos de objetos decorativos/no clickables
export type TipoObjetoDecorativo = 'escenario' | 'mesa-grande' | 'barra' | 'decoracion' | 'texto';

export interface ObjetoDecorativo {
  id: string;
  tipo: TipoObjetoDecorativo;
  x: number;
  y: number;
  ancho: number;
  alto: number;
  rotacion?: number;
  color?: string;
  etiqueta?: string;
  clickeable: false; // Siempre false para objetos decorativos
}

// Tipo de entrada con configuración personalizable
export interface TipoEntrada {
  id: number;
  nombre: string;
  precio: number;
  color: string;
  descripcion?: string;
}

export interface Asiento {
  id: string;
  x: number;
  y: number;
  estado: EstadoAsiento;
  etiqueta: string;
  fila?: number;
  columna?: number;
  tipoEntradaId?: number;
  tipoEntrada?: TipoEntrada;
  precio?: number;
  zonaId?: number;
  forma?: FormaAsiento;
  clickeable?: boolean; // true por defecto para asientos
}

export interface ZonaMapa {
  id: number;
  nombre: string;
  aforoTotal: number;
  asientos: Asiento[];
  objetosDecorativos?: ObjetoDecorativo[];
}

export interface MapaAsientos {
  eventoId: number;
  ancho: number;
  alto: number;
  zonas: ZonaMapa[];
  tiposEntrada?: TipoEntrada[];
}

export interface SeatMapViewerProps {
  asientos: Asiento[];
  objetosDecorativos?: ObjetoDecorativo[];
  onSelectSeat: (id: string) => void;
  ancho?: number;
  alto?: number;
  mostrarEscenario?: boolean;
  tituloEscenario?: string;
}

export interface SeatMapEditorProps {
  mapaInicial?: MapaAsientos;
  onSave: (mapa: MapaAsientos) => void;
}

// Configuración de colores por estado
export const SEAT_COLORS = {
  LIBRE: {
    fill: 'fill-[#00A651]/20',
    stroke: 'stroke-[#00A651]',
    hover: 'hover:fill-[#00A651]/40',
    text: 'fill-slate-200',
  },
  SELECCIONADO: {
    fill: 'fill-[#F29325]',
    stroke: 'stroke-[#F29325]',
    hover: '',
    text: 'fill-white',
  },
  OCUPADO: {
    fill: 'fill-slate-600',
    stroke: 'stroke-slate-500',
    hover: '',
    text: 'fill-slate-400',
  },
  VENDIDO: {
    fill: 'fill-slate-600',
    stroke: 'stroke-slate-500',
    hover: '',
    text: 'fill-slate-400',
  },
  BLOQUEADO: {
    fill: 'fill-red-500/30',
    stroke: 'stroke-red-500',
    hover: '',
    text: 'fill-red-300',
  },
} as const;
