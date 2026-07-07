    import APIService from '../../services/apiService.js';
    import EliminationController from '../../controllers/EliminationController.js';

    const controller = new EliminationController();
    let currentMatchObj = null;

    // Al cargar el DOM
    document.addEventListener('DOMContentLoaded', async () => {
      await controller.init();
      renderBracket();

      // Configurar eventos

      document.getElementById('btn-close-modal').addEventListener('click', closeModal);
      document.getElementById('edit-match-form').addEventListener('submit', saveMatchResult);

      // Cerrar modal haciendo clic fuera de la tarjeta
      document.getElementById('edit-match-modal').addEventListener('click', (e) => {
        if (e.target.id === 'edit-match-modal') {
          closeModal();
        }
      });

      // Monitorear cambios en las entradas de goles para detectar empates
      const homeScoreInput = document.getElementById('modal-home-score');
      const awayScoreInput = document.getElementById('modal-away-score');

      const checkTie = () => {
        const tiebreakerSection = document.getElementById('tiebreaker-section');
        if (homeScoreInput.value !== '' && awayScoreInput.value !== '' && homeScoreInput.value === awayScoreInput.value) {
          tiebreakerSection.style.display = 'block';
          // Activar requerimiento de radio buttons
          document.getElementById('radio-winner-home').required = true;
          document.getElementById('radio-winner-away').required = true;
        } else {
          tiebreakerSection.style.display = 'none';
          document.getElementById('radio-winner-home').required = false;
          document.getElementById('radio-winner-away').required = false;
        }
      };

      homeScoreInput.addEventListener('input', checkTie);
      awayScoreInput.addEventListener('input', checkTie);
    });

    /**
     * Renderiza el árbol completo ordenado para visualización
     */
    function renderBracket() {
      const container = document.getElementById('bracket-render-container');
      if (!container) return;

      const bracket = controller.getKnockoutBracket();
      const allTeams = controller.teams;

      // Ordenar Ronda de 32 (16 matches) para que alineen simétricamente con sus ramas
      // Cada rama r16 está compuesta por ganadores específicos de r32
      const r32Order = [
        '73', '75', // Rama R16 Match 90
        '74', '77', // Rama R16 Match 89
        '83', '84', // Rama R16 Match 93
        '81', '82', // Rama R16 Match 94
        '76', '78', // Rama R16 Match 91
        '79', '80', // Rama R16 Match 92
        '85', '87', // Rama R16 Match 96
        '86', '88'  // Rama R16 Match 95
      ];

      const r16Order = ['90', '89', '93', '94', '91', '92', '96', '95'];
      const qfOrder = ['97', '98', '99', '100'];
      const sfOrder = ['101', '102'];
      const finalOrder = ['104', '103']; // Final y Tercer Puesto

      // Generar listas ordenadas
      const r32Matches = r32Order.map(id => bracket.r32.matches.find(m => String(m.id) === id)).filter(Boolean);
      const r16Matches = r16Order.map(id => bracket.r16.matches.find(m => String(m.id) === id)).filter(Boolean);
      const qfMatches = qfOrder.map(id => bracket.qf.matches.find(m => String(m.id) === id)).filter(Boolean);
      const sfMatches = sfOrder.map(id => bracket.sf.matches.find(m => String(m.id) === id)).filter(Boolean);
      const finalMatches = finalOrder.map(id => {
        // Buscar en final o third
        return bracket.final.matches.find(m => String(m.id) === id) || bracket.third.matches.find(m => String(m.id) === id);
      }).filter(Boolean);

      const columnsData = [
        { name: '16avos de Final', matches: r32Matches, className: 'r32' },
        { name: 'Octavos de Final', matches: r16Matches, className: 'r16' },
        { name: 'Cuartos de Final', matches: qfMatches, className: 'qf' },
        { name: 'Semifinales', matches: sfMatches, className: 'sf' },
        { name: 'Finales', matches: finalMatches, className: 'final' }
      ];

      container.innerHTML = '';

      columnsData.forEach(col => {
        const colDiv = document.createElement('div');
        colDiv.className = `round-column ${col.className}`;
        
        const titleDiv = document.createElement('div');
        colDiv.appendChild(titleDiv);
        titleDiv.className = 'round-title';
        titleDiv.textContent = col.name;

        const matchListDiv = document.createElement('div');
        matchListDiv.className = 'match-list';

        col.matches.forEach(match => {
          const matchCard = createMatchCard(match, allTeams);
          matchListDiv.appendChild(matchCard);
        });

        colDiv.appendChild(matchListDiv);
        container.appendChild(colDiv);
      });

      setupHoverHighlights();
    }

    /**
     * Crea un nodo de tarjeta HTML para un partido
     */
    function createMatchCard(match, allTeams) {
      const card = document.createElement('div');
      card.className = 'bracket-match';
      card.dataset.matchId = match.id;
      
      const finished = match.finished === 'TRUE' || match.finished === true || match.finished === 'true';
      const homeScore = finished ? match.home_score : '-';
      const awayScore = finished ? match.away_score : '-';

      const homeWinner = finished && parseInt(match.home_score) > parseInt(match.away_score);
      const awayWinner = finished && parseInt(match.away_score) > parseInt(match.home_score);

      // Si hubo empate y se definió ganador
      const isHomeSelectedWinner = finished && match.home_score === match.away_score && (match.winner_decided === 'home' || match.winner_decided === match.home_team_id);
      const isAwaySelectedWinner = finished && match.home_score === match.away_score && (match.winner_decided === 'away' || match.winner_decided === match.away_team_id);

      const homeTeamInfo = allTeams.find(t => String(t.id) === String(match.home_team_id));
      const awayTeamInfo = allTeams.find(t => String(t.id) === String(match.away_team_id));

      const homeFlag = homeTeamInfo ? homeTeamInfo.flag : 'https://flagcdn.com/w80/un.png'; // ONU flag fallback
      const awayFlag = awayTeamInfo ? awayTeamInfo.flag : 'https://flagcdn.com/w80/un.png';

      const homeName = match.home_team_name_en || match.home_team_label || 'Por confirmar';
      const awayName = match.away_team_name_en || match.away_team_label || 'Por confirmar';

      const typeLabel = match.type === 'third' ? 'Tercer Puesto' : `Partido #${match.id}`;

      card.innerHTML = `
        <div class="match-meta">
          <span>${typeLabel}</span>
          <span style="font-weight: 700; color: ${finished ? 'var(--color-success)' : 'var(--color-accent)'};">
            ${finished ? 'Finalizado' : 'Pendiente'}
          </span>
        </div>
        <div class="match-teams" data-home-id="${match.home_team_id || ''}" data-away-id="${match.away_team_id || ''}">
          <!-- Local -->
          <div class="team-row ${homeWinner || isHomeSelectedWinner ? 'winner' : ''}" data-team-id="${match.home_team_id || ''}">
            <div class="team-info-left">
              <img class="flag-icon" src="${homeFlag}" alt="">
              <span class="team-name-text">${homeName}</span>
            </div>
            <div class="team-score-val">${homeScore}</div>
          </div>
          <!-- Visitante -->
          <div class="team-row ${awayWinner || isAwaySelectedWinner ? 'winner' : ''}" data-team-id="${match.away_team_id || ''}">
            <div class="team-info-left">
              <img class="flag-icon" src="${awayFlag}" alt="">
              <span class="team-name-text">${awayName}</span>
            </div>
            <div class="team-score-val">${awayScore}</div>
          </div>
        </div>
      `;

      card.addEventListener('click', () => openEditModal(match));
      return card;
    }

    /**
     * Resalta la trayectoria de los equipos en el bracket cuando se pasa el cursor sobre ellos
     */
    function setupHoverHighlights() {
      const teamRows = document.querySelectorAll('.team-row');

      teamRows.forEach(row => {
        const teamId = row.dataset.teamId;
        if (!teamId || teamId === '0' || teamId === '') return;

        row.addEventListener('mouseenter', () => {
          document.querySelectorAll(`.team-row[data-team-id="${teamId}"]`).forEach(r => {
            r.classList.add('team-highlight');
            r.closest('.bracket-match').style.borderColor = 'var(--color-accent)';
          });
        });

        row.addEventListener('mouseleave', () => {
          document.querySelectorAll(`.team-row[data-team-id="${teamId}"]`).forEach(r => {
            r.classList.remove('team-highlight');
            r.closest('.bracket-match').style.borderColor = '';
          });
        });
      });
    }

    /**
     * Abre el modal de edición
     */
    async function openEditModal(match) {
      // Re-consultar partido de la base de datos local para tener info fresca
      const freshMatch = await APIService.getMatchById(match.id);
      if (!freshMatch) return;
      currentMatchObj = freshMatch;

      const allTeams = controller.teams;
      const homeTeamInfo = allTeams.find(t => String(t.id) === String(freshMatch.home_team_id));
      const awayTeamInfo = allTeams.find(t => String(t.id) === String(freshMatch.away_team_id));

      document.getElementById('modal-match-id').value = freshMatch.id;
      document.getElementById('modal-match-title').textContent = freshMatch.type === 'third' 
        ? `Registrar Resultado - Tercer Puesto`
        : `Registrar Resultado - Partido #${freshMatch.id} (${controller.getPhaseName(freshMatch.type)})`;

      // Setear banderas y nombres
      document.getElementById('modal-home-flag').src = homeTeamInfo ? homeTeamInfo.flag : 'https://flagcdn.com/w80/un.png';
      document.getElementById('modal-away-flag').src = awayTeamInfo ? awayTeamInfo.flag : 'https://flagcdn.com/w80/un.png';
      
      const homeName = freshMatch.home_team_name_en || freshMatch.home_team_label || 'Por confirmar';
      const awayName = freshMatch.away_team_name_en || freshMatch.away_team_label || 'Por confirmar';
      
      document.getElementById('modal-home-name').textContent = homeName;
      document.getElementById('modal-away-name').textContent = awayName;

      // Cargar valores existentes si finalizó
      const finished = freshMatch.finished === 'TRUE' || freshMatch.finished === true || freshMatch.finished === 'true';
      document.getElementById('modal-home-score').value = finished ? freshMatch.home_score : '';
      document.getElementById('modal-away-score').value = finished ? freshMatch.away_score : '';

      // Scorers
      document.getElementById('modal-home-scorers').value = (freshMatch.home_scorers && freshMatch.home_scorers !== 'null') ? freshMatch.home_scorers : '';
      document.getElementById('modal-away-scorers').value = (freshMatch.away_scorers && freshMatch.away_scorers !== 'null') ? freshMatch.away_scorers : '';

      // Assists
      document.getElementById('modal-home-assists').value = (freshMatch.home_assists && freshMatch.home_assists !== 'null') ? freshMatch.home_assists : '';
      document.getElementById('modal-away-assists').value = (freshMatch.away_assists && freshMatch.away_assists !== 'null') ? freshMatch.away_assists : '';

      // Renderizar jugadores en listas desplegables
      const homePlayers = homeTeamInfo ? (homeTeamInfo.jugadores || []).map(p => p.nombreCompleto) : [];
      const awayPlayers = awayTeamInfo ? (awayTeamInfo.jugadores || []).map(p => p.nombreCompleto) : [];
      
      populatePlayerSelect('home-players-select', 'modal-home-scorers', homePlayers);
      populatePlayerSelect('away-players-select', 'modal-away-scorers', awayPlayers);
      populatePlayerSelect('home-assists-select', 'modal-home-assists', homePlayers);
      populatePlayerSelect('away-assists-select', 'modal-away-assists', awayPlayers);

      // Configurar sección de desempate
      document.getElementById('label-winner-home').textContent = homeName;
      document.getElementById('label-winner-away').textContent = awayName;

      const tiebreakerSection = document.getElementById('tiebreaker-section');
      if (finished && freshMatch.home_score === freshMatch.away_score) {
        tiebreakerSection.style.display = 'block';
        document.getElementById('radio-winner-home').required = true;
        document.getElementById('radio-winner-away').required = true;
        if (freshMatch.winner_decided === 'home' || freshMatch.winner_decided === freshMatch.home_team_id) {
          document.getElementById('radio-winner-home').checked = true;
        } else if (freshMatch.winner_decided === 'away' || freshMatch.winner_decided === freshMatch.away_team_id) {
          document.getElementById('radio-winner-away').checked = true;
        }
      } else {
        tiebreakerSection.style.display = 'none';
        document.getElementById('radio-winner-home').checked = false;
        document.getElementById('radio-winner-away').checked = false;
        document.getElementById('radio-winner-home').required = false;
        document.getElementById('radio-winner-away').required = false;
      }

      // Mostrar modal
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
     * Guarda el resultado del partido
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

      // Si es empate en eliminación directa, verificar el ganador en penales
      if (homeScore === awayScore) {
        const homeRadio = document.getElementById('radio-winner-home');
        const awayRadio = document.getElementById('radio-winner-away');
        if (homeRadio.checked) {
          fields.winner_decided = 'home';
        } else if (awayRadio.checked) {
          fields.winner_decided = 'away';
        } else {
          alert('Por favor selecciona qué selección avanza en caso de empate.');
          return;
        }
      } else {
        fields.winner_decided = parseInt(homeScore) > parseInt(awayScore) ? 'home' : 'away';
      }

      await APIService.updateMatchResult(matchId, fields);
      
      // Recargar controlador para refrescar los partidos cargados en memoria
      await controller.init();
      
      renderBracket();
      closeModal();
    }
