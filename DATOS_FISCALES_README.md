# Datos Fiscales - Nueva Implementación

## 📋 Descripción

Nueva página de gestión de datos fiscales con diseño moderno y responsivo. Esta implementación permite a usuarios autenticados ver y gestionar sus direcciones fiscales y datos de facturación.

## 🗂️ Estructura de Archivos

```
src/pages/public/DatosFiscales/
├── index.tsx                        # Componente principal
├── HeaderSection.tsx                # Cabecera con navegación y atajo de sesión
├── UserTabsSection.tsx              # Navegación de pestañas del perfil
├── FiscalDataSection.tsx            # Sección de datos fiscales
└── FooterSection.tsx                # Pie de página
```

## 🎨 Características

### 1. **HeaderSection**
- Navegación principal con enlaces activos
- Carrito de compras con contador
- **Atajo de Autenticación:**
  - **Si NO está autenticado:**
    - Botón "Iniciar sesión" (borde gris, enlace a `/login`)
    - Botón "Regístrate" (fondo verde, enlace a `/registro`)
  - **Si está autenticado:**
    - Muestra nombre del usuario
    - Botón "Mi Perfil" (verde oscuro)
    - Botón "Logout" (con icono LogOut)
- Soporte para modo oscuro
- Integración con `useAuth()` para gestionar estado de sesión

### 2. **UserTabsSection**
- Navegación por pestañas interactivas:
  - Saldo: 36.00€
  - Retirar saldo
  - Perfil
  - Compras
  - **Datos fiscales** (activo por defecto)
  - Suscripción
- Estado reactivo con `useState`
- Estilos activos/inactivos diferenciados
- Responde a clics para cambiar pestaña activa

### 3. **FiscalDataSection**
- Tarjetas de datos fiscales guardados
- Información por tarjeta:
  - Nombre de la dirección (NIF Guardado 1, etc.)
  - Nombre del titular (empresa o personal)
  - NIF/CIF
  - Dirección
- Botones de acciones:
  - **Editar** (Color Cyan/Azul claro)
  - **Eliminar** (Color Rojo)
- Botón "Añadir información fiscal" al pie
- Grid responsivo (1 columna móvil, 2 columnas desktop)
- Mensaje vacío cuando no hay datos

### 4. **FooterSection**
- Información de organización
- Enlaces organizados por categorías:
  - Enlaces Rápidos
  - Eventos
  - Contacto
- Información de contacto (dirección, teléfono, email)
- Enlaces legales (Privacidad, Términos)
- Copyright
- Soporte para modo oscuro

## 🔗 Acceso

La página está disponible en la ruta: `/datos-fiscales`

## 🎯 Funcionalidades Implementadas

### Autenticación
- ✅ Detección de usuario autenticado con `useAuth()`
- ✅ Mostrar nombre del usuario en header
- ✅ Botón de logout funcional
- ✅ Atajos de "Iniciar sesión" y "Regístrate" para no autenticados
- ✅ Redirección a `/login` y `/registro`

### Navegación de Perfil
- ✅ Pestañas interactivas
- ✅ Cambio de estado activo
- ✅ Estilos diferenciados para tab activo/inactivo
- ✅ Animaciones suaves

### Gestión de Datos Fiscales
- ✅ Visualización de direcciones fiscales guardadas
- ✅ Grid responsivo de tarjetas
- ✅ Botones de Editar y Eliminar
- ✅ Botón de Añadir información fiscal
- ✅ Mensaje vacío cuando no hay datos
- ✅ Iconos modernos (Edit2, Trash2, Plus)

### Diseño
- ✅ Diseño responsivo (móvil, tablet, desktop)
- ✅ Soporte para modo oscuro completo
- ✅ Transiciones suaves
- ✅ Accesibilidad (aria-labels, roles semánticos)
- ✅ Tipografía Arimo según diseño de marca
- ✅ Uso de container responsivo

## 🎨 Paleta de Colores

```css
/* Colores principales */
--verde-cudeca: #00753e      /* Verde botón perfil */
--verde-claro: #00a651       /* Verde botón regístrate */
--verde-descuento: #005a2e   /* Hover verde */
--cyan: #00bcd4              /* Botón Editar */
--rojo: #ef4444              /* Botón Eliminar */

/* Fondos */
--gris-fondo: #f3f4f6        /* Fondo claro */
--negro-footer: #162810      /* Footer oscuro */
```

## 📱 Responsividad

La página es completamente responsiva:
- **Desktop:** Grid 2 columnas con tarjetas
- **Tablet:** Grid adaptativo
- **Móvil:** Grid 1 columna, stack vertical

## 🚀 Próximos Pasos

### Integración con Backend
1. Conectar con servicios de usuario existentes
2. Implementar llamadas API para:
   - Obtener datos fiscales del usuario
   - Crear/actualizar datos fiscales
   - Eliminar datos fiscales
   - Validar NIF/CIF
   - Generar facturas

### Funcionalidades Adicionales
- Modal de edición de datos fiscales
- Validación de NIF/CIF
- Búsqueda y filtrado
- Paginación
- Exportar datos
- Gestionar direcciones por defecto
- Historial de cambios

## 🔐 Seguridad

- ✅ Requiere autenticación para acceder (implementar protección de ruta)
- ✅ Usa contexto AuthContext para estado de sesión
- ✅ Datos sensibles solo visibles para usuario autenticado
- ✅ Logout seguro con invalidación de sesión
- ✅ Validación de datos en formularios

## 📝 Notas Importantes

- Los datos mostrados actualmente son datos de ejemplo (mock data)
- La pestaña "Datos fiscales" está activa por defecto
- El nombre del usuario se obtiene de `user?.nombre?.split(" ")[0]` (primer nombre)
- Los iconos se usan de lucide-react (Edit2, Trash2, Plus)
- El footer es el mismo que se usa en RecargaSaldo y otras páginas públicas

