# Guía de Integración Backend - Checkout y Perfil

## 🔌 Endpoints Requeridos en el Backend

### 1. Reservas y Compras

#### POST `/api/reservas`
**Descripción:** Crear reserva (bloquear asientos)

**Request Body:**
```json
{
  "eventoId": 1,
  "asientoIds": ["A1", "A2"],
  "solicitarCertificado": true,
  "datosFiscalesId": 5,  // OPCIONAL: si selecciona existente
  "nuevoDatosFiscales": {  // OPCIONAL: si crea nuevos
    "nif": "12345678A",
    "nombreCompleto": "Juan Pérez García",
    "direccion": "Calle Principal 123",
    "ciudad": "Málaga",
    "codigoPostal": "29001",
    "pais": "España"
  }
}
```

**Response:**
```json
{
  "id": 42,
  "usuarioId": 10,
  "eventoId": 1,
  "estadoReserva": "PENDIENTE",
  "fechaReserva": "2025-12-11T10:30:00Z",
  "fechaExpiracion": "2025-12-11T10:45:00Z",
  "total": 52.50,
  "asientos": [
    {
      "id": 1,
      "asientoId": "A1",
      "etiqueta": "A-1",
      "precio": 25.00,
      "zonaId": 1
    },
    {
      "id": 2,
      "asientoId": "A2",
      "etiqueta": "A-2",
      "precio": 25.00,
      "zonaId": 1
    }
  ]
}
```

**Lógica Backend (pseudo-código Java):**
```java
@Transactional
public Reserva crearReserva(ReservaRequest request) {
    // 1. Validar que el evento existe
    Evento evento = eventoRepository.findById(request.getEventoId())
        .orElseThrow(() -> new NotFoundException("Evento no encontrado"));
    
    // 2. BLOQUEO TRANSACCIONAL: Verificar y bloquear asientos
    List<Asiento> asientos = asientoRepository.findAllByIdIn(request.getAsientoIds());
    
    for (Asiento asiento : asientos) {
        if (!asiento.getEstado().equals(EstadoAsiento.LIBRE)) {
            throw new AsientoNoDisponibleException(
                "El asiento " + asiento.getEtiqueta() + " ya no está disponible"
            );
        }
        asiento.setEstado(EstadoAsiento.BLOQUEADO);
    }
    
    // 3. Gestionar datos fiscales si se solicita certificado
    DatosFiscales datosFiscales = null;
    if (request.isSolicitarCertificado()) {
        if (request.getDatosFiscalesId() != null) {
            datosFiscales = datosFiscalesRepository.findById(request.getDatosFiscalesId())
                .orElseThrow(() -> new NotFoundException("Datos fiscales no encontrados"));
        } else if (request.getNuevoDatosFiscales() != null) {
            datosFiscales = datosFiscalesRepository.save(request.getNuevoDatosFiscales());
        }
    }
    
    // 4. Crear reserva
    Reserva reserva = new Reserva();
    reserva.setUsuario(getCurrentUser());
    reserva.setEvento(evento);
    reserva.setEstadoReserva(EstadoReserva.PENDIENTE);
    reserva.setFechaReserva(LocalDateTime.now());
    reserva.setFechaExpiracion(LocalDateTime.now().plusMinutes(15)); // 15 min
    reserva.setDatosFiscales(datosFiscales);
    reserva.setTotal(calcularTotal(asientos));
    
    reserva = reservaRepository.save(reserva);
    
    // 5. Asociar asientos a la reserva
    for (Asiento asiento : asientos) {
        AsientoReserva ar = new AsientoReserva();
        ar.setReserva(reserva);
        ar.setAsiento(asiento);
        asientoReservaRepository.save(ar);
    }
    
    return reserva;
    
    // Si hay algún error, @Transactional hace ROLLBACK automáticamente
    // y los asientos vuelven a LIBRE
}
```

---

#### POST `/api/reservas/{id}/confirmar`
**Descripción:** Confirmar compra (convertir reserva en entradas)

**Request:** Sin body

**Response:**
```json
{
  "reservaId": 42,
  "entradas": [
    {
      "id": 100,
      "codigo": "ABC123DEF456",
      "eventoId": 1,
      "eventoNombre": "Concierto Benéfico",
      "eventoFecha": "2025-12-20T20:00:00Z",
      "asientoId": "A1",
      "asientoEtiqueta": "A-1",
      "zonaNombre": "Platea",
      "precio": 25.00,
      "estadoEntrada": "ACTIVA",
      "fechaCompra": "2025-12-11T10:35:00Z",
      "qrCode": "data:image/png;base64,...",
      "pdfUrl": "/api/entradas/100/pdf"
    }
  ],
  "total": 52.50,
  "mensaje": "Compra confirmada exitosamente"
}
```

**Lógica Backend:**
```java
@Transactional
public CompraResponse confirmarReserva(Long reservaId) {
    Reserva reserva = reservaRepository.findById(reservaId)
        .orElseThrow(() -> new NotFoundException("Reserva no encontrada"));
    
    // Validar que la reserva está PENDIENTE
    if (!reserva.getEstadoReserva().equals(EstadoReserva.PENDIENTE)) {
        throw new IllegalStateException("La reserva ya fue procesada");
    }
    
    // Validar que no expiró
    if (LocalDateTime.now().isAfter(reserva.getFechaExpiracion())) {
        throw new ReservaExpiradaException("La reserva expiró");
    }
    
    List<Entrada> entradas = new ArrayList<>();
    
    // Convertir asientos bloqueados en entradas
    for (AsientoReserva ar : reserva.getAsientos()) {
        Asiento asiento = ar.getAsiento();
        
        // Cambiar estado de BLOQUEADO a VENDIDO
        asiento.setEstado(EstadoAsiento.VENDIDO);
        
        // Crear entrada
        Entrada entrada = new Entrada();
        entrada.setCodigo(generarCodigoUnico());
        entrada.setUsuario(reserva.getUsuario());
        entrada.setEvento(reserva.getEvento());
        entrada.setAsiento(asiento);
        entrada.setPrecio(ar.getPrecio());
        entrada.setEstadoEntrada(EstadoEntrada.ACTIVA);
        entrada.setFechaCompra(LocalDateTime.now());
        entrada.setQrCode(generarQR(entrada.getCodigo()));
        
        entradas.add(entradaRepository.save(entrada));
    }
    
    // Actualizar estado de reserva
    reserva.setEstadoReserva(EstadoReserva.CONFIRMADA);
    reservaRepository.save(reserva);
    
    // Enviar email con las entradas (async)
    emailService.enviarEntradasAsync(reserva.getUsuario().getEmail(), entradas);
    
    return new CompraResponse(reserva.getId(), entradas, reserva.getTotal());
}
```

---

### 2. Datos Fiscales (Libreta de Direcciones)

#### GET `/api/usuarios/datos-fiscales`
**Descripción:** Obtener todos los datos fiscales del usuario autenticado

**Response:**
```json
[
  {
    "id": 1,
    "nif": "12345678A",
    "nombreCompleto": "Juan Pérez García",
    "direccion": "Calle Principal 123",
    "ciudad": "Málaga",
    "codigoPostal": "29001",
    "pais": "España",
    "isPrincipal": true
  },
  {
    "id": 2,
    "nif": "87654321B",
    "nombreCompleto": "Juan Pérez (Empresa)",
    "direccion": "Avenida Comercial 45",
    "ciudad": "Marbella",
    "codigoPostal": "29600",
    "pais": "España",
    "isPrincipal": false
  }
]
```

---

#### POST `/api/usuarios/datos-fiscales`
**Descripción:** Crear nuevos datos fiscales

**Request Body:**
```json
{
  "nif": "12345678A",
  "nombreCompleto": "Juan Pérez García",
  "direccion": "Calle Principal 123",
  "ciudad": "Málaga",
  "codigoPostal": "29001",
  "pais": "España"
}
```

**Response:** `201 Created` + objeto DatosFiscales creado

**Lógica Backend:**
```java
public DatosFiscales crearDatosFiscales(DatosFiscalesRequest request) {
    Usuario usuario = getCurrentUser();
    
    // Validar NIF
    if (!validarNIF(request.getNif())) {
        throw new ValidationException("NIF inválido");
    }
    
    DatosFiscales datos = new DatosFiscales();
    datos.setUsuario(usuario);
    datos.setNif(request.getNif());
    datos.setNombreCompleto(request.getNombreCompleto());
    datos.setDireccion(request.getDireccion());
    datos.setCiudad(request.getCiudad());
    datos.setCodigoPostal(request.getCodigoPostal());
    datos.setPais(request.getPais());
    
    // Si es el primero, marcarlo como principal
    boolean esPrimero = !datosFiscalesRepository.existsByUsuario(usuario);
    datos.setIsPrincipal(esPrimero);
    
    return datosFiscalesRepository.save(datos);
}
```

---

#### PUT `/api/usuarios/datos-fiscales/{id}`
**Descripción:** Actualizar datos fiscales existentes

---

#### DELETE `/api/usuarios/datos-fiscales/{id}`
**Descripción:** Eliminar datos fiscales

**Validación:** No permitir eliminar si está asociado a reservas/entradas activas

---

#### PUT `/api/usuarios/datos-fiscales/{id}/principal`
**Descripción:** Establecer como datos fiscales principal

**Lógica Backend:**
```java
@Transactional
public DatosFiscales establecerPrincipal(Long id) {
    Usuario usuario = getCurrentUser();
    
    // Quitar principal de todos
    datosFiscalesRepository.findAllByUsuario(usuario)
        .forEach(df -> df.setIsPrincipal(false));
    
    // Establecer el nuevo principal
    DatosFiscales datos = datosFiscalesRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Datos fiscales no encontrados"));
    
    datos.setIsPrincipal(true);
    return datosFiscalesRepository.save(datos);
}
```

---

### 3. Entradas

#### GET `/api/entradas/mis-entradas`
**Descripción:** Obtener todas las entradas del usuario

**Response:**
```json
[
  {
    "id": 100,
    "codigo": "ABC123DEF456",
    "eventoId": 1,
    "eventoNombre": "Concierto Benéfico",
    "eventoFecha": "2025-12-20T20:00:00Z",
    "asientoId": "A1",
    "asientoEtiqueta": "A-1",
    "zonaNombre": "Platea",
    "precio": 25.00,
    "estadoEntrada": "ACTIVA",
    "fechaCompra": "2025-12-11T10:35:00Z",
    "qrCode": "data:image/png;base64,...",
    "pdfUrl": "/api/entradas/100/pdf"
  }
]
```

---

#### GET `/api/entradas/{id}/pdf`
**Descripción:** Generar y descargar PDF de la entrada

**Response:** `application/pdf` con el archivo PDF

**Lógica Backend (usando iText o similar):**
```java
public byte[] generarPdfEntrada(Long entradaId) {
    Entrada entrada = entradaRepository.findById(entradaId)
        .orElseThrow(() -> new NotFoundException("Entrada no encontrada"));
    
    // Validar que pertenece al usuario autenticado
    if (!entrada.getUsuario().equals(getCurrentUser())) {
        throw new ForbiddenException("No tienes acceso a esta entrada");
    }
    
    // Generar PDF con:
    // - Logo de Cudeca
    // - Datos del evento
    // - Datos del asiento
    // - QR Code
    // - Número de entrada
    
    return pdfGeneratorService.generarPdfEntrada(entrada);
}
```

---

## 🗄️ Modelos Sugeridos (JPA Entities)

### DatosFiscales.java
```java
@Entity
@Table(name = "datos_fiscales")
public class DatosFiscales {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    
    @Column(nullable = false, length = 20)
    private String nif;
    
    @Column(nullable = false, length = 255)
    private String nombreCompleto;
    
    @Column(nullable = false, length = 255)
    private String direccion;
    
    @Column(nullable = false, length = 100)
    private String ciudad;
    
    @Column(nullable = false, length = 10)
    private String codigoPostal;
    
    @Column(nullable = false, length = 100)
    private String pais;
    
    @Column(nullable = false)
    private Boolean isPrincipal = false;
    
    // Getters y Setters
}
```

### Reserva.java
```java
@Entity
@Table(name = "reservas")
public class Reserva {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    
    @ManyToOne
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoReserva estadoReserva;
    
    @Column(nullable = false)
    private LocalDateTime fechaReserva;
    
    @Column(nullable = false)
    private LocalDateTime fechaExpiracion;
    
    @ManyToOne
    @JoinColumn(name = "datos_fiscales_id")
    private DatosFiscales datosFiscales;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;
    
    @OneToMany(mappedBy = "reserva", cascade = CascadeType.ALL)
    private List<AsientoReserva> asientos;
    
    // Getters y Setters
}
```

### Entrada.java
```java
@Entity
@Table(name = "entradas")
public class Entrada {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 50)
    private String codigo;
    
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    
    @ManyToOne
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;
    
    @ManyToOne
    @JoinColumn(name = "asiento_id", nullable = false)
    private Asiento asiento;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoEntrada estadoEntrada;
    
    @Column(nullable = false)
    private LocalDateTime fechaCompra;
    
    @Lob
    private String qrCode; // Base64
    
    // Getters y Setters
}
```

---

## 🔐 Seguridad

### Validaciones necesarias:
1. **Autenticación:** Verificar JWT en todos los endpoints
2. **Autorización:** Verificar que el usuario solo accede a sus propios recursos
3. **Validación de NIF:** Implementar algoritmo de validación de NIF español
4. **Rate Limiting:** Prevenir abusos en la creación de reservas
5. **Timeout de Reservas:** Job programado que libere asientos de reservas expiradas

---

## ⏰ Job de Limpieza de Reservas Expiradas

```java
@Scheduled(fixedRate = 60000) // Cada minuto
@Transactional
public void limpiarReservasExpiradas() {
    List<Reserva> expiradas = reservaRepository.findByEstadoReservaAndFechaExpiracionBefore(
        EstadoReserva.PENDIENTE,
        LocalDateTime.now()
    );
    
    for (Reserva reserva : expiradas) {
        // Liberar asientos
        for (AsientoReserva ar : reserva.getAsientos()) {
            Asiento asiento = ar.getAsiento();
            asiento.setEstado(EstadoAsiento.LIBRE);
            asientoRepository.save(asiento);
        }
        
        // Marcar reserva como expirada
        reserva.setEstadoReserva(EstadoReserva.EXPIRADA);
        reservaRepository.save(reserva);
    }
}
```

---

## 📧 Email Service (Opcional)

```java
@Async
public void enviarEntradasAsync(String email, List<Entrada> entradas) {
    try {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        
        helper.setTo(email);
        helper.setSubject("Tus entradas para " + entradas.get(0).getEvento().getNombre());
        
        String html = generarHtmlEntradas(entradas);
        helper.setText(html, true);
        
        // Adjuntar PDFs
        for (Entrada entrada : entradas) {
            byte[] pdf = generarPdfEntrada(entrada.getId());
            helper.addAttachment("Entrada-" + entrada.getCodigo() + ".pdf", 
                new ByteArrayResource(pdf));
        }
        
        mailSender.send(message);
    } catch (Exception e) {
        log.error("Error enviando email de entradas", e);
    }
}
```

---

## ✅ Checklist de Integración

- [ ] Crear entidades JPA (DatosFiscales, Reserva, Entrada)
- [ ] Crear repositorios JPA
- [ ] Implementar controladores REST
- [ ] Implementar servicios transaccionales
- [ ] Validar NIF español
- [ ] Implementar generación de QR
- [ ] Implementar generación de PDF
- [ ] Configurar job de limpieza de reservas
- [ ] Implementar envío de emails
- [ ] Configurar CORS para permitir frontend
- [ ] Añadir tests unitarios
- [ ] Añadir tests de integración
- [ ] Documentar con Swagger/OpenAPI

---

**¡Con esta guía tienes todo lo necesario para completar la integración backend!** 🚀

