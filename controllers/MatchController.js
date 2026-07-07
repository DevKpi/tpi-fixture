/**
 * MatchController - Controlador de Partidos
 * Gestiona la lógica de partidos, resultados y estados
 */

import APIService from '../services/apiService.js';

class MatchController {
  constructor() {
    this.matches = [];
    this.currentMatch = null;
  }

  /**
   * Inicializa el controlador
   */
  async init() {
    console.log('[MatchController] Inicializando...');
    try {
      this.matches = await APIService.getAllMatches();
      console.log(`[MatchController] ${this.matches.length} partidos cargados`);
      return true;
    } catch (error) {
      console.error('[MatchController] Error al inicializar:', error);
      return false;
    }
  }

  /**
   * Obtiene un partido por ID
   * @param {number|string} matchId
   * @returns {Object} Datos del partido
   */
  getMatchById(matchId) {
    return this.matches.find(m => m.id === String(matchId) || m.id === matchId);
  }

  /**
   * Obtiene el estado legible de un partido
   * @param {Object} match - Objeto del partido (instancia de Partido)
   * @returns {string} Estado del partido
   */
  getMatchStatus(match) {
    if (!match) return 'Desconocido';
    return typeof match.ObtenerEstadoLegible === 'function' 
      ? match.ObtenerEstadoLegible() 
      : 'En vivo';
  }

  /**
   * Determina si un partido es de grupos
   * @param {Object} match (instancia de Partido)
   * @returns {boolean}
   */
  isGroupMatch(match) {
    if (!match) return false;
    return typeof match.EsFaseDeGrupos === 'function' ? match.EsFaseDeGrupos() : false;
  }

  /**
   * Determina si un partido es de knockout
   * @param {Object} match (instancia de Partido)
   * @returns {boolean}
   */
  isKnockoutMatch(match) {
    if (!match) return false;
    return typeof match.EsFaseEliminatoria === 'function' ? match.EsFaseEliminatoria() : false;
  }

  /**
   * Obtiene el nombre de la fase del torneo
   * @param {string} type - Tipo de fase
   * @param {Object} match - Instancia opcional de Partido
   * @returns {string} Nombre legible de la fase
   */
  getPhaseName(type, match = null) {
    if (match && typeof match.ObtenerNombreFase === 'function') {
      return match.ObtenerNombreFase();
    }
    const phases = {
      'group': 'Fase de Grupos',
      'r32': 'Ronda de 32',
      'r16': 'Octavos de Final',
      'qf': 'Cuartos de Final',
      'sf': 'Semifinal',
      'third': 'Tercer Lugar',
      'final': 'Final'
    };
    return phases[type] || type;
  }

  /**
   * Obtiene partidos próximos sin jugar
   * @param {number} limit
   * @returns {Array}
   */
  getUpcomingMatches(limit = 10) {
    return this.matches
      .filter(m => m.finished === 'FALSE' || m.finished === false)
      .slice(0, limit);
  }

  /**
   * Obtiene partidos ya jugados
   * @param {number} limit
   * @returns {Array}
   */
  getFinishedMatches(limit = 10) {
    return this.matches
      .filter(m => m.finished === 'TRUE' || m.finished === true)
      .slice(0, limit);
  }

  /**
   * Obtiene partidos en vivo
   * @returns {Array}
   */
  getLiveMatches() {
    return this.matches.filter(m => {
      const finished = m.finished === 'TRUE' || m.finished === true;
      const notStarted = m.time_elapsed?.toLowerCase() === 'notstarted';
      return !finished && !notStarted;
    });
  }

  /**
   * Formatea un partido para visualización
   * @param {Object} match
   * @returns {Object} Partido formateado
   */
  formatMatch(match) {
    if (!match) return null;

    return {
      id: match.id,
      homeTeam: match.home_team_name_en || 'Por confirmar',
      awayTeam: match.away_team_name_en || 'Por confirmar',
      homeTeamId: match.home_team_id,
      awayTeamId: match.away_team_id,
      homeScore: parseInt(match.home_score) || 0,
      awayScore: parseInt(match.away_score) || 0,
      group: match.grupo,
      matchday: match.matchday,
      date: match.local_date,
      stadium: match.stadium_id,
      status: this.getMatchStatus(match),
      finished: match.finished === 'TRUE' || match.finished === true,
      phase: this.getPhaseName(match.type),
      homeScorers: match.home_scorers && match.home_scorers !== 'null' 
        ? match.home_scorers.split(',').map(s => s.trim()) 
        : [],
      awayScorers: match.away_scorers && match.away_scorers !== 'null'
        ? match.away_scorers.split(',').map(s => s.trim())
        : []
    };
  }

  /**
   * Calcula resultados de partidos (ganados, empatados, perdidos)
   * @param {string|number} teamId
   * @returns {Object}
   */
  getTeamResults(teamId) {
    const teamMatches = this.matches.filter(m =>
      m.home_team_id === String(teamId) || m.home_team_id === teamId ||
      m.away_team_id === String(teamId) || m.away_team_id === teamId
    );

    let wins = 0, draws = 0, losses = 0;
    let goalsFor = 0, goalsAgainst = 0;

    teamMatches.forEach(match => {
      const isHome = String(match.home_team_id) === String(teamId);
      const homeScore = parseInt(match.home_score) || 0;
      const awayScore = parseInt(match.away_score) || 0;

      if (isHome) {
        goalsFor += homeScore;
        goalsAgainst += awayScore;
        if (homeScore > awayScore) wins++;
        else if (homeScore === awayScore) draws++;
        else losses++;
      } else {
        goalsFor += awayScore;
        goalsAgainst += homeScore;
        if (awayScore > homeScore) wins++;
        else if (awayScore === homeScore) draws++;
        else losses++;
      }
    });

    return {
      teamId,
      played: teamMatches.length,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      goalDifference: goalsFor - goalsAgainst,
      points: (wins * 3) + draws
    };
  }

  /**
   * Obtiene partidos del mismo matchday
   * @param {number|string} matchday
   * @returns {Array}
   */
  getMatchesByMatchday(matchday) {
    return this.matches.filter(m => m.matchday === String(matchday) || m.matchday === matchday);
  }

  /**
   * Obtiene partidos en un estadio específico
   * @param {number|string} stadiumId
   * @returns {Array}
   */
  getMatchesByStadium(stadiumId) {
    return this.matches.filter(m => 
      m.stadium_id === String(stadiumId) || m.stadium_id === stadiumId
    );
  }

  /**
   * Obtiene información del partido siguiente entre dos equipos
   * @param {string|number} team1Id
   * @param {string|number} team2Id
   * @returns {Object|null}
   */
  getMatchBetweenTeams(team1Id, team2Id) {
    return this.matches.find(m =>
      (m.home_team_id === String(team1Id) && m.away_team_id === String(team2Id)) ||
      (m.home_team_id === String(team2Id) && m.away_team_id === String(team1Id))
    );
  }

  /**
   * Obtiene historial entre dos equipos
   * @param {string|number} team1Id
   * @param {string|number} team2Id
   * @returns {Array}
   */
  getHistoryBetweenTeams(team1Id, team2Id) {
    return this.matches.filter(m =>
      (m.home_team_id === String(team1Id) && m.away_team_id === String(team2Id)) ||
      (m.home_team_id === String(team2Id) && m.away_team_id === String(team1Id))
    );
  }

  /**
   * Calcula estadísticas de partidos
   * @returns {Object}
   */
  getMatchStats() {
    const totalMatches = this.matches.length;
    const finishedMatches = this.matches.filter(m => m.finished === 'TRUE' || m.finished === true).length;
    const upcomingMatches = totalMatches - finishedMatches;
    const liveMatches = this.getLiveMatches().length;

    let totalGoals = 0;
    let zeroZeroMatches = 0;

    this.matches.forEach(match => {
      const homeScore = parseInt(match.home_score) || 0;
      const awayScore = parseInt(match.away_score) || 0;
      totalGoals += homeScore + awayScore;

      if (homeScore === 0 && awayScore === 0) {
        zeroZeroMatches++;
      }
    });

    return {
      totalMatches,
      finishedMatches,
      upcomingMatches,
      liveMatches,
      totalGoals,
      averageGoalsPerMatch: (totalGoals / totalMatches).toFixed(2),
      zeroZeroMatches,
      progressPercent: Math.round((finishedMatches / totalMatches) * 100)
    };
  }

  /**
   * Obtiene partidos para rendimiento de carga
   * @param {number} page
   * @param {number} limit
   * @returns {Object}
   */
  getMatchesPaginated(page = 1, limit = 10) {
    const start = (page - 1) * limit;
    const end = start + limit;
    const totalPages = Math.ceil(this.matches.length / limit);

    return {
      matches: this.matches.slice(start, end),
      page,
      limit,
      total: this.matches.length,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };
  }
}

export default MatchController;
