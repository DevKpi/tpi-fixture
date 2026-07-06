/**
 * CleanSheetController - Controlador de Vallas Invictas
 * Gestiona el ranking de arqueros con vallas invictas (arco a cero).
 */

import APIService from '../services/apiService.js';

class CleanSheetController {
  constructor() {
    this.matches = [];
    this.cleanSheets = [];
  }

  /**
   * Inicializa el controlador
   */
  async init() {
    console.log('[CleanSheetController] Inicializando...');
    try {
      this.matches = await APIService.getAllMatches();
      this.calculateStats();
      return true;
    } catch (error) {
      console.error('[CleanSheetController] Error al inicializar:', error);
      return false;
    }
  }

  /**
   * Calcula las vallas invictas de los arqueros
   */
  calculateStats() {
    const sheets = {}; // Conteo por equipo: sheets[teamId] = sheetsCount

    this.matches.forEach(match => {
      const finished = match.finished === 'TRUE' || match.finished === true || match.finished === 'true';
      if (!finished) return;

      const homeId = String(match.home_team_id);
      const awayId = String(match.away_team_id);
      
      const homeScore = parseInt(match.home_score) || 0;
      const awayScore = parseInt(match.away_score) || 0;

      // 1. Si el local anotó 0 goles, el visitante mantuvo su valla invicta
      if (homeScore === 0 && awayId && awayId !== '0') {
        sheets[awayId] = (sheets[awayId] || 0) + 1;
      }

      // 2. Si el visitante anotó 0 goles, el local mantuvo su valla invicta
      if (awayScore === 0 && homeId && homeId !== '0') {
        sheets[homeId] = (sheets[homeId] || 0) + 1;
      }
    });

    // Mapear los resultados a nombres de arqueros
    this.cleanSheets = Object.entries(sheets)
      .map(([teamId, count]) => {
        const teamName = this.getTeamName(teamId);
        const goalkeeper = this.getGoalkeeperName(teamName);
        return {
          teamId,
          teamName,
          goalkeeper,
          cleanSheets: count
        };
      })
      .sort((a, b) => b.cleanSheets - a.cleanSheets);

    console.log(`[CleanSheetController] ${this.cleanSheets.length} vallas invictas calculadas`);
  }

  /**
   * Retorna el nombre de la selección
   */
  getTeamName(teamId) {
    // Como el controlador inicializa y tiene la lista de matches, podemos extraer el nombre del equipo
    const match = this.matches.find(m => String(m.home_team_id) === String(teamId) || String(m.away_team_id) === String(teamId));
    if (match) {
      if (String(match.home_team_id) === String(teamId)) {
        return match.home_team_name_en;
      } else {
        return match.away_team_name_en;
      }
    }
    return `Selección #${teamId}`;
  }

  /**
   * Mapea el equipo al nombre de su arquero titular real
   */
  getGoalkeeperName(teamName) {
    const goalies = {
      'Argentina': 'E. Martínez',
      'Mexico': 'L. Malagón',
      'Germany': 'M. ter Stegen',
      'Brazil': 'Alisson',
      'France': 'M. Maignan',
      'Spain': 'Unai Simón',
      'England': 'J. Pickford',
      'United States': 'M. Turner',
      'Canada': 'M. Crépeau',
      'Netherlands': 'B. Verbruggen',
      'Morocco': 'Y. Bounou',
      'Portugal': 'Diogo Costa',
      'Belgium': 'K. Casteels',
      'Uruguay': 'S. Rochet',
      'Colombia': 'C. Vargas',
      'Italy': 'G. Donnarumma',
      'Croatia': 'D. Livaković',
      'South Africa': 'R. Williams',
      'Japan': 'Z. Suzuki',
      'Ecuador': 'A. Domínguez',
      'Switzerland': 'Y. Sommer',
      'Paraguay': 'R. Fernández'
    };

    return goalies[teamName] || `Golero de ${teamName}`;
  }

  /**
   * Obtiene las vallas invictas ordenadas
   * @param {number} limit
   * @returns {Array}
   */
  getTopCleanSheets(limit = 10) {
    return this.cleanSheets.slice(0, limit);
  }
}

export default CleanSheetController;
