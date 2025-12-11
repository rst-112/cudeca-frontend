# 🔄 Comparación: Checkout Usuario vs Checkout Invitado

## 📊 Tabla Comparativa

| Característica | CheckoutInvitado | CheckoutUsuario |
|----------------|------------------|-----------------|
| **Autenticación** | ❌ No requerida | ✅ Requerida |
| **Ruta principal** | `/dev/checkout-invitado` | `/dev/checkout-usuario` |
| **Botón header** | "INICIAR SESIÓN" | "Mi Perfil" + Notificaciones |
| **Métodos de pago** | 3 (Tarjeta, PayPal, Bizum) | 4 (+Monedero) |
| **Datos fiscales guardados** | ❌ No | ✅ Sí (dropdown) |
| **Descuento socio** | ❌ No | ✅ Sí (10%) |
| **Desglose de precios** | Básico | Completo |
| **Modo oscuro** | ✅ Sí | ✅ Sí |
| **Responsive** | ✅ Sí | ✅ Sí |

---

## 🎯 Diferencias Principales

### 1. Header (Cabecera)

#### CheckoutInvitado
```tsx
<Link to="/login">
  <span>INICIAR SESIÓN</span>
</Link>
```
- Icono de carrito con contador
- Botón verde "INICIAR SESIÓN"
- Sin notificaciones

#### CheckoutUsuario
```tsx
<Link to="/perfil">
  <User className="w-4 h-4" />
  <span>Mi Perfil</span>
</Link>
```
- Icono de notificaciones con contador
- Botón verde "Mi Perfil"
- Con acceso a perfil de usuario

---

### 2. Métodos de Pago

#### CheckoutInvitado
```typescript
const paymentMethods = [
  { id: "credit-card", label: "Tarjeta de crédito" },
  { id: "paypal", label: "Paypal" },
  { id: "bizum", label: "Bizum" },
];
```

#### CheckoutUsuario
```typescript
const paymentMethods = [
  { id: "credit-card", label: "Tarjeta de crédito" },
  { id: "paypal", label: "Paypal" },
  { id: "bizum", label: "Bizum" },
  { id: "wallet", label: "Monedero", subtitle: "Saldo disponible: 0,00€" },
];
```

---

### 3. Certificado Fiscal

#### CheckoutInvitado
- ✅ Checkbox "Solicitar certificado fiscal"
- ✅ Formulario directo (NIF, Nombre, Dirección)
- ❌ Sin datos guardados

```tsx
{requestFiscalCertificate && (
  <div className="space-y-4">
    <input id="nif" />
    <input id="nombre" />
    <input id="direccion" />
  </div>
)}
```

#### CheckoutUsuario
- ✅ Checkbox "Solicitar certificado fiscal"
- ✅ Opciones: "Usar datos guardados" / "Usar otros datos"
- ✅ Dropdown con datos guardados
- ✅ Formulario (NIF, Nombre, Dirección)

```tsx
<div className="space-y-4">
  <label>
    <input type="radio" value="saved" />
    Usar mis datos guardados
  </label>
  <label>
    <input type="radio" value="other" />
    Usar otros datos
  </label>
  
  <button onClick={() => setFiscalDropdownOpen(!fiscalDropdownOpen)}>
    John Alucín Epark (****1234A)
  </button>
</div>
```

---

### 4. Desglose de Precios en Carrito

#### CheckoutInvitado
```
Entrada base: 15,00€
Donación Implícita: 3,00€
Donación Adicional: 350,00€ (opcional)
---
Total: 368€
```

#### CheckoutUsuario
```
Entrada base: 15,00€
Donación Implícita: 3,00€
Descuento Socio (10%): -1,50€
Donación Adicional: 350,00€ (opcional)
---
Total: 366,50€
```

---

## 🚀 Rutas de Acceso

### CheckoutInvitado
```
Desarrollo: http://localhost:5173/dev/checkout-invitado
Producción: http://localhost:5173/checkout-invitado (pública)
```

### CheckoutUsuario
```
Desarrollo: http://localhost:5173/dev/checkout-usuario
Producción: http://localhost:5173/checkout-usuario (protegida)
```

---

## 🔐 Flujo de Usuario

### Invitado (Sin cuenta)
1. 🛒 Selecciona eventos y asientos
2. 📧 Ingresa email
3. 💳 Selecciona método de pago (3 opciones)
4. 📄 Opcionalmente solicita certificado fiscal
5. ✅ Confirma compra
6. 🔑 Opción de registrarse después

### Usuario Registrado
1. 🔐 Inicia sesión
2. 🛒 Selecciona eventos y asientos
3. 📧 Email pre-cargado
4. 💳 Selecciona método de pago (4 opciones, incluye Monedero)
5. 📄 Usa datos fiscales guardados o nuevos
6. 💰 Obtiene descuento de socio (10%)
7. ✅ Confirma compra
8. 👤 Accede a perfil para ver entradas

---

## 💡 Cuándo Usar Cada Uno

### Usar CheckoutInvitado cuando:
- Usuario no tiene cuenta
- Compra rápida sin registro
- Primera vez comprando
- No quiere crear cuenta

### Usar CheckoutUsuario cuando:
- Usuario ya tiene cuenta
- Quiere guardar datos fiscales
- Quiere usar monedero
- Quiere descuento de socio
- Quiere historial de compras

---

## 🎨 Componentes Compartidos

Ambas versiones comparten:
- ✅ FooterSection (idéntico)
- ✅ Estructura base del formulario
- ✅ Estilos Tailwind
- ✅ Diseño responsive
- ✅ Modo oscuro
- ✅ Accesibilidad

---

## 📁 Estructura de Archivos

```
src/pages/public/
├── CheckoutInvitado/
│   ├── index.tsx
│   ├── HeaderSection.tsx        # Con "INICIAR SESIÓN"
│   ├── CheckoutFormSection.tsx  # Sin datos guardados
│   └── FooterSection.tsx        # Compartido
└── CheckoutUsuario/
    ├── index.tsx
    ├── HeaderSection.tsx        # Con "Mi Perfil"
    ├── CheckoutFormSection.tsx  # Con datos guardados
    └── FooterSection.tsx        # Compartido
```

---

## 🔄 Migración entre Versiones

### De Invitado a Usuario
```typescript
// Después de completar compra como invitado
<button onClick={() => navigate('/registro')}>
  Crear cuenta para obtener beneficios
</button>

// Beneficios:
// - Descuento 10% en futuras compras
// - Guardar datos fiscales
// - Usar monedero
// - Historial de compras
```

---

## 📊 Totales de Ejemplo

| Item | Invitado | Usuario Registrado |
|------|----------|-------------------|
| Noche de Jazz | 18,00€ | 16,50€ (-1,50€) |
| Gala Benéfica | 370,00€ | 368,50€ (-1,50€) |
| **TOTAL** | **388,00€** | **385,00€** |

**Ahorro por ser socio**: 3,00€ (10% en entradas base)

---

## ✅ Estado de Implementación

| Componente | CheckoutInvitado | CheckoutUsuario |
|------------|------------------|-----------------|
| Componentes creados | ✅ | ✅ |
| Rutas configuradas | ✅ | ✅ |
| Estilos aplicados | ✅ | ✅ |
| Modo oscuro | ✅ | ✅ |
| Responsive | ✅ | ✅ |
| Accesibilidad | ✅ | ✅ |
| Compila sin errores | ✅ | ✅ |

---

**¡Ambas versiones están completamente implementadas y listas para usar!** 🎉

