    import APIService from '../../services/apiService.js';
    import GroupController from '../../controllers/GroupController.js';

    const groupController = new GroupController();
    let currentMatchObj = null;

    document.addEventListener('DOMContentLoaded', async () => {
      await groupController.init();
      renderGroups();

      // Configurar filtros
      document.getElementById('btn-show-all').addEventListener('click', () => {
        document.getElementById('select-group-filter').value = '';
        renderGroups();
      });

      document.getElementById('select-group-filter').addEventListener('change', (e) => {
        renderGroups(e.target.value);
      });

      // Modales
      document.getElementById('btn-close-modal').addEventListener('click', closeModal);
      document.getElementById('edit-match-form').addEventListener('submit', saveMatchResult);
      document.getElementById('edit-match-modal').addEventListener('click', (e) => {
        if (e.target.id === 'edit-match-modal') closeModal();
      });
    });

    /**
     * Renderiza los grupos (o uno en específico)
     */
    function renderGroups(filterLetter = '') {
      const container = document.getElementById('groups-container');
      if (!container) return;

      container.innerHTML = '';
      const letters = filterLetter ? [filterLetter] : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

      letters.forEach(letter => {
        const groupTableData = groupController.formatGroupTable(letter);
        if (!groupTableData) return;

        const groupMatches = groupController.getGroupMatches(letter);

        const card = document.createElement('div');
        card.className = 'group-card';
        card.innerHTML = `
          <div class="group-header-row">
            <span class="group-title">Grupo ${letter}</span>
            <span style="font-size: 0.75rem; color: var(--color-text-muted)">
              ${groupController.isGroupComplete(letter) ? '✅ Completado' : '⏳ En juego'}
            </span>
          </div>
          
          <!-- Tabla de Posiciones -->
          <table class="standings-table">
            <thead>
              <tr>
                <th>#</th>
                <th style="text-align: left;">Equipo</th>
                <th>PJ</th>
                <th>G</th>
                <th>E</th>
                <th>P</th>
                <th>GF</th>
                <th>GC</th>
                <th>DG</th>
                <th>PTS</th>
              </tr>
            </thead>
            <tbody>
              ${groupTableData.teams.map((t, idx) => {
                const isQualify = idx < 2; // Clasificación directa
                return `
                  <tr class="${isQualify ? 'qualify-zone' : ''}">
                    <td style="font-weight: 700;">${t.position}</td>
                    <td class="team-cell">
                      <img class="flag-icon" src="${t.flagUrl || 'https://flagcdn.com/w80/un.png'}" alt="">
                      <span>${t.teamName}</span>
                    </td>
                    <td>${t.played}</td>
                    <td>${t.wins}</td>
                    <td>${t.draws}</td>
                    <td>${t.losses}</td>
                    <td>${t.goalsFor}</td>
                    <td>${t.goalsAgainst}</td>
                    <td>${t.goalDifference > 0 ? '+' + t.goalDifference : t.goalDifference}</td>
                    <td style="font-weight: 700; color: var(--color-accent);">${t.points}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <!-- Lista de partidos del grupo -->
          <div class="matches-list">
            <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">
              Partidos
            </div>
            ${groupMatches.map(m => {
              const finished = m.finished === 'TRUE' || m.finished === true || m.finished === 'true';
              const scoreText = finished ? `${m.home_score} - ${m.away_score}` : 'vs';
              const dateObj = m.local_date.split(' ')[0]; // Solo fecha dd/mm/aaaa
              const homeTeamName = m.home_team_name_en || m.home_team_label || 'Por confirmar';
              const awayTeamName = m.away_team_name_en || m.away_team_label || 'Por confirmar';
              const homeTeamInfo = groupController.teams.find(t => String(t.id) === String(m.home_team_id));
              const awayTeamInfo = groupController.teams.find(t => String(t.id) === String(m.away_team_id));
              const homeFlag = homeTeamInfo?.flag || 'https://flagcdn.com/w80/un.png';
              const awayFlag = awayTeamInfo?.flag || 'https://flagcdn.com/w80/un.png';
              return `
                <div class="match-row" data-match-id="${m.id}">
                  <div class="match-teams-flow">
                    <span class="match-team home-t">
                      <img class="flag-icon" src="${homeFlag}" alt="Bandera de ${homeTeamName}">
                      <span>${homeTeamName}</span>
                    </span>
                    <span class="match-score-flow">${scoreText}</span>
                    <span class="match-team away-t">
                      <span>${awayTeamName}</span>
                      <img class="flag-icon" src="${awayFlag}" alt="Bandera de ${awayTeamName}">
                    </span>
                  </div>
                  <span class="match-date-meta">${dateObj}</span>
                </div>
              `;
            }).join('')}
          </div>
        `;

        // Asignar eventos de clic a los partidos
        card.querySelectorAll('.match-row').forEach(row => {
          row.addEventListener('click', () => {
            const matchId = row.dataset.matchId;
            const match = groupMatches.find(m => String(m.id) === String(matchId));
            if (match) openEditModal(match);
          });
        });

        container.appendChild(card);
      });
    }

    /**
     * Abre el modal para editar resultado
     */
    async function openEditModal(match) {
      // Obtener datos frescos
      const freshMatch = await APIService.getMatchById(match.id);
      if (!freshMatch) return;
      currentMatchObj = freshMatch;

      document.getElementById('modal-match-id').value = freshMatch.id;
      document.getElementById('modal-match-title').textContent = `Editar Resultado - Grupo ${freshMatch.grupo} (Partido #${freshMatch.id})`;

      const allTeams = groupController.teams;
      const homeTeamInfo = allTeams.find(t => String(t.id) === String(freshMatch.home_team_id));
      const awayTeamInfo = allTeams.find(t => String(t.id) === String(freshMatch.away_team_id));

      document.getElementById('modal-home-flag').src = homeTeamInfo ? homeTeamInfo.flag : 'https://flagcdn.com/w80/un.png';
      document.getElementById('modal-away-flag').src = awayTeamInfo ? awayTeamInfo.flag : 'https://flagcdn.com/w80/un.png';
      document.getElementById('modal-home-name').textContent = freshMatch.home_team_name_en;
      document.getElementById('modal-away-name').textContent = freshMatch.away_team_name_en;

      const finished = freshMatch.finished === 'TRUE' || freshMatch.finished === true || freshMatch.finished === 'true';
      document.getElementById('modal-home-score').value = finished ? freshMatch.home_score : '';
      document.getElementById('modal-away-score').value = finished ? freshMatch.away_score : '';

      document.getElementById('modal-home-scorers').value = (freshMatch.home_scorers && freshMatch.home_scorers !== 'null') ? freshMatch.home_scorers : '';
      document.getElementById('modal-away-scorers').value = (freshMatch.away_scorers && freshMatch.away_scorers !== 'null') ? freshMatch.away_scorers : '';

      // Asistidores
      document.getElementById('modal-home-assists').value = (freshMatch.home_assists && freshMatch.home_assists !== 'null') ? freshMatch.home_assists : '';
      document.getElementById('modal-away-assists').value = (freshMatch.away_assists && freshMatch.away_assists !== 'null') ? freshMatch.away_assists : '';

      // Renderizar jugadores en listas desplegables
      // Renderizar jugadores en listas desplegables
      const homePlayers = homeTeamInfo ? (homeTeamInfo.jugadores || []).map(p => p.nombreCompleto) : [];
      const awayPlayers = awayTeamInfo ? (awayTeamInfo.jugadores || []).map(p => p.nombreCompleto) : [];
      
      populatePlayerSelect('home-players-select', 'modal-home-scorers', homePlayers);
      populatePlayerSelect('away-players-select', 'modal-away-scorers', awayPlayers);
      populatePlayerSelect('home-assists-select', 'modal-home-assists', homePlayers);
      populatePlayerSelect('away-assists-select', 'modal-away-assists', awayPlayers);

      document.getElementById('edit-match-modal').classList.add('active');
    }

    /**
     * Llena el select con jugadores y maneja la inserción en el input
     */
    function populatePlayerSelect(selectId, inputId, players) {
      const select = document.getElementById(selectId);
      select.innerHTML = '<option value="">Agregar jugador...</option>';
      if (!players || players.length === 0) return;
      
      players.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p;
        opt.textContent = p;
        select.appendChild(opt);
      });
      
      select.onchange = () => {
        if (select.value) {
          const input = document.getElementById(inputId);
          const val = input.value.trim();
          input.value = val ? `${val}, ${select.value} ` : `${select.value} `;
          input.focus();
          select.value = ''; // Reset the select
        }
      };
    }

    /**
     * Cierra el modal
     */
    function closeModal() {
      document.getElementById('edit-match-modal').classList.remove('active');
      document.getElementById('edit-match-form').reset();
      currentMatchObj = null;
    }

    /**
     * Guarda el resultado en localStorage y refresca
     */
    async function saveMatchResult(e) {
      e.preventDefault();
      if (!currentMatchObj) return;

      const matchId = document.getElementById('modal-match-id').value;
      const homeScore = document.getElementById('modal-home-score').value;
      const awayScore = document.getElementById('modal-away-score').value;
      const homeScorers = document.getElementById('modal-home-scorers').value.trim();
      const awayScorers = document.getElementById('modal-away-scorers').value.trim();
      const homeAssists = document.getElementById('modal-home-assists').value.trim();
      const awayAssists = document.getElementById('modal-away-assists').value.trim();

      const fields = {
        home_score: String(homeScore),
        away_score: String(awayScore),
        home_scorers: homeScorers || 'null',
        away_scorers: awayScorers || 'null',
        home_assists: homeAssists || 'null',
        away_assists: awayAssists || 'null',
        finished: 'TRUE',
        time_elapsed: 'finished'
      };

      await APIService.updateMatchResult(matchId, fields);
      
      // Re-inicializar controlador
      await groupController.init();
      
      // Mantener filtro activo
      const selectedFilter = document.getElementById('select-group-filter').value;
      renderGroups(selectedFilter);
      closeModal();
    }
