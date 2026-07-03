/**
 * API Service - World Cup 2026
 * Wrapper para conectar con la API worldcup26.ir
 * Base URL: https://worldcup26.ir
 */

const API_BASE_URL = 'https://worldcup26.ir';

class APIService {
  /**
   * Realiza una petición GET a la API
   * @param {string} endpoint - El endpoint sin la base URL
   * @returns {Promise<Object>} Los datos de la respuesta
   */
  static async fetchData(endpoint) {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      console.log(`[API] Fetching: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`[API] Success: ${endpoint}`, data);
      return data;
    } catch (error) {
      console.error(`[API Error] ${endpoint}:`, error.message);
      throw error;
    }
  }

  /**
   * Obtiene todos los 104 partidos del torneo
   * @returns {Promise<Array>} Array de partidos
   */
  static async getAllMatches() {
    try {
      const data = await this.fetchData('/get/games');
      return data.games || [];
    } catch (error) {
      console.error('Error fetching all matches:', error);
      return [];
    }
  }

  /**
   * Obtiene un partido específico por ID
   * @param {number|string} matchId - ID del partido (1-104)
   * @returns {Promise<Object>} Datos del partido
   */
  static async getMatchById(matchId) {
    try {
      const data = await this.fetchData(`/get/game/${matchId}`);
      return data.game || null;
    } catch (error) {
      console.error(`Error fetching match ${matchId}:`, error);
      return null;
    }
  }

  /**
   * Obtiene todos los 12 grupos con standings
   * @returns {Promise<Array>} Array de grupos
   */
  static async getAllGroups() {
    try {
      const data = await this.fetchData('/get/groups');
      return data.groups || [];
    } catch (error) {
      console.error('Error fetching all groups:', error);
      return [];
    }
  }

  /**
   * Obtiene un grupo específico por ID
   * @param {string} groupId - ID del grupo (A-L)
   * @returns {Promise<Object>} Datos del grupo
   */
  static async getGroupById(groupId) {
    try {
      const data = await this.fetchData(`/get/group/${groupId}`);
      return data || null;
    } catch (error) {
      console.error(`Error fetching group ${groupId}:`, error);
      return null;
    }
  }

  /**
   * Obtiene un grupo específico por nombre
   * @param {string} groupName - Nombre del grupo (A-L)
   * @returns {Promise<Object>} Datos del grupo
   */
  static async getGroupByName(groupName) {
    try {
      const data = await this.fetchData(`/get/group/?name=${groupName}`);
      return data || null;
    } catch (error) {
      console.error(`Error fetching group by name ${groupName}:`, error);
      return null;
    }
  }

  /**
   * Obtiene todos los 48 equipos calificados
   * @returns {Promise<Array>} Array de equipos
   */
  static async getAllTeams() {
    try {
      const data = await this.fetchData('/get/teams');
      return data.teams || [];
    } catch (error) {
      console.error('Error fetching all teams:', error);
      return [];
    }
  }

  /**
   * Obtiene un equipo específico por ID
   * @param {number|string} teamId - ID del equipo
   * @returns {Promise<Object>} Datos del equipo
   */
  static async getTeamById(teamId) {
    try {
      const data = await this.fetchData(`/get/team/${teamId}`);
      return data || null;
    } catch (error) {
      console.error(`Error fetching team ${teamId}:`, error);
      return null;
    }
  }

  /**
   * Obtiene un equipo específico por nombre
   * @param {string} teamName - Nombre del equipo (en inglés o persa)
   * @returns {Promise<Object>} Datos del equipo
   */
  static async getTeamByName(teamName) {
    try {
      const data = await this.fetchData(`/get/team/?name=${encodeURIComponent(teamName)}`);
      return data || null;
    } catch (error) {
      console.error(`Error fetching team by name ${teamName}:`, error);
      return null;
    }
  }

  /**
   * Obtiene equipos por grupo
   * @param {string} groupName - Letra del grupo (A-L)
   * @returns {Promise<Array>} Array de equipos en el grupo
   */
  static async getTeamsByGroup(groupName) {
    try {
      const data = await this.fetchData(`/get/teams/?group=${groupName}`);
      return data.teams || [];
    } catch (error) {
      console.error(`Error fetching teams by group ${groupName}:`, error);
      return [];
    }
  }

  /**
   * Obtiene todos los 16 estadios anfitriones
   * @returns {Promise<Array>} Array de estadios
   */
  static async getAllStadiums() {
    try {
      const data = await this.fetchData('/get/stadiums');
      return data.stadiums || [];
    } catch (error) {
      console.error('Error fetching all stadiums:', error);
      return [];
    }
  }

  /**
   * Comprueba el estado de salud del servidor API
   * @returns {Promise<Object>} Estado del servidor
   */
  static async getHealthStatus() {
    try {
      const data = await this.fetchData('/health');
      return data;
    } catch (error) {
      console.error('Error fetching health status:', error);
      return null;
    }
  }

  /**
   * Obtiene el próximo partido a jugarse
   * @returns {Promise<Object>} Datos del próximo partido
   */
  static async getNextMatch() {
    try {
      const matches = await this.getAllMatches();
      // Filtrar partidos no iniciados y ordenar por fecha
      const upcoming = matches
        .filter(match => match.finished === 'FALSE' || match.finished === false)
        .sort((a, b) => {
          const dateA = new Date(a.local_date.replace(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+)/, '$3-$1-$2T$4:$5'));
          const dateB = new Date(b.local_date.replace(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+)/, '$3-$1-$2T$4:$5'));
          return dateA - dateB;
        });
      
      return upcoming.length > 0 ? upcoming[0] : null;
    } catch (error) {
      console.error('Error fetching next match:', error);
      return null;
    }
  }

  /**
   * Obtiene los últimos partidos jugados
   * @param {number} limit - Cantidad de partidos a retornar (default: 5)
   * @returns {Promise<Array>} Array de partidos
   */
  static async getRecentMatches(limit = 5) {
    try {
      const matches = await this.getAllMatches();
      // Filtrar partidos finalizados y ordenar por fecha descendente
      const finished = matches
        .filter(match => match.finished === 'TRUE' || match.finished === true)
        .sort((a, b) => {
          const dateA = new Date(a.local_date.replace(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+)/, '$3-$1-$2T$4:$5'));
          const dateB = new Date(b.local_date.replace(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+)/, '$3-$1-$2T$4:$5'));
          return dateB - dateA;
        });
      
      return finished.slice(0, limit);
    } catch (error) {
      console.error('Error fetching recent matches:', error);
      return [];
    }
  }

  /**
   * Obtiene matches de fase de grupos
   * @returns {Promise<Array>} Array de partidos de grupos
   */
  static async getGroupPhaseMatches() {
    try {
      const matches = await this.getAllMatches();
      return matches.filter(match => match.type === 'group' || (match.group && match.group.match(/^[A-L]$/)));
    } catch (error) {
      console.error('Error fetching group phase matches:', error);
      return [];
    }
  }

  /**
   * Obtiene matches de fase knockout
   * @returns {Promise<Array>} Array de partidos knockout
   */
  static async getKnockoutMatches() {
    try {
      const matches = await this.getAllMatches();
      const knockoutTypes = ['r32', 'r16', 'qf', 'sf', 'third', 'final'];
      return matches.filter(match => knockoutTypes.includes(match.type));
    } catch (error) {
      console.error('Error fetching knockout matches:', error);
      return [];
    }
  }

  /**
   * Calcula estadísticas del torneo
   * @returns {Promise<Object>} Estadísticas del torneo
   */
  static async getTournamentStats() {
    try {
      const matches = await this.getAllMatches();
      
      const totalMatches = matches.length;
      const playedMatches = matches.filter(m => m.finished === 'TRUE' || m.finished === true).length;
      const upcomingMatches = totalMatches - playedMatches;
      
      return {
        totalMatches,
        playedMatches,
        upcomingMatches,
        completed: Math.round((playedMatches / totalMatches) * 100)
      };
    } catch (error) {
      console.error('Error fetching tournament stats:', error);
      return {
        totalMatches: 104,
        playedMatches: 0,
        upcomingMatches: 104,
        completed: 0
      };
    }
  }
}

export default APIService;
