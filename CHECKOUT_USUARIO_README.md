# Checkout Usuario - Nueva Implementación

## 📋 Descripción

Nueva interfaz de checkout con diseño mejorado basado en componentes modulares. Esta implementación incluye un diseño responsivo y moderno con soporte para modo oscuro.

## 🗂️ Estructura de Archivos

```
src/pages/public/CheckoutUsuario/
├── index.tsx                   # Componente principal
├── HeaderSection.tsx           # Cabecera con navegación
├── CheckoutFormSection.tsx     # Formulario de checkout con carrito
└── FooterSection.tsx          # Pie de página
```

## 🎨 Características

### 1. **HeaderSection**
- Navegación principal con enlaces activos
- Barra de búsqueda
- Notificaciones con contador
- Acceso al perfil de usuario
- Soporte para modo oscuro

### 2. **CheckoutFormSection**
- Información de contacto
- Métodos de pago (Tarjeta, PayPal, Bizum, Monedero)
- Certificado fiscal con datos guardados o nuevos
- Resumen del carrito con desglose de precios:
  - Entrada base
  - Donación implícita
  - Descuento de socio (10%)
  - Donación adicional
- Total general
- Botón de confirmación de compra

### 3. **FooterSection**
- Enlaces rápidos organizados por categorías
- Información de contacto
- Enlaces legales (Privacidad, Términos, Cookies)
- Copyright
- Soporte para modo oscuro

## 🔗 Acceso

La página está disponible en la ruta: `/checkout-usuario`

En modo desarrollo, también hay un enlace directo desde la página de inicio en la sección "Sandbox Dev".

## 🎯 Funcionalidades Implementadas

### Formulario de Checkout
- ✅ Selección de método de pago con radio buttons personalizados
- ✅ Checkbox para solicitar certificado fiscal
- ✅ Selector de datos fiscales guardados con dropdown
- ✅ Formulario de datos fiscales (NIF, Nombre, Dirección)
- ✅ Validación de campos requeridos

### Carrito de Compras
- ✅ Vista de items con imagen
- ✅ Desglose detallado de precios
- ✅ Cálculo de totales
- ✅ Botón de eliminar item
- ✅ Total general con formato de moneda

### Diseño
- ✅ Diseño responsivo (móvil, tablet, desktop)
- ✅ Soporte para modo oscuro completo
- ✅ Transiciones suaves
- ✅ Accesibilidad (aria-labels, roles semánticos)
- ✅ Tipografía Arimo según diseño de marca

## 🎨 Paleta de Colores

```css
/* Colores principales */
--verde-cudeca: #00a651      /* Verde principal */
--verde-oscuro: #00753e      /* Verde hover/activo */
--verde-descuento: #008a43   /* Verde botones */

/* Colores de error */
--rojo-error: #d94f04        /* Campos requeridos */

/* Fondos */
--gris-fondo: #f9fafb        /* Fondo claro */
--negro-footer: #162810      /* Footer oscuro */
```

## 🚀 Próximos Pasos

### Integración con Backend
1. Conectar con servicios de checkout existentes
2. Implementar llamadas API para:
   - Obtener datos fiscales guardados
   - Crear/actualizar datos fiscales
   - Procesar pago
   - Generar certificado fiscal
   - Enviar confirmación por email

### Funcionalidades Adicionales
1. Validación en tiempo real de formularios
2. Mensajes de error específicos
3. Loader durante procesamiento
4. Confirmación de compra con detalles
5. Redirección a página de éxito
6. Integración con servicios de pago reales
7. Gestión de carrito dinámico (agregar/eliminar items)
8. Persistencia de carrito en localStorage

### Mejoras de UX
1. Animaciones suaves en transiciones
2. Toast notifications para feedback
3. Skeleton loaders mientras carga
4. Optimización de imágenes de eventos
5. Progressive Web App (PWA) features

## 📱 Responsive Breakpoints

```css
/* Mobile First */
base: 320px - 639px
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

## 🧪 Testing

Para probar la nueva interfaz:

1. Asegúrate de estar autenticado (la ruta está protegida)
2. Navega a `/checkout-usuario`
3. O usa el enlace desde la página principal en modo desarrollo

## 🔧 Personalización

Los componentes están construidos con Tailwind CSS, lo que permite fácil personalización:

- Colores: Definidos en `tailwind.config.js` y variables CSS
- Espaciado: Clases de Tailwind utilities
- Tipografía: Font family 'Arimo' configurada

## 📝 Notas

- Los datos del carrito actualmente están hardcodeados para demostración
- Las imágenes de eventos deben agregarse a la carpeta `/public`
- Los iconos utilizan la librería `lucide-react`
- El diseño sigue las guías de accesibilidad WCAG 2.1

