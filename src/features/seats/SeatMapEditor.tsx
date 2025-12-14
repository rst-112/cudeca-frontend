import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Save,
  Grid3x3,
  Circle,
  Square,
  MapPin,
  Undo,
  Redo,
  Tag,
  Shapes,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/utils';
import type {
  Asiento,
  EstadoAsiento,
  MapaAsientos,
  TipoEntrada,
  FormaAsiento,
  ObjetoDecorativo,
  TipoObjetoDecorativo,
} from '../../types/seatmap.types';

/**
 * SeatMapEditor - Editor interactivo para crear y modificar mapas de asientos
 */

export interface SeatMapEditorProps {
  mapaInicial?: MapaAsientos;
  onSave: (mapa: MapaAsientos) => void;
  ancho?: number;
  alto?: number;
}

type HerramientaEditor = 'select' | 'add' | 'delete';

/**
 * Colores del sistema reservados que no deben usarse en tipos de entrada
 */
const COLORES_RESERVADOS = [
  '#64748b', // slate-600 (ocupado)
  '#6b7280', // gray-600 (similar)
  '#ef4444', // red-500 (seleccionado)
  '#dc2626', // red-600 (similar)
  '#f87171', // red-400 (similar)
];

/**
 * Verifica si un color es muy similar a los colores reservados del sistema
 */
const esColorConflictivo = (color: string): boolean => {
  // Convertir color a RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const colorRgb = hexToRgb(color);
  if (!colorRgb) return false;

  // Verificar similitud con cada color reservado
  for (const reservado of COLORES_RESERVADOS) {
    const reservadoRgb = hexToRgb(reservado);
    if (!reservadoRgb) continue;

    // Calcular distancia euclidiana en espacio RGB
    const distancia = Math.sqrt(
      Math.pow(colorRgb.r - reservadoRgb.r, 2) +
        Math.pow(colorRgb.g - reservadoRgb.g, 2) +
        Math.pow(colorRgb.b - reservadoRgb.b, 2),
    );

    // Si la distancia es menor a 80, es muy similar
    if (distancia < 80) return true;
  }

  return false;
};

export const SeatMapEditor: React.FC<SeatMapEditorProps> = ({
  mapaInicial,
  onSave,
  ancho = 800,
  alto = 600,
}) => {
  // Estado del editor
  const [asientos, setAsientos] = useState<Asiento[]>(mapaInicial?.zonas?.[0]?.asientos || []);
  const [herramientaActiva, setHerramientaActiva] = useState<HerramientaEditor>('select');
  const [asientoSeleccionado, setAsientoSeleccionado] = useState<string | null>(null);
  const [objetoSeleccionado, setObjetoSeleccionado] = useState<string | null>(null);
  const [contadorAsientos, setContadorAsientos] = useState<number>(
    mapaInicial?.zonas?.[0]?.asientos.length || 0,
  );

  // Tipos de entrada (grupos VIP, VIP1, VIP2, Normal, etc.)
  const [tiposEntrada, setTiposEntrada] = useState<TipoEntrada[]>(mapaInicial?.tiposEntrada || []);
  const [editandoTipoEntrada, setEditandoTipoEntrada] = useState<TipoEntrada | null>(null);

  // Forma de asiento activa para nuevos asientos
  const [formaActiva, setFormaActiva] = useState<FormaAsiento>('circulo');

  // Objetos decorativos
  const [objetosDecorativos, setObjetosDecorativos] = useState<ObjetoDecorativo[]>(
    mapaInicial?.zonas?.[0]?.objetosDecorativos || [],
  );
  const [tipoObjetoActivo, setTipoObjetoActivo] = useState<TipoObjetoDecorativo | null>(null);

  // Configuración de layout automático
  const [configGrid, setConfigGrid] = useState({ filas: 5, columnas: 10 });
  const [configCircular, setConfigCircular] = useState({ asientos: 20, radio: 150 });

  // Sistema de Undo/Redo
  const [historial, setHistorial] = useState<
    { asientos: Asiento[]; objetos: ObjetoDecorativo[] }[]
  >([
    {
      asientos: mapaInicial?.zonas[0]?.asientos || [],
      objetos: mapaInicial?.zonas[0]?.objetosDecorativos || [],
    },
  ]);
  const [indiceHistorial, setIndiceHistorial] = useState<number>(0);

  // Drag & Drop
  const [arrastrando, setArrastrando] = useState<{ tipo: 'asiento' | 'objeto'; id: string } | null>(
    null,
  );
  const [posicionArrastre, setPosicionArrastre] = useState<{ x: number; y: number } | null>(null);
  const [mouseDownPos, setMouseDownPos] = useState<{ x: number; y: number } | null>(null);
  const [isDraggingStarted, setIsDraggingStarted] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Resize de objetos decorativos
  const [resizando, setResizando] = useState<{
    objetoId: string;
    handle: 'se' | 'ne' | 'sw' | 'nw';
  } | null>(null);

  /**
   * Calcula el viewBox dinámico basado en los asientos y objetos decorativos
   */
  const viewBox = React.useMemo(() => {
    const padding = 60;

    // Si no hay asientos ni objetos, usar dimensiones por defecto
    if (asientos.length === 0 && objetosDecorativos.length === 0) {
      return `0 0 ${ancho} ${alto}`;
    }

    // Calcular bounds de asientos
    const asientosBounds =
      asientos.length > 0
        ? {
            minX: Math.min(...asientos.map((a) => a.x)),
            maxX: Math.max(...asientos.map((a) => a.x)),
            minY: Math.min(...asientos.map((a) => a.y)),
            maxY: Math.max(...asientos.map((a) => a.y)),
          }
        : null;

    // Calcular bounds de objetos decorativos
    const objetosBounds =
      objetosDecorativos.length > 0
        ? {
            minX: Math.min(...objetosDecorativos.map((o) => o.x - o.ancho / 2)),
            maxX: Math.max(...objetosDecorativos.map((o) => o.x + o.ancho / 2)),
            minY: Math.min(...objetosDecorativos.map((o) => o.y - o.alto / 2)),
            maxY: Math.max(...objetosDecorativos.map((o) => o.y + o.alto / 2)),
          }
        : null;

    // Combinar bounds
    const minX =
      Math.min(asientosBounds?.minX ?? Infinity, objetosBounds?.minX ?? Infinity) - padding;
    const maxX =
      Math.max(asientosBounds?.maxX ?? -Infinity, objetosBounds?.maxX ?? -Infinity) + padding;
    const minY =
      Math.min(asientosBounds?.minY ?? Infinity, objetosBounds?.minY ?? Infinity) - padding;
    const maxY =
      Math.max(asientosBounds?.maxY ?? -Infinity, objetosBounds?.maxY ?? -Infinity) + padding;

    const width = maxX - minX;
    const height = maxY - minY;

    return `${minX} ${minY} ${width} ${height}`;
  }, [asientos, objetosDecorativos, ancho, alto]);

  /**
   * Guarda estado en historial para undo/redo
   */
  const guardarEnHistorial = useCallback(
    (nuevosAsientos: Asiento[], nuevosObjetos?: ObjetoDecorativo[]) => {
      setHistorial((prev) => {
        const nuevoHistorial = prev.slice(0, indiceHistorial + 1);
        nuevoHistorial.push({
          asientos: nuevosAsientos,
          objetos: nuevosObjetos !== undefined ? nuevosObjetos : objetosDecorativos,
        });
        return nuevoHistorial;
      });
      setIndiceHistorial((prev) => prev + 1);
    },
    [indiceHistorial, objetosDecorativos],
  );

  /**
   * Undo - Deshacer último cambio
   */
  const handleUndo = useCallback(() => {
    if (indiceHistorial > 0) {
      setIndiceHistorial((prev) => prev - 1);
      const estadoAnterior = historial[indiceHistorial - 1];
      setAsientos(estadoAnterior.asientos);
      setObjetosDecorativos(estadoAnterior.objetos);
    }
  }, [indiceHistorial, historial]);

  /**
   * Redo - Rehacer cambio deshecho
   */
  const handleRedo = useCallback(() => {
    if (indiceHistorial < historial.length - 1) {
      setIndiceHistorial((prev) => prev + 1);
      const estadoSiguiente = historial[indiceHistorial + 1];
      setAsientos(estadoSiguiente.asientos);
      setObjetosDecorativos(estadoSiguiente.objetos);
    }
  }, [indiceHistorial, historial]);

  /**
   * Atajos de teclado (Ctrl+Z, Ctrl+Y, Supr)
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'Delete' || e.key === 'Supr') {
        e.preventDefault();
        // Eliminar asiento seleccionado
        if (asientoSeleccionado) {
          const nuevosAsientos = asientos.filter((s) => s.id !== asientoSeleccionado);
          setAsientos(nuevosAsientos);
          guardarEnHistorial(nuevosAsientos);
          setAsientoSeleccionado(null);
        }
        // Eliminar objeto decorativo seleccionado
        else if (objetoSeleccionado) {
          const nuevosObjetos = objetosDecorativos.filter((o) => o.id !== objetoSeleccionado);
          setObjetosDecorativos(nuevosObjetos);
          guardarEnHistorial(asientos, nuevosObjetos);
          setObjetoSeleccionado(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleUndo,
    handleRedo,
    asientoSeleccionado,
    objetoSeleccionado,
    asientos,
    objetosDecorativos,
    guardarEnHistorial,
  ]);

  /**
   * Añadir asiento en posición del click
   */
  const handleAddSeat = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (herramientaActiva !== 'add' || arrastrando) return;

      const svg = e.currentTarget;

      // Usar transformación SVG para coordenadas precisas
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());

      // Si hay un tipo de objeto decorativo activo, añadir objeto decorativo
      if (tipoObjetoActivo) {
        const dimensiones = {
          escenario: { ancho: 300, alto: 50 },
          'mesa-grande': { ancho: 80, alto: 80 },
          barra: { ancho: 150, alto: 40 },
          decoracion: { ancho: 60, alto: 60 },
          texto: { ancho: 100, alto: 30 },
        };

        const colores = {
          escenario: '#9333ea',
          'mesa-grande': '#f59e0b',
          barra: '#3b82f6',
          decoracion: '#10b981',
          texto: '#6b7280',
        };

        const dim = dimensiones[tipoObjetoActivo];
        const nuevoObjeto: ObjetoDecorativo = {
          id: `deco-${Date.now()}`,
          tipo: tipoObjetoActivo,
          x: Math.round(svgP.x),
          y: Math.round(svgP.y),
          ancho: dim.ancho,
          alto: dim.alto,
          color: colores[tipoObjetoActivo],
          etiqueta: tipoObjetoActivo.toUpperCase(),
          clickeable: false,
        };

        const nuevosObjetos = [...objetosDecorativos, nuevoObjeto];
        setObjetosDecorativos(nuevosObjetos);
        guardarEnHistorial(asientos, nuevosObjetos);
        // NO desactivar tipoObjetoActivo para poder añadir múltiples objetos seguidos
        return;
      }

      // Si no hay tipos de entrada definidos, no permitir crear asientos
      if (tiposEntrada.length === 0) {
        alert('⚠️ Debes crear al menos un tipo de entrada antes de añadir asientos');
        return;
      }

      // Si no, añadir asiento normal
      const tipoEntradaActivo = tiposEntrada[0];

      const nuevoAsiento: Asiento = {
        id: `seat-${Date.now()}-${contadorAsientos}`,
        x: Math.round(svgP.x),
        y: Math.round(svgP.y),
        estado: 'LIBRE' as EstadoAsiento,
        etiqueta: `A${contadorAsientos + 1}`,
        fila: 1,
        columna: contadorAsientos + 1,
        tipoEntradaId: tipoEntradaActivo.id,
        tipoEntrada: tipoEntradaActivo,
        precio: tipoEntradaActivo.precio,
        forma: formaActiva,
        clickeable: true,
      };

      const nuevosAsientos = [...asientos, nuevoAsiento];
      setAsientos(nuevosAsientos);
      guardarEnHistorial(nuevosAsientos);
      setContadorAsientos((c) => c + 1);
      setAsientoSeleccionado(nuevoAsiento.id);
    },
    [
      herramientaActiva,
      contadorAsientos,
      asientos,
      arrastrando,
      guardarEnHistorial,
      tiposEntrada,
      formaActiva,
      tipoObjetoActivo,
      objetosDecorativos,
    ],
  );

  /**
   * Seleccionar asiento
   */
  const handleSelectSeat = useCallback(
    (id: string) => {
      if (herramientaActiva === 'select') {
        setAsientoSeleccionado(id);
        setObjetoSeleccionado(null);
      } else if (herramientaActiva === 'delete') {
        const nuevosAsientos = asientos.filter((s) => s.id !== id);
        setAsientos(nuevosAsientos);
        guardarEnHistorial(nuevosAsientos);
        if (asientoSeleccionado === id) {
          setAsientoSeleccionado(null);
        }
      }
    },
    [herramientaActiva, asientoSeleccionado, asientos, guardarEnHistorial],
  );

  /**
   * Seleccionar objeto decorativo
   */
  const handleSelectObjeto = useCallback(
    (id: string) => {
      if (herramientaActiva === 'select') {
        setObjetoSeleccionado(id);
        setAsientoSeleccionado(null);
      } else if (herramientaActiva === 'delete') {
        const nuevosObjetos = objetosDecorativos.filter((o) => o.id !== id);
        setObjetosDecorativos(nuevosObjetos);
        guardarEnHistorial(asientos, nuevosObjetos);
        if (objetoSeleccionado === id) {
          setObjetoSeleccionado(null);
        }
      }
    },
    [herramientaActiva, objetoSeleccionado, objetosDecorativos, asientos, guardarEnHistorial],
  );

  /**
   * Drag & Drop - Iniciar arrastre de asiento
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, seatId: string) => {
      if (herramientaActiva === 'select') {
        e.stopPropagation();
        // Guardar posición inicial del mouse
        setMouseDownPos({ x: e.clientX, y: e.clientY });
        setArrastrando({ tipo: 'asiento', id: seatId });
        setIsDraggingStarted(false);
        setAsientoSeleccionado(seatId);
        setObjetoSeleccionado(null);
      }
    },
    [herramientaActiva],
  );

  /**
   * Drag & Drop - Iniciar arrastre de objeto decorativo
   */
  const handleMouseDownObjeto = useCallback(
    (e: React.MouseEvent, objetoId: string) => {
      if (herramientaActiva === 'select') {
        e.stopPropagation();
        // Guardar posición inicial del mouse
        setMouseDownPos({ x: e.clientX, y: e.clientY });
        setArrastrando({ tipo: 'objeto', id: objetoId });
        setIsDraggingStarted(false);
        setObjetoSeleccionado(objetoId);
        setAsientoSeleccionado(null);
      }
    },
    [herramientaActiva],
  );

  /**
   * Drag & Drop - Mover elemento (asiento u objeto) o Resize de objeto
   */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!svgRef.current) return;

      const svg = svgRef.current;

      // Crear un punto SVG para transformación correcta
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;

      // Transformar el punto de coordenadas de pantalla a coordenadas SVG
      const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());

      // Manejar resize de objetos decorativos
      if (resizando) {
        const objeto = objetosDecorativos.find((o) => o.id === resizando.objetoId);
        if (!objeto) return;

        const mouseX = Math.round(svgP.x);
        const mouseY = Math.round(svgP.y);

        let nuevoAncho = objeto.ancho;
        let nuevoAlto = objeto.alto;
        const nuevoX = objeto.x;
        const nuevoY = objeto.y;

        switch (resizando.handle) {
          case 'se': // bottom-right
            nuevoAncho = Math.max(30, (mouseX - objeto.x) * 2);
            nuevoAlto = Math.max(30, (mouseY - objeto.y) * 2);
            break;
          case 'ne': // top-right
            nuevoAncho = Math.max(30, (mouseX - objeto.x) * 2);
            nuevoAlto = Math.max(30, (objeto.y - mouseY) * 2);
            break;
          case 'sw': // bottom-left
            nuevoAncho = Math.max(30, (objeto.x - mouseX) * 2);
            nuevoAlto = Math.max(30, (mouseY - objeto.y) * 2);
            break;
          case 'nw': // top-left
            nuevoAncho = Math.max(30, (objeto.x - mouseX) * 2);
            nuevoAlto = Math.max(30, (objeto.y - mouseY) * 2);
            break;
        }

        setObjetosDecorativos((prev) =>
          prev.map((o) =>
            o.id === resizando.objetoId
              ? { ...o, ancho: nuevoAncho, alto: nuevoAlto, x: nuevoX, y: nuevoY }
              : o,
          ),
        );
        return;
      }

      // Manejar drag normal
      if (!arrastrando) return;

      // Detectar si realmente se está arrastrando (movimiento > 5px)
      if (!isDraggingStarted && mouseDownPos) {
        const deltaX = Math.abs(e.clientX - mouseDownPos.x);
        const deltaY = Math.abs(e.clientY - mouseDownPos.y);

        if (deltaX > 5 || deltaY > 5) {
          setIsDraggingStarted(true);
        } else {
          return;
        }
      }

      // Solo actualizar la posición de arrastre temporal
      setPosicionArrastre({ x: Math.round(svgP.x), y: Math.round(svgP.y) });
    },
    [arrastrando, isDraggingStarted, mouseDownPos, resizando, objetosDecorativos],
  );

  /**
   * Drag & Drop - Finalizar arrastre o resize
   */
  const handleMouseUp = useCallback(() => {
    if (resizando) {
      guardarEnHistorial(asientos);
      setResizando(null);
      return;
    }

    // Finalizar drag
    if (arrastrando && posicionArrastre && isDraggingStarted) {
      // Aplicar la posición final al soltar solo si hubo movimiento real
      if (arrastrando.tipo === 'asiento') {
        setAsientos((prev) =>
          prev.map((seat) =>
            seat.id === arrastrando.id
              ? { ...seat, x: posicionArrastre.x, y: posicionArrastre.y }
              : seat,
          ),
        );
      } else if (arrastrando.tipo === 'objeto') {
        setObjetosDecorativos((prev) =>
          prev.map((obj) =>
            obj.id === arrastrando.id
              ? { ...obj, x: posicionArrastre.x, y: posicionArrastre.y }
              : obj,
          ),
        );
      }

      guardarEnHistorial(asientos);
    }

    // Limpiar estados de drag
    setArrastrando(null);
    setPosicionArrastre(null);
    setMouseDownPos(null);
    setIsDraggingStarted(false);
  }, [arrastrando, posicionArrastre, isDraggingStarted, resizando, asientos, guardarEnHistorial]);

  /**
   * Actualizar propiedad de asiento seleccionado
   */
  const handleUpdateSeat = useCallback(
    (
      propiedad: keyof Asiento,
      valor: string | number | TipoEntrada | FormaAsiento | EstadoAsiento | undefined,
    ) => {
      if (!asientoSeleccionado) return;

      setAsientos((prev) =>
        prev.map((seat) =>
          seat.id === asientoSeleccionado ? { ...seat, [propiedad]: valor } : seat,
        ),
      );
    },
    [asientoSeleccionado],
  );

  /**
   * Generar layout automático en grid
   */
  const handleGenerarGrid = useCallback(() => {
    const { filas, columnas } = configGrid;
    const espaciadoX = (ancho - 100) / columnas;
    const espaciadoY = (alto - 200) / filas;
    const offsetX = 50 + espaciadoX / 2;
    const offsetY = 100 + espaciadoY / 2;

    const nuevosAsientos: Asiento[] = [];

    for (let fila = 0; fila < filas; fila++) {
      for (let col = 0; col < columnas; col++) {
        nuevosAsientos.push({
          id: `seat-${fila}-${col}`,
          x: Math.round(offsetX + col * espaciadoX),
          y: Math.round(offsetY + fila * espaciadoY),
          estado: 'LIBRE',
          etiqueta: `${String.fromCharCode(65 + fila)}${col + 1}`,
          fila: fila + 1,
          columna: col + 1,
          tipoEntradaId: tiposEntrada[0]?.id || 1,
          tipoEntrada: tiposEntrada[0],
          precio: tiposEntrada[0]?.precio || 20,
          forma: formaActiva,
        });
      }
    }

    setAsientos(nuevosAsientos);
    guardarEnHistorial(nuevosAsientos);
    setContadorAsientos(nuevosAsientos.length);
    setAsientoSeleccionado(null);
  }, [configGrid, ancho, alto, guardarEnHistorial, tiposEntrada, formaActiva]);

  /**
   * Generar layout circular
   */
  const handleGenerarCircular = useCallback(() => {
    const { asientos: numAsientos, radio } = configCircular;
    const centroX = ancho / 2;
    const centroY = alto / 2;
    const nuevosAsientos: Asiento[] = [];

    for (let i = 0; i < numAsientos; i++) {
      const angulo = (i / numAsientos) * 2 * Math.PI - Math.PI / 2;
      const x = centroX + radio * Math.cos(angulo);
      const y = centroY + radio * Math.sin(angulo);

      nuevosAsientos.push({
        id: `seat-circular-${i}`,
        x: Math.round(x),
        y: Math.round(y),
        estado: 'LIBRE',
        etiqueta: `${i + 1}`,
        fila: 1,
        columna: i + 1,
        tipoEntradaId: tiposEntrada[0]?.id || 1,
        tipoEntrada: tiposEntrada[0],
        precio: tiposEntrada[0]?.precio || 20,
        forma: formaActiva,
      });
    }

    setAsientos(nuevosAsientos);
    guardarEnHistorial(nuevosAsientos);
    setContadorAsientos(nuevosAsientos.length);
    setAsientoSeleccionado(null);
  }, [configCircular, ancho, alto, guardarEnHistorial, tiposEntrada, formaActiva]);

  /**
   * Limpiar todos los asientos y objetos decorativos
   */
  const handleLimpiar = useCallback(() => {
    if (confirm('¿Estás seguro de eliminar todos los asientos y objetos decorativos?')) {
      setAsientos([]);
      setObjetosDecorativos([]);
      setAsientoSeleccionado(null);
      setObjetoSeleccionado(null);
      setContadorAsientos(0);
    }
  }, []);

  /**
   * Guardar configuración
   */
  const handleGuardar = useCallback(() => {
    const mapa: MapaAsientos = {
      eventoId: mapaInicial?.eventoId || 0,
      ancho,
      alto,
      zonas: [
        {
          id: 1,
          nombre: 'Zona Principal',
          aforoTotal: asientos.length,
          asientos,
          objetosDecorativos,
        },
      ],
      tiposEntrada,
    };

    onSave(mapa);
  }, [asientos, ancho, alto, mapaInicial, onSave, tiposEntrada, objetosDecorativos]);

  /**
   * Renderizar forma de asiento según su tipo
   */
  const renderSeatShape = useCallback((seat: Asiento, isSelected: boolean) => {
    const forma = seat.forma || 'circulo';
    const color = seat.tipoEntrada?.color || '#00A651';
    const fillClass = isSelected ? color : 'rgb(51, 65, 85)';
    const strokeClass = isSelected ? color : 'rgb(100, 116, 139)';

    switch (forma) {
      case 'cuadrado':
        return (
          <rect
            x={seat.x - 14}
            y={seat.y - 14}
            width={28}
            height={28}
            rx={3}
            fill={fillClass}
            stroke={strokeClass}
            strokeWidth={2}
            className="hover:opacity-80"
          />
        );

      case 'rectangulo':
        return (
          <rect
            x={seat.x - 18}
            y={seat.y - 10}
            width={36}
            height={20}
            rx={3}
            fill={fillClass}
            stroke={strokeClass}
            strokeWidth={2}
            className="hover:opacity-80"
          />
        );

      case 'triangulo':
        return (
          <polygon
            points={`${seat.x},${seat.y - 16} ${seat.x - 14},${seat.y + 10} ${seat.x + 14},${seat.y + 10}`}
            fill={fillClass}
            stroke={strokeClass}
            strokeWidth={2}
            className="hover:opacity-80"
          />
        );

      case 'circulo':
      default:
        return (
          <circle
            cx={seat.x}
            cy={seat.y}
            r={14}
            fill={fillClass}
            stroke={strokeClass}
            strokeWidth={2}
            className="hover:opacity-80"
          />
        );
    }
  }, []);

  const asientoActual = asientos.find((s) => s.id === asientoSeleccionado);

  return (
    <div className="flex h-screen gap-4 bg-slate-50 dark:bg-slate-950">
      {/* Panel izquierdo - Herramientas */}
      <aside className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-4 overflow-y-auto">
        {/* Herramientas básicas */}
        <div className="space-y-2">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide">
            Herramientas
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={herramientaActiva === 'select' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setHerramientaActiva('select')}
              className={cn(
                'flex-col h-auto py-3',
                herramientaActiva === 'select' && 'bg-[#00A651] hover:bg-[#008a43]',
              )}
            >
              <MapPin size={20} />
              <span className="text-xs mt-1">Seleccionar</span>
            </Button>
            <Button
              variant={herramientaActiva === 'add' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setHerramientaActiva('add')}
              className={cn(
                'flex-col h-auto py-3',
                herramientaActiva === 'add' && 'bg-[#00A651] hover:bg-[#008a43]',
              )}
            >
              <Plus size={20} />
              <span className="text-xs mt-1">Añadir</span>
            </Button>
            <Button
              variant={herramientaActiva === 'delete' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setHerramientaActiva('delete')}
              className={cn(
                'flex-col h-auto py-3',
                herramientaActiva === 'delete' && 'bg-red-500 hover:bg-red-600',
              )}
            >
              <Trash2 size={20} />
              <span className="text-xs mt-1">Eliminar</span>
            </Button>
          </div>

          {/* Undo/Redo */}
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={indiceHistorial === 0}
              className="flex-1 gap-1"
              title="Deshacer (Ctrl+Z)"
            >
              <Undo size={14} />
              Deshacer
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRedo}
              disabled={indiceHistorial === historial.length - 1}
              className="flex-1 gap-1"
              title="Rehacer (Ctrl+Y)"
            >
              <Redo size={14} />
              Rehacer
            </Button>
          </div>
        </div>

        <div className="h-px bg-slate-200 dark:bg-slate-700" />

        {/* Formas de asiento */}
        <div className="space-y-2">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide">
            Forma de Asiento
          </h3>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setFormaActiva('circulo')}
              className={cn(
                'aspect-square p-3 rounded border-2 flex items-center justify-center transition-all',
                formaActiva === 'circulo'
                  ? 'border-[#00A651] bg-[#00A651]/10'
                  : 'border-slate-300 dark:border-slate-700 hover:border-slate-400',
              )}
              title="Círculo - Butacas tradicionales"
            >
              <Circle
                size={20}
                className={
                  formaActiva === 'circulo'
                    ? 'text-[#00A651]'
                    : 'text-slate-600 dark:text-slate-400'
                }
              />
            </button>
            <button
              onClick={() => setFormaActiva('cuadrado')}
              className={cn(
                'aspect-square p-3 rounded border-2 flex items-center justify-center transition-all',
                formaActiva === 'cuadrado'
                  ? 'border-[#00A651] bg-[#00A651]/10'
                  : 'border-slate-300 dark:border-slate-700 hover:border-slate-400',
              )}
              title="Cuadrado - Asientos especiales"
            >
              <Square
                size={20}
                className={
                  formaActiva === 'cuadrado'
                    ? 'text-[#00A651]'
                    : 'text-slate-600 dark:text-slate-400'
                }
              />
            </button>
            <button
              onClick={() => setFormaActiva('rectangulo')}
              className={cn(
                'aspect-square p-3 rounded border-2 flex items-center justify-center transition-all',
                formaActiva === 'rectangulo'
                  ? 'border-[#00A651] bg-[#00A651]/10'
                  : 'border-slate-300 dark:border-slate-700 hover:border-slate-400',
              )}
              title="Rectángulo - Mesas"
            >
              <div
                className={cn(
                  'w-5 h-3 border-2 rounded-sm',
                  formaActiva === 'rectangulo'
                    ? 'border-[#00A651]'
                    : 'border-slate-600 dark:border-slate-400',
                )}
              />
            </button>
            <button
              onClick={() => setFormaActiva('triangulo')}
              className={cn(
                'aspect-square p-3 rounded border-2 flex items-center justify-center transition-all',
                formaActiva === 'triangulo'
                  ? 'border-[#00A651] bg-[#00A651]/10'
                  : 'border-slate-300 dark:border-slate-700 hover:border-slate-400',
              )}
              title="Triángulo - Indicadores especiales"
            >
              <div
                className={cn(
                  'w-0 h-0 border-l-10 border-r-10 border-b-16 border-l-transparent border-r-transparent',
                  formaActiva === 'triangulo'
                    ? 'border-b-[#00A651]'
                    : 'border-b-slate-600 dark:border-b-slate-400',
                )}
              />
            </button>
          </div>
        </div>

        <div className="h-px bg-slate-200 dark:bg-slate-700" />

        {/* Objetos Decorativos */}
        <div className="space-y-2">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide flex items-center gap-2">
            <Shapes size={14} />
            Objetos Decorativos
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Elementos no clickables (mesas, escenarios, decoración)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setTipoObjetoActivo(tipoObjetoActivo === 'escenario' ? null : 'escenario');
                if (tipoObjetoActivo !== 'escenario') setHerramientaActiva('add');
              }}
              className={cn(
                'p-2 rounded border-2 flex flex-col items-center justify-center gap-1 transition-all text-xs',
                tipoObjetoActivo === 'escenario'
                  ? 'border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300'
                  : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 text-slate-600 dark:text-slate-400',
              )}
              title="Escenario personalizado"
            >
              <div className="w-8 h-5 bg-purple-500/30 border border-purple-500 rounded" />
              Escenario
            </button>
            <button
              onClick={() => {
                setTipoObjetoActivo(tipoObjetoActivo === 'mesa-grande' ? null : 'mesa-grande');
                if (tipoObjetoActivo !== 'mesa-grande') setHerramientaActiva('add');
              }}
              className={cn(
                'p-2 rounded border-2 flex flex-col items-center justify-center gap-1 transition-all text-xs',
                tipoObjetoActivo === 'mesa-grande'
                  ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                  : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 text-slate-600 dark:text-slate-400',
              )}
              title="Mesa grande"
            >
              <div className="w-8 h-8 bg-amber-500/30 border border-amber-500 rounded" />
              Mesa
            </button>
            <button
              onClick={() => {
                setTipoObjetoActivo(tipoObjetoActivo === 'barra' ? null : 'barra');
                if (tipoObjetoActivo !== 'barra') setHerramientaActiva('add');
              }}
              className={cn(
                'p-2 rounded border-2 flex flex-col items-center justify-center gap-1 transition-all text-xs',
                tipoObjetoActivo === 'barra'
                  ? 'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300'
                  : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 text-slate-600 dark:text-slate-400',
              )}
              title="Barra / Mostrador"
            >
              <div className="w-10 h-3 bg-blue-500/30 border border-blue-500 rounded" />
              Barra
            </button>
            <button
              onClick={() => {
                setTipoObjetoActivo(tipoObjetoActivo === 'decoracion' ? null : 'decoracion');
                if (tipoObjetoActivo !== 'decoracion') setHerramientaActiva('add');
              }}
              className={cn(
                'p-2 rounded border-2 flex flex-col items-center justify-center gap-1 transition-all text-xs',
                tipoObjetoActivo === 'decoracion'
                  ? 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-300'
                  : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 text-slate-600 dark:text-slate-400',
              )}
              title="Elemento decorativo"
            >
              <Circle size={16} className="opacity-50" />
              Decoración
            </button>
          </div>
          {tipoObjetoActivo && (
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-800 dark:text-blue-200">
              💡 Click en el canvas para colocar "{tipoObjetoActivo}"
            </div>
          )}
        </div>

        <div className="h-px bg-slate-200 dark:bg-slate-700" />

        {/* Tipos de entrada */}
        <div className="space-y-2">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide flex items-center gap-2">
            <Tag size={14} />
            Tipos de Entrada
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {tiposEntrada.map((tipo) => (
              <div
                key={tipo.id}
                className="p-2 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {editandoTipoEntrada?.id === tipo.id ? (
                  // Modo edición
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editandoTipoEntrada.nombre}
                      onChange={(e) =>
                        setEditandoTipoEntrada({ ...editandoTipoEntrada, nombre: e.target.value })
                      }
                      className="w-full px-2 py-1 text-sm border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                      placeholder="Nombre"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={editandoTipoEntrada.precio}
                        onChange={(e) =>
                          setEditandoTipoEntrada({
                            ...editandoTipoEntrada,
                            precio: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-2 py-1 text-sm border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                        placeholder="Precio"
                        step="0.5"
                      />
                      <input
                        type="color"
                        value={editandoTipoEntrada.color}
                        onChange={(e) =>
                          setEditandoTipoEntrada({ ...editandoTipoEntrada, color: e.target.value })
                        }
                        className="w-full h-8 border rounded dark:bg-slate-800 dark:border-slate-700"
                      />
                      {esColorConflictivo(editandoTipoEntrada.color) && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded text-xs text-amber-800 dark:text-amber-300">
                          <AlertTriangle size={12} />
                          <span>Color muy similar a estados del sistema</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setTiposEntrada((prev) =>
                            prev.map((t) =>
                              t.id === editandoTipoEntrada.id ? editandoTipoEntrada : t,
                            ),
                          );
                          setEditandoTipoEntrada(null);
                        }}
                        className="flex-1 px-2 py-1 text-xs bg-[#00A651] text-white rounded hover:bg-[#008a43]"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditandoTipoEntrada(null)}
                        className="flex-1 px-2 py-1 text-xs bg-slate-300 dark:bg-slate-700 rounded hover:bg-slate-400 dark:hover:bg-slate-600"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  // Modo vista
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border-2 shrink-0"
                      style={{ backgroundColor: tipo.color, borderColor: tipo.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {tipo.nombre}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{tipo.precio}€</p>
                    </div>
                    <button
                      onClick={() => setEditandoTipoEntrada(tipo)}
                      className="px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    {tiposEntrada.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar tipo "${tipo.nombre}"?`)) {
                            setTiposEntrada((prev) => prev.filter((t) => t.id !== tipo.id));
                          }
                        }}
                        className="px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const nuevoTipo: TipoEntrada = {
                id: Math.max(...tiposEntrada.map((t) => t.id), 0) + 1,
                nombre: `Tipo ${tiposEntrada.length + 1}`,
                precio: 25,
                color: '#10b981', // verde por defecto (no conflictivo)
              };
              setTiposEntrada([...tiposEntrada, nuevoTipo]);
              // Abrir directamente en modo edición
              setEditandoTipoEntrada(nuevoTipo);
            }}
            className="w-full gap-2"
          >
            <Plus size={14} />
            Añadir Tipo
          </Button>
          <div className="p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <AlertTriangle size={12} className="mt-0.5 shrink-0" />
            <span>
              Evita usar colores grises o rojos muy oscuros (reservados para ocupado/seleccionado)
            </span>
          </div>
        </div>

        <div className="h-px bg-slate-200 dark:bg-slate-700" />

        {/* Layout automático */}
        <div className="space-y-2">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide">
            Layout Automático
          </h3>

          {/* Grid Layout */}
          <div className="space-y-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Grid (Cuadrícula)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400">Filas</label>
                <input
                  type="number"
                  value={configGrid.filas}
                  onChange={(e) =>
                    setConfigGrid((c) => ({ ...c, filas: parseInt(e.target.value) || 1 }))
                  }
                  className="w-full px-2 py-1 text-sm border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                  min={1}
                  max={20}
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400">Columnas</label>
                <input
                  type="number"
                  value={configGrid.columnas}
                  onChange={(e) =>
                    setConfigGrid((c) => ({ ...c, columnas: parseInt(e.target.value) || 1 }))
                  }
                  className="w-full px-2 py-1 text-sm border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                  min={1}
                  max={30}
                />
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerarGrid}
              className="w-full gap-2"
            >
              <Grid3x3 size={16} />
              Generar Grid {configGrid.filas}×{configGrid.columnas}
            </Button>
          </div>

          {/* Circular Layout */}
          <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Circular</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400">Asientos</label>
                <input
                  type="number"
                  value={configCircular.asientos}
                  onChange={(e) =>
                    setConfigCircular((c) => ({ ...c, asientos: parseInt(e.target.value) || 1 }))
                  }
                  className="w-full px-2 py-1 text-sm border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                  min={3}
                  max={50}
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400">Radio</label>
                <input
                  type="number"
                  value={configCircular.radio}
                  onChange={(e) =>
                    setConfigCircular((c) => ({ ...c, radio: parseInt(e.target.value) || 50 }))
                  }
                  className="w-full px-2 py-1 text-sm border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                  min={50}
                  max={300}
                />
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerarCircular}
              className="w-full gap-2"
            >
              <Circle size={16} />
              Generar Circular ({configCircular.asientos})
            </Button>
          </div>
        </div>

        <div className="h-px bg-slate-200 dark:bg-slate-700" />

        {/* Propiedades del asiento seleccionado */}
        {asientoActual ? (
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide">
              Asiento: {asientoActual.etiqueta}
            </h3>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Etiqueta
                </label>
                <input
                  type="text"
                  value={asientoActual.etiqueta}
                  onChange={(e) => handleUpdateSeat('etiqueta', e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    Fila
                  </label>
                  <input
                    type="number"
                    value={asientoActual.fila || 1}
                    onChange={(e) => handleUpdateSeat('fila', parseInt(e.target.value) || 1)}
                    className="w-full px-2 py-1 text-sm border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    Columna
                  </label>
                  <input
                    type="number"
                    value={asientoActual.columna || 1}
                    onChange={(e) => handleUpdateSeat('columna', parseInt(e.target.value) || 1)}
                    className="w-full px-2 py-1 text-sm border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Tipo de Entrada
                </label>
                <select
                  value={asientoActual.tipoEntradaId || 1}
                  onChange={(e) => {
                    const tipoId = parseInt(e.target.value);
                    const tipo = tiposEntrada.find((t) => t.id === tipoId);
                    handleUpdateSeat('tipoEntradaId', tipoId);
                    handleUpdateSeat('tipoEntrada', tipo);
                    if (tipo) handleUpdateSeat('precio', tipo.precio);
                  }}
                  className="w-full px-3 py-2 text-sm border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                >
                  {tiposEntrada.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre} - {tipo.precio}€
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Forma
                </label>
                <select
                  value={asientoActual.forma || 'circulo'}
                  onChange={(e) => handleUpdateSeat('forma', e.target.value as FormaAsiento)}
                  className="w-full px-3 py-2 text-sm border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                >
                  <option value="circulo">Círculo (Butaca)</option>
                  <option value="cuadrado">Cuadrado</option>
                  <option value="rectangulo">Rectángulo (Mesa)</option>
                  <option value="triangulo">Triángulo</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Precio (€)
                </label>
                <input
                  type="number"
                  value={asientoActual.precio || 0}
                  onChange={(e) => handleUpdateSeat('precio', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                  step="0.5"
                  min="0"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    X
                  </label>
                  <input
                    type="number"
                    value={Math.round(asientoActual.x)}
                    onChange={(e) => handleUpdateSeat('x', parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-sm border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    Y
                  </label>
                  <input
                    type="number"
                    value={Math.round(asientoActual.y)}
                    onChange={(e) => handleUpdateSeat('y', parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-sm border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : objetoSeleccionado ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Editar Objeto Decorativo
            </h3>
            <div className="space-y-3">
              {(() => {
                const objeto = objetosDecorativos.find((o) => o.id === objetoSeleccionado);
                if (!objeto) return null;

                return (
                  <>
                    <div>
                      <label className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        Tipo
                      </label>
                      <input
                        type="text"
                        value={objeto.tipo}
                        disabled
                        className="w-full px-3 py-2 text-sm border rounded bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        Etiqueta
                      </label>
                      <input
                        type="text"
                        value={objeto.etiqueta || ''}
                        onChange={(e) => {
                          setObjetosDecorativos((prev) =>
                            prev.map((o) =>
                              o.id === objetoSeleccionado ? { ...o, etiqueta: e.target.value } : o,
                            ),
                          );
                        }}
                        className="w-full px-3 py-2 text-sm border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                        placeholder="Ej: Mesa principal"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        Color
                      </label>
                      <input
                        type="color"
                        value={objeto.color || '#9333ea'}
                        onChange={(e) => {
                          setObjetosDecorativos((prev) =>
                            prev.map((o) =>
                              o.id === objetoSeleccionado ? { ...o, color: e.target.value } : o,
                            ),
                          );
                        }}
                        className="w-full h-10 px-1 py-1 border rounded dark:bg-slate-800 dark:border-slate-700"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          Ancho
                        </label>
                        <input
                          type="number"
                          value={Math.round(objeto.ancho)}
                          onChange={(e) => {
                            const nuevoAncho = parseInt(e.target.value) || 50;
                            setObjetosDecorativos((prev) =>
                              prev.map((o) =>
                                o.id === objetoSeleccionado ? { ...o, ancho: nuevoAncho } : o,
                              ),
                            );
                          }}
                          className="w-full px-2 py-1 text-sm border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                          min="20"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          Alto
                        </label>
                        <input
                          type="number"
                          value={Math.round(objeto.alto)}
                          onChange={(e) => {
                            const nuevoAlto = parseInt(e.target.value) || 50;
                            setObjetosDecorativos((prev) =>
                              prev.map((o) =>
                                o.id === objetoSeleccionado ? { ...o, alto: nuevoAlto } : o,
                              ),
                            );
                          }}
                          className="w-full px-2 py-1 text-sm border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                          min="20"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          X
                        </label>
                        <input
                          type="number"
                          value={Math.round(objeto.x)}
                          onChange={(e) => {
                            setObjetosDecorativos((prev) =>
                              prev.map((o) =>
                                o.id === objetoSeleccionado
                                  ? { ...o, x: parseInt(e.target.value) || 0 }
                                  : o,
                              ),
                            );
                          }}
                          className="w-full px-2 py-1 text-sm border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          Y
                        </label>
                        <input
                          type="number"
                          value={Math.round(objeto.y)}
                          onChange={(e) => {
                            setObjetosDecorativos((prev) =>
                              prev.map((o) =>
                                o.id === objetoSeleccionado
                                  ? { ...o, y: parseInt(e.target.value) || 0 }
                                  : o,
                              ),
                            );
                          }}
                          className="w-full px-2 py-1 text-sm border rounded dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        const nuevosObjetos = objetosDecorativos.filter(
                          (o) => o.id !== objetoSeleccionado,
                        );
                        setObjetosDecorativos(nuevosObjetos);
                        setObjetoSeleccionado(null);
                        guardarEnHistorial(asientos, nuevosObjetos);
                      }}
                      variant="destructive"
                      className="w-full gap-2 mt-2"
                    >
                      <Trash2 size={16} />
                      Eliminar Objeto
                    </Button>
                  </>
                );
              })()}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-sm">
            Selecciona un asiento u objeto para editar sus propiedades
          </div>
        )}

        {/* Acciones finales */}
        <div className="mt-auto space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">
            Total de asientos: <span className="font-bold">{asientos.length}</span>
          </div>
          <Button
            onClick={handleGuardar}
            className="w-full gap-2 bg-[#00A651] hover:bg-[#008a43]"
            disabled={asientos.length === 0}
          >
            <Save size={16} />
            Guardar Mapa
          </Button>
          <Button variant="outline" onClick={handleLimpiar} className="w-full gap-2 text-red-600">
            <Trash2 size={16} />
            Limpiar Todo
          </Button>
        </div>
      </aside>

      {/* Área de trabajo - Canvas SVG */}
      <main className="flex-1 bg-slate-100 dark:bg-slate-950 p-4 overflow-hidden flex flex-col">
        <div className="flex-1 bg-slate-950 rounded-xl shadow-lg overflow-hidden relative">
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={3}
            wheel={{ step: 0.1 }}
            doubleClick={{ disabled: true }}
            panning={{ disabled: false }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                {/* Controles de Zoom - Esquina superior derecha */}
                <div className="absolute top-3 right-3 z-20 flex flex-col gap-1">
                  <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-xl border border-slate-700/50 p-1 flex flex-col gap-1">
                    <button
                      onClick={() => zoomIn(0.3)}
                      className="h-9 w-9 p-0 text-slate-300 hover:text-white hover:bg-slate-700 rounded flex items-center justify-center transition-colors"
                      aria-label="Acercar"
                    >
                      <ZoomIn size={18} />
                    </button>
                    <button
                      onClick={() => zoomOut(0.3)}
                      className="h-9 w-9 p-0 text-slate-300 hover:text-white hover:bg-slate-700 rounded flex items-center justify-center transition-colors"
                      aria-label="Alejar"
                    >
                      <ZoomOut size={18} />
                    </button>
                    <div className="h-px bg-slate-600 mx-1" />
                    <button
                      onClick={() => resetTransform()}
                      className="h-9 w-9 p-0 text-slate-300 hover:text-white hover:bg-slate-700 rounded flex items-center justify-center transition-colors"
                      aria-label="Restablecer vista"
                    >
                      <RotateCcw size={18} />
                    </button>
                  </div>
                </div>

                <TransformComponent
                  wrapperStyle={{
                    width: '100%',
                    height: '100%',
                  }}
                  contentStyle={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  wrapperClass="cursor-grab active:cursor-grabbing"
                >
                  <svg
                    ref={svgRef}
                    viewBox={viewBox}
                    className={cn(
                      'w-full h-full',
                      herramientaActiva === 'add' && 'cursor-crosshair',
                      herramientaActiva === 'select' && !arrastrando && 'cursor-default',
                      arrastrando && 'cursor-move',
                    )}
                    onClick={handleAddSeat}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Grid de referencia */}
                    <defs>
                      <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path
                          d="M 50 0 L 0 0 0 50"
                          fill="none"
                          stroke="rgba(148, 163, 184, 0.1)"
                          strokeWidth="1"
                        />
                      </pattern>
                    </defs>
                    <rect x="-5000" y="-5000" width="10000" height="10000" fill="url(#grid)" />

                    {/* Renderizado de objetos decorativos (ahora clickables y editables) */}
                    {objetosDecorativos.map((obj) => {
                      const isSelected = obj.id === objetoSeleccionado;
                      const isDragging =
                        arrastrando?.tipo === 'objeto' &&
                        arrastrando.id === obj.id &&
                        isDraggingStarted;

                      // Si se está arrastrando, usar posicionArrastre para rendering suave
                      const displayX = isDragging && posicionArrastre ? posicionArrastre.x : obj.x;
                      const displayY = isDragging && posicionArrastre ? posicionArrastre.y : obj.y;

                      return (
                        <g
                          key={obj.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectObjeto(obj.id);
                          }}
                          onMouseDown={(e) => {
                            if (herramientaActiva === 'select') {
                              handleMouseDownObjeto(e, obj.id);
                            }
                          }}
                          className={cn(
                            isDragging ? '' : 'transition-all duration-200',
                            herramientaActiva === 'select' && 'cursor-move',
                            herramientaActiva === 'delete' && 'cursor-pointer',
                            isSelected && 'drop-shadow-lg',
                          )}
                        >
                          {/* Highlight de selección */}
                          {isSelected && (
                            <rect
                              x={displayX - obj.ancho / 2 - 5}
                              y={displayY - obj.alto / 2 - 5}
                              width={obj.ancho + 10}
                              height={obj.alto + 10}
                              rx={8}
                              className="fill-[#00A651]/30 animate-pulse"
                              strokeWidth={2}
                              stroke="#00A651"
                              strokeDasharray="5,5"
                            />
                          )}
                          <rect
                            x={displayX - obj.ancho / 2}
                            y={displayY - obj.alto / 2}
                            width={obj.ancho}
                            height={obj.alto}
                            rx={6}
                            fill={obj.color || '#9333ea'}
                            fillOpacity={0.3}
                            stroke={obj.color || '#9333ea'}
                            strokeWidth={isSelected ? 3 : 2}
                          />
                          <text
                            x={displayX}
                            y={displayY}
                            textAnchor="middle"
                            dy={4}
                            className="text-[10px] font-bold pointer-events-none select-none font-['Arimo'] fill-slate-700 dark:fill-slate-300"
                          >
                            {obj.etiqueta || obj.tipo}
                          </text>

                          {/* Handles de resize (solo cuando está seleccionado) */}
                          {isSelected && (
                            <>
                              {/* Esquina SE (bottom-right) */}
                              <circle
                                cx={displayX + obj.ancho / 2}
                                cy={displayY + obj.alto / 2}
                                r={6}
                                fill="#00A651"
                                stroke="white"
                                strokeWidth={2}
                                className="cursor-nwse-resize"
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                  setResizando({ objetoId: obj.id, handle: 'se' });
                                }}
                              />
                              {/* Esquina NE (top-right) */}
                              <circle
                                cx={displayX + obj.ancho / 2}
                                cy={displayY - obj.alto / 2}
                                r={6}
                                fill="#00A651"
                                stroke="white"
                                strokeWidth={2}
                                className="cursor-nesw-resize"
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                  setResizando({ objetoId: obj.id, handle: 'ne' });
                                }}
                              />
                              {/* Esquina SW (bottom-left) */}
                              <circle
                                cx={displayX - obj.ancho / 2}
                                cy={displayY + obj.alto / 2}
                                r={6}
                                fill="#00A651"
                                stroke="white"
                                strokeWidth={2}
                                className="cursor-nesw-resize"
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                  setResizando({ objetoId: obj.id, handle: 'sw' });
                                }}
                              />
                              {/* Esquina NW (top-left) */}
                              <circle
                                cx={displayX - obj.ancho / 2}
                                cy={displayY - obj.alto / 2}
                                r={6}
                                fill="#00A651"
                                stroke="white"
                                strokeWidth={2}
                                className="cursor-nwse-resize"
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                  setResizando({ objetoId: obj.id, handle: 'nw' });
                                }}
                              />
                            </>
                          )}
                        </g>
                      );
                    })}

                    {/* Renderizado de asientos */}
                    {asientos.map((seat) => {
                      const isSelected = seat.id === asientoSeleccionado;
                      const isDragging =
                        arrastrando?.tipo === 'asiento' &&
                        arrastrando.id === seat.id &&
                        isDraggingStarted;

                      // Si se está arrastrando, usar posicionArrastre para rendering suave
                      const displayX = isDragging && posicionArrastre ? posicionArrastre.x : seat.x;
                      const displayY = isDragging && posicionArrastre ? posicionArrastre.y : seat.y;

                      return (
                        <g
                          key={seat.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectSeat(seat.id);
                          }}
                          onMouseDown={(e) => handleMouseDown(e, seat.id)}
                          className={cn(
                            isDragging ? '' : 'transition-all duration-200',
                            herramientaActiva === 'select' && 'cursor-move',
                            herramientaActiva === 'delete' && 'cursor-pointer',
                            isSelected && 'drop-shadow-lg',
                          )}
                        >
                          {/* Highlight de selección */}
                          {isSelected && (
                            <circle
                              cx={displayX}
                              cy={displayY}
                              r={20}
                              className="fill-[#00A651]/30 animate-pulse"
                            />
                          )}
                          {/* Forma del asiento */}
                          {renderSeatShape({ ...seat, x: displayX, y: displayY }, isSelected)}
                          <text
                            x={displayX}
                            y={displayY}
                            dy={4}
                            textAnchor="middle"
                            className={cn(
                              'text-[10px] font-bold pointer-events-none select-none font-["Arimo"]',
                              isSelected ? 'fill-white' : 'fill-slate-300',
                            )}
                          >
                            {seat.etiqueta}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>

        {/* Instrucciones compactas */}
        <div className="mt-3 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-xs text-blue-800 dark:text-blue-200">
          {herramientaActiva === 'add' && '✏️ Click para añadir asientos'}
          {herramientaActiva === 'select' && '🖱️ Arrastra para mover • Click para editar'}
          {herramientaActiva === 'delete' && '🗑️ Click para eliminar'}
          <span className="ml-2 opacity-75">
            | <kbd className="px-1 bg-blue-100 dark:bg-blue-800 rounded">Ctrl+Z</kbd> Deshacer
          </span>
        </div>
      </main>
    </div>
  );
};

export default SeatMapEditor;
