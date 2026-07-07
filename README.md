# FIFA World Cup 2026 - Fixture Digital

**Trabajo Práctico Integrador** — 

## 📋 Descripción

Sistema digital para gestionar la **FIFA World Cup 2026** completa: 32 selecciones,
8 grupos, **104 partidos** (48 de grupos + 56 de eliminatorias).

Permite:
- 📊 Ver el fixture completo (grupos y eliminatorias) con filtros
- ✏️ Registrar resultados y goles por jugador
- 📈 Calcular tablas de posiciones automáticamente
- 🏆 Generar el árbol de playoff (dieciseisavos → final) desde los clasificados
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
tpi-fixture/
├── controllers/
│   ├── AssistController.js
│   ├── CleanSheet.js
│   ├── EliminationController.js
│   ├── GoalsController.js
│   ├── GroupController.js
│   ├── MatchController.js
│   └── MundialController.js
├── data/
│   ├── full-fixture.json
│   └── teams.json
├── docs/
│   ├── diagram-class.md
│   ├── diagram-class.png
│   ├── Diagrama de Clases
│   └── diagrama-grafico-relaciones.png
├── models/
│   ├── CountryTeams.js
│   ├── Fase.js
│   ├── Goal.js
│   ├── Group.js
│   ├── KnockOutStage.js
│   ├── Match.js
│   ├── Mundial.js
│   ├── Player.js
│   ├── Table.js
│   ├── TableRegister.js
│   └── User.js
├── scratch/
│   ├── generate-teams-json.js
│   ├── test-assists-raw.js
│   ├── test-groups.js
│   ├── test-knockout.js
│   ├── test-single-team.js
│   └── test-teams.js
├── services/
│   └── apiService.js
├── views/  
│   ├── elimination-bracket.html
│   ├── fixture.html
│   ├── login.html
│   ├── match-detail.html
│   ├── tops.html
│   └── styles/
│       └── styles.css
├── index.html
├── main.js
└── README.md
```

---

## 📊 Entidades implementadas

| Clase | Archivo | Responsabilidad (Fat Models) |
|---|---|---|
| **Mundial** | `models/Mundial.js` | Coordinador general. Calcula estadísticas globales, clasifica partidos por fases y retorna goleadores. |
| **Eliminatoria** | `models/KnockOutStage.js` | Representa un cruce de eliminatorias; extrae goles y determina automáticamente al ganador (incluyendo posibles penales). |
| **Grupo** | `models/Group.js` | Modela la fase de grupos; procesa los partidos del grupo delegando en `Tabla` para obtener a los clasificados. |
| **Tabla / RegistroTabla** | `models/Table.js` & `TableRegister.js` | Motor matemático. Procesa iterativamente listas de partidos para acumular puntos, DG, GF, GC y devolver posiciones ordenadas. |
| **Partido** | `models/Match.js` | Parsea e interpreta datos en crudo (incluyendo fechas). Calcula estado (finalizado, en vivo) y provee resúmenes específicos. |
| **Gol** | `models/Goal.js` | Entidad que extrae de strings sucios de la API al jugador anotador, su minuto y asistencia; provee su propia descripción. |
| **Usuario** | `models/User.js` | Maneja la lógica de autenticación simulada (LogIn/LogOut) y cálculo de porcentajes de aciertos (progreso/nivel). |
| **Equipos** | `models/CountryTeams.js` | Diccionario de selecciones que incluye mapeo inteligente de formaciones y arqueros titulares. |

---

## 🧠 Arquitectura y Conceptos Aplicados

| Concepto | Implementación |
|---|---|
| **MVC Refactorizado** | Implementación estricta de **"Thin Controllers, Fat Models"**. Toda la lógica de negocio (parseo, contabilidad de puntos, llaves) vive en `models/`. Los archivos de `controllers/` solo orquestan datos y se comunican con el almacenamiento. |
| **Clases y objetos** | Modelos nativos ES6+ con métodos estáticos y constructores semánticos (`Gol.ParsearDeString`, `Eliminatoria`). |
| **Persistencia** | `localStorage` con caché inteligente implementado en `services/apiService.js` (cache buster). |
| **Delegación** | Principio SRP: `Grupo` no calcula posiciones matemáticas, sino que delega el array a la clase `Tabla`. |
| **Modularización** | Importación/Exportación nativa entre clases. Estructura ordenada en `/models`, `/controllers`, `/services`. |
| **Git** | Historial de refactorización paulatina hacia un paradigma puramente Orientado a Objetos. |

---

## Licencia

ISFT118 - Belpoliti Thiago, Balladares Esteban
