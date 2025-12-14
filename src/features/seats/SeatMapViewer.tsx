import React, { useCallback, useMemo } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Asiento, SeatMapViewerProps } from '../../types/seatmap.types';
import { SEAT_COLORS } from '../../types/seatmap.types';

/**
 * SeatMapViewer - Componente para visualizar el mapa de asientos con zoom y pan
 * Usa react-zoom-pan-pinch para interactividad táctil y de ratón
 */
export const SeatMapViewer: React.FC<SeatMapViewerProps> = ({
  asientos,
  objetosDecorativos = [],
  onSelectSeat,
  ancho = 800,
  alto = 600,
  mostrarEscenario = true,
  tituloEscenario = 'ESCENARIO',
}) => {
  /**
   * Calcula el viewBox dinámico basado en los asientos y objetos decorativos
   */
  const viewBox = useMemo(() => {
    const padding = 60;
    const escenarioOffset = mostrarEscenario ? 80 : 0;

    // Si no hay asientos ni objetos, usar dimensiones por defecto
    if (asientos.length === 0 && objetosDecorativos.length === 0) {
      return { minX: 0, minY: 0, width: ancho, height: alto };
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
      Math.min(asientosBounds?.minY ?? Infinity, objetosBounds?.minY ?? Infinity) -
      padding -
      escenarioOffset;
    const maxY =
      Math.max(asientosBounds?.maxY ?? -Infinity, objetosBounds?.maxY ?? -Infinity) + padding;

    return {
      minX,
      minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }, [asientos, objetosDecorativos, ancho, alto, mostrarEscenario]);

  /**
   * Retorna las clases CSS según el estado del asiento
   */
  const getAsientoClasses = useCallback((estado: Asiento['estado']) => {
    const colors = SEAT_COLORS[estado] || SEAT_COLORS.LIBRE;
    return {
      circle: cn(colors.fill, colors.stroke, colors.hover, 'stroke-2 transition-all duration-200'),
      text: cn(colors.text, 'text-[10px] font-bold pointer-events-none select-none font-["Arimo"]'),
    };
  }, []);

  /**
   * Renderiza la forma del asiento según su tipo
   */
  const renderSeatShape = useCallback(
    (seat: Asiento) => {
      const forma = seat.forma || 'circulo';
      const classes = getAsientoClasses(seat.estado);
      const color = seat.tipoEntrada?.color;

      // Usar color del tipo de entrada si existe y está en estado LIBRE
      const customColor =
        seat.estado === 'LIBRE' && color ? { fill: `${color}33`, stroke: color } : {};

      switch (forma) {
        case 'cuadrado':
          return (
            <rect
              x={seat.x - 14}
              y={seat.y - 14}
              width={28}
              height={28}
              rx={3}
              className={classes.circle}
              style={customColor}
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
              className={classes.circle}
              style={customColor}
            />
          );

        case 'triangulo':
          return (
            <polygon
              points={`${seat.x},${seat.y - 16} ${seat.x - 14},${seat.y + 10} ${seat.x + 14},${seat.y + 10}`}
              className={classes.circle}
              style={customColor}
            />
          );

        case 'circulo':
        default:
          return (
            <circle cx={seat.x} cy={seat.y} r={14} className={classes.circle} style={customColor} />
          );
      }
    },
    [getAsientoClasses],
  );

  /**
   * Determina si un asiento es clickeable
   */
  const isClickable = useCallback((estado: Asiento['estado']) => {
    return estado === 'LIBRE' || estado === 'SELECCIONADO';
  }, []);

  /**
   * Maneja el click en un asiento - PREVIENE DOBLE CLICK
   */
  const handleSeatClick = useCallback(
    (e: React.MouseEvent, seat: Asiento) => {
      e.stopPropagation();

      if (isClickable(seat.estado)) {
        onSelectSeat(seat.id);
      }
    },
    [isClickable, onSelectSeat],
  );

  /**
   * Maneja eventos de teclado para accesibilidad
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, seat: Asiento) => {
      if ((e.key === 'Enter' || e.key === ' ') && isClickable(seat.estado)) {
        e.preventDefault();
        e.stopPropagation();
        onSelectSeat(seat.id);
      }
    },
    [isClickable, onSelectSeat],
  );

  // Centro del escenario basado en el viewBox
  const escenarioCentroX = viewBox.minX + viewBox.width / 2;
  const escenarioY = viewBox.minY + 30;
  const escenarioAncho = Math.min(viewBox.width * 0.6, 400);

  return (
    <div className="relative w-full h-full min-h-[400px] bg-slate-950 rounded-xl overflow-hidden">
      {/* Contenedor del mapa con zoom/pan */}
      <TransformWrapper
        initialScale={1}
        minScale={0.3}
        maxScale={5}
        centerOnInit
        limitToBounds={false}
        // CONFIGURACIÓN DE ZOOM
        wheel={{
          step: 0.05,
          smoothStep: 0.002,
          disabled: false,
        }}
        // CONFIGURACIÓN DE PANNING SUAVE
        panning={{
          velocityDisabled: false,
          disabled: false,
        }}
        // DOBLE CLICK DESHABILITADO para evitar zoom involuntario
        doubleClick={{
          disabled: true,
        }}
        // VELOCIDAD DE ANIMACIÓN
        velocityAnimation={{
          sensitivity: 1,
          animationTime: 400,
        }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Controles flotantes - Esquina superior derecha */}
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

            {/* Instrucciones flotantes - Esquina superior izquierda */}
            <div className="absolute top-3 left-3 z-20">
              <div className="bg-slate-800/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-700/50 flex items-center gap-2">
                <Move size={14} className="text-slate-400" />
                <span className="text-xs font-medium text-slate-300 font-['Arimo']">
                  Arrastra para mover · Rueda para zoom
                </span>
              </div>
            </div>

            {/* Leyenda flotante - Esquina inferior izquierda */}
            <div className="absolute bottom-3 left-3 z-20">
              <div className="bg-slate-800/90 backdrop-blur-sm p-3 rounded-lg border border-slate-700/50">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-['Arimo']">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#00A651] shadow-sm shadow-[#00A651]/50" />
                    <span className="text-slate-300 font-medium">Libre</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#F29325] shadow-sm shadow-[#F29325]/50" />
                    <span className="text-slate-300 font-medium">Seleccionado</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-slate-500" />
                    <span className="text-slate-300 font-medium">Ocupado</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
                    <span className="text-slate-300 font-medium">Bloqueado</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Área del mapa - Ocupa todo el contenedor con CURSOR DE MANO */}
            <TransformComponent
              wrapperStyle={{
                width: '100%',
                height: '100%',
                cursor: 'grab',
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
                viewBox={`${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}`}
                className="w-full h-full max-w-full max-h-full"
                style={{
                  minWidth: '100%',
                  minHeight: '100%',
                  pointerEvents: 'auto',
                }}
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label="Mapa de asientos del evento"
              >
                {/* Fondo del mapa */}
                <rect
                  x={viewBox.minX}
                  y={viewBox.minY}
                  width={viewBox.width}
                  height={viewBox.height}
                  className="fill-slate-950"
                  style={{ pointerEvents: 'none' }}
                />

                {/* Escenario */}
                {mostrarEscenario && (
                  <g style={{ pointerEvents: 'none' }}>
                    {' '}
                    {/* Escenario no clickeable */}
                    <rect
                      x={escenarioCentroX - escenarioAncho / 2}
                      y={escenarioY}
                      width={escenarioAncho}
                      height={45}
                      rx="6"
                      className="fill-slate-800 stroke-slate-600 stroke-1"
                    />
                    <text
                      x={escenarioCentroX}
                      y={escenarioY + 28}
                      textAnchor="middle"
                      className="text-xs font-bold fill-slate-400 font-['Arimo'] tracking-wider"
                    >
                      {tituloEscenario}
                    </text>
                  </g>
                )}

                {/* Renderizado de objetos decorativos (no clickables) */}
                {objetosDecorativos.map((obj) => (
                  <g key={obj.id} style={{ pointerEvents: 'none' }}>
                    <rect
                      x={obj.x - obj.ancho / 2}
                      y={obj.y - obj.alto / 2}
                      width={obj.ancho}
                      height={obj.alto}
                      rx={6}
                      fill={obj.color || '#9333ea'}
                      fillOpacity={0.3}
                      stroke={obj.color || '#9333ea'}
                      strokeWidth={2}
                    />
                    <text
                      x={obj.x}
                      y={obj.y}
                      textAnchor="middle"
                      dy={4}
                      className="text-[10px] font-bold select-none font-['Arimo'] fill-slate-700 dark:fill-slate-300"
                    >
                      {obj.etiqueta || obj.tipo}
                    </text>
                  </g>
                ))}

                {/* Renderizado de asientos */}
                {asientos.map((seat) => {
                  const classes = getAsientoClasses(seat.estado);
                  const clickable = isClickable(seat.estado);

                  return (
                    <g
                      key={seat.id}
                      onClick={(e) => handleSeatClick(e, seat)}
                      onKeyDown={(e) => handleKeyDown(e, seat)}
                      className={cn(
                        'transition-all duration-200',
                        clickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50',
                      )}
                      role="button"
                      aria-label={`Asiento ${seat.etiqueta}, estado: ${seat.estado}${seat.precio ? `, precio: ${seat.precio}€` : ''}`}
                      tabIndex={clickable ? 0 : -1}
                      style={{
                        pointerEvents: 'all',
                      }}
                    >
                      {/* Sombra/Glow para asientos seleccionados */}
                      {seat.estado === 'SELECCIONADO' && (
                        <circle
                          cx={seat.x}
                          cy={seat.y}
                          r={18}
                          className="fill-[#F29325]/20"
                          style={{ pointerEvents: 'none' }}
                        />
                      )}
                      {/* Forma del asiento */}
                      {renderSeatShape(seat)}
                      <text
                        x={seat.x}
                        y={seat.y}
                        dy={4}
                        textAnchor="middle"
                        className={classes.text}
                        style={{ pointerEvents: 'none' }}
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
  );
};

export default SeatMapViewer;
