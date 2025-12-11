# Checkout Invitado - Implementación

## 📋 Descripción

Versión de checkout para usuarios **no registrados**. Similar al CheckoutUsuario pero sin opciones de datos fiscales guardados y con un botón "INICIAR SESIÓN" en lugar de "Mi Perfil".

## 🗂️ Estructura de Archivos

```
src/pages/public/CheckoutInvitado/
├── index.tsx                   # Componente principal
├── HeaderSection.tsx           # Cabecera con botón "INICIAR SESIÓN"
├── CheckoutFormSection.tsx     # Formulario de checkout simplificado
└── FooterSection.tsx          # Pie de página
```

## 🎨 Diferencias con CheckoutUsuario

### 1. **HeaderSection**
- ❌ No tiene botón "Mi Perfil"
- ✅ Tiene botón "INICIAR SESIÓN" que redirige a `/login`
- ✅ Icono de carrito con contador (en vez de notificaciones)

### 2. **CheckoutFormSection**
- ❌ No tiene opción "Usar mis datos guardados"
- ❌ No tiene dropdown de datos fiscales
- ✅ Solo muestra formulario directo (NIF, Nombre, Dirección)
- ✅ Solo 3 métodos de pago (sin "Monedero")

### 3. **Resumen del Carrito**
- ✅ Desglose simplificado:
  - Entrada base
  - Donación Implícita
  - Donación Adicional (opcional)
- ❌ No muestra "Descuento Socio" (solo para usuarios registrados)

## 🔗 Acceso

### Rutas disponibles:
- **Desarrollo**: `/dev/checkout-invitado` (sin autenticación)
- **Producción**: `/checkout-invitado` (pública)

## 🚀 Cómo Acceder

### Opción 1: URL Directa
```
http://localhost:5173/dev/checkout-invitado
```

### Opción 2: Desde Home
1. Ve a `http://localhost:5173`
2. En la sección "Modo Desarrollo" (amarilla)
3. Haz clic en el botón azul **"Ver Checkout Invitado"**

## ✨ Características

### Formulario
- ✅ Campo de email para envío de entradas
- ✅ 3 métodos de pago (Tarjeta, PayPal, Bizum)
- ✅ Checkbox para certificado fiscal
- ✅ Formulario de datos fiscales directo (sin dropdown)

### Carrito
- ✅ 2 eventos de ejemplo
- ✅ Desglose de precios
- ✅ Botón de eliminar items
- ✅ Total general
- ✅ Botón "Confirmar compra"

### Diseño
- ✅ Responsive (móvil, tablet, desktop)
- ✅ Modo oscuro completo
- ✅ Tipografía Arimo
- ✅ Colores corporativos Cudeca

## 🎯 Flujo de Usuario

1. **Usuario llega al checkout** (sin estar registrado)
2. **Ingresa email** para recibir entradas
3. **Selecciona método de pago**
4. **Opcionalmente solicita certificado fiscal**
   - Si lo solicita, debe completar NIF, Nombre y Dirección
5. **Revisa el carrito** con desglose de precios
6. **Confirma la compra**
7. **Opción de registrarse** (botón "INICIAR SESIÓN")

## 📊 Datos de Ejemplo

```typescript
const cartItems = [
  {
    id: "1",
    name: "Noche de Jazz Solidaria",
    type: "Asiento normal",
    basePrice: 15.0,
    implicitDonation: 3.0,
  },
  {
    id: "2",
    name: "Gala Benéfica anual",
    type: "Entrada general",
    basePrice: 15.0,
    implicitDonation: 5.0,
    additionalDonation: 350.0,
  },
];
```

**Total**: 388.00€

## 🔄 Integración con CheckoutUsuario

Ambas versiones comparten la misma estructura base pero con diferencias clave:

| Característica | CheckoutInvitado | CheckoutUsuario |
|----------------|------------------|-----------------|
| Login requerido | ❌ No | ✅ Sí |
| Datos guardados | ❌ No | ✅ Sí |
| Descuento socio | ❌ No | ✅ Sí |
| Monedero | ❌ No | ✅ Sí |
| Botón header | INICIAR SESIÓN | Mi Perfil |

## 🛠️ Próximos Pasos

### Funcionalidades Pendientes
1. Integración con backend para procesar pagos
2. Validación en tiempo real de formularios
3. Mensajes de error específicos
4. Confirmación por email
5. Opción de crear cuenta después de comprar

### Mejoras Sugeridas
1. Guardar carrito en localStorage
2. Opción de "Comprar como invitado o registrarse"
3. Mostrar ventajas de registrarse
4. Integración con pasarelas de pago reales

## 📝 Notas Técnicas

- **Framework**: React + TypeScript
- **Estilos**: Tailwind CSS
- **Iconos**: lucide-react
- **Fuente**: Arimo (Google Fonts)
- **Dark Mode**: Soporte completo
- **Accesibilidad**: WCAG 2.1

## 🎨 Paleta de Colores

```css
/* Verde principal */
--verde-cudeca: #00a651
--verde-hover: #008a43
--verde-dark: #00753e

/* Errores */
--rojo-error: #d94f04

/* Fondos */
--gris-fondo: #f9fafb
--negro-footer: #162810
```

## ✅ Estado Actual

- ✅ Componentes creados
- ✅ Rutas configuradas
- ✅ Sin errores de compilación
- ✅ Responsive design
- ✅ Modo oscuro funcional
- ✅ Accesibilidad implementada

---

**¡La implementación está completa y lista para usar!** 🎉

