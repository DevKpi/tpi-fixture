/* Se pueden ejecutar las pruebas unitarias con npm run test */

// 1. IMPORTACIONES DE TODOS LOS MODELOS
import Seleccion from './models/CountryTeams.js';
import Fase from './models/Fase.js';
import Gol from './models/Goal.js';
import Grupo from './models/Group.js';
import Eliminatoria from './models/KnockOutStage.js';
import Partido from './models/Match.js';
import Mundial from './models/Mundial.js';
import Jugador from './models/Player.js';
import Tabla from './models/Table.js';
import RegistroTabla from './models/TableRegister.js';
import Usuario from './models/User.js';

// 2. IMPORTACIONES DE TODOS LOS CONTROLADORES
import AssistController from './controllers/AssistController.js';
import CleanSheetController from './controllers/CleanSheet.js';
import EliminationController from './controllers/EliminationController.js';
import GoalsController from './controllers/GoalsController.js';
import GroupController from './controllers/GroupController.js';
import MatchController from './controllers/MatchController.js';
import MundialController from './controllers/MundialController.js';

// 3. IMPORTACIONES DE SERVICIOS, UTILIDADES Y APP
import APIService from './services/apiService.js';
import { parseApiDate } from './utils/dateUtils.mjs';
import AppController from './main.js';

// Exportación centralizada para facilitar su uso externo
export {
  // Modelos
  Seleccion,
  Fase,
  Gol,
  Grupo,
  Eliminatoria,
  Partido,
  Mundial,
  Jugador,
  Tabla,
  RegistroTabla,
  Usuario,
  // Controladores
  AssistController,
  CleanSheetController,
  EliminationController,
  GoalsController,
  GroupController,
  MatchController,
  MundialController,
  // Servicios & Utils
  APIService,
  parseApiDate,
  AppController
};

function assertEquals(resultado, esperado) {
    if (resultado === esperado) {
        console.log("✅ Test correcto");
    } else {
        console.log(`❌ Esperado: ${esperado} - Obtenido: ${resultado}`);
    }
}


// Constructor: (id, nombreCompleto, numero, posicion, seleccion, goles, asistencias, amarillas, rojas, rawPlayer = {})
const jugador = new Jugador(
    10,               // id
    "Lionel Messi",   // nombreCompleto
    10,               // numero (dorsal)
    "Delantero",      // posicion
    "Argentina",      // seleccion
    5,                // goles
    3,                // asistencias
    1,                // amarillas
    0                 // rojas
);

console.log("Pruebas de Propiedades de Jugador");
assertEquals(jugador.id, 10);
assertEquals(jugador.nombreCompleto, "Lionel Messi");
assertEquals(jugador.name, "Lionel Messi"); // Alias de compatibilidad
assertEquals(jugador.numero, 10);
assertEquals(jugador.posicion, "Delantero");
assertEquals(jugador.seleccion, "Argentina");
assertEquals(jugador.goles, 5);
assertEquals(jugador.asistencias, 3);
assertEquals(jugador.amarillas, 1);
assertEquals(jugador.rojas, 0);

console.log(" ");

console.log("Pruebas de Métodos de Jugador");
assertEquals(jugador.MostrarPosicion(), "Delantero");

jugador.AgregarGol();
assertEquals(jugador.goles, 6);

jugador.AgregarAsistencia();
assertEquals(jugador.asistencias, 4);

jugador.AgregarAmarilla();
assertEquals(jugador.amarillas, 2);

jugador.AgregarRoja();
assertEquals(jugador.rojas, 1);

jugador.SumarValla();
assertEquals(jugador.vallasInvictas, 1);

