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

const jugador = new Jugador("Lionel Messi", "Argentina", 34, "Delantero");
assertEquals(jugador.nombre, "Lionel Messi");
assertEquals(jugador.pais, "Argentina");
assertEquals(jugador.edad, 34);
assertEquals(jugador.posicion, "Delantero");


