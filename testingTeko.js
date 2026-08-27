/* Archivo de pruebas reducido: solo 6 tests, cada uno de un modelo distinto.
   Se puede ejecutar con: npm run test */

import Gol from './models/Goal.js';
import RegistroTabla from './models/TableRegister.js';
import Grupo from './models/Group.js';
import Partido from './models/Match.js';
import Mundial from './models/Mundial.js';
import Usuario from './models/User.js';

function assertEquals(resultado, esperado) {
    if (resultado === esperado) {
        console.log("✅ Test correcto");
    } else {
        console.log(`❌ Esperado: ${esperado} - Obtenido: ${resultado}`);
    }
}

console.log("Pruebas rápidas - testingTeko");

// 1. Gol: parsear un string crudo de la API
const gol = Gol.ParsearDeString("L. Messi 45+2'");
assertEquals(gol.jugador, "L. Messi");

// 2. RegistroTabla: puntos tras ganar, empatar y perder
const registro = new RegistroTabla("ARG", "Argentina");
registro.RegistrarResultado(2, 0); // gana -> 3 pts
registro.RegistrarResultado(1, 1); // empata -> 1 pt
registro.RegistrarResultado(0, 1); // pierde -> 0 pts
assertEquals(registro.points, 4);

// 3. Grupo: no está completo si no jugaron todos los partidos
const grupo = new Grupo(1, "Grupo A", [], [{ finished: true }, { finished: false }]);
assertEquals(grupo.EstaCompleto(), false);

// 4. Partido: determinar el ganador según el marcador
const partido = new Partido(
    1, "Argentina", "Brasil", "01/01/2026 20:00", "Estadio X", "Árbitro Y",
    2, 1, [], "FINALIZADO", "group", "A",
    { home_team_id: "10", away_team_id: "20", finished: true }
);
assertEquals(partido.ObtenerGanador(), "local");

// 5. Mundial: cálculo del total de goles del torneo
const mundial = new Mundial("Mundial 2026", 2026, [], [], [], [], [partido]);
assertEquals(mundial.CalcularEstadisticasGlobales().totalGoals, 3);

// 6. Usuario: progreso calculado sobre los partidos finalizados
const usuario = new Usuario(1, "test@mail.com", "1234");
usuario.AnotarResultados([{ finished: true }, { finished: false }]);
assertEquals(usuario.progress, 1); // Math.round((1/104)*100)
