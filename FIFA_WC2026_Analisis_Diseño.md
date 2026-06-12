# FIFA World Cup 2026 - Fixture Digital
## Análisis de Requisitos y Diseño de Clases

---

## 1. ANÁLISIS DE REQUISITOS

### Requisitos Funcionales RF

| ID | Descripción | Actor |
|---|---|---|
| RF-001 | Visualizar fixture completa (104 encuentros) | Usuario |
| RF-002 | Completar resultados de partidos (fase de grupos) | Usuario |
| RF-003 | Generar/Completar encuentros de octavos en adelante | Usuario/Sistema |
| RF-004 | Registrar goleadores por partido | Usuario |
| RF-005 | Visualizar llaves eliminatorias | Usuario |
| RF-006 | Mostrar countdown hasta próximo partido | Sistema |
| RF-007 | Consultar planteles de equipos | Usuario |
| RF-008 | Obtener datos de API de deportes | Sistema |
| RF-009 | Visualizar estadísticas de equipos/jugadores | Usuario |
| RF-010 | Generar automáticamente partidos eliminatorios | Sistema |

### Requisitos No Funcionales

- **RNF-001**: Interfaz responsiva (web/móvil)
- **RNF-002**: Sincronización con API externa en tiempo real
- **RNF-003**: Actualización automática cada 5 minutos
- **RNF-004**: Almacenamiento persistente de resultados

---

## 2. ENTIDADES PRINCIPALES

### 2.1 Dominio del Torneo

```
TOURNAMENT (Torneo)
├── name: String
├── year: Integer (2026)
├── startDate: DateTime
├── endDate: DateTime
├── totalMatches: Integer (104)
├── teams: List<Team>
├── groups: List<Group>
├── matches: List<Match>
└── knockoutRounds: List<KnockoutRound>
```

### 2.2 Dominio de Equipos

```
TEAM (Equipo)
├── id: String
├── name: String
├── isoCode: String (ej: "AR", "BR")
├── flagUrl: String
├── coach: String
├── players: List<Player>
├── groupPosition: Integer (0 si no está en grupos)
├── statistics: TeamStatistics
└── matches: List<Match>
```

```
PLAYER (Jugador)
├── id: String
├── name: String
├── dorsal: Integer
├── position: Position (ARQUERO, DEFENSOR, VOLANTE, DELANTERO)
├── team: Team
├── stats: PlayerStatistics
└── goals: List<Goal>
```

```
POSITION (Enum)
├── ARQUERO
├── DEFENSOR
├── VOLANTE
├── DELANTERO
```

### 2.3 Dominio de Competición

```
GROUP (Grupo)
├── id: String (A, B, C... H)
├── name: String
├── teams: List<Team> (4 equipos)
├── matches: List<Match> (6 partidos)
├── standings: List<GroupStanding>
└── tournament: Tournament
```

```
KNOCKOUT_ROUND (Ronda Eliminatoria)
├── id: String
├── name: String (Octavos, Cuartos, Semis, Final)
├── round: Integer (1-4)
├── matches: List<Match>
└── tournament: Tournament
```

```
MATCH (Partido)
├── id: String (UUID)
├── homeTeam: Team
├── awayTeam: Team
├── matchDate: DateTime
├── stadium: Stadium
├── status: MatchStatus (SCHEDULED, LIVE, FINISHED)
├── homeScore: Integer
├── awayScore: Integer
├── duration: Integer (minutos jugados)
├── goals: List<Goal>
├── group: Group (NULL si es knockout)
├── knockoutRound: KnockoutRound (NULL si es grupo)
├── round: Integer (round-robin number)
├── winner: Team (solo si está definido)
├── penalties: PenaltyShootout (solo si es knockout con empate)
├── referee: Referee
└── status: MatchStatus
```

```
MATCH_STATUS (Enum)
├── SCHEDULED    (Programado)
├── LIVE         (En vivo)
├── FINISHED     (Finalizado)
├── POSTPONED    (Pospuesto)
├── CANCELLED    (Cancelado)
```

### 2.4 Dominio de Anotaciones

```
GOAL (Gol)
├── id: String
├── match: Match
├── player: Player
├── minute: Integer
├── isPenalty: Boolean
├── isOwnGoal: Boolean
├── assist: Player (nullable)
└── timestamp: DateTime
```

```
PENALTY_SHOOTOUT (Tanda de Penales)
├── id: String
├── match: Match
├── homeTeamPenalties: List<PenaltyKick>
├── awayTeamPenalties: List<PenaltyKick>
├── winner: Team
└── timestamp: DateTime
```

```
PENALTY_KICK (Lanzamiento de Penal)
├── player: Player
├── minute: Integer
├── scored: Boolean
└── timestamp: DateTime
```

### 2.5 Dominio de Locaciones

```
STADIUM (Estadio)
├── id: String
├── name: String
├── city: String
├── country: String (USA)
├── capacity: Integer
├── latitude: Float
├── longitude: Float
└── matches: List<Match>
```

### 2.6 Dominio de Árbitros

```
REFEREE (Árbitro)
├── id: String
├── name: String
├── country: String
├── confederate: String (CONMEBOL, UEFA, etc)
├── experience: Integer (años)
└── matches: List<Match>
```

### 2.7 Dominio de Estadísticas

```
TEAM_STATISTICS (Estadísticas de Equipo)
├── teamId: String
├── matchesPlayed: Integer
├── wins: Integer
├── draws: Integer
├── losses: Integer
├── goalsFor: Integer
├── goalsAgainst: Integer
├── goalDifference: Integer
├── points: Integer (wins*3 + draws*1)
├── possession: Float (%)
└── shotsOnTarget: Integer
```

```
PLAYER_STATISTICS (Estadísticas de Jugador)
├── playerId: String
├── matchesPlayed: Integer
├── goals: Integer
├── assists: Integer
├── yellowCards: Integer
├── redCards: Integer
├── possession: Float (%)
├── passes: Integer
├── shotsOnTarget: Integer
└── tackles: Integer
```

```
GROUP_STANDING (Posición en Grupo)
├── id: String
├── group: Group
├── team: Team
├── position: Integer (1-4)
├── matchesPlayed: Integer
├── wins: Integer
├── draws: Integer
├── losses: Integer
├── goalsFor: Integer
├── goalsAgainst: Integer
├── goalDifference: Integer
├── points: Integer
└── qualifiedToKnockout: Boolean
```

### 2.8 Dominio de Usuario

```
USER (Usuario)
├── id: String (UUID)
├── username: String
├── email: String
├── password: String (hash)
├── createdAt: DateTime
├── predictions: List<Prediction>
├── preferences: UserPreferences
└── lastLogin: DateTime
```

```
USER_PREFERENCES (Preferencias)
├── userId: String
├── favoriteTeam: Team
├── timezone: String
├── notifications: Boolean
├── theme: String (light/dark)
└── language: String
```

```
PREDICTION (Predicción/Resultado del Usuario)
├── id: String
├── user: User
├── match: Match
├── predictedHomeScore: Integer
├── predictedAwayScore: Integer
├── predictedWinner: Team
├── createdAt: DateTime
├── accuracy: Boolean (null si no está definido el resultado real)
└── points: Integer
```

### 2.9 Dominio de Contadores

```
COUNTDOWN (Cuenta Regresiva)
├── id: String
├── nextMatch: Match
├── targetDateTime: DateTime
├── status: String (RUNNING, COMPLETED)
├── timeRemaining: Duration
├── lastUpdated: DateTime
└── notified: Boolean
```

---

## 3. RELACIONES PRINCIPALES

```
TOURNAMENT (1) ──┬──→ (8) GROUP
                 ├──→ (32) TEAM
                 ├──→ (104) MATCH
                 └──→ (4) KNOCKOUT_ROUND

GROUP (1) ──→ (4) TEAM
GROUP (1) ──→ (6) MATCH
GROUP (1) ──→ (4) GROUP_STANDING

TEAM (1) ──┬──→ (23) PLAYER
           ├──→ (6) MATCH (como local)
           ├──→ (6) MATCH (como visitante)
           └──→ (1) TEAM_STATISTICS

PLAYER (1) ──→ (n) GOAL
PLAYER (1) ──→ (1) PLAYER_STATISTICS

MATCH (1) ──┬──→ (1) TEAM (local)
            ├──→ (1) TEAM (visitante)
            ├──→ (n) GOAL
            ├──→ (0..1) PENALTY_SHOOTOUT
            ├──→ (1) STADIUM
            ├──→ (1) REFEREE
            ├──→ (0..1) GROUP
            └──→ (0..1) KNOCKOUT_ROUND

GOAL (1) ──┬──→ (1) MATCH
           ├──→ (1) PLAYER (goleador)
           └──→ (0..1) PLAYER (asistencia)

PENALTY_SHOOTOUT (1) ──┬──→ (1) MATCH
                        └──→ (n) PENALTY_KICK

USER (1) ──→ (n) PREDICTION
PREDICTION (1) ──→ (1) MATCH
```

---

## 4. CASOS DE USO PRINCIPALES

### UC-001: Visualizar Fixture
```
Actor: Usuario
Precondición: Torneo creado en sistema
Flujo:
  1. Usuario solicita visualizar fixture
  2. Sistema obtiene datos de Tournament, Group, Match
  3. Sistema muestra partidos agrupados por fase
  4. Usuario filtra por grupo o ronda
```

### UC-002: Completar Resultado de Partido
```
Actor: Usuario
Precondición: Partido en estado LIVE o FINISHED
Flujo:
  1. Usuario selecciona partido
  2. Usuario ingresa marcador final
  3. Sistema valida resultado
  4. Usuario agrega goles (jugador, minuto)
  5. Sistema calcula posiciones de grupo
  6. Sistema guarda cambios
```

### UC-003: Generar Partidos Knockout
```
Actor: Sistema
Precondición: Grupos finalizados y posiciones confirmadas
Flujo:
  1. Sistema calcula clasificados (1°, 2° de cada grupo)
  2. Sistema crea brackets de octavos
  3. Sistema genera partidos automáticamente
  4. Usuario puede validar o ajustar
```

### UC-004: Ver Countdown
```
Actor: Usuario
Precondición: Próximo partido definido
Flujo:
  1. Usuario accede a panel principal
  2. Sistema calcula tiempo restante
  3. Sistema muestra cuenta regresiva en vivo
  4. Usuario recibe notificación cuando falta 1 hora
```

---

## 5. SERVICIOS (LÓGICA DE NEGOCIO)

```
TOURNAMENT_SERVICE
├── createTournament()
├── getTournamentById()
├── initializeGroups()
├── initializeMatchSchedule()
└── generateKnockoutMatches()

MATCH_SERVICE
├── createMatch()
├── updateMatchResult()
├── addGoal()
├── removeGoal()
├── updateMatchStatus()
├── recordPenaltyShootout()
└── getMatchStats()

GROUP_SERVICE
├── calculateStandings()
├── updateGroupStandings()
├── getQualifiedTeams()
└── getGroupMatches()

KNOCKOUT_SERVICE
├── generateOctavos()
├── generateCuartos()
├── generateSemis()
├── generateFinal()
├── determineWinner()
└── getMatchupsByRound()

TEAM_SERVICE
├── getTeamById()
├── getTeamByIsoCode()
├── getTeamPlayers()
├── updateTeamStats()
└── getTeamForm()

PLAYER_SERVICE
├── getPlayerStats()
├── updatePlayerStats()
├── getTopScorers()
└── getPlayerGoals()

COUNTDOWN_SERVICE
├── getNextMatch()
├── calculateTimeRemaining()
├── startCountdown()
├── notifyCountdownComplete()
└── updateCountdownStatus()

STATISTICS_SERVICE
├── calculateTeamStats()
├── calculatePlayerStats()
├── getTopScorersList()
├── getTournamentStats()
└── getTeamComparisons()

USER_SERVICE
├── createUser()
├── updateUserPreferences()
├── getUserPredictions()
└── validateUserLogin()

PREDICTION_SERVICE
├── createPrediction()
├── updatePrediction()
├── calculatePredictionAccuracy()
├── getUserScore()
└── getLeaderboard()

API_INTEGRATION_SERVICE
├── fetchTeamsData()
├── fetchPlayersData()
├── fetchStadiumsData()
├── fetchRefereesData()
├── fetchScheduleData()
└── syncWithExternalAPI()
```

---

## 6. VALIDACIONES IMPORTANTES

### Validaciones en Match
- Fecha debe ser después de tournament.startDate
- Equipos no pueden ser iguales
- Score no puede ser negativo
- No se puede modificar si ya está FINISHED
- Penales solo si está en KnockoutRound y es empate

### Validaciones en Goal
- Minuto debe estar entre 0 y duration+penalties
- Jugador debe pertenecer a equipo del partido
- No puede haber más goles que el score final
- Asistencia debe ser de jugador del mismo equipo

### Validaciones en Group
- Debe tener exactamente 4 equipos
- Debe tener exactamente 6 partidos
- No puede tener equipos duplicados

### Validaciones en Knockout
- Solo se genera cuando grupo termina
- Clasificados deben ser válidos
- No puede haber equipos duplicados en bracket

---

## 7. ENUMERACIONES IMPORTANTES

```
POSITION_ENUM:
  - ARQUERO (GK)
  - DEFENSOR (DEF)
  - VOLANTE (MID)
  - DELANTERO (FWD)

MATCH_STATUS_ENUM:
  - SCHEDULED
  - LIVE
  - FINISHED
  - POSTPONED
  - CANCELLED

CONFEDERATION_ENUM:
  - CONMEBOL (América del Sur)
  - UEFA (Europa)
  - AFC (Asia)
  - CAF (África)
  - CONCACAF (América Central)
  - OFC (Oceanía)

KNOCKOUT_ROUND_NAME:
  - ROUND_16 (Octavos)
  - QUARTER_FINALS (Cuartos)
  - SEMI_FINALS (Semis)
  - FINALS (Final)
```

---

## 8. NOTAS DE IMPLEMENTACIÓN

1. **Persistencia**: Usar base de datos relacional (PostgreSQL) o NoSQL (MongoDB)
2. **API**: Endpoint REST para todas las operaciones CRUD
3. **Real-time**: WebSocket para actualizaciones de countdown y resultados vivos
4. **Autenticación**: JWT para usuarios
5. **Caché**: Redis para datos que cambian lentamente (equipos, estadios)
6. **Integración API**: Llamadas asincrónicas a servicio de API deportivos
7. **Validación**: Server-side y client-side
8. **Auditoría**: Registrar cambios en resultados y goles
9. **Transacciones**: Para operaciones que afectan múltiples entidades
10. **Testing**: Casos de prueba para cada servicio

---

## 9. FLUJO DE DATOS PRINCIPAL

```
┌─────────────────────────────────────────────────────┐
│          USUARIO - INTERFAZ                          │
└──────────────────┬──────────────────────────────────┘
                   │
       ┌───────────┼───────────┐
       │           │           │
    [Ver Fixture] [Resultado] [Goles]
       │           │           │
       └───────────┼───────────┘
                   │
    ┌──────────────▼─────────────────┐
    │    APPLICATION SERVICES        │
    │  - Match Service               │
    │  - Group Service               │
    │  - Tournament Service           │
    │  - Knockout Service             │
    └──────────────┬──────────────────┘
                   │
    ┌──────────────▼─────────────────┐
    │    DATA ACCESS LAYER           │
    │  - Repository Pattern           │
    │  - ORM/Query Builder            │
    └──────────────┬──────────────────┘
                   │
    ┌──────────────▼─────────────────┐
    │    DATABASE                     │
    │  - Matches                      │
    │  - Teams                        │
    │  - Groups                       │
    │  - Knockouts                    │
    │  - Goals                        │
    └─────────────────────────────────┘
                   │
    ┌──────────────▼─────────────────┐
    │    EXTERNAL API                 │
    │  - Sports Data API              │
    │  - Teams Info                   │
    │  - Player Rosters               │
    └─────────────────────────────────┘
```

