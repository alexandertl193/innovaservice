# Listado de tareas – Alcance Funcional Fase 1 (Mockup / Bosquejo)  
**Plataforma de Ingreso y Gestión de Reclamos e Instalaciones (Innova)**

---

## Alcance del proyecto

Este proyecto es un **mockup o bosquejo** de la plataforma. Se sube únicamente a **GitHub** y se ejecuta en **GitHub Actions** (CI + despliegue, p. ej. GitHub Pages). No hay backend, base de datos ni servicios externos reales.

- **En alcance:** frontend (React), datos mock (`mockApi`), flujos UI, validaciones, demostración de pantallas y comportamientos.
- **Fuera de alcance (por ahora):** base de datos, API real, autenticación real, envío real de emails/SMS, mapas reales (Google Maps, etc.), persistencia entre sesiones.

**Leyenda:** **Hecho** | **Parcial** | **Pendiente** | **Fuera de alcance (mockup)**

---

## 1. Objetivo y contexto

| # | Tarea | Estado | Ubicación / Notas |
|---|--------|--------|-------------------|
| 1.1 | Centralizar registro de reclamos e instalaciones canal Innova | **Hecho** | `App.tsx`, `ClientWizard`, `mockApi.createCase` |
| 1.2 | Permitir que el cliente ingrese la solicitud vía plataforma web | **Hecho** | `/` → “Nueva Solicitud” → `/wizard` |
| 1.3 | Reducir carga operativa de Post Venta (evitar registro manual) | **Hecho** | Casos creados por cliente; admin solo valida y programa (flujo simulado) |

---

## 2. Usuarios considerados

| # | Tarea | Estado | Ubicación / Notas |
|---|--------|--------|-------------------|
| 2.1 | Soporte para **clientes finales** (tiendas físicas y e‑commerce Innova) | **Hecho** | Rutas cliente: `/`, `/wizard`, `/success`, `/tracking` |
| 2.2 | Soporte para **equipo de Post Venta** | **Hecho** | `/admin`, Gestión de Casos, Agenda |
| 2.3 | Soporte para **equipo de supervisión** (Comercial / TI) | **Parcial** | Mismo panel `/admin`; sin rol ni vista diferenciada (aceptable en mockup) |
| 2.4 | Autenticación y control de acceso por rol | **Fuera de alcance** | No hay backend; en mockup no se implementa login real |
| 2.5 | Diferenciar permisos: Cliente vs Post Venta vs Supervisión | **Fuera de alcance** | Idem; se simula solo con rutas separadas cliente/admin |

---

## 3. Funcionalidades principales

### 3.1 Plataforma web de autogestión

| # | Tarea | Estado | Ubicación / Notas |
|---|--------|--------|-------------------|
| 3.1.1 | **Punto de entrada único** para reclamos e instalaciones | **Hecho** | `ClientViews.tsx` → `LandingPage`: “Nueva Solicitud” y “Seguimiento” |
| 3.1.2 | Formulario de registro | **Hecho** | `ClientWizard.tsx` |
| 3.1.3 | Formulario dividido en **4 pasos** | **Hecho** | `STEPS`, `currentStep`, progreso visual |
| 3.1.4 | **Validaciones automáticas** de la información ingresada | **Hecho** | `validateStep()` en `ClientWizard` |
| 3.1.5 | Validación DNI (8 dígitos) | **Hecho** | `ClientWizard` L52–53 |
| 3.1.6 | Validación RUC (11 dígitos) | **Hecho** | `ClientWizard` L53 |
| 3.1.7 | Validación email (formato) | **Hecho** | `ClientWizard` L55 |
| 3.1.8 | Validación celular (9 dígitos) | **Hecho** | `ClientWizard` L56, `maxLength={9}` |
| 3.1.9 | Validación campos obligatorios por paso | **Hecho** | `validateStep` pasos 1–4 |
| 3.1.10 | Mensajes de error visibles al usuario | **Hecho** | `error` state, bloque con `AlertCircle` en wizard |
| 3.1.11 | Barra de progreso / pasos visibles | **Hecho** | `STEPS` + círculos numerados y “Siguiente” / “Atrás” |

---

### 3.2 Flujo del formulario

#### Paso 1 – Tipo de solicitud

| # | Tarea | Estado | Ubicación / Notas |
|---|--------|--------|-------------------|
| 3.2.1 | Selección **Reclamo** o **Instalación** | **Hecho** | `ClientWizard` L154–175, `CaseType` |
| 3.2.2 | UI diferenciada (iconos, textos) para cada tipo | **Hecho** | `FileWarning` / `Wrench`, descripciones |
| 3.2.3 | Bloquear “Siguiente” si no se elige tipo | **Hecho** | `validateStep(1)` |

#### Paso 2 – Datos del cliente, producto, marca y tipología

| # | Tarea | Estado | Ubicación / Notas |
|---|--------|--------|-------------------|
| 3.2.4 | Ingreso **datos del cliente**: nombres, apellidos | **Hecho** | `ClientWizard` L184–185 |
| 3.2.5 | Tipo de documento (DNI / RUC) + número | **Hecho** | `ClientWizard` L187–189, `docType`, `docNumber` |
| 3.2.6 | Email y celular | **Hecho** | `ClientWizard` L191–192 |
| 3.2.7 | Ingreso **producto**: categoría, marca, modelo | **Hecho** | `ClientWizard` L197–201, `ProductData` |
| 3.2.8 | Campo **tipología** explícito | **Pendiente** | No existe. En mockup: añadir en paso 2 (ej. Select “Tipología”) y en `ProductData` |
| 3.2.9 | Opcional: fecha de compra, número de serie | **Parcial** | `types` los tiene; wizard no los pide. Opcional para mockup |
| 3.2.10 | Validar al menos categoría y marca | **Hecho** | `validateStep(2)` L56 |
| 3.2.11 | Opciones de categoría/marca acordes a Innova | **Hecho** | Grifería/Sanitarios/Accesorios, Vainsa/Italgrif |

#### Paso 3 – Dirección y mapa

| # | Tarea | Estado | Ubicación / Notas |
|---|--------|--------|-------------------|
| 3.2.12 | Ingreso **dirección**: departamento, provincia, distrito | **Hecho** | `ClientWizard` L211–213, `LocationData` |
| 3.2.13 | Dirección exacta y referencia | **Hecho** | `ClientWizard` L214–215 |
| 3.2.14 | **Soporte de mapa** para ubicación | **Hecho** | `UI.tsx` → `MockMap` (simulado) |
| 3.2.15 | **Ajuste manual del pin** (lat/lng) | **Hecho** | `MockMap` onClick, `onChange(lat, lng)` |
| 3.2.16 | Persistir lat/lng en el caso (mock) | **Hecho** | `formData.lat/lng` → `location` en `createCase` |
| 3.2.17 | Integración con mapa real (Google Maps, etc.) | **Fuera de alcance** | Mockup usa `MockMap`; sin APIs externas |
| 3.2.18 | Geocodificación inversa (dirección → coordenadas) | **Fuera de alcance** | Idem |
| 3.2.19 | Validar distrito y dirección | **Hecho** | `validateStep(3)` L58–59 |

#### Paso 4 – Fecha de atención

| # | Tarea | Estado | Ubicación / Notas |
|---|--------|--------|-------------------|
| 3.2.20 | Selección de **fecha** de atención | **Hecho** | `Input type="date"`, `scheduleDate` |
| 3.2.21 | **Calendario** visual (opcional en mockup) | **Pendiente** | Solo `<input type="date">`. Mejora UX si se añade componente tipo calendar |
| 3.2.22 | Selección de **bloque horario** (AM / PM) | **Hecho** | Botones Mañana / Tarde, `scheduleSlot` |
| 3.2.23 | **Disponibilidad** por fecha/franja (slots ocupados deshabilitados) | **Fuera de alcance** | Requeriría lógica/API de capacidad; en mockup no aplica |
| 3.2.24 | API o reglas de disponibilidad (capacidad, feriados) | **Fuera de alcance** | Idem |
| 3.2.25 | Evitar fechas pasadas | **Hecho** | `min={new Date().toISOString().split('T')[0]}` |
| 3.2.26 | Resumen de la solicitud antes de confirmar | **Hecho** | Bloque “Resumen de Solicitud” paso 4 |
| 3.2.27 | Mensaje sobre confirmación posterior por el equipo | **Hecho** | Aviso “referenciales… confirmados en 24 h” |

---

### 3.3 Gestión en Post Venta

| # | Tarea | Estado | Ubicación / Notas |
|---|--------|--------|-------------------|
| 3.3.1 | **Recepción** del caso en plataforma Post Venta (mock) | **Hecho** | `mockApi.createCase` → lista en `/admin/cases` |
| 3.3.2 | Listado de casos con filtros (estado, búsqueda) | **Hecho** | `AdminCaseList`, filtros por status y búsqueda |
| 3.3.3 | **Validación de información** por equipo técnico | **Hecho** | “Validar información” → `PENDIENTE_VALIDACION` |
| 3.3.4 | **Programación del servicio** sin registro manual | **Hecho** | “Confirmar programación” → `PROGRAMADO` |
| 3.3.5 | Vista **Agenda** (día / semana / mes) | **Hecho** | `AdminSchedule` |
| 3.3.6 | Agrupar casos por fecha y bloque (AM/PM) | **Hecho** | `groupCasesByDate`, `getSlotLabel` |
| 3.3.7 | Cambio de estado: Técnico en camino | **Hecho** | `AdminCaseDetail` y `AdminSchedule` |
| 3.3.8 | Cambio de estado: Atendido | **Hecho** | “Marcar Atendido” → `ATENDIDO` |
| 3.3.9 | Cambio de estado: Cerrar caso | **Hecho** | “Cerrar Caso” → `CERRADO` |
| 3.3.10 | Historial de acciones por caso | **Hecho** | `CaseHistory` en detalle y en tracking |
| 3.3.11 | Notas internas en detalle de caso | **Parcial** | Textarea + “Agregar nota” en UI; no se persisten en mock |
| 3.3.12 | Cancelar solicitud | **Parcial** | Botón existe pero `disabled`. Pendiente: habilitar y `updateCaseStatus(…, CANCELADO)` |
| 3.3.13 | Edición de fecha/hora (reagendar) en admin | **Pendiente** | No se puede modificar `schedule` desde admin; factible en mock con `mockApi` |

---

### 3.4 Notificaciones automáticas (simulación en mockup)

En un mockup **no hay envío real** de email/SMS. Solo se puede **simular** la idea (ej. mensajes en UI o lista mock de “notificaciones enviadas”).

| # | Tarea | Estado | Ubicación / Notas |
|---|--------|--------|-------------------|
| 3.4.1 | **Confirmación de registro** (cliente) | **Hecho** | Success en web; mensaje tipo “Hemos recibido tu solicitud” |
| 3.4.2 | **Programación de atención** (cliente) | **Parcial** | Cliente ve estado en tracking; no hay “aviso” simulado aparte |
| 3.4.3 | **Aviso de técnico en camino** (cliente) | **Parcial** | Idem; se refleja en timeline al consultar |
| 3.4.4 | **Cierre del servicio** (cliente) | **Parcial** | Idem |
| 3.4.5 | **Envío de encuesta NPS** tras cierre | **Pendiente** | Ver sección 4 (NPS en mockup) |
| 3.4.6 | Notificaciones al **equipo Vainsa** | **Fuera de alcance** | Sin backend; no se implementa en mockup |
| 3.4.7 | Servicio real de envío (email/SMS) | **Fuera de alcance** | Sin backend |
| 3.4.8 | Plantillas de mensajes por evento | **Fuera de alcance** | Idem |
| 3.4.9 | Preferencias cliente (email vs SMS) | **Fuera de alcance** | Idem |
| 3.4.10 | Ruta **Notificaciones** en admin | **Pendiente** | Link en sidebar a `/admin/notifications`; ruta no existe en `App`. Añadir vista mock (ej. “Log de notificaciones” con datos estáticos) |

---

## 4. Indicadores habilitados (con datos mock)

Todo se calcula desde `MOCK_CASES` / `mockApi`; no hay persistencia entre despliegues.

| # | Tarea | Estado | Ubicación / Notas |
|---|--------|--------|-------------------|
| 4.1 | **Cantidad de reclamos e instalaciones por mes** | **Pendiente** | Dashboard muestra totales. Calcular desde `createdAt` y agrupar por mes en `getDashboardStats` |
| 4.2 | Gráfico o tabla “reclamos/instalaciones por mes” | **Pendiente** | Añadir en `AdminDashboard` cuando 4.1 exista |
| 4.3 | **Tiempo promedio de programación** | **Pendiente** | Calcular en mock: ej. desde `createdAt` hasta primer `history` con “Programación” / `PROGRAMADO` |
| 4.4 | **Tiempo promedio de atención** | **Pendiente** | Calcular en mock: ej. desde `PROGRAMADO` hasta `ATENDIDO`/`CERRADO` usando `history` |
| 4.5 | **Casos abiertos vs. cerrados** | **Hecho** | `DashboardStats`, KPI + gráfico de torta |
| 4.6 | **NPS post servicio** en dashboard | **Hecho** | `npsScore` en `Case`, promedio en dashboard (datos mock) |
| 4.7 | Flujo para que el **cliente** responda NPS (encuesta + guardado en mock) | **Pendiente** | Página o modal “Encuesta NPS” (ej. tras consultar caso cerrado); guardar en `mockApi` y en `Case` |
| 4.8 | Cálculo de indicadores desde `history` y fechas (mock) | **Parcial** | Abiertos/cerrados y totales sí; tiempos y por mes no |

---

## 5. Infraestructura y calidad (mockup + GitHub Actions)

| # | Tarea | Estado | Ubicación / Notas |
|---|--------|--------|-------------------|
| 5.1 | Backend / API real | **Fuera de alcance** | Mockup solo usa `mockApi` |
| 5.2 | Base de datos | **Fuera de alcance** | Idem |
| 5.3 | Autenticación real (login, sesión, roles) | **Fuera de alcance** | Idem |
| 5.4 | **CI en GitHub Actions** (install + build) | **Hecho** | `ci.yml`: `npm install`, `npm run build` |
| 5.5 | **Despliegue** vía GitHub Actions (ej. GitHub Pages) | **Parcial** | `deploy.yml` existe; verificar que efectivamente publique el `dist` |
| 5.6 | Lint en CI (opcional para mockup) | **Pendiente** | No hay en `ci.yml` |
| 5.7 | Tests (opcional para mockup) | **Pendiente** | Sin `test` en `package.json` ni `*.test.*` / `*.spec.*` |
| 5.8 | Variables de entorno (API URL, etc.) | **Fuera de alcance** | No hay backend; en mockup no aplica |

---

## 6. UX y contenido

| # | Tarea | Estado | Ubicación / Notas |
|---|--------|--------|-------------------|
| 6.1 | Landing clara: Nueva Solicitud + Seguimiento | **Hecho** | `LandingPage` |
| 6.2 | Página de éxito con código de caso y enlace a tracking | **Hecho** | `SuccessPage` |
| 6.3 | Seguimiento por número de caso + documento | **Hecho** | `TrackingPage` |
| 6.4 | Timeline del caso en seguimiento | **Hecho** | `result.history` en `TrackingPage` |
| 6.5 | Layout cliente (header, navegación) | **Hecho** | `ClientLayout` |
| 6.6 | Layout admin (sidebar, secciones) | **Hecho** | `AdminLayout` |
| 6.7 | Responsive (móvil/tablet) | **Parcial** | Tailwind responsive; revisar wizard y agenda en móvil |
| 6.8 | Accesibilidad básica (ARIA, contraste, teclado) | **Pendiente** | Opcional para mockup; no revisado |

---

## 7. Resumen por estado

| Estado | Cantidad | Observación |
|--------|----------|-------------|
| **Hecho** | 48 | Cumplido en el ámbito mockup |
| **Parcial** | 9 | Mejorable sin salir del alcance |
| **Pendiente** | 12 | Factibles solo con frontend + mock |
| **Fuera de alcance (mockup)** | 14 | Backend, BD, auth, notificaciones reales, mapa real, etc. |

---

## 8. Priorización para cerrar brechas (dentro del mockup)

### Hacer sí o sí (rápido y solo frontend + mock)

1. **Tipología** (3.2.8): Añadir campo en paso 2 y en `ProductData`.
2. **Ruta Notificaciones** (3.4.10): Crear `/admin/notifications` en `App`, vista simple con listado mock de “notificaciones” (registro, programación, etc.).
3. **Cancelar solicitud** (3.3.12): Habilitar botón, llamar `updateCaseStatus(…, CANCELADO)` y actualizar UI.

### Recomendable (mejora UX y métricas mock)

4. **Indicadores por mes** (4.1–4.2): Calcular en `getDashboardStats` por mes y mostrar gráfico o tabla en dashboard.
5. **Tiempos promedio** (4.3–4.4): Calcular en mock desde `history` y mostrarlos en dashboard (reemplazar `avgResponseTime` fijo).
6. **Encuesta NPS** (4.7): Página/modal para que el cliente “responda” NPS tras caso cerrado; guardar en `mockApi` y en `Case`.

### Opcional

7. **Calendario visual** (3.2.21): Sustituir o complementar `input date` por un calendario en paso 4.
8. **Reagendar** (3.3.13): En detalle de caso, permitir editar fecha/slot y actualizar vía `mockApi`.
9. **Notas internas** (3.3.11): Guardar en estado local o en estructura mock y mostrarlas en historial.
10. **Lint en CI** (5.6): Añadir `npm run lint` al workflow si se configura ESLint.

---

## 9. Qué no se hará en este mockup

- Base de datos ni API real.
- Autenticación ni roles reales.
- Envío real de emails o SMS.
- Google Maps u otro mapa real.
- Geocodificación.
- Disponibilidad real de turnos (APIs de agenda).
- Persistencia entre sesiones o despliegues (los datos mock se reinician).

---

*Documento ajustado al alcance **mockup/bosquejo**: solo frontend, GitHub Actions, datos mock. Actualizar al completar tareas.*
