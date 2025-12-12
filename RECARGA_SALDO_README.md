# Pantalla de Recarga de Saldo - RecargaSaldo

## Descripción

La pantalla de recarga de saldo (`PantallaDeRecargar`) es una interfaz de usuario que permite a los usuarios autenticados añadir saldo a su monedero. Esta pantalla está ubicada en la ruta `/RecargaSaldo` y forma parte del flujo de gestión de perfil de usuario.

## Estructura de Archivos

```
RecargaSaldo/
├── index.tsx              # Componente principal que integra todas las secciones
├── HeaderSection.tsx      # Encabezado con navegación principal
├── UserTabsSection.tsx    # Pestañas de navegación de usuario (Perfil, Compras, etc.)
├── AddBalanceSection.tsx  # Formulario para añadir saldo
└── FooterSection.tsx      # Pie de página
```

## Componentes

### 1. `PantallaDeRecargar` (index.tsx)
Componente principal que actúa como contenedor de todas las secciones.

**Propiedades:**
- Devuelve un JSX.Element que contiene la estructura completa de la pantalla

**Características:**
- Altura fija de 1760px
- Fondo blanco con área de contenido gris (gray-50)
- Integra HeaderSection, UserTabsSection, AddBalanceSection y FooterSection

### 2. `HeaderSection` (HeaderSection.tsx)
Barra de navegación superior con logo, menú y acciones de usuario.

**Características:**
- Logo de Fundación Cudeca
- Navegación principal (Inicio, Eventos, Contacto)
- Icono de carrito de compras con contador
- Botón "Mi Perfil"
- Requiere imágenes SVG: `icon-4.svg`, `vector.svg`, `vector-2.svg`

### 3. `UserTabsSection` (UserTabsSection.tsx)
Sistema de pestañas para navegación dentro del perfil de usuario.

**Pestañas disponibles:**
- Saldo: 36.00€ (default)
- **Recargar saldo** (primary - activa)
- Perfil
- Compras
- Datos fiscales
- Suscripción

**Características:**
- La pestaña activa tiene fondo verde (#00753e) y texto blanco
- Pestañas inactivas tienen fondo blanco y borde gris
- Estados de hover y focus accesibles

### 4. `AddBalanceSection` (AddBalanceSection.tsx)
Formulario principal para la recarga de saldo.

**Características:**
- Input de cantidad personalizable
- Botones rápidos de 4 cantidades predefinidas (10€, 25€, 50€, 100€)
- Selector de método de pago (predeterminado: "Tarjeta de crédito / débito")
- Botón de envío "Añadir saldo"

**Estados:**
- `amount`: almacena la cantidad ingresada
- `selectedQuickAmount`: rastrea cuál botón rápido está seleccionado

**Funcionalidades:**
- Al hacer clic en un botón rápido, actualiza la cantidad
- El campo de entrada permite cambios manuales
- Desactiva la selección rápida al escribir manualmente

### 5. `FooterSection` (FooterSection.tsx)
Pie de página con información de la fundación.

**Secciones:**
- **Información de Fundación Cudeca:** Nombre, descripción
- **Enlaces Rápidos:** Sobre Nosotros, Nuestros Servicios, Cómo Ayudar
- **Eventos:** Próximos Eventos, Eventos Pasados
- **Contacto:** Dirección, teléfono, correo electrónico
- **Legal:** Política de Privacidad, Términos y Condiciones

## Estilos y Tema

La pantalla utiliza:
- **Colores principales:**
  - Verde Cudeca: #00753e
  - Blanco: #ffffff
  - Gris fondo: #f3f4f6
  - Texto principal: #101828
  - Texto secundario: #4a5565

- **Tipografía:**
  - Familia: Arimo (Bold, Regular)
  - Tamaños: base (16px), lg (18px), xl (20px)

- **Framework CSS:** Tailwind CSS

## Integración

Para utilizar esta pantalla, importa el componente principal:

```typescript
import { PantallaDeRecargar } from "@/pages/public/RecargaSaldo";
```

Luego, añádelo a tu rutero (por ejemplo, en React Router):

```typescript
import { PantallaDeRecargar } from "@/pages/public/RecargaSaldo";

const routes = [
  {
    path: "/recarga-saldo",
    element: <PantallaDeRecargar />,
    requiresAuth: true
  }
];
```

## Notas Importantes

1. **Autenticación:** Esta pantalla requiere que el usuario esté autenticado
2. **Imágenes SVG:** La HeaderSection requiere archivos SVG que deben estar en la carpeta `RecargaSaldo` o ser importados desde otra ubicación
3. **Responsive:** Los diseños están basados en dimensiones fijas (1920px). Para hacer responsive, será necesario ajustar los estilos
4. **Accesibilidad:** Todos los elementos incluyen atributos `aria-label` y `role` apropiados

## Flujo de Datos

```
PantallaDeRecargar
├── HeaderSection (solo lectura - elementos estáticos)
├── UserTabsSection (solo lectura - elementos estáticos)
├── AddBalanceSection (estado local - amount, selectedQuickAmount)
└── FooterSection (solo lectura - elementos estáticos)
```

## Próximas Funcionalidades

Para completar la pantalla, se recomienda:

1. Conectar el formulario con un servicio de API para procesar pagos
2. Implementar validación de entrada (cantidad mínima/máxima)
3. Implementar integración con pasarela de pagos
4. Añadir notificaciones de éxito/error
5. Implementar responsive design para dispositivos móviles
6. Hacer que las pestañas sean navegables y dinámicas

## Componentes Relacionados

- CheckoutInvitado - Compra sin autenticación
- CheckoutUsuario - Compra con autenticación
- CompraInvitado - Confirmación de compra invitado
- CompraUsuario - Confirmación de compra usuario

