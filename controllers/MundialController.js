/**
 * MundialController - Controlador Principal del Torneo
 * Gestiona toda la lógica relacionada con el Mundial 2026
 */

import APIService from '../services/apiService.js';
import Mundial from '../models/Mundial.js';

class MundialController {
  constructor() {
    this.teams = [];
    this.groups = [];
    this.matches = [];
    this.stadiums = [];
    this.stats = {};
  }

  /**
   * Inicializa el controlador cargando todos los datos
   */
  async init() {
    console.log('[MundialController] Inicializando...');
    try {
      await Promise.all([
        this.loadTeams(),
        this.loadGroups(),
        this.loadMatches(),
        this.loadStadiums()
      ]);
      console.log('[MundialController] Datos cargados correctamente');
      return true;
    } catch (error) {
      console.error('[MundialController] Error al inicializar:', error);
      return false;
    }
  }

  /**
   * Carga todos los equipos
   */
  async loadTeams() {
    try {
      this.teams = await APIService.getAllTeams();
      console.log(`[MundialController] ${this.teams.length} equipos cargados`);
      return this.teams;
    } catch (error) {
      console.error('[MundialController] Error cargando equipos:', error);
      return [];
    }
  }

  /**
   * Carga todos los grupos con standings
   */
  async loadGroups() {
    try {
      this.groups = await APIService.getAllGroups();
      console.log(`[MundialController] ${this.groups.length} grupos cargados`);
      return this.groups;
    } catch (error) {
      console.error('[MundialController] Error cargando grupos:', error);
      return [];
    }
  }

  /**
   * Carga todos los partidos
   */
  async loadMatches() {
    try {
      this.matches = await APIService.getAllMatches();
      console.log(`[MundialController] ${this.matches.length} partidos cargados`);
      return this.matches;
    } catch (error) {
      console.error('[MundialController] Error cargando partidos:', error);
      return [];
    }
  }

  /**
   * Carga todos los estadios
   */
  async loadStadiums() {
    try {
      this.stadiums = await APIService.getAllStadiums();
      console.log(`[MundialController] ${this.stadiums.length} estadios cargados`);
      return this.stadiums;
    } catch (error) {
      console.error('[MundialController] Error cargando estadios:', error);
      return [];
    }
  }

  /**
   * Obtiene un equipo por ID
   * @param {number|string} teamId
   * @returns {Object} Equipo
   */
  getTeamById(teamId) {
    return this.teams.find(t => t.id === String(teamId) || t.id === teamId);
  }

  /**
   * Obtiene equipos por grupo
   * @param {string} groupName - Letra del grupo (A-L)
   * @returns {Array} Array de equipos
   */
  getTeamsByGroup(groupName) {
    return this.teams.filter(t => t.grupo === groupName);
  }

  /**
   * Obtiene un grupo específico
   * @param {string} groupName - Letra del grupo (A-L)
   * @returns {Object} Grupo con standings
   */
  getGroupByName(groupName) {
    return this.groups.find(g => (g.group || g.name) === groupName);
  }

  /**
   * Obtiene todos los partidos de una fase específica
   * @param {string} phase - 'group', 'r32', 'r16', 'qf', 'sf', 'third', 'final'
   * @returns {Array} Partidos de esa fase
   */
  getMatchesByPhase(phase) {
    if (phase === 'group') {
      return this.matches.filter(m => typeof m.EsFaseDeGrupos === 'function' ? m.EsFaseDeGrupos() : false);
    }
    return this.matches.filter(m => m.type === phase);
  }

  /**
   * Obtiene partidos de un grupo específico
   * @param {string} groupName - Letra del grupo (A-L)
   * @returns {Array} Partidos del grupo
   */
  getMatchesByGroup(groupName) {
    return this.matches.filter(m => m.grupo === groupName);
  }

  /**
   * Obtiene el próximo partido a jugarse
   * @returns {Object} Próximo partido
   */
  getNextMatch() {
    const upcoming = this.matches
      .filter(m => m.finished === 'FALSE' || m.finished === false)
      .sort((a, b) => {
        const dateA = typeof a.ObtenerFechaObj === 'function' ? a.ObtenerFechaObj() : new Date();
        const dateB = typeof b.ObtenerFechaObj === 'function' ? b.ObtenerFechaObj() : new Date();
        return dateA - dateB;
      });
    
    return upcoming.length > 0 ? upcoming[0] : null;
  }

  /**
   * Obtiene los últimos partidos jugados
   * @param {number} limit - Cantidad de partidos
   * @returns {Array} Últimos partidos
   */
  getRecentMatches(limit = 5) {
    return this.matches
      .filter(m => m.finished === 'TRUE' || m.finished === true)
      .sort((a, b) => {
        const dateA = typeof a.ObtenerFechaObj === 'function' ? a.ObtenerFechaObj() : new Date();
        const dateB = typeof b.ObtenerFechaObj === 'function' ? b.ObtenerFechaObj() : new Date();
        return dateB - dateA;
      })
      .slice(0, limit);
  }

  /**
   * Obtiene un estadio por ID
   * @param {number|string} stadiumId
   * @returns {Object} Estadio
   */
  getStadiumById(stadiumId) {
    return this.stadiums.find(s => s.id === String(stadiumId) || s.id === stadiumId);
  }

  /**
   * Obtiene estadios por país
   * @param {string} country - 'United States', 'Mexico', 'Canada'
   * @returns {Array} Estadios del país
   */
  getStadiumsByCountry(country) {
    return this.stadiums.filter(s => s.country_en === country || s.country_fa === country);
  }

  /**
   * Calcula estadísticas del torneo
   * @returns {Object} Estadísticas
   */
  calculateStats() {
    // Para no sobrecargar el controlador, instanciamos el modelo y le delegamos el cálculo
    const mundial = new Mundial('World Cup 2026', 2026, [], this.groups, [], this.teams);
    this.stats = mundial.CalcularEstadisticasGlobales(this.matches, this.teams, this.groups, this.stadiums);
    return this.stats;
  }

  /**
   * Obtiene goleadores del torneo (basado en datos disponibles)
   * @returns {Array} Top scorers
   */
  getTopScorers() {
    const scorers = {};

    this.matches.forEach(match => {
      if (match.home_scorers && match.home_scorers !== 'null' && match.home_scorers !== 'NULL') {
        const goals = match.home_scorers.split(',').map(g => g.trim());
        goals.forEach(goal => {
          scorers[goal] = (scorers[goal] || 0) + 1;
        });
      }

      if (match.away_scorers && match.away_scorers !== 'null' && match.away_scorers !== 'NULL') {
        const goals = match.away_scorers.split(',').map(g => g.trim());
        goals.forEach(goal => {
          scorers[goal] = (scorers[goal] || 0) + 1;
        });
      }
    });

    return Object.entries(scorers)
      .map(([player, goals]) => ({ player, goals }))
      .sort((a, b) => b.goals - a.goals)
      .slice(0, 10);
  }

  /**
   * Obtiene partidos para una vista de fixture completo
   * @param {string} filter - 'all', 'group', 'knockout'
   * @returns {Object} Matches organizados
   */
  getFixture(filter = 'all') {
    const groupMatches = this.getMatchesByPhase('group');
    const knockoutMatches = this.getMatchesByPhase('r32');

    if (filter === 'group') return groupMatches;
    if (filter === 'knockout') return knockoutMatches;

    return {
      groupStage: groupMatches,
      knockoutStage: knockoutMatches
    };
  }

  /**
   * Obtiene datos para generar el árbol de eliminación
   * @returns {Object} Matches de knockout organizados por fase
   */
  getKnockoutBracket() {
    const phases = {
      r32: this.getMatchesByPhase('r32'),
      r16: this.getMatchesByPhase('r16'),
      qf: this.getMatchesByPhase('qf'),
      sf: this.getMatchesByPhase('sf'),
      third: this.getMatchesByPhase('third'),
      final: this.getMatchesByPhase('final')
    };

    return phases;
  }

  /**
   * Obtiene partidos de un equipo
   * @param {string|number} teamId
   * @returns {Array} Partidos del equipo
   */
  getTeamMatches(teamId) {
    return this.matches.filter(m => 
      m.home_team_id === String(teamId) || m.home_team_id === teamId ||
      m.away_team_id === String(teamId) || m.away_team_id === teamId
    );
  }

  /**
   * Obtiene resultados de un equipo
   * @param {string|number} teamId
   * @returns {Array} Resultados del equipo
   */
  getTeamResults(teamId) {
    const teamMatches = this.getTeamMatches(teamId);
    
    return teamMatches.map(match => ({
      id: match.id,
      opponent: 
        String(match.home_team_id) === String(teamId) 
          ? match.away_team_name_en 
          : match.home_team_name_en,
      homeScore: parseInt(match.home_score) || 0,
      awayScore: parseInt(match.away_score) || 0,
      isHome: String(match.home_team_id) === String(teamId),
      finished: match.finished === 'TRUE' || match.finished === true,
      group: match.grupo,
      date: match.local_date
    }));
  }
}

export default MundialController;
