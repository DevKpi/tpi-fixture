    import APIService from '../../services/apiService.js';
    import MatchController from '../../controllers/MatchController.js';

    const matchController = new MatchController();

    document.addEventListener('DOMContentLoaded', async () => {
      await matchController.init();
      renderMatchDetail();
    });

    async function renderMatchDetail() {
      const container = document.getElementById('detail-render-target');
      if (!container) return;

      // Obtener ID del partido desde los parámetros de la URL
      const urlParams = new URLSearchParams(window.location.search);
      const matchId = urlParams.get('id');

      if (!matchId) {
        container.innerHTML = `
          <div class="detail-card">
            <h2 style="color: var(--color-danger);">Error</h2>
            <p>No se especificó un ID de partido válido.</p>
            <a href="fixture.html" class="btn-back">Volver al Fixture</a>
          </div>
        `;
        return;
      }

      // Obtener información del partido fresco
      const match = await APIService.getMatchById(matchId);
      if (!match) {
        container.innerHTML = `
          <div class="detail-card">
            <h2 style="color: var(--color-danger);">No encontrado</h2>
            <p>El partido con ID #${matchId} no existe.</p>
            <a href="fixture.html" class="btn-back">Volver al Fixture</a>
          </div>
        `;
        return;
      }

      const allTeams = await APIService.getAllTeams();
      const homeTeamInfo = allTeams.find(t => String(t.id) === String(match.home_team_id));
      const awayTeamInfo = allTeams.find(t => String(t.id) === String(match.away_team_id));

      const homeFlag = homeTeamInfo ? homeTeamInfo.flag : 'https://flagcdn.com/w80/un.png';
      const awayFlag = awayTeamInfo ? awayTeamInfo.flag : 'https://flagcdn.com/w80/un.png';

      const homeName = match.home_team_name_en || match.home_team_label || 'Por confirmar';
      const awayName = match.away_team_name_en || match.away_team_label || 'Por confirmar';

      const finished = match.finished === 'TRUE' || match.finished === true || match.finished === 'true';
      const scoreHTML = finished 
        ? `${match.home_score} - ${match.away_score}`
        : 'VS';

      const homeScorersList = (match.home_scorers && match.home_scorers !== 'null') 
        ? match.home_scorers.replace(/[{}"“”]/g, '').split(',') 
        : [];
      const awayScorersList = (match.away_scorers && match.away_scorers !== 'null') 
        ? match.away_scorers.replace(/[{}"“”]/g, '').split(',') 
        : [];

      container.innerHTML = `
        <div class="detail-card">
          <div class="detail-header">
            ${matchController.getPhaseName(match.type)} — Partido #${match.id}
          </div>

          <div class="teams-vs-container">
            <div class="team-block">
              <img class="team-flag-large" src="${homeFlag}" alt="">
              <span class="team-name-large">${homeName}</span>
            </div>
            <div class="score-display-large">
              ${scoreHTML}
            </div>
            <div class="team-block">
              <img class="team-flag-large" src="${awayFlag}" alt="">
              <span class="team-name-large">${awayName}</span>
            </div>
          </div>

          <!-- Goleadores si finalizó -->
          ${finished && (homeScorersList.length > 0 || awayScorersList.length > 0) ? `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1.5rem 0;">
              <div class="scorers-container">
                <div class="scorers-title">Goles ${homeName}</div>
                ${homeScorersList.length > 0 
                  ? homeScorersList.map(s => `<div>⚽ ${s.trim()}</div>`).join('')
                  : '<div style="color: var(--color-text-muted);">Sin goles</div>'
                }
              </div>
              <div class="scorers-container">
                <div class="scorers-title">Goles ${awayName}</div>
                ${awayScorersList.length > 0 
                  ? awayScorersList.map(s => `<div>⚽ ${s.trim()}</div>`).join('')
                  : '<div style="color: var(--color-text-muted);">Sin goles</div>'
                }
              </div>
            </div>
          ` : ''}

          <div class="meta-list">
            <div class="meta-item">
              <span class="meta-label">Estado</span>
              <span class="meta-value" style="color: ${finished ? 'var(--color-success)' : 'var(--color-accent)'}">
                ${finished ? 'Finalizado' : 'Pendiente'}
              </span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Fecha y Hora</span>
              <span class="meta-value">${match.local_date}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Estadio</span>
              <span class="meta-value">Sede #${match.stadium_id}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Fase</span>
              <span class="meta-value">${matchController.getPhaseName(match.type)}</span>
            </div>
            ${match.grupo && match.grupo !== 'R32' && match.grupo !== 'R16' ? `
              <div class="meta-item">
                <span class="meta-label">Grupo</span>
                <span class="meta-value">Grupo ${match.grupo}</span>
              </div>
            ` : ''}
          </div>

          <button onclick="history.back()" class="btn-back">Volver Atrás</button>
        </div>
      `;
    }
