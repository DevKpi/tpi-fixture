# FIFA World Cup 2026 - Fixture Digital

**Trabajo Práctico Integrador** — 

## 📋 Descripción

Sistema digital para gestionar la **FIFA World Cup 2026** completa: 32 selecciones,
8 grupos, **104 partidos** (48 de grupos + 56 de eliminatorias).

Permite:
- 📊 Ver el fixture completo (grupos y eliminatorias) con filtros
- ✏️ Registrar resultados y goles por jugador
- 📈 Calcular tablas de posiciones automáticamente
- 🏆 Generar el árbol de playoff (octavos → final) desde los clasificados
- ⚽ Ranking de goleadores y asistencias
- ⏰ Countdown al próximo partido
- 💾 Persistencia en localStorage (los datos sobreviven a recargas)

**Stack**: JavaScript ES Modules + HTML5 + CSS3. Sin frameworks.

---

## 👥 Equipo

| Integrante | Rol |
|---|---|
| **Thiago**  | UML, datos, vistas, README |
| **Esteban** | Modelos, controladores, persistencia, tests |

---

## 🚀 Cómo ejecutar

Los JS Modules requieren un servidor (no funciona con doble clic en el archivo):

```bash
npm install -g http-server
http-server . -p 8000
# Abrir: http://localhost:8000/vistas/index.html
```

O con la extensión **Live Server** de VS Code.



## 📁 Estructura

```
fifa-wc2026-tpi/
├── models/
│   ├── Users.js
│   ├── Mundial.js            ← coordinador principal
│   ├── Group.js
│   ├── CountryTeams.js
│   ├── Player.js
│   ├── Match.js
│   ├── Goal.js
│   ├── Fase.js
│   ├── LlaveEliminatoria.js  
│   ├── Eliminatorias.js      ← motor del árbol de playoff
│   ├── Table.js
│   └── TableRegister.js
├── controllers/
│   ├── MundialController.js
│   ├── GroupController.js
│   ├── MatchController.js
│   ├── CleanSheet.js
│   ├── GoalsController.js
│   ├── AssistController.js
│   └── MatchController.js
├── views/  
│   ├── fixture.html            → 48 partidos + tabla por grupo
│   ├── match-detail.html    → Registrar goles
│   ├── tops.html         → Rankings
│   ├── login.html         → login para saber a quien se le guarda el progreso
│   ├── elimination-bracket.html → Árbol de playoff (Fase 2)
│   └── styles/styles.css
├── data/
│   ├── full-fixture.json   (104 partidos en total)
│   └── teams.json            (48 selecciones × 23 jugadores)
├── services/
│   └── apiService.js
├── test/
│   ├── Gol.test.js
│   ├── Partido.test.js
│   ├── Tabla.test.js
│   ├── Mundial.test.js
│   └── Eliminatorias.test.js 
├── docs/
│   ├── diagram-class.md
│   ├── diagram-class.png
│   └── diagram-sequence.md
├── main.js
├── index.html              → Dashboard + countdown
├── package.json
└── .gitignore
```

---

## 📊 Entidades implementadas

| Clase | Responsabilidad |
|---|---|
| **Mundial** | Coordinador general, integra Fase 1 y Fase 2 |
| **Eliminatorias** | Motor del árbol de playoff; genera y conecta llaves |
| **LlaveEliminatoria** | Enfrentamiento de una ronda; propaga ganador automáticamente |
| **Grupo** | 4 selecciones + 6 partidos (round-robin) |
| **Selección** | Equipo con plantilla de 23 jugadores |
| **Jugador** | Goles, asistencias, tarjetas, posición |
| **Partido** | Resultado, goles, estado (PENDIENTE / FINALIZADO) |
| **Gol** | Minuto, tipo (NORMAL / PENAL / AUTOGOL), asistencia |
| **Fase** | Agrupa partidos de una ronda |
| **Tabla / RegistroTabla** | Cálculo de puntos y standings del grupo |

---


## Conceptos aplicados

| Concepto | Implementación |
|---|---|
| **Clases y objetos** | 12 clases en `/modelos` |
| **Encapsulación** | `Tabla`, `Eliminatorias` ocultan lógica interna |
| **Polimorfismo** | `Gol.tipo` cambia el efecto en el marcador |
| **UML** | `docs/diagrama-clases.md` + `diagrama-secuencia.md` |
| **MVC** | `modelos/` → `controladores/` → `vistas/` |
| **Modularización** | Cada clase en su propio ES Module |
| **Persistencia** | `localStorage` vía controladores |
| **APIs** | `servicios/apiService.js` con fallback local |
| **Git** | Historial de commits del equipo |

---

## Licencia

ISFT118 - Belpoliti Thiago, Balladares Esteban
