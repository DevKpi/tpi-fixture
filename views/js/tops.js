    import GoalsController from '../../controllers/GoalsController.js';
    import AssistController from '../../controllers/AssistController.js';
    import CleanSheetController from '../../controllers/CleanSheet.js';

    const goalsController = new GoalsController();
    const assistController = new AssistController();
    const cleanSheetController = new CleanSheetController();

    document.addEventListener('DOMContentLoaded', async () => {
      // Inicializar controladores en paralelo
      await Promise.all([
        goalsController.init(),
        assistController.init(),
        cleanSheetController.init()
      ]);

      renderTopScorers();
      renderTopAssists();
      renderTopCleanSheets();
      renderGeneralSummary();
    });

    // Render de Goleadores
    function renderTopScorers() {
      const tableBody = document.querySelector('#scorers-table tbody');
      if (!tableBody) return;

      const scorers = goalsController.getTopScorers(10);
      
      if (scorers.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="3" style="text-align: center; color: var(--color-text-muted); padding: 1.5rem;">
              Sin goles registrados.
            </td>
          </tr>
        `;
        return;
      }

      tableBody.innerHTML = scorers.map((s, index) => {
        const rank = index + 1;
        let rankHTML = rank;
        
        if (rank === 1) rankHTML = '<span class="medal medal-1">1</span>';
        else if (rank === 2) rankHTML = '<span class="medal medal-2">2</span>';
        else if (rank === 3) rankHTML = '<span class="medal medal-3">3</span>';

        return `
          <tr>
            <td class="rank-cell center-align">${rankHTML}</td>
            <td>
              <span style="font-weight: 700; color: #fff;">${s.player}</span>
            </td>
            <td class="value-cell value-goals center-align">${s.goals}</td>
          </tr>
        `;
      }).join('');
    }

    // Render de Asistidores
    function renderTopAssists() {
      const tableBody = document.querySelector('#assists-table tbody');
      if (!tableBody) return;

      const assists = assistController.getTopAssists(10);
      
      if (assists.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="3" style="text-align: center; color: var(--color-text-muted); padding: 1.5rem;">
              Sin asistencias registradas.
            </td>
          </tr>
        `;
        return;
      }

      tableBody.innerHTML = assists.map((s, index) => {
        const rank = index + 1;
        let rankHTML = rank;
        
        if (rank === 1) rankHTML = '<span class="medal medal-1">1</span>';
        else if (rank === 2) rankHTML = '<span class="medal medal-2">2</span>';
        else if (rank === 3) rankHTML = '<span class="medal medal-3">3</span>';

        return `
          <tr>
            <td class="rank-cell center-align">${rankHTML}</td>
            <td>
              <span style="font-weight: 700; color: #fff;">${s.player}</span>
            </td>
            <td class="value-cell value-assists center-align">${s.assists}</td>
          </tr>
        `;
      }).join('');
    }

    // Render de Vallas Invictas
    function renderTopCleanSheets() {
      const tableBody = document.querySelector('#cleansheets-table tbody');
      if (!tableBody) return;

      const cleanSheets = cleanSheetController.getTopCleanSheets(10);
      
      if (cleanSheets.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="3" style="text-align: center; color: var(--color-text-muted); padding: 1.5rem;">
              Sin partidos terminados a cero.
            </td>
          </tr>
        `;
        return;
      }

      tableBody.innerHTML = cleanSheets.map((s, index) => {
        const rank = index + 1;
        let rankHTML = rank;
        
        if (rank === 1) rankHTML = '<span class="medal medal-1">1</span>';
        else if (rank === 2) rankHTML = '<span class="medal medal-2">2</span>';
        else if (rank === 3) rankHTML = '<span class="medal medal-3">3</span>';

        return `
          <tr>
            <td class="rank-cell center-align">${rankHTML}</td>
            <td>
              <span style="font-weight: 700; color: #fff;">${s.goalkeeper}</span>
              <span class="sub-info">${s.teamName}</span>
            </td>
            <td class="value-cell value-sheets center-align">${s.cleanSheets}</td>
          </tr>
        `;
      }).join('');
    }

    // Resumen en cabecera
    function renderGeneralSummary() {
      const goalsSummary = goalsController.getTournamentGoalStats();
      const cleanSheetsCount = cleanSheetController.cleanSheets.reduce((sum, item) => sum + item.cleanSheets, 0);

      document.getElementById('val-total-goals').textContent = goalsSummary.totalGoals;
      document.getElementById('val-avg-goals').textContent = goalsSummary.averageGoalsPerMatch;
      document.getElementById('val-clean-sheets').textContent = cleanSheetsCount;
    }
