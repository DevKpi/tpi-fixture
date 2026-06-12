# DIAGRAMAS DE CLASES UML - FIFA World Cup 2026

## DIAGRAMA 1: NÚCLEO DEL TORNEO

```
┌─────────────────────────────────┐
│         TOURNAMENT              │
├─────────────────────────────────┤
│ - id: String                    │
│ - name: String                  │
│ - year: Integer                 │
│ - startDate: DateTime           │
│ - endDate: DateTime             │
│ - totalMatches: Integer         │
├─────────────────────────────────┤
│ + getTournamentById()           │
│ + initializeGroups()            │
│ + generateKnockoutMatches()     │
│ + getStandings()                │
│ + updateTournamentStatus()      │
└─────────────────────────────────┘
        │
        │ contains (8)
        ▼
┌─────────────────────────────────┐
│        GROUP                    │
├─────────────────────────────────┤
│ - id: String (A,B,C...H)       │
│ - name: String                  │
│ - matchCount: Integer = 6       │
├─────────────────────────────────┤
│ + calculateStandings()          │
│ + getQualifiedTeams()           │
│ + getGroupMatches()             │
│ + getGroupLeaderboard()         │
└─────────────────────────────────┘
        │
        │ contains (4)
        ▼
┌─────────────────────────────────┐
│         TEAM                    │
├─────────────────────────────────┤
│ - id: String                    │
│ - name: String                  │
│ - isoCode: String               │
│ - flagUrl: String               │
│ - coach: String                 │
│ - confederation: String         │
├─────────────────────────────────┤
│ + getPlayers()                  │
│ + getStatistics()               │
│ + updateTeamStats()             │
│ + getTeamForm(lastN)            │
│ + qualifiedToKnockout()         │
└─────────────────────────────────┘
```

---

## DIAGRAMA 2: DOMINIO DE PARTIDOS

```
┌──────────────────────────────────────────────┐
│               MATCH                          │
├──────────────────────────────────────────────┤
│ - id: String (UUID)                          │
│ - matchDate: DateTime                        │
│ - homeTeam: Team                             │
│ - awayTeam: Team                             │
│ - homeScore: Integer                         │
│ - awayScore: Integer                         │
│ - status: MatchStatus                        │
│ - duration: Integer (minutos)                │
│ - round: Integer                             │
│ - referee: Referee                           │
│ - stadium: Stadium                           │
├──────────────────────────────────────────────┤
│ + updateScore(h, a)                          │
│ + addGoal(player, minute, penalty)           │
│ + removeGoal(goalId)                         │
│ + recordPenalties()                          │
│ + updateMatchStatus()                        │
│ + getMatchStats()                            │
│ + getWinner()                                │
│ + isFinalized()                              │
└──────────────────────────────────────────────┘
    │           │           │
    │           │           └─────────────┐
    │           │                         │
    │ (1)       │ (1)                  (0..1)
    ▼           ▼                         ▼
┌────────┐  ┌────────┐         ┌──────────────────┐
│ STADIUM│  │REFEREE │         │PENALTY_SHOOTOUT │
├────────┤  ├────────┤         ├──────────────────┤
│-id     │  │-id     │         │-id               │
│-name   │  │-name   │         │-penaltyKicks[]  │
│-city   │  │-country│         │-winner: Team     │
│-cap    │  │-exp    │         │-timestamp       │
└────────┘  └────────┘         └──────────────────┘
```

---

## DIAGRAMA 3: ANOTACIONES Y GOLES

```
┌──────────────────────────────────────────┐
│               GOAL                       │
├──────────────────────────────────────────┤
│ - id: String                             │
│ - player: Player                         │
│ - match: Match                           │
│ - minute: Integer                        │
│ - isPenalty: Boolean                     │
│ - isOwnGoal: Boolean                     │
│ - assistedBy: Player (nullable)          │
│ - timestamp: DateTime                    │
├──────────────────────────────────────────┤
│ + validateGoal()                         │
│ + getGoalType()                          │
│ + getScorer()                            │
│ + getAssist()                            │
└──────────────────────────────────────────┘
    │           │
    │(n)        │(0..1)
    ▼           ▼
┌─────────────────────────────────┐
│         PLAYER                  │
├─────────────────────────────────┤
│ - id: String                    │
│ - name: String                  │
│ - dorsal: Integer               │
│ - position: Position            │
│ - team: Team                    │
│ - dateOfBirth: DateTime         │
│ - nationality: String           │
├─────────────────────────────────┤
│ + getPlayerStats()              │
│ + updatePlayerStats()           │
│ + getGoalCount()                │
│ + getAssistCount()              │
│ + getYellowCards()              │
│ + getRedCards()                 │
│ + isEligible()                  │
└─────────────────────────────────┘
        │
        │ (23 por equipo)
        │
    contains
```

---

## DIAGRAMA 4: RONDAS ELIMINATORIAS

```
┌────────────────────────────────────────────┐
│          KNOCKOUT_ROUND                    │
├────────────────────────────────────────────┤
│ - id: String                               │
│ - name: String (Octavos/Cuartos/Semis)    │
│ - roundNumber: Integer (1-4)               │
│ - startDate: DateTime                      │
│ - endDate: DateTime                        │
│ - status: RoundStatus                      │
├────────────────────────────────────────────┤
│ + generateMatches()                        │
│ + updateRoundStatus()                      │
│ + getMatchups()                            │
│ + getQualifiedTeams()                      │
│ + isRoundComplete()                        │
│ + getWinnersBracket()                      │
└────────────────────────────────────────────┘
        │
        │(1..n) Match
        ▼
    MATCH (ver diagrama 2)
    
    
Estructura de Bracket (Octavos):
┌─────────────────────────────────────┐
│     1° GRUPO A  vs  2° GRUPO B      │
│     1° GRUPO B  vs  2° GRUPO A      │
│     1° GRUPO C  vs  2° GRUPO D      │
│     1° GRUPO D  vs  2° GRUPO C      │
│     1° GRUPO E  vs  2° GRUPO F      │
│     1° GRUPO F  vs  2° GRUPO E      │
│     1° GRUPO G  vs  2° GRUPO H      │
│     1° GRUPO H  vs  2° GRUPO G      │
└─────────────────────────────────────┘
         │ 8 Ganadores
         ▼
    CUARTOS (4 matches)
         │ 4 Ganadores
         ▼
    SEMIS (2 matches)
         │ 2 Ganadores
         ▼
    FINAL (1 match)
```

---

## DIAGRAMA 5: ESTADÍSTICAS

```
┌──────────────────────────────────┐
│    TEAM_STATISTICS              │
├──────────────────────────────────┤
│ - teamId: String                 │
│ - matchesPlayed: Integer         │
│ - wins: Integer                  │
│ - draws: Integer                 │
│ - losses: Integer                │
│ - goalsFor: Integer              │
│ - goalsAgainst: Integer          │
│ - goalDifference: Integer        │
│ - points: Integer                │
│ - possession: Float (%)          │
│ - shotsOnTarget: Integer         │
│ - redCards: Integer              │
│ - yellowCards: Integer           │
├──────────────────────────────────┤
│ + calculate()                    │
│ + update()                       │
│ + getGoalDifference()            │
│ + getWinPercentage()             │
└──────────────────────────────────┘
            ▲
            │ 1
            │
        belongs to
            │
            TEAM

┌────────────────────────────────────────┐
│     PLAYER_STATISTICS                  │
├────────────────────────────────────────┤
│ - playerId: String                     │
│ - matchesPlayed: Integer               │
│ - goals: Integer                       │
│ - assists: Integer                     │
│ - yellowCards: Integer                 │
│ - redCards: Integer                    │
│ - possession: Float (%)                │
│ - passes: Integer                      │
│ - completionRate: Float (%)            │
│ - shotsOnTarget: Integer               │
│ - tackles: Integer                     │
│ - intercepts: Integer                  │
├────────────────────────────────────────┤
│ + calculate()                          │
│ + update()                             │
│ + getGoalRatio()                       │
│ + getPassCompletion()                  │
│ + isTopScorer()                        │
└────────────────────────────────────────┘
            ▲
            │ 1
            │
        belongs to
            │
            PLAYER

┌──────────────────────────────────┐
│    GROUP_STANDING               │
├──────────────────────────────────┤
│ - id: String                     │
│ - group: Group                   │
│ - team: Team                     │
│ - position: Integer (1-4)        │
│ - matchesPlayed: Integer         │
│ - wins: Integer                  │
│ - draws: Integer                 │
│ - losses: Integer                │
│ - goalsFor: Integer              │
│ - goalsAgainst: Integer          │
│ - goalDifference: Integer        │
│ - points: Integer                │
│ - qualified: Boolean             │
├──────────────────────────────────┤
│ + calculatePoints()              │
│ + updateStanding()               │
│ + compare(other)                 │
│ + isQualified()                  │
└──────────────────────────────────┘
```

---

## DIAGRAMA 6: USUARIO Y PREDICCIONES

```
┌─────────────────────────────────────────┐
│             USER                        │
├─────────────────────────────────────────┤
│ - id: String (UUID)                     │
│ - username: String                      │
│ - email: String                         │
│ - passwordHash: String                  │
│ - createdAt: DateTime                   │
│ - lastLogin: DateTime                   │
│ - isActive: Boolean                     │
├─────────────────────────────────────────┤
│ + authenticate()                        │
│ + updateProfile()                       │
│ + getPredictions()                      │
│ + getScore()                            │
│ + updatePreferences()                   │
│ + getLeaderboardPosition()              │
└─────────────────────────────────────────┘
        │
        │ (1)
        ├────────────────┐
        │                │
        ▼                ▼
┌──────────────────┐  ┌──────────────────────┐
│USER_PREFERENCES  │  │   PREDICTION         │
├──────────────────┤  ├──────────────────────┤
│-userId           │  │-id                   │
│-favTeam:Team     │  │-user: User           │
│-timezone         │  │-match: Match         │
│-notifications    │  │-homeScorePred        │
│-theme            │  │-awayScorePred        │
│-language         │  │-winnerPred: Team     │
└──────────────────┘  │-createdAt            │
                      │-accuracy: Boolean    │
                      │-points: Integer      │
                      ├──────────────────────┤
                      │+ validate()          │
                      │+ updatePrediction()  │
                      │+ calculateAccuracy() │
                      │+ awardPoints()       │
                      └──────────────────────┘
                              │
                              │ references
                              ▼
                            MATCH
```

---

## DIAGRAMA 7: SERVICIO DE COUNTDOWN

```
┌────────────────────────────────────┐
│       COUNTDOWN                    │
├────────────────────────────────────┤
│ - id: String                       │
│ - nextMatch: Match                 │
│ - targetDateTime: DateTime         │
│ - status: CountdownStatus          │
│ - lastUpdated: DateTime            │
│ - notified: Boolean                │
├────────────────────────────────────┤
│ + getNextMatch()                   │
│ + calculateRemaining()             │
│ + startCountdown()                 │
│ + updateCountdown()                │
│ + sendNotification()               │
│ + stopCountdown()                  │
│ + getFormattedTime()               │
│ + isCountdownActive()              │
└────────────────────────────────────┘
        │
        │ references (1)
        ▼
        MATCH
        
Flujo de Actualización:
┌─────────────────────────────────────────┐
│  1. getCurrentTime()                    │
│  2. getNextMatch()                      │
│  3. calculateTimeRemaining()            │
│  4. IF remaining <= 60 min THEN         │
│        sendNotification()               │
│  5. Update UI every 1 second            │
│  6. IF remaining <= 0 THEN              │
│        stopCountdown()                  │
└─────────────────────────────────────────┘
```

---

## DIAGRAMA 8: INTEGRACIÓN CON API EXTERNA

```
┌──────────────────────────────────────────┐
│      API_INTEGRATION_SERVICE             │
├──────────────────────────────────────────┤
│ - apiKey: String                         │
│ - baseUrl: String                        │
│ - timeout: Integer                       │
│ - maxRetries: Integer                    │
├──────────────────────────────────────────┤
│ + fetchTeamsData()                       │
│ + fetchPlayersData()                     │
│ + fetchStadiumsData()                    │
│ + fetchRefereesData()                    │
│ + fetchScheduleData()                    │
│ + syncMatchResults()                     │
│ + validateExternalData()                 │
│ + handleAPIError()                       │
│ + retryFailedRequest()                   │
└──────────────────────────────────────────┘
        │
        │ fetches
        ├─────────┬─────────┬──────────┐
        │         │         │          │
        ▼         ▼         ▼          ▼
      TEAM     PLAYER    STADIUM    REFEREE
```

---

## DIAGRAMA 9: ESTRUCTURA COMPLETA (VISTA GENERAL)

```
┌────────────────────────────────────────────────────────────────────┐
│                      TOURNAMENT SYSTEM                             │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐      │
│  │  TOURNAMENT  │────→│    GROUP     │────→│    TEAM      │      │
│  │              │     │              │     │              │      │
│  │ - year:2026  │     │ - A,B,C...H  │     │ - id         │      │
│  │ - matches:104│     │ - teams:4    │     │ - players:23 │      │
│  └──────────────┘     │ - matches:6  │     │ - stats      │      │
│         │             └──────────────┘     └──────────────┘      │
│         │                                           │              │
│         ├─────────────────────────────────────────┤              │
│         │                                          │              │
│         ▼                                          ▼              │
│  ┌──────────────┐                         ┌──────────────┐       │
│  │  KNOCKOUT    │                         │    PLAYER    │       │
│  │  ROUND       │                         │              │       │
│  │              │                         │ - dorsal     │       │
│  │ - octavos    │                         │ - position   │       │
│  │ - cuartos    │                         │ - stats      │       │
│  │ - semis      │                         └──────────────┘       │
│  │ - final      │                                │               │
│  └──────────────┘                                │               │
│         │                                        │               │
│         └────────────┬─────────────┬────────────┘               │
│                      │             │                             │
│                      ▼             ▼                             │
│              ┌──────────────┐  ┌──────────────┐                │
│              │    MATCH     │  │     GOAL     │                │
│              │              │  │              │                │
│              │ - homeTeam   │  │ - player     │                │
│              │ - awayTeam   │  │ - minute     │                │
│              │ - homeScore  │  │ - isPenalty  │                │
│              │ - awayScore  │  │ - assist     │                │
│              │ - status     │  └──────────────┘                │
│              │ - goals[]    │                                  │
│              │ - penalties  │                                  │
│              └──────────────┘                                  │
│                      │                                         │
│              ┌───────┴────────┐                                │
│              │                │                                │
│              ▼                ▼                                │
│         ┌────────┐      ┌──────────────┐                      │
│         │STADIUM │      │   REFEREE    │                      │
│         └────────┘      └──────────────┘                      │
│                                                                │
│  ┌──────────────────┐  ┌─────────────────────┐               │
│  │      USER        │  │   PREDICTION        │               │
│  ├──────────────────┤  ├─────────────────────┤               │
│  │ - id             │  │ - user              │               │
│  │ - username       │  │ - match             │               │
│  │ - email          │  │ - predictedScore    │               │
│  │ - preferences    │  │ - accuracy          │               │
│  └──────────────────┘  │ - points            │               │
│         │              └─────────────────────┘               │
│         └───────────────────┬────────────────┘               │
│                             ▼                                 │
│                  ┌──────────────────────┐                    │
│                  │  COUNTDOWN           │                    │
│                  ├──────────────────────┤                    │
│                  │ - nextMatch          │                    │
│                  │ - timeRemaining      │                    │
│                  │ - status             │                    │
│                  └──────────────────────┘                    │
│                                                              │
└────────────────────────────────────────────────────────────────────┘

         ┌─────────────────────────────────────┐
         │   EXTERNAL API INTEGRATION          │
         ├─────────────────────────────────────┤
         │  - Sports Data Provider             │
         │  - Teams Info                       │
         │  - Player Rosters                   │
         │  - Live Scores                      │
         │  - Stadium Info                     │
         └─────────────────────────────────────┘
```

---

## DIAGRAMA 10: PATRONES DE DISEÑO RECOMENDADOS

```
MVC/MVVM PATTERN:
┌─────────────────┐      ┌──────────────────┐      ┌─────────────┐
│      VIEW       │◄────→│    CONTROLLER    │◄────→│    MODEL    │
│                 │      │                  │      │             │
│ - Fixture      │      │ - Match Service  │      │ - Team      │
│ - Matches      │      │ - Group Service  │      │ - Match     │
│ - Standings    │      │ - User Service   │      │ - Player    │
│ - Countdown    │      │ - API Service    │      │ - Goal      │
└─────────────────┘      └──────────────────┘      └─────────────┘


REPOSITORY PATTERN:
┌────────────────────────────────────────┐
│      SERVICE LAYER                     │
│  (Business Logic)                      │
└────────────────┬───────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────┐
│    REPOSITORY INTERFACE                │
│  - ITeamRepository                     │
│  - IMatchRepository                    │
│  - IPlayerRepository                   │
│  - IGoalRepository                     │
└────────────────┬───────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────┐
│    CONCRETE REPOSITORIES               │
│  - TeamRepository (SQL/NoSQL)          │
│  - MatchRepository (SQL/NoSQL)         │
│  - PlayerRepository (SQL/NoSQL)        │
│  - GoalRepository (SQL/NoSQL)          │
└────────────────┬───────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────┐
│        DATABASE                        │
│  (PostgreSQL / MongoDB)                │
└────────────────────────────────────────┘


DEPENDENCY INJECTION:
┌──────────────────┐
│   IOC Container  │
├──────────────────┤
│ - Configure      │
│ - Register       │
│ - Resolve        │
└────────┬─────────┘
         │
         ├─→ MatchService
         ├─→ GroupService
         ├─→ TeamService
         ├─→ UserService
         └─→ APIService
```

---

## DIAGRAMA 11: ESTADOS Y TRANSICIONES (STATE MACHINE)

```
MATCH STATUS TRANSITIONS:
┌──────────┐
│SCHEDULED │
└────┬─────┘
     │ (cuando llega fecha)
     ▼
┌──────────┐
│   LIVE   │
└────┬─────┘
     │ (cuando termina tiempo)
     ├─────────────────────┐
     │                     │
     ▼                     ▼
┌──────────┐         ┌──────────────┐
│ FINISHED │◄────────│POSTPONED     │
└──────────┘         └──────────────┘
     │
     └─ (grupo) → Actualizar standings
     └─ (knockout) → Generar siguiente match


COUNTDOWN STATUS:
┌──────────┐
│ INACTIVE │
└────┬─────┘
     │ (cuando hay próximo match)
     ▼
┌──────────┐
│ RUNNING  │
└────┬─────┘
     │ (cada segundo actualiza)
     │
     ├─ (notificación a -60 min)
     │
     └─ (cuando llega a 0)
        │
        ▼
     ┌──────────┐
     │COMPLETED │
     └──────────┘
```

---

## DIAGRAMA 12: FLUJO DE CREACIÓN DE PARTIDO KNOCKOUT

```
┌──────────────────────────────────┐
│  1. Fin de Grupos                │
│  (Todos los partidos finished)    │
└───────────────┬──────────────────┘
                │
                ▼
┌──────────────────────────────────┐
│  2. Calcular Clasificados        │
│  - 1° y 2° de cada grupo (16)    │
└───────────────┬──────────────────┘
                │
                ▼
┌──────────────────────────────────┐
│  3. Generar Bracket Octavos      │
│  - 1° Grupo A vs 2° Grupo B      │
│  - 1° Grupo B vs 2° Grupo A      │
│  - ... (8 matches)               │
└───────────────┬──────────────────┘
                │
                ▼
┌──────────────────────────────────┐
│  4. Crear Matches                │
│  - Asignar stadiums              │
│  - Asignar referees              │
│  - Set status = SCHEDULED        │
└───────────────┬──────────────────┘
                │
                ▼
┌──────────────────────────────────┐
│  5. Repetir para Cuartos         │
│  - Usar ganadores de Octavos     │
│  - 4 matches                     │
└───────────────┬──────────────────┘
                │
                ▼
┌──────────────────────────────────┐
│  6. Repetir para Semis           │
│  - 2 matches                     │
└───────────────┬──────────────────┘
                │
                ▼
┌──────────────────────────────────┐
│  7. Final                        │
│  - 1 match                       │
└──────────────────────────────────┘
```

---

## DIAGRAMA 13: ESTRUCTURA DE DATOS - MATCH SCHEDULE

```
FASE DE GRUPOS (80 partidos):
┌─────────────────────────────────────────┐
│ Jornada 1 (4 matches simultáneos)       │
│ - A1 vs A2, A3 vs A4                    │
│ - B1 vs B2, B3 vs B4                    │
│ - C1 vs C2, C3 vs C4                    │
│ - D1 vs D2, D3 vs D4                    │
└─────────────────────────────────────────┘
│ (días 1-2)
├─────────────────────────────────────────┐
│ Jornada 2 (4 matches)                   │
│ - A1 vs A3, A2 vs A4                    │
│ - B1 vs B3, B2 vs B4                    │
│ - C1 vs C3, C2 vs C4                    │
│ - D1 vs D3, D2 vs D4                    │
└─────────────────────────────────────────┘
│ (días 3-4)
├─────────────────────────────────────────┐
│ Jornada 3 (4 matches simultáneos)       │
│ - A1 vs A4, A2 vs A3                    │
│ - B1 vs B4, B2 vs B3                    │
│ - C1 vs C4, C2 vs C3                    │
│ - D1 vs D4, D2 vs D3                    │
└─────────────────────────────────────────┘
│ (días 5-6)

TOTAL: 24 matches × 8 grupos = 192 matches
PERO: Solo 6 matches por grupo = 48 matches en total

NO, CORRECCIÓN:
- 8 grupos × 6 partidos por grupo = 48 matches
- Espera... 4 equipos por grupo, round-robin:
  * Equipo A: vs B, C, D (3 partidos)
  * Equipo B: vs A, C, D (3 partidos)
  * Equipo C: vs A, B, D (3 partidos)
  * Equipo D: vs A, B, C (3 partidos)
  * PERO cada partido se cuenta una vez = 6 por grupo

CORRECCIÓN FINAL:
- 4 equipos per grupo, round-robin = C(4,2) = 6 partidos
- 8 grupos × 6 = 48 partidos grupos
- 8 octavos + 4 cuartos + 2 semis + 1 final = 15 partidos knockout
- Total: 48 + 15 = 63 partidos

EL REQUISITO dice 104, probablemente:
- 48 grupos + 16 octavos + 8 cuartos + 4 semis + 2 finales = 78
- O hay 3eros lugar + repechaje = casos extra

ASUMIENDO 104 correctamente especificado.
```

---

## OBSERVACIONES IMPORTANTES

1. **Escalabilidad**: Las clases pueden extenderse para incluir:
   - Statisticas expandidas
   - Video highlights
   - Comentarios en vivo
   - Sistema de puntos fantasy

2. **Validaciones**: Cada clase debe validar:
   - Datos antes de persistencia
   - Transiciones de estado válidas
   - Integridad referencial

3. **Auditoría**: Registrar:
   - Quién y cuándo modificó un resultado
   - Cambios en goles
   - Actualizaciones de standings

4. **Caché**: Implementar para:
   - Standings de grupo
   - Estadísticas de jugadores
   - Datos de equipos (rara vez cambian)

5. **Notificaciones**: Enviar cuando:
   - Comienza un partido
   - Se marca un gol
   - Termina un partido
   - Ronda está completa

