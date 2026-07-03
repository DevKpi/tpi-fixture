/**
 * GroupController - Controlador de Grupos
 * Gestiona la lógica de grupos, standings y clasificación de forma dinámica.
 */

import APIService from '../services/apiService.js';

class GroupController {
  constructor() {
    this.groups = [];
    this.teams = [];
    this.matches = [];
  }

  /**
   * Inicializa el controlador cargando los datos frescos
   */
  async init() {
    console.log('[GroupController] Inicializando...');
    try {
      const [groups, teams, matches] = await Promise.all([
        APIService.getAllGroups(),
        APIService.getAllTeams(),
        APIService.getAllMatches()
      ]);

      this.groups = groups;
      this.teams = teams;
      this.matches = matches;

      console.log(`[GroupController] ${this.groups.length} grupos cargados`);
      return true;
    } catch (error) {
      console.error('[GroupController] Error al inicializar:', error);
      return false;
    }
  }

  /**
   * Obtiene un grupo específico
   * @param {string} groupName - Letra del grupo (A-L)
   * @returns {Object} Grupo
   */
  getGroup(groupName) {
    return this.groups.find(g => (g.group || g.name) === groupName);
  }

  /**
   * Obtiene todos los grupos
   * @returns {Array} Array de grupos
   */
  getAllGroups() {
    return this.groups;
  }

  /**
   * Obtiene equipos de un grupo
   * @param {string} groupName - Letra del grupo (A-L)
   * @returns {Array} Equipos del grupo
   */
  getTeamsByGroup(groupName) {
    return this.teams.filter(t => t.groups === groupName);
  }

  /**
   * Obtiene standings formateados de un grupo calculados DINÁMICAMENTE desde los partidos
   * @param {string} groupName - Letra del grupo (A-L)
   * @returns {Object} Standings del grupo
   */
  getGroupStandings(groupName) {
    const group = this.getGroup(groupName);
    if (!group) return null;

    const groupTeams = this.getTeamsByGroup(groupName);
    const groupMatches = this.getGroupMatches(groupName);

    // Calcular estadísticas por equipo
    const standingsMap = {};
    groupTeams.forEach(team => {
      standingsMap[String(team.id)] = {
        teamId: String(team.id),
        teamName: team.name_en,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0
      };
    });

    groupMatches.forEach(match => {
      const finished = match.finished === 'TRUE' || match.finished === true || match.finished === 'true';
      if (!finished) return;

      const homeId = String(match.home_team_id);
      const awayId = String(match.away_team_id);
      
      const homeScore = parseInt(match.home_score) || 0;
      const awayScore = parseInt(match.away_score) || 0;

      // Actualizar equipo local
      if (standingsMap[homeId]) {
        const stats = standingsMap[homeId];
        stats.played++;
        stats.goalsFor += homeScore;
        stats.goalsAgainst += awayScore;
        if (homeScore > awayScore) {
          stats.wins++;
          stats.points += 3;
        } else if (homeScore === awayScore) {
          stats.draws++;
          stats.points += 1;
        } else {
          stats.losses++;
        }
      }

      // Actualizar equipo visitante
      if (standingsMap[awayId]) {
        const stats = standingsMap[awayId];
        stats.played++;
        stats.goalsFor += awayScore;
        stats.goalsAgainst += homeScore;
        if (awayScore > homeScore) {
          stats.wins++;
          stats.points += 3;
        } else if (homeScore === awayScore) {
          stats.draws++;
          stats.points += 1;
        } else {
          stats.losses++;
        }
      }
    });

    // Convertir a array y calcular diferencia de gol
    const standingsList = Object.values(standingsMap).map(stats => {
      stats.goalDifference = stats.goalsFor - stats.goalsAgainst;
      return stats;
    });

    // Ordenar standings según criterio de FIFA:
    // 1. Puntos
    // 2. Diferencia de Gol
    // 3. Goles a Favor
    // 4. Enfrentamiento directo (simplificado aquí por orden alfabético para fallback estable)
    standingsList.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.teamName.localeCompare(b.teamName);
    });

    return {
      groupName,
      standings: standingsList.map((standing, index) => ({
        ...standing,
        position: index + 1
      }))
    };
  }

  /**
   * Obtiene información de un equipo
   * @param {string|number} teamId
   * @returns {Object} Información del equipo
   */
  getTeamInfo(teamId) {
    return this.teams.find(t => t.id === String(teamId) || t.id === teamId);
  }

  /**
   * Obtiene partidos de un grupo
   * @param {string} groupName - Letra del grupo (A-L)
   * @returns {Array} Partidos del grupo
   */
  getGroupMatches(groupName) {
    return this.matches.filter(m => m.group === groupName);
  }

  /**
   * Obtiene el resultado del grupo (cuáles equipos avanzan)
   * @param {string} groupName - Letra del grupo (A-L)
   * @returns {Array} Equipos clasificados (los primeros 2)
   */
  getQualifiedTeams(groupName) {
    const standings = this.getGroupStandings(groupName);
    if (!standings) return [];

    return standings.standings.slice(0, 2);
  }

  /**
   * Formatea grupo para visualización en tabla
   * @param {string} groupName - Letra del grupo (A-L)
   * @returns {Object}
   */
  formatGroupTable(groupName) {
    const standings = this.getGroupStandings(groupName);
    if (!standings) return null;

    return {
      groupName,
      teams: standings.standings.map(team => ({
        ...team,
        flagUrl: this.getTeamInfo(team.teamId)?.flag || null
      }))
    };
  }

  /**
   * Obtiene todos los grupos formateados para visualización
   * @returns {Array}
   */
  getAllGroupsFormatted() {
    const groupLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    return groupLetters.map(letter => this.formatGroupTable(letter)).filter(g => g !== null);
  }

  /**
   * Verifica si un grupo está completo (todos los partidos jugados)
   * @param {string} groupName
   * @returns {boolean}
   */
  isGroupComplete(groupName) {
    const matches = this.getGroupMatches(groupName);
    const finishedMatches = matches.filter(m => m.finished === 'TRUE' || m.finished === true || m.finished === 'true').length;
    return finishedMatches === matches.length && matches.length > 0;
  }

  /**
   * Obtiene clasificados y eliminados de un grupo
   * @param {string} groupName
   * @returns {Object}
   */
  getGroupClassification(groupName) {
    const standings = this.getGroupStandings(groupName);
    if (!standings) return null;

    return {
      groupName,
      qualified: standings.standings.slice(0, 2),
      eliminated: standings.standings.slice(2)
    };
  }
}

export default GroupController;
