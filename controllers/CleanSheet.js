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
  async calculateStats() {
    const sheets = {}; // Conteo por equipo: sheets[teamId] = sheetsCount

    this.matches.forEach(match => {
      // Usar modelo Partido si están mapeados, o instanciar temporalmente si no
      if (typeof match.ObtuvoVallaInvicta === 'function') {
        const homeId = String(match.home_team_id);
        const awayId = String(match.away_team_id);
        
        if (match.ObtuvoVallaInvicta(homeId)) {
          sheets[homeId] = (sheets[homeId] || 0) + 1;
        }
        if (match.ObtuvoVallaInvicta(awayId)) {
          sheets[awayId] = (sheets[awayId] || 0) + 1;
        }
      }
    });

    const teams = await APIService.getAllTeams();

    // Mapear los resultados a nombres de arqueros usando el modelo Seleccion
    this.cleanSheets = Object.entries(sheets)
      .map(([teamId, count]) => {
        const teamInfo = teams.find(t => String(t.id) === String(teamId));
        const teamName = teamInfo ? (teamInfo.name_en || teamInfo.nombre) : `Selección #${teamId}`;
        const goalkeeper = teamInfo && typeof teamInfo.ObtenerArqueroTitular === 'function' 
          ? teamInfo.ObtenerArqueroTitular() 
          : `Golero de ${teamName}`;
          
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
   * Retorna el nombre de la selección (obsoleto, delegado al mapeo)
   */
  getTeamName(teamId) {
    return `Selección #${teamId}`;
  }

  /**
   * Mapea el equipo al nombre de su arquero titular real (obsoleto, delegado a CountryTeams.js)
   */
  getGoalkeeperName(teamName) {
    return `Golero de ${teamName}`;
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
