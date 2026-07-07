    import APIService from '../../services/apiService.js';
    import Usuario from '../../models/User.js';
    
    document.addEventListener('DOMContentLoaded', () => {
      const currentUser = Usuario.ObtenerUsuarioActual();
      const loginForm = document.getElementById('login-form');
      const statusDiv = document.getElementById('logged-user-status');
      const usernameSpan = document.getElementById('logged-username');
      const logoutBtn = document.getElementById('btn-logout');
      const resetResultsBtn = document.getElementById('btn-reset-results');

      if (currentUser) {
        loginForm.style.display = 'none';
        statusDiv.style.display = 'block';
        usernameSpan.textContent = currentUser.id;

        APIService.getAllMatches().then(matches => {
          const stats = currentUser.AnotarResultados(matches);
          
          document.getElementById('progress-bar').style.width = stats.percentage + '%';
          document.getElementById('progress-text').textContent = `Has completado ${stats.finishedMatches} de ${stats.totalMatches} partidos (${stats.percentage}%)`;
        }).catch(err => {
          console.error("Error al cargar progreso:", err);
          document.getElementById('progress-text').textContent = "Error al cargar progreso.";
        });
      }

      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        if (Usuario.LogIn(username)) {
          alert(`¡Bienvenido, ${username}! Tus cambios y predicciones ahora se guardarán.`);
          window.location.href = '../index.html';
        }
      });

      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        Usuario.LogOut();
        alert('Sesión cerrada.');
        window.location.reload();
      });

      if (resetResultsBtn) {
        resetResultsBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          if (confirm('¿Estás seguro de que quieres limpiar todos los resultados y reiniciar el torneo? Esto borrará todos los goles y equipos de las rondas eliminatorias.')) {
            await APIService.clearAllResults();
          }
        });
      }

      const resetTournamentBtn = document.getElementById('btn-reset-tournament');
      if (resetTournamentBtn) {
        resetTournamentBtn.addEventListener('click', () => {
          if (confirm('¿Estás seguro de que quieres restablecer todo el fixture a su estado original? Perderás todos los resultados cargados.')) {
            APIService.resetTournament();
          }
        });
      }
    });
