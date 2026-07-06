/**
 * GoalsController - Controlador de Goles y Goleadores
 * Gestiona la lógica de goles, asistencias y ranking de anotadores
 */

import APIService from '../services/apiService.js';

class GoalsController {
  constructor() {
    this.matches = [];
    this.topScorers = [];
    this.topAssists = [];
  }

  /**
   * Inicializa el controlador
   */
  async init() {
    console.log('[GoalsController] Inicializando...');
    try {
      this.matches = await APIService.getAllMatches();
      this.calculateStats();
      return true;
    } catch (error) {
      console.error('[GoalsController] Error al inicializar:', error);
      return false;
    }
  }

  /**
   * Calcula estadísticas de goles
   */
  calculateStats() {
    console.log('[GoalsController] Calculando estadísticas de goles...');
    this.calculateTopScorers();
    this.calculateTopAssists();
  }

  /**
   * Calcula los principales goleadores
   */
  calculateTopScorers() {
    const scorers = {};

    this.matches.forEach(match => {
      // Goles del equipo local
      if (match.home_scorers && match.home_scorers !== 'null' && match.home_scorers !== 'NULL' && match.home_scorers !== '') {
        // Limpiar llaves y comillas antes de separar si es formato JSON string
        const cleanedStr = match.home_scorers.replace(/[{}"“”]/g, '');
        const goals = cleanedStr.split(',').map(g => g.trim());
        goals.forEach(goal => {
          if (goal) {
            // Extraer el nombre del jugador quitando el minuto al final (ej: "J. Quiñones 9'" -> "J. Quiñones")
            const playerName = goal.replace(/\s+\d+('|\+)?\d*'?$/, '').trim();
            if (playerName) {
              scorers[playerName] = (scorers[playerName] || 0) + 1;
            }
          }
        });
      }

      // Goles del equipo visitante
      if (match.away_scorers && match.away_scorers !== 'null' && match.away_scorers !== 'NULL' && match.away_scorers !== '') {
        const cleanedStr = match.away_scorers.replace(/[{}"“”]/g, '');
        const goals = cleanedStr.split(',').map(g => g.trim());
        goals.forEach(goal => {
          if (goal) {
            const playerName = goal.replace(/\s+\d+('|\+)?\d*'?$/, '').trim();
            if (playerName) {
              scorers[playerName] = (scorers[playerName] || 0) + 1;
            }
          }
        });
      }
    });

    this.topScorers = Object.entries(scorers)
      .map(([player, goals]) => ({ player, goals, type: 'gol' }))
      .sort((a, b) => b.goals - a.goals);

    console.log(`[GoalsController] Top ${Math.min(10, this.topScorers.length)} goleadores calculados`);
    return this.topScorers;
  }

  /**
   * Calcula las principales asistencias
   * (Nota: La API actual no proporciona datos de asistencias, 
   * este método está preparado para cuando esté disponible)
   */
  calculateTopAssists() {
    const assists = {};

    this.matches.forEach(match => {
      // Esta es una estructura preparada para cuando la API proporcione datos de asistencias
      // Por ahora no hay datos de asistencias disponibles en la API
    });

    this.topAssists = Object.entries(assists)
      .map(([player, assists]) => ({ player, assists }))
      .sort((a, b) => b.assists - a.assists);

    return this.topAssists;
  }

  /**
   * Obtiene los top goleadores
   * @param {number} limit - Cantidad de goleadores a retornar
   * @returns {Array} Top scorers
   */
  getTopScorers(limit = 10) {
    return this.topScorers.slice(0, limit);
  }

  /**
   * Obtiene los top asistidores
   * @param {number} limit - Cantidad de asistidores a retornar
   * @returns {Array} Top assists
   */
  getTopAssists(limit = 10) {
    return this.topAssists.slice(0, limit);
  }

  /**
   * Obtiene goles de un equipo específico
   * @param {string|number} teamId
   * @returns {Object} Datos de goles del equipo
   */
  getTeamGoals(teamId) {
    let homeGoals = 0;
    let awayGoals = 0;
    let goalsFor = [];
    let goalsAgainst = [];

    this.matches.forEach(match => {
      if (match.home_team_id === String(teamId) || match.home_team_id === teamId) {
        homeGoals += parseInt(match.home_score) || 0;
        if (match.home_scorers && match.home_scorers !== 'null') {
          goalsFor.push(...match.home_scorers.split(',').map(g => g.trim()));
        }
        awayGoals += parseInt(match.away_score) || 0;
        if (match.away_scorers && match.away_scorers !== 'null') {
          goalsAgainst.push(...match.away_scorers.split(',').map(g => g.trim()));
        }
      }

      if (match.away_team_id === String(teamId) || match.away_team_id === teamId) {
        awayGoals += parseInt(match.away_score) || 0;
        if (match.away_scorers && match.away_scorers !== 'null') {
          goalsFor.push(...match.away_scorers.split(',').map(g => g.trim()));
        }
        homeGoals += parseInt(match.home_score) || 0;
        if (match.home_scorers && match.home_scorers !== 'null') {
          goalsAgainst.push(...match.home_scorers.split(',').map(g => g.trim()));
        }
      }
    });

    return {
      teamId,
      goalsFor: homeGoals,
      goalsAgainst: awayGoals,
      goalDifference: homeGoals - awayGoals,
      scorersCount: goalsFor.filter(g => g).length,
      concededCount: goalsAgainst.filter(g => g).length
    };
  }

  /**
   * Obtiene goles de un jugador específico
   * @param {string} playerName
   * @returns {Array} Goles del jugador
   */
  getPlayerGoals(playerName) {
    const goals = [];

    this.matches.forEach(match => {
      if (match.home_scorers && match.home_scorers.includes(playerName)) {
        const homeGoals = match.home_scorers.split(',').filter(g => g.trim() === playerName).length;
        goals.push({
          matchId: match.id,
          homeTeam: match.home_team_name_en,
          awayTeam: match.away_team_name_en,
          goals: homeGoals,
          date: match.local_date,
          group: match.grupo
        });
      }

      if (match.away_scorers && match.away_scorers.includes(playerName)) {
        const awayGoals = match.away_scorers.split(',').filter(g => g.trim() === playerName).length;
        goals.push({
          matchId: match.id,
          homeTeam: match.home_team_name_en,
          awayTeam: match.away_team_name_en,
          goals: awayGoals,
          date: match.local_date,
          group: match.grupo
        });
      }
    });

    return goals;
  }

  /**
   * Obtiene estadísticas generales de goles
   * @returns {Object} Estadísticas
   */
  getTournamentGoalStats() {
    let totalGoals = 0;
    let matchesWithGoals = 0;
    let maxGoalsInMatch = 0;

    this.matches.forEach(match => {
      const homeGoals = parseInt(match.home_score) || 0;
      const awayGoals = parseInt(match.away_score) || 0;
      const totalMatchGoals = homeGoals + awayGoals;

      if (totalMatchGoals > 0) matchesWithGoals++;
      totalGoals += totalMatchGoals;
      if (totalMatchGoals > maxGoalsInMatch) maxGoalsInMatch = totalMatchGoals;
    });

    return {
      totalGoals,
      matchesWithGoals,
      maxGoalsInMatch,
      averageGoalsPerMatch: (totalGoals / this.matches.length).toFixed(2),
      averageGoalsPerMatchWithGoals: (totalGoals / (matchesWithGoals || 1)).toFixed(2),
      uniqueScorers: this.topScorers.length
    };
  }

  /**
   * Obtiene partidos sin goles (0-0)
   * @returns {Array} Partidos sin goles
   */
  getZeroZeroMatches() {
    return this.matches.filter(match => 
      (parseInt(match.home_score) || 0) === 0 && (parseInt(match.away_score) || 0) === 0
    );
  }

  /**
   * Obtiene los partidos con más goles
   * @param {number} limit
   * @returns {Array} Partidos con más goles
   */
  getHighScoringMatches(limit = 10) {
    return this.matches
      .map(match => ({
        ...match,
        totalGoals: (parseInt(match.home_score) || 0) + (parseInt(match.away_score) || 0)
      }))
      .filter(match => match.totalGoals > 0)
      .sort((a, b) => b.totalGoals - a.totalGoals)
      .slice(0, limit);
  }

  /**
   * Obtiene goles por fase del torneo
   * @returns {Object} Goles por fase
   */
  getGoalsByPhase() {
    const phases = {};

    this.matches.forEach(match => {
      const phase = match.type || (match.grupo && match.grupo.match(/^[A-L]$/) ? 'group' : 'unknown');
      
      if (!phases[phase]) {
        phases[phase] = {
          totalGoals: 0,
          matches: 0
        };
      }

      phases[phase].totalGoals += (parseInt(match.home_score) || 0) + (parseInt(match.away_score) || 0);
      phases[phase].matches += 1;
    });

    // Calcular promedio de goles por partido por fase
    Object.keys(phases).forEach(phase => {
      phases[phase].averageGoalsPerMatch = 
        (phases[phase].totalGoals / phases[phase].matches).toFixed(2);
    });

    return phases;
  }
}

export default GoalsController;
