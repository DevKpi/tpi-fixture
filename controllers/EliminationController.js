/**
 * EliminationController - Controlador de Fase Eliminatoria
 * Gestiona la lógica de knockout, llaves y árbol de eliminación
 */

import APIService from '../services/apiService.js';

class EliminationController {
  constructor() {
    this.knockoutMatches = [];
    this.teams = [];
  }

  /**
   * Inicializa el controlador
   */
  async init() {
    console.log('[EliminationController] Inicializando...');
    try {
      const [matches, teams] = await Promise.all([
        APIService.getKnockoutMatches(),
        APIService.getAllTeams()
      ]);

      this.knockoutMatches = matches;
      this.teams = teams;

      console.log(`[EliminationController] ${this.knockoutMatches.length} partidos de knockout cargados`);
      return true;
    } catch (error) {
      console.error('[EliminationController] Error al inicializar:', error);
      return false;
    }
  }

  /**
   * Obtiene matches de una fase específica
   * @param {string} phase - 'r32', 'r16', 'qf', 'sf', 'third', 'final'
   * @returns {Array}
   */
  getMatchesByPhase(phase) {
    return this.knockoutMatches.filter(m => m.type === phase);
  }

  /**
   * Obtiene el nombre legible de una fase
   * @param {string} phase
   * @returns {string}
   */
  getPhaseName(phase) {
    const names = {
      'r32': 'Ronda de 32',
      'r16': 'Octavos de Final',
      'qf': 'Cuartos de Final',
      'sf': 'Semifinal',
      'third': 'Tercer Lugar',
      'final': 'Final'
    };
    return names[phase] || phase;
  }

  /**
   * Obtiene el árbol de eliminación completo
   * @returns {Object}
   */
  getKnockoutBracket() {
    return {
      r32: {
        name: this.getPhaseName('r32'),
        matches: this.getMatchesByPhase('r32')
      },
      r16: {
        name: this.getPhaseName('r16'),
        matches: this.getMatchesByPhase('r16')
      },
      qf: {
        name: this.getPhaseName('qf'),
        matches: this.getMatchesByPhase('qf')
      },
      sf: {
        name: this.getPhaseName('sf'),
        matches: this.getMatchesByPhase('sf')
      },
      third: {
        name: this.getPhaseName('third'),
        matches: this.getMatchesByPhase('third')
      },
      final: {
        name: this.getPhaseName('final'),
        matches: this.getMatchesByPhase('final')
      }
    };
  }

  /**
   * Verifica si un equipo está clasificado a una fase
   * @param {string|number} teamId
   * @param {string} phase - Fase objetivo
   * @returns {boolean}
   */
  isTeamInPhase(teamId, phase) {
    const matches = this.getMatchesByPhase(phase);
    return matches.some(m =>
      (m.home_team_id === String(teamId) || m.home_team_id === teamId) ||
      (m.away_team_id === String(teamId) || m.away_team_id === teamId)
    );
  }

  /**
   * Obtiene el recorrido de un equipo en la fase eliminatoria
   * @param {string|number} teamId
   * @returns {Array}
   */
  getTeamKnockoutPath(teamId) {
    const path = [];
    const phases = ['r32', 'r16', 'qf', 'sf', 'third', 'final'];

    phases.forEach(phase => {
      const phaseMatches = this.getMatchesByPhase(phase);
      const teamMatch = phaseMatches.find(m =>
        (m.home_team_id === String(teamId) || m.home_team_id === teamId) ||
        (m.away_team_id === String(teamId) || m.away_team_id === teamId)
      );

      if (teamMatch) {
        const isHome = String(teamMatch.home_team_id) === String(teamId);
        const teamScore = isHome ? parseInt(teamMatch.home_score) : parseInt(teamMatch.away_score);
        const oppositeScore = isHome ? parseInt(teamMatch.away_score) : parseInt(teamMatch.home_score);
        const opponent = isHome ? teamMatch.away_team_name_en : teamMatch.home_team_name_en;

        path.push({
          phase,
          phaseName: this.getPhaseName(phase),
          matchId: teamMatch.id,
          opponent,
          teamScore: teamScore || 0,
          oppositeScore: oppositeScore || 0,
          result: teamScore > oppositeScore ? 'ganó' : (teamScore === oppositeScore ? 'empató' : 'perdió'),
          finished: teamMatch.finished === 'TRUE' || teamMatch.finished === true
        });
      }
    });

    return path;
  }

  /**
   * Obtiene los semifinalistas
   * @returns {Array}
   */
  getSemifinalTeams() {
    const sfMatches = this.getMatchesByPhase('sf');
    const teams = [];

    sfMatches.forEach(match => {
      if (match.home_team_id && match.home_team_id !== '0') {
        teams.push({
          teamId: match.home_team_id,
          teamName: match.home_team_name_en
        });
      }
      if (match.away_team_id && match.away_team_id !== '0') {
        teams.push({
          teamId: match.away_team_id,
          teamName: match.away_team_name_en
        });
      }
    });

    return [...new Map(teams.map(t => [t.teamId, t])).values()];
  }

  /**
   * Obtiene los finalistas
   * @returns {Array}
   */
  getFinalTeams() {
    const finalMatch = this.getMatchesByPhase('final')[0];
    if (!finalMatch) return [];

    const teams = [];
    if (finalMatch.home_team_id && finalMatch.home_team_id !== '0') {
      teams.push({
        teamId: finalMatch.home_team_id,
        teamName: finalMatch.home_team_name_en
      });
    }
    if (finalMatch.away_team_id && finalMatch.away_team_id !== '0') {
      teams.push({
        teamId: finalMatch.away_team_id,
        teamName: finalMatch.away_team_name_en
      });
    }

    return teams;
  }

  /**
   * Obtiene el ganador del torneo
   * @returns {Object|null}
   */
  getTournamentWinner() {
    const finalMatch = this.getMatchesByPhase('final')[0];
    if (!finalMatch || finalMatch.finished !== 'TRUE' && finalMatch.finished !== true) {
      return null;
    }

    const homeScore = parseInt(finalMatch.home_score) || 0;
    const awayScore = parseInt(finalMatch.away_score) || 0;

    if (homeScore > awayScore) {
      return {
        teamId: finalMatch.home_team_id,
        teamName: finalMatch.home_team_name_en
      };
    } else if (awayScore > homeScore) {
      return {
        teamId: finalMatch.away_team_id,
        teamName: finalMatch.away_team_name_en
      };
    }

    return null; // Puede haber prórroga o penaltis
  }

  /**
   * Obtiene tercer y cuarto puesto
   * @returns {Object}
   */
  getThirdFourthPlace() {
    const thirdMatch = this.getMatchesByPhase('third')[0];
    if (!thirdMatch) return null;

    const homeScore = parseInt(thirdMatch.home_score) || 0;
    const awayScore = parseInt(thirdMatch.away_score) || 0;

    return {
      third: homeScore > awayScore 
        ? { teamId: thirdMatch.home_team_id, teamName: thirdMatch.home_team_name_en }
        : { teamId: thirdMatch.away_team_id, teamName: thirdMatch.away_team_name_en },
      fourth: homeScore > awayScore
        ? { teamId: thirdMatch.away_team_id, teamName: thirdMatch.away_team_name_en }
        : { teamId: thirdMatch.home_team_id, teamName: thirdMatch.home_team_name_en },
      match: thirdMatch
    };
  }

  /**
   * Formatea un partido de knockout para visualización
   * @param {Object} match
   * @returns {Object}
   */
  formatKnockoutMatch(match) {
    return {
      id: match.id,
      phase: this.getPhaseName(match.type),
      homeTeam: match.home_team_name_en || match.home_team_label || 'Por confirmar',
      awayTeam: match.away_team_name_en || match.away_team_label || 'Por confirmar',
      homeScore: parseInt(match.home_score) || 0,
      awayScore: parseInt(match.away_score) || 0,
      homeTeamId: match.home_team_id,
      awayTeamId: match.away_team_id,
      date: match.local_date,
      stadium: match.stadium_id,
      finished: match.finished === 'TRUE' || match.finished === true,
      status: this.getKnockoutMatchStatus(match)
    };
  }

  /**
   * Obtiene el estado de un partido de knockout
   * @param {Object} match
   * @returns {string}
   */
  getKnockoutMatchStatus(match) {
    const finished = match.finished === 'TRUE' || match.finished === true;
    const timeElapsed = match.time_elapsed?.toLowerCase() || '';

    if (!finished && timeElapsed === 'notstarted') {
      return 'Por comenzar';
    }

    if (finished) {
      const homeScore = parseInt(match.home_score) || 0;
      const awayScore = parseInt(match.away_score) || 0;
      
      if (homeScore > awayScore) {
        return `${match.home_team_name_en || 'Local'} clasificado`;
      } else if (awayScore > homeScore) {
        return `${match.away_team_name_en || 'Visitante'} clasificado`;
      } else {
        return 'Prórroga/Penaltis'; // Resultado final será por prórroga
      }
    }

    if (timeElapsed.includes('\'')) {
      return `En vivo - ${match.time_elapsed}'`;
    }

    return 'En vivo';
  }

  /**
   * Obtiene estadísticas de la fase eliminatoria
   * @returns {Object}
   */
  getEliminationStats() {
    const phases = ['r32', 'r16', 'qf', 'sf', 'third', 'final'];
    const stats = {};
    let totalMatches = 0;
    let finishedMatches = 0;
    let totalGoals = 0;

    phases.forEach(phase => {
      const phaseMatches = this.getMatchesByPhase(phase);
      const finished = phaseMatches.filter(m => m.finished === 'TRUE' || m.finished === true).length;
      let phaseGoals = 0;

      phaseMatches.forEach(match => {
        phaseGoals += (parseInt(match.home_score) || 0) + (parseInt(match.away_score) || 0);
      });

      stats[phase] = {
        name: this.getPhaseName(phase),
        total: phaseMatches.length,
        finished,
        goals: phaseGoals
      };

      totalMatches += phaseMatches.length;
      finishedMatches += finished;
      totalGoals += phaseGoals;
    });

    return {
      phases: stats,
      totalMatches,
      finishedMatches,
      totalGoals,
      progressPercent: totalMatches > 0 ? Math.round((finishedMatches / totalMatches) * 100) : 0
    };
  }

  /**
   * Obtiene sorpresas del torneo (equipos inesperados en fases avanzadas)
   * @returns {Array}
   */
  getSurprises() {
    // Esto sería más útil con datos históricos o predicciones previas
    // Por ahora retornamos equipos en semifinales que no son potencias habituales
    const semis = this.getSemifinalTeams();
    const unseeded = semis.filter(team => {
      // Potencias esperadas
      const powerTeams = ['Brazil', 'France', 'Argentina', 'Spain', 'Germany', 'England'];
      return !powerTeams.includes(team.teamName);
    });

    return unseeded;
  }
}

export default EliminationController;
