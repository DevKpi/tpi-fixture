/**
 * AssistController - Controlador de Asistidores
 * Gestiona el ranking de máximos asistidores del torneo.
 */

import APIService from '../services/apiService.js';

class AssistController {
  constructor() {
    this.matches = [];
    this.topAssists = [];
  }

  /**
   * Inicializa el controlador
   */
  async init() {
    console.log('[AssistController] Inicializando...');
    try {
      this.matches = await APIService.getAllMatches();
      this.calculateStats();
      return true;
    } catch (error) {
      console.error('[AssistController] Error al inicializar:', error);
      return false;
    }
  }

  /**
   * Calcula las estadísticas de asistencias
   */
  calculateStats() {
    const assists = {};

    this.matches.forEach(match => {
      const finished = match.finished === 'TRUE' || match.finished === true || match.finished === 'true';
      if (!finished) return;

      // 1. Asistencias locales ingresadas por el usuario o mockeadas
      if (match.home_assists && match.home_assists !== 'null' && match.home_assists !== 'NULL' && match.home_assists !== '') {
        const cleanedStr = match.home_assists.replace(/[{}"“”]/g, '');
        const playerAssists = cleanedStr.split(',').map(a => a.trim());
        playerAssists.forEach(player => {
          if (player) {
            assists[player] = (assists[player] || 0) + 1;
          }
        });
      } else {
        // Mockear algunas asistencias para los partidos ya finalizados por defecto en la API
        // para que la tabla no se vea vacía al iniciar.
        // Si hay goles, asignamos una asistencia simulada al 60% de los goles.
        if (match.home_scorers && match.home_scorers !== 'null' && match.home_scorers !== '') {
          const cleanedStr = match.home_scorers.replace(/[{}"“”]/g, '');
          const goals = cleanedStr.split(',').map(g => g.trim());
          goals.forEach((goal, idx) => {
            // Generar asistencia solo para el primer gol de cada partido si no tiene datos cargados
            if (idx === 0) {
              const teamName = match.home_team_name_en;
              const mockAssister = this.getMockPlayer(teamName, goal);
              assists[mockAssister] = (assists[mockAssister] || 0) + 1;
            }
          });
        }
      }

      // 2. Asistencias visitantes
      if (match.away_assists && match.away_assists !== 'null' && match.away_assists !== 'NULL' && match.away_assists !== '') {
        const cleanedStr = match.away_assists.replace(/[{}"“”]/g, '');
        const playerAssists = cleanedStr.split(',').map(a => a.trim());
        playerAssists.forEach(player => {
          if (player) {
            assists[player] = (assists[player] || 0) + 1;
          }
        });
      } else {
        if (match.away_scorers && match.away_scorers !== 'null' && match.away_scorers !== '') {
          const cleanedStr = match.away_scorers.replace(/[{}"“”]/g, '');
          const goals = cleanedStr.split(',').map(g => g.trim());
          goals.forEach((goal, idx) => {
            if (idx === 0) {
              const teamName = match.away_team_name_en;
              const mockAssister = this.getMockPlayer(teamName, goal);
              assists[mockAssister] = (assists[mockAssister] || 0) + 1;
            }
          });
        }
      }
    });

    this.topAssists = Object.entries(assists)
      .map(([player, assistsCount]) => ({ player, assists: assistsCount }))
      .sort((a, b) => b.assists - a.assists);

    console.log(`[AssistController] Top ${Math.min(10, this.topAssists.length)} asistidores calculados`);
  }

  /**
   * Retorna un jugador simulado para asistencias de partidos pre-cargados
   */
  getMockPlayer(teamName, scorerName) {
    // Evitar que el asistidor sea el mismo que hizo el gol
    const scorerClean = scorerName.replace(/\s+\d+('|\+)?\d*'?$/, '').trim();
    
    const mocks = {
      'Mexico': ['H. Martín', 'U. Antuna', 'O. Pineda', 'C. Rodríguez'],
      'South Africa': ['T. Zwane', 'P. Tau', 'T. Morena'],
      'Canada': ['A. Davies', 'J. David', 'T. Buchanan'],
      'Germany': ['F. Wirtz', 'J. Musiala', 'T. Kroos', 'I. Gündogan'],
      'Paraguay': ['M. Almirón', 'J. Enciso', 'R. Sosa'],
      'Netherlands': ['C. Gakpo', 'X. Simons', 'T. Reijnders'],
      'Morocco': ['H. Ziyech', 'A. Ounahi', 'A. Hakimi'],
      'Brazil': ['Neymar Jr', 'Rodrygo', 'Raphinha', 'Bruno Guimarães'],
      'Argentina': ['L. Messi', 'A. Di María', 'R. De Paul', 'E. Fernández'],
      'France': ['K. Mbappé', 'A. Griezmann', 'O. Dembélé'],
      'Spain': ['Pedri', 'L. Yamal', 'N. Williams', 'Dani Olmo'],
      'England': ['J. Bellingham', 'P. Foden', 'B. Saka', 'D. Rice'],
      'United States': ['C. Pulisic', 'W. McKennie', 'T. Weah'],
      'Belgium': ['K. De Bruyne', 'J. Doku', 'L. Trossard'],
      'Portugal': ['B. Silva', 'B. Fernandes', 'R. Leão']
    };

    const teamMocks = mocks[teamName] || ['A. Assister', 'J. Playmaker', 'M. Passer'];
    const filtered = teamMocks.filter(name => name !== scorerClean);
    
    // Devolver uno estable basado en el hash del partido
    const index = Math.abs(teamName.charCodeAt(0) + scorerName.charCodeAt(0)) % (filtered.length || 1);
    return filtered[index] || teamMocks[0];
  }

  /**
   * Obtiene la lista ordenada de asistidores
   * @param {number} limit
   * @returns {Array}
   */
  getTopAssists(limit = 10) {
    return this.topAssists.slice(0, limit);
  }
}

export default AssistController;
