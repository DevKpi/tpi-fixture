/**
 * GroupController - Controlador de Grupos
 * Gestiona la lógica de grupos, standings y clasificación
 */

import APIService from '../services/apiService.js';

class GroupController {
  constructor() {
    this.groups = [];
    this.teams = [];
    this.matches = [];
  }

  /**
   * Inicializa el controlador
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
   * @returns {Object} Grupo con standings
   */
  getGroup(groupName) {
    return this.groups.find(g => g.group === groupName);
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
   * Obtiene standings formateados de un grupo
   * @param {string} groupName - Letra del grupo (A-L)
   * @returns {Object} Standings del grupo
   */
  getGroupStandings(groupName) {
    const group = this.getGroup(groupName);
    if (!group || !group.teams) return null;

    return {
      groupName,
      standings: group.teams.map((standing, index) => {
        const team = this.getTeamInfo(standing.team_id);
        return {
          position: index + 1,
          teamId: standing.team_id,
          teamName: team ? team.name_en : 'Desconocido',
          points: parseInt(standing.pts) || 0,
          played: 0, // Se calcula con los partidos
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: parseInt(standing.gf) || 0,
          goalsAgainst: parseInt(standing.ga) || 0,
          goalDifference: (parseInt(standing.gf) || 0) - (parseInt(standing.ga) || 0)
        };
      })
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
   * Calcula el resultado del grupo (cuáles equipos avanzan)
   * @param {string} groupName - Letra del grupo (A-L)
   * @returns {Array} Equipos clasificados (max 2)
   */
  getQualifiedTeams(groupName) {
    const standings = this.getGroupStandings(groupName);
    if (!standings) return [];

    // Retornar los primeros 2 equipos
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
    // Cada grupo debe tener 6 partidos (4 equipos juegan todos contra todos)
    // 4C2 = 6
    const groupMatchesCount = 6;
    const finishedMatches = matches.filter(m => m.finished === 'TRUE' || m.finished === true).length;

    return finishedMatches === groupMatchesCount;
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

  /**
   * Compara dos equipos en un grupo
   * @param {string} groupName
   * @param {string|number} team1Id
   * @param {string|number} team2Id
   * @returns {Array} Historial de enfrentamientos
   */
  getHeadToHead(groupName, team1Id, team2Id) {
    const groupMatches = this.getGroupMatches(groupName);
    
    return groupMatches.filter(m =>
      (m.home_team_id === String(team1Id) && m.away_team_id === String(team2Id)) ||
      (m.home_team_id === String(team2Id) && m.away_team_id === String(team1Id))
    );
  }

  /**
   * Obtiene estadísticas generales de los grupos
   * @returns {Object}
   */
  getGroupsStats() {
    const groupLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    let totalMatches = 0;
    let totalGoals = 0;
    let completeGroups = 0;

    groupLetters.forEach(letter => {
      if (this.isGroupComplete(letter)) {
        completeGroups++;
      }

      const matches = this.getGroupMatches(letter);
      totalMatches += matches.length;

      matches.forEach(match => {
        totalGoals += (parseInt(match.home_score) || 0) + (parseInt(match.away_score) || 0);
      });
    });

    return {
      totalGroups: 12,
      completeGroups,
      totalMatches,
      totalGoals,
      averageGoalsPerMatch: totalMatches > 0 ? (totalGoals / totalMatches).toFixed(2) : 0,
      progressPercent: completeGroups > 0 ? Math.round((completeGroups / 12) * 100) : 0
    };
  }

  /**
   * Busca un equipo en un grupo
   * @param {string} groupName
   * @param {string|number} teamId
   * @returns {Object|null}
   */
  getTeamInGroup(groupName, teamId) {
    const standings = this.getGroupStandings(groupName);
    if (!standings) return null;

    return standings.standings.find(t => 
      t.teamId === String(teamId) || t.teamId === teamId
    ) || null;
  }

  /**
   * Obtiene próximos partidos de un grupo
   * @param {string} groupName
   * @returns {Array}
   */
  getUpcomingGroupMatches(groupName) {
    const groupMatches = this.getGroupMatches(groupName);
    return groupMatches.filter(m => m.finished === 'FALSE' || m.finished === false);
  }

  /**
   * Obtiene partidos finalizados de un grupo
   * @param {string} groupName
   * @returns {Array}
   */
  getFinishedGroupMatches(groupName) {
    const groupMatches = this.getGroupMatches(groupName);
    return groupMatches.filter(m => m.finished === 'TRUE' || m.finished === true);
  }

  /**
   * Obtiene mano a mano detallado entre dos equipos en un grupo
   * @param {string} groupName
   * @param {string|number} team1Id
   * @param {string|number} team2Id
   * @returns {Object}
   */
  getDetailedHeadToHead(groupName, team1Id, team2Id) {
    const matches = this.getHeadToHead(groupName, team1Id, team2Id);
    
    let team1Wins = 0, team2Wins = 0, draws = 0;
    let team1Goals = 0, team2Goals = 0;

    matches.forEach(match => {
      const isTeam1Home = String(match.home_team_id) === String(team1Id);
      const homeScore = parseInt(match.home_score) || 0;
      const awayScore = parseInt(match.away_score) || 0;

      if (isTeam1Home) {
        team1Goals += homeScore;
        team2Goals += awayScore;
        if (homeScore > awayScore) team1Wins++;
        else if (awayScore > homeScore) team2Wins++;
        else draws++;
      } else {
        team2Goals += homeScore;
        team1Goals += awayScore;
        if (homeScore > awayScore) team2Wins++;
        else if (awayScore > homeScore) team1Wins++;
        else draws++;
      }
    });

    return {
      team1Id,
      team2Id,
      team1Name: this.getTeamInfo(team1Id)?.name_en,
      team2Name: this.getTeamInfo(team2Id)?.name_en,
      team1Wins,
      team2Wins,
      draws,
      team1Goals,
      team2Goals,
      matches
    };
  }
}

export default GroupController;
