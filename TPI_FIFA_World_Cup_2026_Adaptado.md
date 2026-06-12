# Proyecto TPI: Fixture Digital FIFA World Cup 2026
## Versión Acotada para Trabajo Práctico Integrador

**Estado**: Diseño listo para implementar  
**Tiempo estimado**: 4-6 semanas  
**Integrantes**: 2-3 estudiantes  
**Dificultad**: Intermedio

---

## 📋 Cambios respecto al documento original

El documento "FIFA_WC2026_Resumen_Ejecutivo.md" que tienes es **profesional pero pensado para un equipo de 5+ desarrolladores con tecnologías avanzadas**.

Hemos adaptado el proyecto para que sea **realizable en el tiempo de un cuatrimestre por 2-3 estudiantes**, manteniendo toda la complejidad técnica de OOP:

### Simplificaciones principales

| Aspecto | Original | TPI Adaptado |
|---------|----------|-------------|
| **Partidos** | 104 (grupos + knockout) | 48 (solo grupos) |
| **Knockout** | Generación automática | Forma manual (opcional, si hay tiempo) |
| **Backend** | Node.js + Express + PostgreSQL | Node.js simple / JSON + localStorage |
| **Frontend** | React + Redux | HTML + CSS + Vanilla JS |
| **Real-time** | WebSocket + Socket.io | Polling simple o botón refresh |
| **API Externa** | SportRadar / ESPN | Mock data estática (sin integración) |
| **Git** | Básico | Evaluado por commits y participación |

---

## 🎯 Alcance del proyecto TPI

### Fases de grupos (48 partidos)

- **8 grupos**: A, B, C, D, E, F, G, H
- **4 equipos por grupo**
- **6 partidos por grupo** (round-robin: cada equipo juega con los otros 3)
- **Total**: 8 × 6 = 48 partidos

### Knockout (opcional, si hay tiempo)

- Octavos: 8 partidos (1°A vs 2°B, etc.)
- Cuartos: 4 partidos
- Semis: 2 partidos
- Final + tercer lugar: 2 partidos

**Para el TPI, es suficiente con los 48 de grupos. Knockout se agrega si termina temprano.**

---

## 📊 Entidades principales

### 1. **Torneo**
- Nombre, año, país anfitrión
- Colección de 8 grupos
- Métodos: `inicializar()`, `obtenerGrupo(id)`, `obtenerTodosPartidos()`

### 2. **Grupo**
- Identificador (A-H)
- 4 equipos
- 6 partidos
- Tabla de posiciones
- Métodos: `agregarEquipo()`, `calcularTabla()`, `obtenerPrimeros()`

### 3. **Equipo**
- Nombre, código (3 letras), bandera (emoji)
- Plantilla de 23 jugadores
- Estadísticas (partidos, victorias, derrotas, empates, goles a favor, goles en contra)
- Métodos: `agregarJugador()`, `obtenerJugador(numero)`, `calcularStats()`

### 4. **Jugador**
- Nombre, número, posición (Portero/Defensa/Centrocampista/Delantero)
- Goles marcados en el torneo
- Asistencias
- Métodos: `agregarGol()`, `agregarAsistencia()`, `obtenerStats()`

### 5. **Partido**
- Equipo local, equipo visitante
- Fecha y hora (ISO format)
- Resultado: golesLocal, golesVisitante (default: 0-0)
- Estado: PENDIENTE, JUGADO, ABANDONADO
- Estadio, árbitro (opcional)
- Lista de goles
- Métodos: `registrarGol()`, `obtenerGoles()`, `validarResultado()`, `obtenerGanador()`

### 6. **Gol**
- Jugador que marcó
- Minuto (1-90+)
- Tipo: NORMAL, PENAL, AUTOGOL
- Asistencia (opcional): jugador que asistió
- Métodos: `obtenerDescripcion()`, `esPenal()`, `esAutogol()`

### 7. **Tabla** (Standings)
- Equipo
- Partidos jugados (J)
- Victorias (G), empates (E), derrotas (P)
- Goles a favor (GF), goles en contra (GC), diferencia (DG)
- Puntos (3 por victoria, 1 por empate, 0 por derrota)
- Métodos: `calcularPuntos()`, `calcularDiferencia()`, `comparar()` (para ordenamiento)

### 8. **Usuario** (opcional, para permisos)
- Nombre, email
- Rol: ADMIN (edita resultados), USUARIO (solo ve)
- Métodos: `puedeEditarPartido()`, `puedeVerTodo()`

---

## ⚽ Funcionalidades MVP (Producto Mínimo Viable)

### Fase 1: Visualización (Semanas 1-2)

- ✅ Ver fixture completa (48 partidos)
- ✅ Filtrar partidos por grupo (A, B, C, ..., H)
- ✅ Ver detalles de cada partido (equipos, hora, estado, resultado)
- ✅ Ver tabla de posiciones de cada grupo
- ✅ Ordenar tabla por puntos (descendente)

### Fase 2: Ingreso de resultados (Semanas 3-4)

- ✅ Seleccionar un partido (estado PENDIENTE)
- ✅ Cargar resultado: goles local y visitante
- ✅ Agregar goles con:
  - Jugador (desplegable de plantilla)
  - Minuto (validación 1-90)
  - Tipo (normal/penal/autogol)
  - Asistencia (opcional)
- ✅ Validaciones:
  - No números negativos
  - Minuto entre 1 y 90
  - Cantidad de goles = cantidad de registros
  - Jugadores válidos del equipo
- ✅ Tabla se recalcula automáticamente tras cada gol
- ✅ Persistencia: guardar en localStorage

### Fase 3: Reportes y pulido (Semanas 5-6)

- ✅ Vista de goleadores: jugadores que más goles hicieron en el torneo
- ✅ Historial de goles por partido (quién, cuándo, tipo)
- ✅ Exportar tabla a JSON
- ✅ Búsqueda rápida de partidos por equipo
- ✅ Diseño responsive (mobile-first)

---

## 🏗️ Arquitectura MVC Simplificada

### 📦 MODELO (`/modelos`)

Clases con lógica de negocio pura:

```
Torneo.js       → Gestiona el torneo completo y sus grupos
Grupo.js        → Un grupo con sus 4 equipos y 6 partidos
Equipo.js       → Información del equipo, plantilla, stats
Jugador.js      → Datos del jugador, goles, asistencias
Partido.js      → Detalles del partido, resultado, goles
Gol.js          → Registro de cada gol marcado
Tabla.js        → Cálculo y almacenamiento de standings
```

**Responsabilidades**:
- Validar datos (¿minuto válido? ¿jugador existe?)
- Calcular resultados (tabla, puntos, ganador)
- Sin UI, sin localStorage (solo datos)

### 🎨 VISTA (`/vistas`)

Archivos HTML + CSS para la presentación:

```
index.html              → Dashboard principal
fixture.html            → Lista de partidos
partido-detalle.html    → Editar resultado de un partido
stats.html              → Goleadores y reportes
styles.css              → Estilos globales
```

**Responsabilidades**:
- Mostrar datos (no procesarlos)
- Capturar eventos (clicks, input)
- Enviar datos al controlador

### 🎮 CONTROLADOR (`/controladores`)

JavaScript que conecta modelo y vista:

```
torneoController.js         → Cargar/guardar fixture, inicializar
partidoController.js        → Registrar resultado, agregar goles
tablaController.js          → Calcular y mostrar standings
estadísticasController.js   → Goleadores, reportes
```

**Responsabilidades**:
- Recibir acciones de la vista
- Llamar a métodos del modelo
- Actualizar vista con resultados
- Persistencia (localStorage)

### 📂 Datos

```
/datos/fixture.json     → Fixture inicial (48 partidos, equipos, fechas)
```

---

## 👥 División de tareas por integrante

### **Integrante A: Diseño y modelado**

**Tareas principales**:
- ✅ Diagrama UML de clases (entidades, relaciones, métodos)
- ✅ Diagrama de secuencia (flujo: usuario edita resultado → tabla se recalcula)
- ✅ Especificación de métodos de cada clase
- ✅ Mockups HTML/CSS (wireframes)
- ✅ README del proyecto
- ✅ Crear fixture.json con datos iniciales

**Archivos a crear**:
- `docs/diagrama-clases.png` (o en texto Mermaid)
- `docs/diagrama-secuencia.png`
- `README.md`
- `datos/fixture.json`
- `vistas/mockups.html` (de referencia)

**Commits típicos**:
```
- feat: Agregar diagrama UML de clases
- docs: Escribir README del proyecto
- data: Fixture inicial con 48 partidos
```

---

### **Integrante B: Vistas y presentación**

**Tareas principales**:
- ✅ HTML semántico para las 4 vistas principales
- ✅ CSS responsive (mobile-first, Flexbox/Grid)
- ✅ Tablas bonitas de standings
- ✅ Formularios para editar resultados
- ✅ Clase `Jugador` con métodos básicos
- ✅ Clase `Partido` con validaciones
- ✅ Persistencia en localStorage

**Archivos a crear**:
- `vistas/index.html`
- `vistas/fixture.html`
- `vistas/partido-detalle.html`
- `vistas/stats.html`
- `vistas/styles.css`
- `modelos/Jugador.js`
- `modelos/Partido.js`
- Tests básicos en navegador

**Commits típicos**:
```
- feat: Vista de fixture con filtros por grupo
- feat: Formulario para registrar resultado
- feat: Tabla de standings con colores
- feat: Clase Jugador y Partido con validaciones
```

---

### **Integrante C: Lógica de negocio y coordinación**

**Tareas principales**:
- ✅ Clases complejas: `Torneo`, `Grupo`, `Tabla`
- ✅ Controladores (3 clases)
- ✅ Cálculo de tabla de posiciones
- ✅ Validaciones de reglas del fútbol
- ✅ Persistencia completa (cargar/guardar)
- ✅ Manejo del repositorio Git
- ✅ Code review de otros integrantes

**Archivos a crear**:
- `modelos/Torneo.js`
- `modelos/Grupo.js`
- `modelos/Tabla.js`
- `modelos/Gol.js`
- `controladores/torneoController.js`
- `controladores/partidoController.js`
- `controladores/tablaController.js`
- `main.js` (inicialización)
- `test/` (tests unitarios)

**Commits típicos**:
```
- feat: Clase Torneo y Grupo con métodos
- feat: Cálculo automático de tabla
- feat: Controlador de partidos con persistencia
- fix: Validación de goles y minutos
```

---

## 📅 Timeline realista (4-6 semanas)

### **Semana 1: Análisis y Diseño**

**Meta**: Tener claro QUÉ vamos a hacer

- [ ] Leer y entender este documento
- [ ] Crear repo en GitHub (privado)
- [ ] Hacer diagrama UML de clases
- [ ] Hacer diagrama de secuencia principal
- [ ] Crear mockups de vistas en Figma o en HTML estático
- [ ] Definir estructura de carpetas
- [ ] Crear archivo `fixture.json` con datos iniciales (8 grupos, 4 equipos cada uno, 6 partidos cada grupo)

**Commits esperados**: 10-15 (especialmente en `docs/` y datos iniciales)

**Responsables**: Integrante A lidera, los otros revisan y aportan

---

### **Semana 2: Clases base y modelos**

**Meta**: Tener las clases fundamentales funcionando

- [ ] Clase `Jugador`: nombre, número, posición, goles, asistencias
- [ ] Clase `Gol`: jugador, minuto, tipo, asistencia
- [ ] Clase `Partido`: teams, fecha, resultado, lista de goles, estado
- [ ] Clase `Equipo`: nombre, plantilla, calcularStats()
- [ ] Tests unitarios básicos (¿gol se agrega correctamente? ¿se calcula correctamente?)

**Commits esperados**: 8-10

**Responsables**: Integrante B (Jugador, Partido) + Integrante C (Equipo) + Integrante A (tests)

---

### **Semana 3: Vistas y tabla**

**Meta**: Ver la interfaz funcionando (aunque vacía)

- [ ] HTML/CSS de las 4 vistas (index, fixture, partido-detalle, stats)
- [ ] Carga inicial de fixture desde JSON
- [ ] Clase `Tabla` con cálculo de standings
- [ ] Clase `Grupo` con métodos
- [ ] Vista de tabla de posiciones (al menos grupo A)

**Commits esperados**: 12-15

**Responsables**: Integrante B (vistas) + Integrante C (Tabla, Grupo)

---

### **Semana 4: Integración y funcionalidad principal**

**Meta**: Poder editar resultados y ver tabla recalcularse

- [ ] Controlador de partidos
- [ ] Funcionalidad: editar resultado de un partido
- [ ] Funcionalidad: agregar goles con validaciones
- [ ] Recálculo automático de tabla
- [ ] Persistencia en localStorage
- [ ] Tests E2E básicos

**Commits esperados**: 15-20

**Responsables**: Integrante C (controlador, lógica) + Integrante B (UI interactiva) + Integrante A (tests)

---

### **Semana 5: Reportes y pulido**

**Meta**: Feature-complete

- [ ] Vista de goleadores (top scorers)
- [ ] Historial de goles
- [ ] Búsqueda de partidos
- [ ] Exportar tabla a JSON
- [ ] Validaciones completas
- [ ] Bug fixes
- [ ] Performance (carga rápida)

**Commits esperados**: 10-12

**Responsables**: Integrante A (stats) + Integrante C (lógica) + Integrante B (UX)

---

### **Semana 6: Refinamiento y documentación**

**Meta**: Proyecto listo para entregar

- [ ] Code review cruzado
- [ ] README con instrucciones
- [ ] Diagrama UML actualizado
- [ ] Ejemplos de uso
- [ ] Git: commits limpios y bien mensajeados
- [ ] Deploy a GitHub Pages (opcional)
- [ ] Presentation prep

**Commits esperados**: 5-8 (especialmente documentación)

**Responsables**: Integrante A (README) + Integrante C (coordinación)

---

## 📁 Estructura de carpetas

```
/proyecto
├── /modelos
│   ├── Torneo.js
│   ├── Grupo.js
│   ├── Equipo.js
│   ├── Jugador.js
│   ├── Partido.js
│   ├── Gol.js
│   └── Tabla.js
├── /vistas
│   ├── index.html
│   ├── fixture.html
│   ├── partido-detalle.html
│   ├── stats.html
│   └── styles.css
├── /controladores
│   ├── torneoController.js
│   ├── partidoController.js
│   ├── tablaController.js
│   └── estadísticasController.js
├── /datos
│   └── fixture.json
├── /docs
│   ├── diagrama-clases.md (o .png)
│   ├── diagrama-secuencia.md (o .png)
│   └── especificacion.md
├── /test
│   ├── Jugador.test.js
│   ├── Partido.test.js
│   └── Tabla.test.js
├── README.md
├── main.js (inicialización)
├── .gitignore
└── package.json (opcional, si usan npm)
```

---

## 🔄 Conceptos del cuatrimestre aplicados

| Concepto | Dónde aparece | Ejemplo |
|----------|---------------|---------|
| **Clases y objetos** | Todas las clases de `/modelos` | Jugador, Partido, Gol |
| **Encapsulación** | Métodos privados/públicos | `#tablero` privado, `calcularTabla()` público |
| **Herencia** | Gol (subclases: GoalNormal, GoalPenal, GoalAutogol) | Polimorfismo en `obtenerPuntos()` |
| **Polimorfismo** | Diferentes tipos de gol → diferente impacto | Autogol resta 1 punto; normal suma |
| **UML** | `/docs/diagrama-clases.md` | Relaciones, multiplicidades, atributos |
| **MVC** | Arquitectura del proyecto | Modelo/Vista/Controlador separados |
| **Modularización** | Cada clase en archivo separado | Reutilización y mantenimiento |
| **Persistencia** | localStorage o JSON | Guardar/cargar fixture |
| **Git** | Commits frecuentes y bien nombrados | Feature branches, code review |

---

## ✅ Por qué este proyecto es ideal para TPI

### 1. **Jerarquías naturales**
   - `Equipo` contiene `Jugador`
   - `Partido` contiene `Gol`
   - `Gol` tiene subtipo (normal/penal/autogol)
   - `Torneo` contiene `Grupo` contiene `Equipo`

### 2. **Lógica de negocio real**
   - Cálculo de tabla de posiciones (puntos, diferencia de goles, desempate)
   - Validación de reglas de fútbol (minutos válidos, equipos válidos)
   - Conteo automático de goleadores
   - Estados de partido (PENDIENTE → JUGADO)

### 3. **Interactividad significativa**
   - Usuario edita resultado
   - Sistema valida y recalcula
   - Vista se actualiza automáticamente
   - No es un simple CRUD

### 4. **Datos estructurados y realistas**
   - Fixture con 48 partidos reales de Qatar 2022 (o similar)
   - Equipos y jugadores reales
   - Fechas y horas reales

### 5. **Evaluable en Git**
   - Cada commit muestra quién hizo qué
   - Historial claro de desarrollo
   - Code review integrado

### 6. **Escalable a futuro**
   - Fase 1: Grupos (MVP)
   - Fase 2: Knockout (opcional)
   - Fase 3: API real de datos
   - Fase 4: Base de datos SQL

---

## 🚀 Próximos pasos inmediatos

### 1. **Crear repositorio en GitHub**
```bash
git clone https://github.com/tu-usuario/fifa-wc2026-tpi.git
cd fifa-wc2026-tpi
```

### 2. **Configurar estructura inicial**
```bash
mkdir modelos vistas controladores datos docs test
touch .gitignore README.md main.js
```

### 3. **Generar UML**
   - Usar Mermaid, Lucidchart, o Draw.io
   - Basarse en las 7 entidades principales de este documento

### 4. **Crear fixture.json**
   - 8 grupos (A-H)
   - 4 equipos por grupo
   - 6 partidos por grupo
   - Ver template en sección de datos

### 5. **Primer commit**
```bash
git add .
git commit -m "Initial: project structure and documentation"
git push
```

---

## 📚 Archivos de documentación a generar

Este proyecto requiere:

1. **README.md**
   - Descripción del proyecto
   - Cómo ejecutar (abrir index.html en navegador)
   - Cómo agregar resultado de un partido
   - Créditos y autores

2. **diagrama-clases.md** (UML)
   - Todas las clases y relaciones
   - Métodos públicos y privados
   - Tipos de dato

3. **diagrama-secuencia.md**
   - Flujo: usuario selecciona partido → edita resultado → tabla se recalcula
   - Interacción entre modelo, vista, controlador

4. **especificacion.md**
   - Requisitos funcionales
   - Requisitos no funcionales
   - Casos de uso

---

## 📞 Tips finales

### ✅ Haz esto

- Commit después de cada feature pequeña
- Mensaje de commit descriptivo: `feat: agregar goles a partido`
- Separar en ramas por feature: `git checkout -b feature/agregar-goles`
- Code review antes de mergear
- Tests antes de features complejas
- Documentar mientras codeas

### ❌ Evita esto

- Commit gigante al final (`fix: todo`)
- Cambios en múltiples responsabilidades por commit
- Subir contraseñas o archivos grandes
- Mezclar estilos de código entre integrantes
- Dejar TODO al último momento

### 🎯 Enfoque

- **Semana 1**: Entender bien qué hacemos (UML es la guía)
- **Semanas 2-4**: Implementar lo básico funcional
- **Semanas 5-6**: Pulir, documentar, presentar

---

## 📝 Checklist final antes de entregar

- [ ] Diagrama UML completo y claro
- [ ] README con instrucciones de uso
- [ ] 48 partidos en fixture.json
- [ ] Fixture visible en web
- [ ] Poder editar un partido y ver resultado
- [ ] Tabla de posiciones que se recalcula
- [ ] Validaciones básicas (minuto, jugador)
- [ ] localStorage guardando cambios
- [ ] Responsive en mobile
- [ ] Git con commits limpios y frecuentes
- [ ] Todos los integrantes con commits visibles
- [ ] Código comentado en puntos complejos

---

## 🎓 Conclusión

Este proyecto **integra todos los conceptos del cuatrimestre** en un sistema realista, escalable y profesional.

**No es "solo un CRUD"** — es una aplicación con lógica de negocio real, validaciones, cálculos complejos, y un flujo de usuario significativo.

**¿Preguntas?** Consultá los diagramas UML, revisá el fixture.json, y empezá con el integrante A haciendo el diagrama de clases.

---

**Documento creado**: Junio 2026  
**Versión**: 1.0 TPI  
**Estado**: Listo para comenzar ✅
