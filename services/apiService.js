/**
 * API Service - World Cup 2026
 * Wrapper para conectar con la API worldcup26.ir
 * Soporta persistencia local en localStorage para modificaciones de resultados.
 */
import Partido from '../models/Match.js';
import Seleccion from '../models/CountryTeams.js';
import Jugador from '../models/Player.js';
import { parseApiDate } from '../utils/dateUtils.mjs';

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
      console.log(`[API] Success: ${endpoint}`);
      return data;
    } catch (error) {
      console.error(`[API Error] ${endpoint}:`, error.message);
      throw error;
    }
  }

  /**
   * Obtiene la fecha exacta del partido ajustada a la zona horaria del estadio
   * @param {Object} match - Datos del partido
   * @returns {Date} Objeto Date absoluto
   */
  static getMatchDate(match) {
    if (!match?.local_date) return null;

    const regionMap = {
      '14': 'Western', '8': 'Eastern', '13': 'Western', '15': 'Western',
      '3': 'Central', '1': 'Central', '2': 'Central', '5': 'Central',
      '16': 'Western', '7': 'Eastern', '9': 'Eastern', '6': 'Central',
      '10': 'Eastern', '4': 'Central', '11': 'Eastern', '12': 'Eastern'
    };
    const timezoneOffsets = {
      'Western': '-07:00',
      'Central': '-05:00',
      'Eastern': '-04:00'
    };
    const stadiumId = match.stadium_id || match.estadio;
    const region = regionMap[stadiumId] || 'Eastern';
    const offset = timezoneOffsets[region];
    const value = String(match.local_date).trim();

    const isoMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})$/);
    if (isoMatch) {
      const [, month, day, year, hour, minute] = isoMatch;
      const isoString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute}${offset}`;
      return new Date(isoString);
    }

    return parseApiDate(value);
  }

  static async getAllMatches() {
    try {
      let games = [];
      const localMatchesStr = localStorage.getItem('worldcup2026_matches');
      if (localMatchesStr) {
        games = JSON.parse(localMatchesStr);
      } else {
        const data = await this.fetchData('/get/games');
        games = data.games || [];
        if (games.length > 0) {
          localStorage.setItem('worldcup2026_matches', JSON.stringify(games));
        }
      }
      
      // Normalizador de nombres inconsistentes de la API
      const normalizeScorers = (scorers) => {
        if (!scorers || typeof scorers !== 'string') return scorers;
        return scorers.replace(/Kylian Mbappé/g, 'K. Mbappé');
      };

      // Mapear los partidos a instancias de la clase del modelo Partido
      return games.map(m => {
        m.home_scorers = normalizeScorers(m.home_scorers);
        m.away_scorers = normalizeScorers(m.away_scorers);
        m.home_assists = normalizeScorers(m.home_assists);
        m.away_assists = normalizeScorers(m.away_assists);
        
        return new Partido(
          m.id,
          m.home_team_name_en || m.home_team_label,
          m.away_team_name_en || m.away_team_label,
          m.local_date,
          m.stadium_id,
          '', // arbitro
          m.home_score,
          m.away_score,
          [], // goles list
          (m.finished === 'TRUE' || m.finished === true || m.finished === 'true') ? 'FINALIZADO' : 'PENDIENTE',
          m.type,
          m.group,
          m
        );
      });
    } catch (error) {
      console.error('Error fetching all matches:', error);
      const localMatchesStr = localStorage.getItem('worldcup2026_matches');
      if (localMatchesStr) {
        const games = JSON.parse(localMatchesStr);
        return games.map(m => new Partido(
          m.id,
          m.home_team_name_en || m.home_team_label,
          m.away_team_name_en || m.away_team_label,
          m.local_date,
          m.stadium_id,
          '', // arbitro
          m.home_score,
          m.away_score,
          [],
          (m.finished === 'TRUE' || m.finished === true || m.finished === 'true') ? 'FINALIZADO' : 'PENDIENTE',
          m.type,
          m.group,
          m
        ));
      }
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
      const matches = await this.getAllMatches();
      return matches.find(m => String(m.id) === String(matchId)) || null;
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

  static async getAllTeams() {
    try {
      let teamsRaw = [];
      const localTeamsStr = localStorage.getItem('worldcup2026_teams');
      if (localTeamsStr) {
        teamsRaw = JSON.parse(localTeamsStr);
      } else {
        const isView = window.location.pathname.includes('/views/');
        const path = isView ? '../data/teams.json' : './data/teams.json';
        
        const response = await fetch(`${path}?v=${new Date().getTime()}`);
        teamsRaw = await response.json();

        if (teamsRaw.length > 0) {
          localStorage.setItem('worldcup2026_teams', JSON.stringify(teamsRaw));
        }
      }

      // Mapear a instancias de las clases Seleccion y Jugador del modelo
      return teamsRaw.map(t => {
        const jugadores = (t.plantilla || t.jugadores || []).map(p => new Jugador(
          p.id,
          p.nombreCompleto || p.name,
          p.numero,
          p.posicion,
          p.seleccion,
          p.goles,
          p.asistencias,
          p.amarillas,
          p.rojas,
          p
        ));
        
        return new Seleccion(
          t.id,
          t.nombre || t.name_en,
          t.bandera || t.flag,
          t.entrenador,
          jugadores,
          t.grupo || t.groups,
          t
        );
      });
    } catch (error) {
      console.error('Error fetching teams from local JSON, falling back to API:', error);
      // Fallback a API
      try {
        const data = await this.fetchData('/get/teams');
        const teamsRaw = data.teams || [];
        if (teamsRaw.length > 0) {
          localStorage.setItem('worldcup2026_teams', JSON.stringify(teamsRaw));
        }
        return teamsRaw.map(t => new Seleccion(
          t.id,
          t.name_en,
          t.flag,
          '', // Sin entrenador
          [], // Sin plantilla
          t.groups,
          t
        ));
      } catch (apiError) {
        const localTeamsStr = localStorage.getItem('worldcup2026_teams');
        if (localTeamsStr) {
          const teamsRaw = JSON.parse(localTeamsStr);
          return teamsRaw.map(t => {
            const jugadores = (t.plantilla || t.jugadores || []).map(p => new Jugador(
              p.id,
              p.nombreCompleto || p.name,
              p.numero,
              p.posicion,
              p.seleccion,
              p.goles,
              p.asistencias,
              p.amarillas,
              p.rojas,
              p
            ));
            return new Seleccion(
              t.id,
              t.nombre || t.name_en,
              t.bandera || t.flag,
              t.entrenador,
              jugadores,
              t.grupo || t.groups,
              t
            );
          });
        }
        return [];
      }
    }
  }

  /**
   * Obtiene un equipo específico por ID
   * @param {number|string} teamId - ID del equipo
   * @returns {Promise<Object>} Datos del equipo
   */
  static async getTeamById(teamId) {
    try {
      const teams = await this.getAllTeams();
      return teams.find(t => String(t.id) === String(teamId)) || null;
    } catch (error) {
      console.error(`Error fetching team ${teamId}:`, error);
      return null;
    }
  }

  /**
   * Obtiene un equipo específico por nombre
   * @param {string} teamName - Nombre del equipo
   * @returns {Promise<Object>} Datos del equipo
   */
  static async getTeamByName(teamName) {
    try {
      const teams = await this.getAllTeams();
      return teams.find(t => t.name_en.toLowerCase() === teamName.toLowerCase()) || null;
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
      const teams = await this.getAllTeams();
      return teams.filter(t => t.grupo === groupName);
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
      const now = new Date();
      const upcoming = matches
        .filter(match => {
          const isPending = match.finished === 'FALSE' || match.finished === false || match.finished === 'false';
          if (!isPending) return false;

          const matchDate = APIService.getMatchDate(match);
          return !!matchDate && matchDate.getTime() > now.getTime();
        })
        .sort((a, b) => {
          const dateA = APIService.getMatchDate(a);
          const dateB = APIService.getMatchDate(b);
          return (dateA?.getTime() ?? Number.POSITIVE_INFINITY) - (dateB?.getTime() ?? Number.POSITIVE_INFINITY);
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
      const finished = matches
        .filter(match => match.finished === 'TRUE' || match.finished === true || match.finished === 'true')
        .sort((a, b) => {
          const dateA = APIService.getMatchDate(a);
          const dateB = APIService.getMatchDate(b);
          return (dateB?.getTime() ?? Number.NEGATIVE_INFINITY) - (dateA?.getTime() ?? Number.NEGATIVE_INFINITY);
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
      return matches.filter(match => match.type === 'group' || (match.grupo && match.grupo.match(/^[A-L]$/)));
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
      const playedMatches = matches.filter(m => m.finished === 'TRUE' || m.finished === true || m.finished === 'true').length;
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

  /**
   * Resetea el torneo a los datos originales de la API
   */
  static resetTournament() {
    localStorage.removeItem('worldcup2026_matches');
    localStorage.removeItem('worldcup2026_teams');
    console.log('[API] Torneo reseteado correctamente');
    window.location.reload();
  }

  /**
   * Limpia todos los resultados manuales (deja los partidos en 0)
   */
  static async clearAllResults() {
    const matches = await this.getAllMatches();
    matches.forEach(m => {
      m.home_score = null;
      m.away_score = null;
      m.finished = 'FALSE';
      m.home_scorers = 'null';
      m.away_scorers = 'null';
      m.home_assists = 'null';
      m.away_assists = 'null';
      m.winner_decided = '';
      
      if (m.type !== 'group') {
        m.home_team_id = '';
        m.away_team_id = '';
        m.home_team_name_en = '';
        m.away_team_name_en = '';
        m.home_team_name_fa = '';
        m.away_team_name_fa = '';
      }
    });
    localStorage.setItem('worldcup2026_matches', JSON.stringify(matches));
    console.log('[API] Todos los resultados han sido limpiados localmente.');
    window.location.reload();
  }

  /**
   * Actualiza el resultado de un partido y propaga el ganador
   * @param {string|number} matchId 
   * @param {Object} updatedFields 
   */
  static async updateMatchResult(matchId, updatedFields) {
    const matches = await this.getAllMatches();
    const index = matches.findIndex(m => String(m.id) === String(matchId));
    if (index === -1) return null;

    // Actualizar partido
    matches[index] = {
      ...matches[index],
      ...updatedFields
    };

    // Propagar ganador si es un partido finalizado
    const isFinished = matches[index].finished === 'TRUE' || matches[index].finished === true || matches[index].finished === 'true';
    if (matches[index].type !== 'group' && isFinished) {
      await this.propagateWinner(matches[index], matches);
    } else if (matches[index].type === 'group' && isFinished) {
      const groupMatches = matches.filter(m => m.type === 'group');
      const allGroupFinished = groupMatches.every(m => m.finished === 'TRUE' || m.finished === true || m.finished === 'true');
      if (allGroupFinished) {
        await this.generateR32Bracket(matches);
      }
    }

    localStorage.setItem('worldcup2026_matches', JSON.stringify(matches));
    return matches[index];
  }

  /**
   * Genera los cruces de 16avos de final (R32) dinámicamente según el formato de la FIFA.
   */
  static async generateR32Bracket(allMatches) {
    const GroupController = (await import('../controllers/GroupController.js')).default;
    const groupCtrl = new GroupController();
    await groupCtrl.init();

    const groupLetters = ['A','B','C','D','E','F','G','H','I','J','K','L'];
    const winners = {};
    const runners = {};
    const thirds = [];

    groupLetters.forEach(letter => {
      const standings = groupCtrl.getGroupStandings(letter);
      if (standings && standings.standings.length >= 3) {
        winners[letter] = standings.standings[0];
        runners[letter] = standings.standings[1];
        
        thirds.push({ group: letter, team: standings.standings[2] });
      }
    });

    if (thirds.length < 12) return; // No están todos los grupos completados

    // Ordenar a los terceros
    thirds.sort((a, b) => {
      const ta = a.team;
      const tb = b.team;
      if (tb.points !== ta.points) return tb.points - ta.points;
      if (tb.goalDifference !== ta.goalDifference) return tb.goalDifference - ta.goalDifference;
      if (tb.goalsFor !== ta.goalsFor) return tb.goalsFor - ta.goalsFor;
      return ta.teamName.localeCompare(tb.teamName);
    });

    const top8Thirds = thirds.slice(0, 8);
    const thirdGroups = top8Thirds.map(t => t.group).sort();

    // Mapeo oficial de enfrentamientos para los terceros
    const thirdSlots = [
      { matchId: '74', winnerGroup: 'E', validThirds: ['A','B','C','D','F'] },
      { matchId: '77', winnerGroup: 'I', validThirds: ['C','D','F','G','H'] },
      { matchId: '79', winnerGroup: 'A', validThirds: ['C','E','F','H','I'] },
      { matchId: '80', winnerGroup: 'L', validThirds: ['E','H','I','J','K'] },
      { matchId: '81', winnerGroup: 'D', validThirds: ['B','E','F','I','J'] },
      { matchId: '82', winnerGroup: 'G', validThirds: ['A','E','H','I','J'] },
      { matchId: '85', winnerGroup: 'B', validThirds: ['E','F','G','I','J'] },
      { matchId: '87', winnerGroup: 'K', validThirds: ['D','E','I','J','L'] }
    ];

    function findAssignment(remainingGroups, slotIndex, currentAssignment) {
      if (slotIndex === 8) return currentAssignment;
      const slot = thirdSlots[slotIndex];
      for (let i = 0; i < remainingGroups.length; i++) {
        const group = remainingGroups[i];
        if (slot.validThirds.includes(group) && group !== slot.winnerGroup) {
          const newRemaining = [...remainingGroups];
          newRemaining.splice(i, 1);
          const res = findAssignment(newRemaining, slotIndex + 1, { ...currentAssignment, [slot.matchId]: group });
          if (res) return res;
        }
      }
      return null;
    }

    const assignment = findAssignment(thirdGroups, 0, {}) || {};

    const setTeam = (matchId, slot, teamData) => {
      const idx = allMatches.findIndex(m => String(m.id) === String(matchId));
      if (idx !== -1 && teamData) {
        if (slot === 'home') {
          allMatches[idx].home_team_id = teamData.teamId;
          allMatches[idx].home_team_name_en = teamData.teamName;
        } else {
          allMatches[idx].away_team_id = teamData.teamId;
          allMatches[idx].away_team_name_en = teamData.teamName;
        }
      }
    };

    thirdSlots.forEach(slot => {
      setTeam(slot.matchId, 'home', winners[slot.winnerGroup]);
      const thirdGroupAssigned = assignment[slot.matchId];
      if (thirdGroupAssigned) {
        const thirdTeamData = top8Thirds.find(t => t.group === thirdGroupAssigned).team;
        setTeam(slot.matchId, 'away', thirdTeamData);
      }
    });

    setTeam('73', 'home', runners['A']); setTeam('73', 'away', runners['B']);
    setTeam('75', 'home', winners['F']); setTeam('75', 'away', runners['C']);
    setTeam('76', 'home', winners['C']); setTeam('76', 'away', runners['F']);
    setTeam('78', 'home', runners['E']); setTeam('78', 'away', runners['I']);
    setTeam('83', 'home', runners['K']); setTeam('83', 'away', runners['L']);
    setTeam('84', 'home', winners['H']); setTeam('84', 'away', runners['J']);
    setTeam('86', 'home', winners['J']); setTeam('86', 'away', runners['H']);
    setTeam('88', 'home', runners['D']); setTeam('88', 'away', runners['G']);
  }

  /**
   * Propaga el ganador del partido al siguiente casillero del fixture
   */
  static async propagateWinner(match, allMatches) {
    const propagationMap = {
      // r32 -> r16
      '73': { nextMatchId: '90', slot: 'home' },
      '75': { nextMatchId: '90', slot: 'away' },
      '74': { nextMatchId: '89', slot: 'home' },
      '77': { nextMatchId: '89', slot: 'away' },
      '83': { nextMatchId: '93', slot: 'home' },
      '84': { nextMatchId: '93', slot: 'away' },
      '81': { nextMatchId: '94', slot: 'home' },
      '82': { nextMatchId: '94', slot: 'away' },
      '76': { nextMatchId: '91', slot: 'home' },
      '78': { nextMatchId: '91', slot: 'away' },
      '79': { nextMatchId: '92', slot: 'home' },
      '80': { nextMatchId: '92', slot: 'away' },
      '85': { nextMatchId: '96', slot: 'home' },
      '87': { nextMatchId: '96', slot: 'away' },
      '86': { nextMatchId: '95', slot: 'home' },
      '88': { nextMatchId: '95', slot: 'away' },

      // r16 -> qf
      '89': { nextMatchId: '97', slot: 'home' },
      '90': { nextMatchId: '97', slot: 'away' },
      '93': { nextMatchId: '98', slot: 'home' },
      '94': { nextMatchId: '98', slot: 'away' },
      '91': { nextMatchId: '99', slot: 'home' },
      '92': { nextMatchId: '99', slot: 'away' },
      '95': { nextMatchId: '100', slot: 'home' },
      '96': { nextMatchId: '100', slot: 'away' },

      // qf -> sf
      '97': { nextMatchId: '101', slot: 'home' },
      '98': { nextMatchId: '101', slot: 'away' },
      '99': { nextMatchId: '102', slot: 'home' },
      '100': { nextMatchId: '102', slot: 'away' },

      // sf -> final / tercer lugar
      '101': { nextMatchId: '104', slot: 'home', loserMatchId: '103', loserSlot: 'home' },
      '102': { nextMatchId: '104', slot: 'away', loserMatchId: '103', loserSlot: 'away' }
    };

    const config = propagationMap[String(match.id)];
    if (!config) return;

    // Determinar ganador y perdedor
    const homeScore = parseInt(match.home_score) || 0;
    const awayScore = parseInt(match.away_score) || 0;
    
    let winnerId = '';
    let winnerName = '';
    let winnerNameFa = '';
    
    let loserId = '';
    let loserName = '';
    let loserNameFa = '';

    if (homeScore > awayScore) {
      winnerId = match.home_team_id;
      winnerName = match.home_team_name_en;
      winnerNameFa = match.home_team_name_fa;
      
      loserId = match.away_team_id;
      loserName = match.away_team_name_en;
      loserNameFa = match.away_team_name_fa;
    } else if (awayScore > homeScore) {
      winnerId = match.away_team_id;
      winnerName = match.away_team_name_en;
      winnerNameFa = match.away_team_name_fa;
      
      loserId = match.home_team_id;
      loserName = match.home_team_name_en;
      loserNameFa = match.home_team_name_fa;
    } else {
      // Es empate, pero debe definirse un ganador (ej. penales)
      // Si el usuario especificó ganador en updatedFields, se usará,
      // sino elegimos por defecto el equipo local para evitar bloqueos
      const selectedWinner = match.winner_decided; 
      if (selectedWinner === 'away' || selectedWinner === match.away_team_id) {
        winnerId = match.away_team_id;
        winnerName = match.away_team_name_en;
        winnerNameFa = match.away_team_name_fa;
        loserId = match.home_team_id;
        loserName = match.home_team_name_en;
        loserNameFa = match.home_team_name_fa;
      } else {
        winnerId = match.home_team_id;
        winnerName = match.home_team_name_en;
        winnerNameFa = match.home_team_name_fa;
        loserId = match.away_team_id;
        loserName = match.away_team_name_en;
        loserNameFa = match.away_team_name_fa;
      }
    }

    // Actualizar partido del ganador
    const nextIndex = allMatches.findIndex(m => String(m.id) === String(config.nextMatchId));
    if (nextIndex !== -1) {
      if (config.slot === 'home') {
        allMatches[nextIndex].home_team_id = winnerId;
        allMatches[nextIndex].home_team_name_en = winnerName;
        allMatches[nextIndex].home_team_name_fa = winnerNameFa;
        allMatches[nextIndex].home_team_label = winnerName;
      } else {
        allMatches[nextIndex].away_team_id = winnerId;
        allMatches[nextIndex].away_team_name_en = winnerName;
        allMatches[nextIndex].away_team_name_fa = winnerNameFa;
        allMatches[nextIndex].away_team_label = winnerName;
      }
    }

    // Actualizar partido del perdedor (si aplica, como Tercer Puesto)
    if (config.loserMatchId) {
      const loserIndex = allMatches.findIndex(m => String(m.id) === String(config.loserMatchId));
      if (loserIndex !== -1) {
        if (config.loserSlot === 'home') {
          allMatches[loserIndex].home_team_id = loserId;
          allMatches[loserIndex].home_team_name_en = loserName;
          allMatches[loserIndex].home_team_name_fa = loserNameFa;
          allMatches[loserIndex].home_team_label = loserName;
        } else {
          allMatches[loserIndex].away_team_id = loserId;
          allMatches[loserIndex].away_team_name_en = loserName;
          allMatches[loserIndex].away_team_name_fa = loserNameFa;
          allMatches[loserIndex].away_team_label = loserName;
        }
      }
    }
  }
}

export default APIService;
