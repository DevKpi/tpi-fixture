/**
 * GroupController - Controlador de Grupos
 * Gestiona la lógica de grupos, standings y clasificación de forma dinámica.
 */

import APIService from '../services/apiService.js';
import Tabla from '../models/Table.js';
import Grupo from '../models/Group.js';

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
    return this.teams.filter(t => t.grupo === groupName);
  }

  /**
   * Obtiene standings formateados de un grupo calculados DINÁMICAMENTE desde los partidos
   * @param {string} groupName - Letra del grupo (A-L)
   * @returns {Array} Standings del grupo ordenados
   */
  getGroupStandings(groupName) {
    const groupData = this.getGroup(groupName);
    if (!groupData) return null;

    const groupTeams = this.getTeamsByGroup(groupName);
    const groupMatches = this.getGroupMatches(groupName);

    const grupo = new Grupo(groupName, groupName, groupTeams, groupMatches);
    const standingsList = grupo.CalcularTabla();

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
    return this.matches.filter(m => m.grupo === groupName);
  }

  /**
   * Obtiene el resultado del grupo (cuáles equipos avanzan)
   * @param {string} groupName - Letra del grupo (A-L)
   * @returns {Array} Equipos clasificados (los primeros 2)
   */
  getQualifiedTeams(groupName) {
    const groupTeams = this.getTeamsByGroup(groupName);
    const groupMatches = this.getGroupMatches(groupName);

    const grupo = new Grupo(groupName, groupName, groupTeams, groupMatches);
    return grupo.ObtenerClasificados().clasificados;
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
    const groupMatches = this.getGroupMatches(groupName);
    const grupo = new Grupo(groupName, groupName, [], groupMatches);
    return grupo.EstaCompleto();
  }

  /**
   * Obtiene clasificados y eliminados de un grupo
   * @param {string} groupName
   * @returns {Object}
   */
  getGroupClassification(groupName) {
    const groupTeams = this.getTeamsByGroup(groupName);
    const groupMatches = this.getGroupMatches(groupName);

    const grupo = new Grupo(groupName, groupName, groupTeams, groupMatches);
    const clasificacion = grupo.ObtenerClasificados();
    
    return {
      groupName,
      qualified: clasificacion.clasificados,
      eliminated: clasificacion.eliminados
    };
  }
}

export default GroupController;
