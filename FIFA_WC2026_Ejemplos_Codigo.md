# EJEMPLOS DE CÓDIGO - FIFA World Cup 2026
## Implementación en TypeScript

---

## 1. ENUMERACIONES Y TIPOS

```typescript
// Position.ts
export enum Position {
  GOALKEEPER = "GK",
  DEFENDER = "DEF",
  MIDFIELDER = "MID",
  FORWARD = "FWD"
}

// MatchStatus.ts
export enum MatchStatus {
  SCHEDULED = "SCHEDULED",
  LIVE = "LIVE",
  FINISHED = "FINISHED",
  POSTPONED = "POSTPONED",
  CANCELLED = "CANCELLED"
}

// KnockoutRoundType.ts
export enum KnockoutRoundType {
  ROUND_16 = "ROUND_16",    // Octavos
  QUARTER_FINALS = "QUARTER_FINALS",  // Cuartos
  SEMI_FINALS = "SEMI_FINALS",    // Semis
  FINALS = "FINALS"         // Final
}

// Confederation.ts
export enum Confederation {
  CONMEBOL = "CONMEBOL",    // América del Sur
  UEFA = "UEFA",            // Europa
  AFC = "AFC",              // Asia
  CAF = "CAF",              // África
  CONCACAF = "CONCACAF",    // América Central
  OFC = "OFC"               // Oceanía
}
```

---

## 2. CLASES DE DOMINIO

### 2.1 Clase Player

```typescript
// Player.ts
export class Player {
  private id: string;
  private name: string;
  private dorsal: number;
  private position: Position;
  private teamId: string;
  private dateOfBirth: Date;
  private nationality: string;
  private stats: PlayerStatistics;

  constructor(
    id: string,
    name: string,
    dorsal: number,
    position: Position,
    teamId: string,
    dateOfBirth: Date,
    nationality: string
  ) {
    this.id = id;
    this.name = name;
    this.dorsal = dorsal;
    this.position = position;
    this.teamId = teamId;
    this.dateOfBirth = dateOfBirth;
    this.nationality = nationality;
    this.stats = new PlayerStatistics(id);
  }

  // Getters
  getId(): string { return this.id; }
  getName(): string { return this.name; }
  getDorsal(): number { return this.dorsal; }
  getPosition(): Position { return this.position; }
  getTeamId(): string { return this.teamId; }
  getAge(): number {
    const ageDiff = Date.now() - this.dateOfBirth.getTime();
    return Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
  }
  getStats(): PlayerStatistics { return this.stats; }

  // Validaciones
  isEligible(): boolean {
    return this.getAge() >= 16 && this.getAge() <= 40;
  }

  // Métodos de estadísticas
  incrementGoals(count: number = 1): void {
    this.stats.addGoals(count);
  }

  incrementAssists(count: number = 1): void {
    this.stats.addAssists(count);
  }

  addYellowCard(): void {
    this.stats.addYellowCard();
  }

  addRedCard(): void {
    this.stats.addRedCard();
  }

  increaseMatches(): void {
    this.stats.incrementMatches();
  }

  // JSON serialization
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      dorsal: this.dorsal,
      position: this.position,
      teamId: this.teamId,
      age: this.getAge(),
      nationality: this.nationality,
      stats: this.stats.toJSON()
    };
  }
}
```

### 2.2 Clase Team

```typescript
// Team.ts
export class Team {
  private id: string;
  private name: string;
  private isoCode: string;
  private flagUrl: string;
  private coach: string;
  private confederation: Confederation;
  private players: Player[] = [];
  private statistics: TeamStatistics;

  constructor(
    id: string,
    name: string,
    isoCode: string,
    flagUrl: string,
    coach: string,
    confederation: Confederation
  ) {
    this.id = id;
    this.name = name;
    this.isoCode = isoCode;
    this.flagUrl = flagUrl;
    this.coach = coach;
    this.confederation = confederation;
    this.statistics = new TeamStatistics(id);
  }

  // Getters
  getId(): string { return this.id; }
  getName(): string { return this.name; }
  getIsoCode(): string { return this.isoCode; }
  getFlagUrl(): string { return this.flagUrl; }
  getCoach(): string { return this.coach; }
  getConfederation(): Confederation { return this.confederation; }
  getPlayers(): Player[] { return this.players; }
  getStatistics(): TeamStatistics { return this.statistics; }

  // Manejo de jugadores
  addPlayer(player: Player): boolean {
    if (!this.hasPlayer(player.getId())) {
      this.players.push(player);
      return true;
    }
    return false;
  }

  removePlayer(playerId: string): boolean {
    const index = this.players.findIndex(p => p.getId() === playerId);
    if (index !== -1) {
      this.players.splice(index, 1);
      return true;
    }
    return false;
  }

  hasPlayer(playerId: string): boolean {
    return this.players.some(p => p.getId() === playerId);
  }

  getPlayerByName(name: string): Player | undefined {
    return this.players.find(p => p.getName().toLowerCase() === name.toLowerCase());
  }

  getPlayerByDorsal(dorsal: number): Player | undefined {
    return this.players.find(p => p.getDorsal() === dorsal);
  }

  getPlayersByPosition(position: Position): Player[] {
    return this.players.filter(p => p.getPosition() === position);
  }

  // Validaciones
  isFullSquad(): boolean {
    return this.players.length === 23; // 23 jugadores por equipo
  }

  hasEnoughPlayers(): boolean {
    return this.players.length >= 11; // Mínimo 11 para jugar
  }

  // JSON serialization
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      isoCode: this.isoCode,
      flagUrl: this.flagUrl,
      coach: this.coach,
      confederation: this.confederation,
      playerCount: this.players.length,
      statistics: this.statistics.toJSON()
    };
  }
}
```

### 2.3 Clase Goal

```typescript
// Goal.ts
export class Goal {
  private id: string;
  private matchId: string;
  private player: Player;
  private minute: number;
  private isPenalty: boolean;
  private isOwnGoal: boolean;
  private assistedBy?: Player;
  private timestamp: Date;

  constructor(
    id: string,
    matchId: string,
    player: Player,
    minute: number,
    isPenalty: boolean = false,
    isOwnGoal: boolean = false,
    assistedBy?: Player
  ) {
    if (!this.validateGoal(minute)) {
      throw new Error("Minuto de gol inválido");
    }

    this.id = id;
    this.matchId = matchId;
    this.player = player;
    this.minute = minute;
    this.isPenalty = isPenalty;
    this.isOwnGoal = isOwnGoal;
    this.assistedBy = assistedBy;
    this.timestamp = new Date();
  }

  // Getters
  getId(): string { return this.id; }
  getMatchId(): string { return this.matchId; }
  getPlayer(): Player { return this.player; }
  getMinute(): number { return this.minute; }
  isPenaltyGoal(): boolean { return this.isPenalty; }
  isOwnGoalFlag(): boolean { return this.isOwnGoal; }
  getAssistant(): Player | undefined { return this.assistedBy; }
  getTimestamp(): Date { return this.timestamp; }

  // Validaciones
  private validateGoal(minute: number): boolean {
    return minute >= 0 && minute <= 120; // 90 + 30 extra time máximo
  }

  // Métodos de información
  getGoalType(): string {
    if (this.isOwnGoal) return "Own Goal";
    if (this.isPenalty) return "Penalty";
    return "Open Play";
  }

  getDescription(): string {
    const type = this.getGoalType();
    const assist = this.assistedBy ? ` (assist: ${this.assistedBy.getName()})` : "";
    return `${this.player.getName()} - ${type} @ ${this.minute}'${assist}`;
  }

  // JSON serialization
  toJSON() {
    return {
      id: this.id,
      matchId: this.matchId,
      player: {
        id: this.player.getId(),
        name: this.player.getName(),
        dorsal: this.player.getDorsal()
      },
      minute: this.minute,
      type: this.getGoalType(),
      assistant: this.assistedBy ? {
        id: this.assistedBy.getId(),
        name: this.assistedBy.getName()
      } : null,
      timestamp: this.timestamp
    };
  }
}
```

### 2.4 Clase Match

```typescript
// Match.ts
export class Match {
  private id: string;
  private homeTeam: Team;
  private awayTeam: Team;
  private matchDate: Date;
  private stadium: Stadium;
  private referee: Referee;
  private homeScore: number = 0;
  private awayScore: number = 0;
  private status: MatchStatus = MatchStatus.SCHEDULED;
  private goals: Goal[] = [];
  private duration: number = 0; // minutos jugados
  private penaltyShootout?: PenaltyShootout;
  private groupId?: string;
  private knockoutRound?: KnockoutRound;

  constructor(
    id: string,
    homeTeam: Team,
    awayTeam: Team,
    matchDate: Date,
    stadium: Stadium,
    referee: Referee,
    groupId?: string,
    knockoutRound?: KnockoutRound
  ) {
    if (homeTeam.getId() === awayTeam.getId()) {
      throw new Error("Los equipos no pueden ser iguales");
    }

    this.id = id;
    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;
    this.matchDate = matchDate;
    this.stadium = stadium;
    this.referee = referee;
    this.groupId = groupId;
    this.knockoutRound = knockoutRound;
  }

  // Getters
  getId(): string { return this.id; }
  getHomeTeam(): Team { return this.homeTeam; }
  getAwayTeam(): Team { return this.awayTeam; }
  getMatchDate(): Date { return this.matchDate; }
  getStadium(): Stadium { return this.stadium; }
  getReferee(): Referee { return this.referee; }
  getHomeScore(): number { return this.homeScore; }
  getAwayScore(): number { return this.awayScore; }
  getStatus(): MatchStatus { return this.status; }
  getDuration(): number { return this.duration; }
  getGoals(): Goal[] { return this.goals; }
  getGroupId(): string | undefined { return this.groupId; }
  getKnockoutRound(): KnockoutRound | undefined { return this.knockoutRound; }

  // Actualización de marcador
  updateScore(homeScore: number, awayScore: number): void {
    if (homeScore < 0 || awayScore < 0) {
      throw new Error("El marcador no puede ser negativo");
    }
    this.homeScore = homeScore;
    this.awayScore = awayScore;
  }

  // Gestión de goles
  addGoal(goal: Goal): void {
    if (this.status === MatchStatus.FINISHED && !this.isPenaltyTime()) {
      throw new Error("No se pueden agregar goles a un partido finalizado");
    }

    // Validar que el jugador pertenece a uno de los equipos
    const playerTeamId = goal.getPlayer().getTeamId();
    if (playerTeamId !== this.homeTeam.getId() && playerTeamId !== this.awayTeam.getId()) {
      throw new Error("El jugador no pertenece a ninguno de los equipos");
    }

    this.goals.push(goal);

    // Actualizar score automáticamente
    if (goal.getPlayer().getTeamId() === this.homeTeam.getId()) {
      if (!goal.isOwnGoalFlag()) {
        this.homeScore++;
      } else {
        this.awayScore++;
      }
    } else {
      if (!goal.isOwnGoalFlag()) {
        this.awayScore++;
      } else {
        this.homeScore++;
      }
    }

    // Actualizar estadísticas del jugador
    goal.getPlayer().incrementGoals();
    if (goal.getAssistant()) {
      goal.getAssistant()!.incrementAssists();
    }
  }

  removeGoal(goalId: string): boolean {
    const index = this.goals.findIndex(g => g.getId() === goalId);
    if (index !== -1) {
      const goal = this.goals[index];
      this.goals.splice(index, 1);

      // Revertir score
      if (goal.getPlayer().getTeamId() === this.homeTeam.getId()) {
        if (!goal.isOwnGoalFlag()) {
          this.homeScore--;
        } else {
          this.awayScore--;
        }
      } else {
        if (!goal.isOwnGoalFlag()) {
          this.awayScore--;
        } else {
          this.homeScore--;
        }
      }

      return true;
    }
    return false;
  }

  // Gestión de estado
  updateStatus(newStatus: MatchStatus): void {
    // Validar transiciones válidas
    const validTransitions: { [key in MatchStatus]: MatchStatus[] } = {
      [MatchStatus.SCHEDULED]: [MatchStatus.LIVE, MatchStatus.POSTPONED],
      [MatchStatus.LIVE]: [MatchStatus.FINISHED],
      [MatchStatus.FINISHED]: [],
      [MatchStatus.POSTPONED]: [MatchStatus.SCHEDULED],
      [MatchStatus.CANCELLED]: []
    };

    if (!validTransitions[this.status].includes(newStatus)) {
      throw new Error(`Transición no permitida: ${this.status} → ${newStatus}`);
    }

    this.status = newStatus;
  }

  startMatch(): void {
    if (this.status !== MatchStatus.SCHEDULED) {
      throw new Error("El partido debe estar programado para iniciarse");
    }
    this.updateStatus(MatchStatus.LIVE);
  }

  finishMatch(duration: number = 90): void {
    if (this.status !== MatchStatus.LIVE) {
      throw new Error("El partido debe estar en vivo para finalizarse");
    }
    this.duration = duration;
    this.updateStatus(MatchStatus.FINISHED);
  }

  // Información del ganador
  getWinner(): Team | null {
    if (this.homeScore > this.awayScore) {
      return this.homeTeam;
    } else if (this.awayScore > this.homeScore) {
      return this.awayTeam;
    }
    return null; // Empate
  }

  isDraw(): boolean {
    return this.homeScore === this.awayScore;
  }

  // Penales
  recordPenaltyShootout(penaltyShootout: PenaltyShootout): void {
    if (!this.isKnockout()) {
      throw new Error("Los penales solo se aplican en fases eliminatorias");
    }
    if (!this.isDraw()) {
      throw new Error("Los penales solo aplican si hay empate");
    }
    this.penaltyShootout = penaltyShootout;
  }

  // Validaciones
  isPenaltyTime(): boolean {
    return this.duration > 90;
  }

  isKnockout(): boolean {
    return this.knockoutRound !== undefined;
  }

  isFinalized(): boolean {
    return this.status === MatchStatus.FINISHED;
  }

  // JSON serialization
  toJSON() {
    return {
      id: this.id,
      homeTeam: this.homeTeam.getName(),
      awayTeam: this.awayTeam.getName(),
      homeScore: this.homeScore,
      awayScore: this.awayScore,
      status: this.status,
      matchDate: this.matchDate,
      stadium: this.stadium.getName(),
      referee: this.referee.getName(),
      duration: this.duration,
      goalCount: this.goals.length,
      isKnockout: this.isKnockout(),
      winner: this.getWinner()?.getName() || "Draw"
    };
  }
}
```

### 2.5 Clase Tournament

```typescript
// Tournament.ts
export class Tournament {
  private id: string;
  private name: string;
  private year: number;
  private startDate: Date;
  private endDate: Date;
  private groups: Group[] = [];
  private teams: Team[] = [];
  private matches: Match[] = [];
  private knockoutRounds: KnockoutRound[] = [];

  constructor(
    id: string,
    name: string,
    year: number,
    startDate: Date,
    endDate: Date
  ) {
    this.id = id;
    this.name = name;
    this.year = year;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  // Getters
  getId(): string { return this.id; }
  getName(): string { return this.name; }
  getYear(): number { return this.year; }
  getStartDate(): Date { return this.startDate; }
  getEndDate(): Date { return this.endDate; }
  getGroups(): Group[] { return this.groups; }
  getTeams(): Team[] { return this.teams; }
  getMatches(): Match[] { return this.matches; }
  getKnockoutRounds(): KnockoutRound[] { return this.knockoutRounds; }

  // Gestión de grupos
  initializeGroups(): void {
    const groupIds = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    groupIds.forEach(id => {
      this.groups.push(new Group(id, `Group ${id}`, this.id));
    });
  }

  getGroupById(groupId: string): Group | undefined {
    return this.groups.find(g => g.getId() === groupId);
  }

  // Gestión de equipos
  addTeam(team: Team): void {
    if (this.teams.length >= 32) {
      throw new Error("El torneo ya tiene 32 equipos");
    }
    this.teams.push(team);
  }

  // Gestión de partidos
  addMatch(match: Match): void {
    this.matches.push(match);
  }

  getMatchById(matchId: string): Match | undefined {
    return this.matches.find(m => m.getId() === matchId);
  }

  getMatchesByTeam(teamId: string): Match[] {
    return this.matches.filter(m =>
      m.getHomeTeam().getId() === teamId || m.getAwayTeam().getId() === teamId
    );
  }

  getMatchesByStatus(status: MatchStatus): Match[] {
    return this.matches.filter(m => m.getStatus() === status);
  }

  // Generación de fixtures
  initializeGroupPhase(): void {
    if (this.groups.length === 0) {
      this.initializeGroups();
    }

    // Distribuir 32 equipos en 8 grupos (4 por grupo)
    if (this.teams.length !== 32) {
      throw new Error("Se necesitan exactamente 32 equipos");
    }

    for (let i = 0; i < this.groups.length; i++) {
      const group = this.groups[i];
      const groupTeams = this.teams.slice(i * 4, (i + 1) * 4);
      groupTeams.forEach(team => group.addTeam(team));
    }
  }

  generateKnockoutMatches(): void {
    // Obtener clasificados de grupos
    const qualifiedTeams: Team[] = [];
    this.groups.forEach(group => {
      const classified = group.getQualifiedTeams();
      qualifiedTeams.push(...classified);
    });

    if (qualifiedTeams.length !== 16) {
      throw new Error("Se necesitan 16 equipos para octavos");
    }

    // Crear rondas de knockout
    const octavos = new KnockoutRound("1", "Round of 16", KnockoutRoundType.ROUND_16, 1);
    this.knockoutRounds.push(octavos);

    // Generar bracket automático basado en posiciones
    this.generateOctavos(qualifiedTeams);
  }

  private generateOctavos(qualifiedTeams: Team[]): void {
    // Bracket: 1°A vs 2°B, 1°B vs 2°A, 1°C vs 2°D, etc.
    const matchups = [
      [0, 9],   // 1°A vs 2°B
      [8, 1],   // 2°A vs 1°B
      [2, 11],  // 1°C vs 2°D
      [10, 3],  // 2°C vs 1°D
      [4, 13],  // 1°E vs 2°F
      [12, 5],  // 2°E vs 1°F
      [6, 15],  // 1°G vs 2°H
      [14, 7]   // 2°G vs 1°H
    ];

    matchups.forEach((pair, index) => {
      const match = new Match(
        `OCTAVO_${index + 1}`,
        qualifiedTeams[pair[0]],
        qualifiedTeams[pair[1]],
        new Date(this.startDate.getTime() + (index * 2 * 24 * 60 * 60 * 1000)),
        new Stadium("STADIUM_" + index, "Stadium", "USA", "", 70000, 0, 0),
        new Referee("REF_" + index, "Referee", "Country", "confederation", 0),
        undefined,
        this.knockoutRounds[0]
      );
      this.addMatch(match);
    });
  }

  // Estadísticas del torneo
  getTotalMatches(): number {
    return this.matches.length;
  }

  getFinishedMatches(): number {
    return this.matches.filter(m => m.isFinalized()).length;
  }

  getCompletionPercentage(): number {
    return (this.getFinishedMatches() / this.getTotalMatches()) * 100;
  }

  // JSON serialization
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      year: this.year,
      startDate: this.startDate,
      endDate: this.endDate,
      teams: this.teams.length,
      groups: this.groups.length,
      totalMatches: this.getTotalMatches(),
      finishedMatches: this.getFinishedMatches(),
      completionPercentage: this.getCompletionPercentage()
    };
  }
}
```

---

## 3. SERVICIOS (BUSINESS LOGIC)

### 3.1 Match Service

```typescript
// MatchService.ts
export class MatchService {
  constructor(private matchRepository: IMatchRepository) {}

  createMatch(
    homeTeam: Team,
    awayTeam: Team,
    matchDate: Date,
    stadium: Stadium,
    referee: Referee,
    group?: Group,
    knockoutRound?: KnockoutRound
  ): Match {
    const id = generateUUID();
    const match = new Match(
      id,
      homeTeam,
      awayTeam,
      matchDate,
      stadium,
      referee,
      group?.getId(),
      knockoutRound
    );
    return this.matchRepository.save(match);
  }

  updateMatchResult(
    matchId: string,
    homeScore: number,
    awayScore: number
  ): Match {
    const match = this.matchRepository.findById(matchId);
    if (!match) throw new Error("Match not found");

    match.updateScore(homeScore, awayScore);
    match.finishMatch();

    // Si es de grupo, actualizar standings
    if (match.getGroupId()) {
      this.updateGroupStandings(match.getGroupId()!);
    }

    return this.matchRepository.save(match);
  }

  addGoal(
    matchId: string,
    playerId: string,
    minute: number,
    isPenalty: boolean = false,
    assistedByPlayerId?: string
  ): Goal {
    const match = this.matchRepository.findById(matchId);
    if (!match) throw new Error("Match not found");

    const player = this.playerRepository.findById(playerId);
    if (!player) throw new Error("Player not found");

    const assistant = assistedByPlayerId
      ? this.playerRepository.findById(assistedByPlayerId)
      : undefined;

    const goal = new Goal(
      generateUUID(),
      matchId,
      player,
      minute,
      isPenalty,
      false,
      assistant
    );

    match.addGoal(goal);
    this.matchRepository.save(match);

    return goal;
  }

  getMatchStats(matchId: string): MatchStats {
    const match = this.matchRepository.findById(matchId);
    if (!match) throw new Error("Match not found");

    const homeTeam = match.getHomeTeam();
    const awayTeam = match.getAwayTeam();

    return {
      matchId: matchId,
      homeTeam: homeTeam.getName(),
      awayTeam: awayTeam.getName(),
      homeScore: match.getHomeScore(),
      awayScore: match.getAwayScore(),
      duration: match.getDuration(),
      goalCount: match.getGoals().length,
      possessionHome: 50, // Calcular de API
      possessionAway: 50,
      shotsOnTargetHome: 0,
      shotsOnTargetAway: 0
    };
  }

  private updateGroupStandings(groupId: string): void {
    // Lógica para actualizar posiciones del grupo
    const group = this.groupRepository.findById(groupId);
    if (group) {
      group.calculateStandings();
      this.groupRepository.save(group);
    }
  }
}
```

### 3.2 Countdown Service

```typescript
// CountdownService.ts
export class CountdownService {
  private countdownInterval: NodeJS.Timeout | null = null;
  private currentCountdown: Countdown | null = null;

  constructor(private matchService: MatchService) {}

  getNextMatch(allMatches: Match[]): Match | null {
    const now = new Date();
    const futureMatches = allMatches
      .filter(m => m.getMatchDate() > now)
      .sort((a, b) => a.getMatchDate().getTime() - b.getMatchDate().getTime());

    return futureMatches.length > 0 ? futureMatches[0] : null;
  }

  startCountdown(match: Match): Countdown {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    this.currentCountdown = new Countdown(
      generateUUID(),
      match,
      match.getMatchDate(),
      CountdownStatus.RUNNING
    );

    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000); // Actualizar cada segundo

    return this.currentCountdown;
  }

  private updateCountdown(): void {
    if (!this.currentCountdown) return;

    const now = new Date();
    const targetTime = this.currentCountdown.getTargetDateTime();
    const remaining = targetTime.getTime() - now.getTime();

    if (remaining <= 0) {
      this.stopCountdown();
      return;
    }

    // Notificar cuando falte 1 hora
    if (Math.floor(remaining / 1000) === 3600) {
      this.sendNotification("El partido comienza en 1 hora!");
    }

    // Notificar cuando falten 10 minutos
    if (Math.floor(remaining / 1000) === 600) {
      this.sendNotification("¡El partido comienza en 10 minutos!");
    }

    this.currentCountdown.updateLastUpdated();
  }

  getFormattedTimeRemaining(): string {
    if (!this.currentCountdown) return "No hay próximo partido";

    const remaining = this.currentCountdown.getTargetDateTime().getTime() - new Date().getTime();
    
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }

  stopCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }

    if (this.currentCountdown) {
      this.currentCountdown.setStatus(CountdownStatus.COMPLETED);
    }
  }

  private sendNotification(message: string): void {
    // Implementar lógica de notificación
    console.log(`🔔 Notificación: ${message}`);
    // Aquí se podría usar WebSocket, push notifications, etc.
  }

  getCurrentCountdown(): Countdown | null {
    return this.currentCountdown;
  }
}
```

---

## 4. INTERFAZ DE USUARIO (COMPONENTES REACT)

```typescript
// MatchCard.tsx
import React, { useState } from 'react';
import { Match } from '../models/Match';

interface MatchCardProps {
  match: Match;
  onUpdateScore: (homeScore: number, awayScore: number) => void;
  editable: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onUpdateScore,
  editable
}) => {
  const [homeScore, setHomeScore] = useState(match.getHomeScore());
  const [awayScore, setAwayScore] = useState(match.getAwayScore());

  const handleSaveScore = () => {
    onUpdateScore(homeScore, awayScore);
  };

  return (
    <div className="match-card">
      <div className="match-header">
        <span className="match-date">
          {match.getMatchDate().toLocaleDateString()}
        </span>
        <span className="match-status">{match.getStatus()}</span>
      </div>

      <div className="match-content">
        <div className="team home">
          <img
            src={match.getHomeTeam().getFlagUrl()}
            alt={match.getHomeTeam().getName()}
            className="flag"
          />
          <span className="team-name">{match.getHomeTeam().getName()}</span>
        </div>

        <div className="score">
          {editable ? (
            <>
              <input
                type="number"
                value={homeScore}
                onChange={(e) => setHomeScore(parseInt(e.target.value))}
                min="0"
              />
              <span>-</span>
              <input
                type="number"
                value={awayScore}
                onChange={(e) => setAwayScore(parseInt(e.target.value))}
                min="0"
              />
            </>
          ) : (
            <>
              <span className="score-value">{homeScore}</span>
              <span>-</span>
              <span className="score-value">{awayScore}</span>
            </>
          )}
        </div>

        <div className="team away">
          <span className="team-name">{match.getAwayTeam().getName()}</span>
          <img
            src={match.getAwayTeam().getFlagUrl()}
            alt={match.getAwayTeam().getName()}
            className="flag"
          />
        </div>
      </div>

      {editable && (
        <button className="save-button" onClick={handleSaveScore}>
          Guardar Resultado
        </button>
      )}

      <div className="match-footer">
        <span className="stadium">{match.getStadium().getName()}</span>
      </div>
    </div>
  );
};

export default MatchCard;
```

```typescript
// CountdownDisplay.tsx
import React, { useState, useEffect } from 'react';
import { Countdown } from '../models/Countdown';
import { CountdownService } from '../services/CountdownService';

interface CountdownDisplayProps {
  countdownService: CountdownService;
}

const CountdownDisplay: React.FC<CountdownDisplayProps> = ({
  countdownService
}) => {
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [nextMatch, setNextMatch] = useState<string>("");

  useEffect(() => {
    const countdown = countdownService.getCurrentCountdown();
    if (countdown) {
      setNextMatch(
        `${countdown.getNextMatch().getHomeTeam().getName()} vs ${countdown.getNextMatch().getAwayTeam().getName()}`
      );
    }

    const interval = setInterval(() => {
      const formatted = countdownService.getFormattedTimeRemaining();
      setTimeRemaining(formatted);
    }, 1000);

    return () => clearInterval(interval);
  }, [countdownService]);

  return (
    <div className="countdown-display">
      <h2>Próximo Partido</h2>
      <p className="match-info">{nextMatch}</p>
      <div className="countdown-timer">
        <span className="time">{timeRemaining}</span>
      </div>
    </div>
  );
};

export default CountdownDisplay;
```

---

## 5. VALIDACIONES Y MANEJO DE ERRORES

```typescript
// ValidationService.ts
export class ValidationService {
  validateMatch(match: Match): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!match.getHomeTeam() || !match.getAwayTeam()) {
      errors.push("Los equipos son requeridos");
    }

    if (match.getHomeTeam().getId() === match.getAwayTeam().getId()) {
      errors.push("Los equipos no pueden ser iguales");
    }

    if (match.getHomeScore() < 0 || match.getAwayScore() < 0) {
      errors.push("El marcador no puede ser negativo");
    }

    if (match.getGoals().length === 0 && match.isFinalized()) {
      errors.push("Un partido finalizado debe tener goles registrados");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateGoal(goal: Goal, match: Match): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (goal.getMinute() < 0 || goal.getMinute() > match.getDuration() + 30) {
      errors.push("El minuto del gol es inválido");
    }

    const playerTeam = goal.getPlayer().getTeamId();
    if (playerTeam !== match.getHomeTeam().getId() && 
        playerTeam !== match.getAwayTeam().getId()) {
      errors.push("El jugador no pertenece a ninguno de los equipos");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
```

---

## 6. INICIALIZACIÓN DEL SISTEMA

```typescript
// App.ts
import { Tournament } from './models/Tournament';
import { Team } from './models/Team';
import { MatchService } from './services/MatchService';
import { CountdownService } from './services/CountdownService';

async function initializeTournament() {
  // Crear torneo
  const tournament = new Tournament(
    "WC2026",
    "FIFA World Cup 2026",
    2026,
    new Date("2026-06-12"),
    new Date("2026-07-19")
  );

  // Obtener datos de API externa
  const apiService = new APIIntegrationService();
  const teams = await apiService.fetchTeamsData();

  // Agregar equipos al torneo
  teams.forEach(team => tournament.addTeam(team));

  // Inicializar fase de grupos
  tournament.initializeGroupPhase();

  // Generar partidos de grupos (sería manual en DB)
  // ...

  // Servicios
  const matchService = new MatchService(matchRepository);
  const countdownService = new CountdownService(matchService);

  // Obtener próximo partido e iniciar countdown
  const nextMatch = countdownService.getNextMatch(tournament.getMatches());
  if (nextMatch) {
    countdownService.startCountdown(nextMatch);
  }

  return {
    tournament,
    matchService,
    countdownService
  };
}

export { initializeTournament };
```

---

## NOTAS IMPORTANTES

1. **Validaciones**: Todas las clases incluyen validaciones tanto en constructor como en métodos
2. **Inmutabilidad**: Usar getters para acceder a propiedades (encapsulación)
3. **Manejo de errores**: Usar try-catch en servicios
4. **Testing**: Crear tests unitarios para cada clase
5. **Persistencia**: Las clases deben ser serializables a JSON
6. **Real-time**: Implementar WebSocket para actualizaciones en vivo del countdown
7. **Async/Await**: Usar para llamadas a API y base de datos

