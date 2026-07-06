/**
 * Main Application Logic - World Cup 2026 Fixture
 * Maneja la lógica principal de la aplicación
 */

import APIService from './services/apiService.js';

class AppController {
  constructor() {
    this.nextMatch = null;
    this.tournamentStats = null;
    this.recentMatches = [];
    this.countdownInterval = null;
  }

  /**
   * Inicializa la aplicación
   */
  async init() {
    console.log('[App] Inicializando aplicación...');
    try {
      await this.loadDashboardData();
      this.startCountdown();
      console.log('[App] Aplicación inicializada correctamente');
    } catch (error) {
      console.error('[App] Error en inicialización:', error);
      this.showError('Error al cargar los datos');
    }
  }

  /**
   * Carga todos los datos del dashboard
   */
  async loadDashboardData() {
    console.log('[App] Cargando datos del dashboard...');
    
    // Cargar datos en paralelo
    const [nextMatch, stats, recentMatches] = await Promise.all([
      APIService.getNextMatch(),
      APIService.getTournamentStats(),
      APIService.getRecentMatches(3)
    ]);

    this.nextMatch = nextMatch;
    this.tournamentStats = stats;
    this.recentMatches = recentMatches;

    // Actualizar UI
    this.updateNextMatchDisplay();
    this.updateTournamentStats();
    this.updateRecentMatches();
  }

  /**
   * Actualiza la visualización del próximo partido
   */
  updateNextMatchDisplay() {
    const container = document.getElementById('proximo-partido');
    if (!container) return;

    if (!this.nextMatch) {
      container.innerHTML = '<p>No hay próximos partidos</p>';
      return;
    }

    const match = this.nextMatch;
    const homeTeam = match.home_team_name_en || 'Por confirmar';
    const awayTeam = match.away_team_name_en || 'Por confirmar';
    const dateTime = this.formatDateTime(match.local_date);

    container.innerHTML = `
      <div class="match-card">
        <div class="match-team home">
          <div class="team-name">${homeTeam}</div>
        </div>
        <div class="match-info">
          <div class="match-date">${dateTime}</div>
          <div class="match-vs">VS</div>
          <div class="match-group">Grupo ${match.grupo}</div>
        </div>
        <div class="match-team away">
          <div class="team-name">${awayTeam}</div>
        </div>
      </div>
    `;
  }

  /**
   * Actualiza las estadísticas del torneo
   */
  updateTournamentStats() {
    if (!this.tournamentStats) return;

    const stats = this.tournamentStats;
    
    // Actualizar resumen
    const totalPartidosEl = document.getElementById('total-partidos');
    const partidosJugadosEl = document.getElementById('partidos-jugados');

    if (totalPartidosEl) totalPartidosEl.textContent = stats.totalMatches;
    if (partidosJugadosEl) partidosJugadosEl.textContent = stats.playedMatches;
  }

  /**
   * Actualiza los resultados recientes
   */
  updateRecentMatches() {
    const container = document.getElementById('resultados-recientes');
    if (!container || this.recentMatches.length === 0) {
      if (container) container.innerHTML = '<p>No hay resultados recientes</p>';
      return;
    }

    const resultsHTML = this.recentMatches
      .map(match => `
        <div class="result-item">
          <div class="result-team home">${match.home_team_name_en || 'Por confirmar'}</div>
          <div class="result-score">
            <span class="score">${match.home_score} - ${match.away_score}</span>
            <span class="group">${match.grupo}</span>
          </div>
          <div class="result-team away">${match.away_team_name_en || 'Por confirmar'}</div>
        </div>
      `)
      .join('');

    container.innerHTML = resultsHTML;
  }

  /**
   * Inicia el countdown hacia el próximo partido
   */
  startCountdown() {
    if (this.countdownInterval) clearInterval(this.countdownInterval);

    const updateCountdown = () => {
      if (!this.nextMatch) {
        this.clearCountdown();
        return;
      }

      const matchDate = new Date(
        this.nextMatch.local_date.replace(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+)/, '$3-$1-$2T$4:$5')
      );

      const now = new Date();
      const diff = matchDate - now;

      if (diff <= 0) {
        this.clearCountdown();
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const cdDias = document.getElementById('cd-dias');
      const cdHoras = document.getElementById('cd-horas');
      const cdMinutos = document.getElementById('cd-minutos');
      const cdSegundos = document.getElementById('cd-segundos');

      if (cdDias) cdDias.textContent = String(days).padStart(2, '0');
      if (cdHoras) cdHoras.textContent = String(hours).padStart(2, '0');
      if (cdMinutos) cdMinutos.textContent = String(minutes).padStart(2, '0');
      if (cdSegundos) cdSegundos.textContent = String(seconds).padStart(2, '0');
    };

    updateCountdown(); // Primera ejecución inmediata
    this.countdownInterval = setInterval(updateCountdown, 1000);
  }

  /**
   * Limpia el countdown
   */
  clearCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  /**
   * Formatea una fecha de la API al formato legible
   * @param {string} dateString - Fecha en formato "06/11/2026 13:00"
   * @returns {string} Fecha formateada
   */
  formatDateTime(dateString) {
    if (!dateString) return 'Fecha por confirmar';
    
    try {
      const [date, time] = dateString.split(' ');
      const [day, month, year] = date.split('/');
      const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      
      return `${parseInt(day)} de ${monthNames[parseInt(month) - 1]} de ${year} a las ${time}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  }

  /**
   * Muestra un mensaje de error
   * @param {string} message - Mensaje de error
   */
  showError(message) {
    console.error('[Error]', message);
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    document.body.insertBefore(errorEl, document.body.firstChild);
    
    setTimeout(() => errorEl.remove(), 5000);
  }

  /**
   * Obtiene todos los partidos de grupos
   */
  async loadGroupMatches() {
    try {
      return await APIService.getGroupPhaseMatches();
    } catch (error) {
      console.error('Error loading group matches:', error);
      return [];
    }
  }

  /**
   * Obtiene todos los partidos de knockout
   */
  async loadKnockoutMatches() {
    try {
      return await APIService.getKnockoutMatches();
    } catch (error) {
      console.error('Error loading knockout matches:', error);
      return [];
    }
  }

  /**
   * Obtiene todos los grupos con standings
   */
  async loadGroups() {
    try {
      return await APIService.getAllGroups();
    } catch (error) {
      console.error('Error loading groups:', error);
      return [];
    }
  }

  /**
   * Obtiene todos los equipos
   */
  async loadTeams() {
    try {
      return await APIService.getAllTeams();
    } catch (error) {
      console.error('Error loading teams:', error);
      return [];
    }
  }

  /**
   * Obtiene todos los estadios
   */
  async loadStadiums() {
    try {
      return await APIService.getAllStadiums();
    } catch (error) {
      console.error('Error loading stadiums:', error);
      return [];
    }
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[App] DOM loaded, iniciando aplicación...');
  const app = new AppController();
  await app.init();
  
  // Exponer globalmente para acceso desde consola
  window.app = app;
});

export default AppController;
