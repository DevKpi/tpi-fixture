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

// ============================================================================
// 4. POLYFILLS Y ENTORNO DE PRUEBAS (Compatibilidad Node.js / Browser)
// ============================================================================
if (typeof globalThis.localStorage === 'undefined') {
  const memoryStore = new Map();
  globalThis.localStorage = {
    getItem: (key) => memoryStore.get(key) ?? null,
    setItem: (key, val) => memoryStore.set(key, String(val)),
    removeItem: (key) => memoryStore.delete(key),
    clear: () => memoryStore.clear()
  };
}

// ============================================================================
// 5. FRAMEWORK DE ASSERTIONS Y TEST RUNNER (Soporta funciones async y sync)
// ============================================================================
const registeredSuites = [];
let activeSuite = null;

export function suite(name, fn) {
  activeSuite = { name, tests: [] };
  registeredSuites.push(activeSuite);
  fn();
  activeSuite = null;
}

export function test(description, fn) {
  if (activeSuite) {
    activeSuite.tests.push({ description, fn });
  } else {
    registeredSuites.push({ name: 'General', tests: [{ description, fn }] });
  }
}

export function assertEquals(resultado, esperado, mensaje = '') {
  if (resultado !== esperado) {
    throw new Error(`${mensaje ? mensaje + ' -> ' : ''}Esperado: ${JSON.stringify(esperado)}, Obtenido: ${JSON.stringify(resultado)}`);
  }
}

export function assertNotEquals(resultado, noEsperado, mensaje = '') {
  if (resultado === noEsperado) {
    throw new Error(`${mensaje ? mensaje + ' -> ' : ''}Se esperaba un valor distinto a: ${JSON.stringify(noEsperado)}`);
  }
}

export function assertTrue(condicion, mensaje = 'Se esperaba true') {
  if (!condicion) {
    throw new Error(`${mensaje} -> Se obtuvo: ${condicion}`);
  }
}

export function assertFalse(condicion, mensaje = 'Se esperaba false') {
  if (condicion) {
    throw new Error(`${mensaje} -> Se obtuvo: ${condicion}`);
  }
}

export function assertDeepEquals(resultado, esperado, mensaje = '') {
  const resStr = JSON.stringify(resultado);
  const espStr = JSON.stringify(esperado);
  if (resStr !== espStr) {
    throw new Error(`${mensaje ? mensaje + ' -> ' : ''}Objetos no coinciden.\nEsperado: ${espStr}\nObtenido: ${resStr}`);
  }
}


// ============================================================================
// 6. BATERÍA DE PRUEBAS UNITARIAS
// ============================================================================

// --- 6.1 Modelo Jugador ---
suite('Modelo Jugador (Player.js)', () => {
  test('Debe inicializar correctamente las propiedades del jugador', () => {
    const jugador = new Jugador(10, 'Lionel Messi', 10, 'Delantero', 'Argentina', 5, 3, 1, 0);
    assertEquals(jugador.id, 10);
    assertEquals(jugador.nombreCompleto, 'Lionel Messi');
    assertEquals(jugador.numero, 10);
    assertEquals(jugador.posicion, 'Delantero');
    assertEquals(jugador.seleccion, 'Argentina');
    assertEquals(jugador.goles, 5);
    assertEquals(jugador.asistencias, 3);
    assertEquals(jugador.amarillas, 1);
    assertEquals(jugador.rojas, 0);
  });

  test('Debe incrementar goles con AgregarGol()', () => {
    const jugador = new Jugador(1, 'Julián Álvarez', 9, 'Delantero', 'Argentina', 0, 0, 0, 0);
    jugador.AgregarGol();
    jugador.AgregarGol();
    assertEquals(jugador.goles, 2);
  });

  test('Debe incrementar asistencias con AgregarAsistencia()', () => {
    const jugador = new Jugador(1, 'Rodrigo De Paul', 7, 'Mediocampista', 'Argentina', 0, 0, 0, 0);
    jugador.AgregarAsistencia();
    assertEquals(jugador.asistencias, 1);
  });

  test('Debe incrementar tarjetas amarillas y rojas', () => {
    const jugador = new Jugador(1, 'C. Romero', 13, 'Defensor', 'Argentina', 0, 0, 0, 0);
    jugador.AgregarAmarilla();
    jugador.AgregarRoja();
    assertEquals(jugador.amarillas, 1);
    assertEquals(jugador.rojas, 1);
  });

  test('Debe sumar vallas invictas con SumarValla()', () => {
    const arquero = new Jugador(1, 'E. Martínez', 23, 'Arquero', 'Argentina', 0, 0, 0, 0);
    arquero.SumarValla();
    arquero.SumarValla();
    assertEquals(arquero.vallasInvictas, 2);
  });

  test('Debe mostrar la posición correcta con MostrarPosicion()', () => {
    const jugador = new Jugador(1, 'Alexis Mac Allister', 20, 'Mediocampista', 'Argentina');
    assertEquals(jugador.MostrarPosicion(), 'Mediocampista');
  });
});

// --- 6.2 Modelo Gol ---
suite('Modelo Gol (Goal.js)', () => {
  test('Debe instanciar correctamente un gol', () => {
    const gol = new Gol(1, 'L. Messi', "45'", 'Primer Tiempo', 'R. De Paul');
    assertEquals(gol.jugador, 'L. Messi');
    assertEquals(gol.minuto, "45'");
    assertEquals(gol.asistidor, 'R. De Paul');
  });

  test('MostrarDescripcion() debe formatear jugador y minuto', () => {
    const golConMinuto = new Gol(1, 'L. Messi', "45'", '', null);
    assertEquals(golConMinuto.MostrarDescripcion(), "L. Messi (45')");

    const golSinMinuto = new Gol(2, 'E. Haaland', '', '', null);
    assertEquals(golSinMinuto.MostrarDescripcion(), 'E. Haaland ');
  });

  test('ParsearDeString() debe extraer jugador y minuto correctamente', () => {
    const parseado1 = Gol.ParsearDeString("L. Messi 45'");
    assertEquals(parseado1.jugador, 'L. Messi');
    assertEquals(parseado1.minuto, "45'");

    const parseado2 = Gol.ParsearDeString("K. Mbappé 118'+2'");
    assertTrue(parseado2.jugador.includes('Mbappé'));

    const parseadoVacio = Gol.ParsearDeString(null);
    assertEquals(parseadoVacio, null);
  });
});

// --- 6.3 Modelo Seleccion ---
suite('Modelo Seleccion (CountryTeams.js)', () => {
  test('Debe crear una selección y gestionar su plantilla', () => {
    const seleccion = new Seleccion(1, 'Argentina', 'https://flag.png', 'L. Scaloni', [], 'A');
    assertEquals(seleccion.nombre, 'Argentina');
    assertEquals(seleccion.entrenador, 'L. Scaloni');
    assertEquals(seleccion.plantilla.length, 0);

    const messi = new Jugador(10, 'L. Messi', 10, 'Forward', 'Argentina', 3, 2);
    const dibu = new Jugador(23, 'E. Martínez', 23, 'Goalkeeper', 'Argentina', 0, 0);

    seleccion.AgregarJugador(messi);
    seleccion.AgregarJugador(dibu);

    assertEquals(seleccion.ListarPlantilla().length, 2);
    assertEquals(seleccion.ObtenerJugador(10)?.nombreCompleto, 'L. Messi');
    assertEquals(seleccion.ObtenerJugador('23')?.nombreCompleto, 'E. Martínez');
  });

  test('CalcularStats() debe sumar goles y asistencias del equipo', () => {
    const seleccion = new Seleccion(1, 'Argentina', 'https://flag.png', 'L. Scaloni', []);
    seleccion.AgregarJugador(new Jugador(1, 'J1', 1, 'FW', 'ARG', 4, 1));
    seleccion.AgregarJugador(new Jugador(2, 'J2', 2, 'MF', 'ARG', 2, 3));

    const stats = seleccion.CalcularStats();
    assertEquals(stats.goles, 6);
    assertEquals(stats.asistencias, 4);
    assertEquals(stats.plantillaCount, 2);
  });

  test('ObtenerArqueroTitular() debe detectar al arquero de la plantilla o usar fallback', () => {
    const seleccionConPlantilla = new Seleccion(1, 'Argentina', '', '', []);
    seleccionConPlantilla.AgregarJugador(new Jugador(23, 'E. Martínez', 23, 'Goalkeeper', 'Argentina'));
    assertEquals(seleccionConPlantilla.ObtenerArqueroTitular(), 'E. Martínez');

    const seleccionVacia = new Seleccion(2, 'Brazil', '', '', [], '', { name_en: 'Brazil' });
    assertEquals(seleccionVacia.ObtenerArqueroTitular(), 'Alisson');
  });
});

// --- 6.4 Modelo Partido ---
suite('Modelo Partido (Match.js)', () => {
  test('Debe calcular ganador y puntos correctamente para victoria local', () => {
    const partido = new Partido(1, 'Argentina', 'Chile', '11/06/2026 15:00', 'Estadio Azteca', 'Árbitro', 2, 0, [], 'FINALIZADO', 'group', 'A');
    assertEquals(partido.ObtenerGanador(), 'local');
    assertEquals(partido.ObtenerPuntosLocal(), 3);
    assertEquals(partido.ObtenerPuntosVisitante(), 0);
  });

  test('Debe calcular ganador y puntos correctamente para empate', () => {
    const partido = new Partido(2, 'Francia', 'Alemania', '12/06/2026 18:00', 'Estadio', 'Árbitro', 1, 1, [], 'FINALIZADO', 'group', 'B');
    assertEquals(partido.ObtenerGanador(), 'empate');
    assertEquals(partido.ObtenerPuntosLocal(), 1);
    assertEquals(partido.ObtenerPuntosVisitante(), 1);
  });

  test('RegistrarGol() debe actualizar marcadores y goleadores', () => {
    const partido = new Partido(3, 'España', 'Italia', '13/06/2026 20:00', 'Estadio', 'Árbitro', 0, 0, [], 'PENDIENTE', 'group', 'C');
    partido.RegistrarGol('local', 'L. Yamal', '25', 'NORMAL', 'Pedri');
    
    assertEquals(partido.golLocal, '1');
    assertEquals(partido.home_score, '1');
    assertTrue(partido.home_scorers.includes('L. Yamal'));
    assertTrue(partido.home_assists.includes('Pedri'));
  });

  test('EsFaseDeGrupos() y EsFaseEliminatoria()', () => {
    const partidoGrupo = new Partido(1, 'A', 'B', '', '', '', 0, 0, [], 'PENDIENTE', 'group', 'A', { type: 'group' });
    assertTrue(partidoGrupo.EsFaseDeGrupos());
    assertFalse(partidoGrupo.EsFaseEliminatoria());

    const partidoOctavos = new Partido(2, 'A', 'B', '', '', '', 0, 0, [], 'PENDIENTE', 'r16', '', { type: 'r16' });
    assertFalse(partidoOctavos.EsFaseDeGrupos());
    assertTrue(partidoOctavos.EsFaseEliminatoria());
    assertEquals(partidoOctavos.ObtenerNombreFase(), 'Octavos de Final');
  });

  test('EsParticipante() y ObtuvoVallaInvicta()', () => {
    const partido = new Partido(1, 'ARG', 'BRA', '', '', '', 2, 0, [], 'FINALIZADO', 'final', '', {
      home_team_id: '1',
      away_team_id: '2',
      home_score: '2',
      away_score: '0',
      finished: true
    });

    assertTrue(partido.EsParticipante('1'));
    assertTrue(partido.EsParticipante('2'));
    assertFalse(partido.EsParticipante('99'));

    assertTrue(partido.ObtuvoVallaInvicta('1'));
    assertFalse(partido.ObtuvoVallaInvicta('2'));
  });

  test('IniciarPartido() y FinalizarPartido()', () => {
    const partido = new Partido(1, 'A', 'B', '', '', '', 0, 0, [], 'PENDIENTE', 'group');
    partido.FinalizarPartido();
    assertEquals(partido.estado, 'FINALIZADO');
    assertTrue(partido.finished);

    partido.IniciarPartido();
    assertEquals(partido.estado, 'PENDIENTE');
    assertFalse(partido.finished);
  });
});

// --- 6.5 Modelo RegistroTabla ---
suite('Modelo RegistroTabla (TableRegister.js)', () => {
  test('Debe acumular estadísticas de victorias, empates y derrotas', () => {
    const reg = new RegistroTabla('1', 'Argentina');
    
    // Victoria 2-0
    reg.RegistrarResultado(2, 0);
    assertEquals(reg.played, 1);
    assertEquals(reg.wins, 1);
    assertEquals(reg.points, 3);
    assertEquals(reg.goalDifference, 2);

    // Empate 1-1
    reg.RegistrarResultado(1, 1);
    assertEquals(reg.played, 2);
    assertEquals(reg.draws, 1);
    assertEquals(reg.points, 4);
    assertEquals(reg.goalDifference, 2);

    // Derrota 0-1
    reg.RegistrarResultado(0, 1);
    assertEquals(reg.played, 3);
    assertEquals(reg.losses, 1);
    assertEquals(reg.points, 4);
    assertEquals(reg.goalDifference, 1);

    // Reiniciar
    reg.Reiniciar();
    assertEquals(reg.played, 0);
    assertEquals(reg.points, 0);
  });
});

// --- 6.6 Modelo Tabla ---
suite('Modelo Tabla (Table.js)', () => {
  test('Debe calcular y ordenar la tabla de posiciones por puntos y diferencia de gol', () => {
    const tabla = new Tabla('A');
    const partidos = [
      new Partido(1, 'ARG', 'MEX', '', '', '', 3, 0, [], 'FINALIZADO', 'group', 'A', { home_team_id: '1', away_team_id: '2', home_team_name_en: 'ARG', away_team_name_en: 'MEX', home_score: '3', away_score: '0', finished: true }),
      new Partido(2, 'POL', 'KOR', '', '', '', 1, 1, [], 'FINALIZADO', 'group', 'A', { home_team_id: '3', away_team_id: '4', home_team_name_en: 'POL', away_team_name_en: 'KOR', home_score: '1', away_score: '1', finished: true })
    ];

    tabla.Calcular(partidos);
    const equiposBase = [{ id: '1', name_en: 'ARG' }, { id: '2', name_en: 'MEX' }, { id: '3', name_en: 'POL' }, { id: '4', name_en: 'KOR' }];
    const orden = tabla.MostrarOrden(equiposBase);

    assertEquals(orden[0].teamName, 'ARG');
    assertEquals(orden[0].points, 3);
    assertEquals(orden[1].points, 1);
    assertEquals(orden[2].points, 1);
    assertEquals(orden[3].teamName, 'MEX');
    assertEquals(orden[3].points, 0);
  });
});

// --- 6.7 Modelo Grupo ---
suite('Modelo Grupo (Group.js)', () => {
  test('Debe calcular tabla y clasificados del grupo', () => {
    const selecciones = [
      new Seleccion('1', 'ARG', '', '', []),
      new Seleccion('2', 'MEX', '', '', []),
      new Seleccion('3', 'POL', '', '', []),
      new Seleccion('4', 'KOR', '', '', [])
    ];
    const partidos = [
      new Partido(1, 'ARG', 'MEX', '', '', '', 2, 0, [], 'FINALIZADO', 'group', 'A', { home_team_id: '1', away_team_id: '2', home_team_name_en: 'ARG', away_team_name_en: 'MEX', home_score: '2', away_score: '0', finished: true }),
      new Partido(2, 'POL', 'KOR', '', '', '', 0, 1, [], 'FINALIZADO', 'group', 'A', { home_team_id: '3', away_team_id: '4', home_team_name_en: 'POL', away_team_name_en: 'KOR', home_score: '0', away_score: '1', finished: true })
    ];

    const grupo = new Grupo('A', 'Grupo A', selecciones, partidos);
    const clasificacion = grupo.ObtenerClasificados();

    assertEquals(clasificacion.clasificados.length, 2);
    assertEquals(clasificacion.clasificados[0].teamName, 'ARG');
    assertEquals(clasificacion.clasificados[1].teamName, 'KOR');
    assertEquals(clasificacion.eliminados.length, 2);
  });

  test('EstaCompleto() debe verificar si todos los partidos terminaron', () => {
    const p1 = new Partido(1, 'A', 'B', '', '', '', 1, 0, [], 'FINALIZADO', 'group', 'A', { finished: true });
    const p2 = new Partido(2, 'C', 'D', '', '', '', 0, 0, [], 'PENDIENTE', 'group', 'A', { finished: false });

    const grupo = new Grupo('A', 'Grupo A', [], [p1, p2]);
    assertFalse(grupo.EstaCompleto());

    p2.finished = true;
    assertTrue(grupo.EstaCompleto());
  });
});

// --- 6.8 Modelo Eliminatoria ---
suite('Modelo Eliminatoria (KnockOutStage.js)', () => {
  test('Debe determinar el ganador de una llave eliminatoria finalizada', () => {
    const partido = new Partido(1, 'Francia', 'Inglaterra', '', '', '', 2, 1, [], 'FINALIZADO', 'qf', '', {
      id: 1,
      type: 'qf',
      home_team_id: '10',
      away_team_id: '11',
      home_team_name_en: 'Francia',
      away_team_name_en: 'Inglaterra',
      home_score: '2',
      away_score: '1',
      finished: true
    });

    const eliminatoria = new Eliminatoria(partido);
    assertEquals(eliminatoria.ganador.nombre, 'Francia');
    assertTrue(eliminatoria.MostrarResumen().includes('Cuartos de Final'));
  });
});

// --- 6.9 Modelo Fase ---
suite('Modelo Fase (Fase.js)', () => {
  test('Debe administrar partidos y verificar estado de fase', () => {
    const fase = new Fase(1, 'Octavos de Final', 'OCTAVOS');
    const p1 = new Partido(1, 'A', 'B', '', '', '', 1, 0, [], 'FINALIZADO', 'OCTAVOS');
    const p2 = new Partido(2, 'C', 'D', '', '', '', 0, 0, [], 'PENDIENTE', 'OCTAVOS');

    fase.agregarPartido(p1);
    fase.agregarPartido(p2);

    assertEquals(fase.obtenerPartidos().length, 2);
    assertEquals(fase.obtenerPartidosPendientes().length, 1);
    assertEquals(fase.obtenerPartidosFinalizados().length, 1);
    assertFalse(fase.checkEstadoFase());

    p2.estado = 'FINALIZADO';
    assertTrue(fase.checkEstadoFase());
  });
});

// --- 6.10 Modelo Mundial ---
suite('Modelo Mundial (Mundial.js)', () => {
  test('CalcularEstadisticasGlobales() debe resumir partidos y goles del torneo', () => {
    const partidos = [
      new Partido(1, 'A', 'B', '', '', '', 2, 1, [], 'FINALIZADO', 'group', 'A', { home_score: '2', away_score: '1', finished: true, type: 'group' }),
      new Partido(2, 'C', 'D', '', '', '', 0, 0, [], 'PENDIENTE', 'group', 'B', { home_score: '0', away_score: '0', finished: false, type: 'group' })
    ];
    const selecciones = [{}, {}, {}, {}];
    const grupos = [{}, {}];

    const mundial = new Mundial('World Cup 2026', 2026, ['USA', 'MEX', 'CAN'], grupos, [], selecciones, partidos, []);
    const stats = mundial.CalcularEstadisticasGlobales();

    assertEquals(stats.totalMatches, 2);
    assertEquals(stats.playedMatches, 1);
    assertEquals(stats.upcomingMatches, 1);
    assertEquals(stats.totalGoals, 3);
    assertEquals(stats.progressPercent, 50);
  });
});

// --- 6.11 Modelo Usuario ---
suite('Modelo Usuario (User.js)', () => {
  test('AnotarResultados() debe calcular el progreso sobre los 104 partidos', () => {
    const usuario = new Usuario('user1', 'user@test.com', 'pass123');
    const partidos = [
      { finished: true },
      { finished: true },
      { finished: false }
    ];

    const res = usuario.AnotarResultados(partidos);
    assertEquals(res.finishedMatches, 2);
    assertEquals(res.totalMatches, 104);
    assertEquals(res.percentage, Math.round((2 / 104) * 100));
  });

  test('LogIn(), LogOut() y ObtenerUsuarioActual() deben persistir en almacenamiento', () => {
    assertTrue(Usuario.LogIn('admin_test'));
    const actual = Usuario.ObtenerUsuarioActual();
    assertEquals(actual.id, 'admin_test');

    Usuario.LogOut();
    assertEquals(Usuario.ObtenerUsuarioActual(), null);
  });
});

// --- 6.12 Utilidad parseApiDate ---
suite('Utilidad dateUtils.mjs (parseApiDate)', () => {
  test('Debe parsear formatos dd/mm/yyyy hh:mm', () => {
    const fecha = parseApiDate('11/06/2026 15:00');
    assertTrue(fecha instanceof Date);
    assertEquals(fecha.getFullYear(), 2026);
    assertEquals(fecha.getMonth(), 5); // Junio = 5 (0-indexed)
    assertEquals(fecha.getDate(), 11);
    assertEquals(fecha.getHours(), 15);
    assertEquals(fecha.getMinutes(), 0);
  });

  test('Debe retornar null ante entradas inválidas o vacías', () => {
    assertEquals(parseApiDate(null), null);
    assertEquals(parseApiDate(''), null);
    assertEquals(parseApiDate('fecha_invalida'), null);
  });
});

// --- 6.13 Controladores ---
suite('Controladores (Instanciación y estructura)', () => {
  test('MatchController debe inicializar estructuras vacías', () => {
    const ctrl = new MatchController();
    assertEquals(Array.isArray(ctrl.matches), true);
    assertEquals(ctrl.matches.length, 0);
  });

  test('GoalsController debe calcular top goleadores y asistidores desde matches mock', () => {
    const ctrl = new GoalsController();
    ctrl.matches = [
      new Partido(1, 'ARG', 'FRA', '', '', '', 2, 1, [], 'FINALIZADO', 'final', '', {
        home_scorers: 'L. Messi 23, L. Messi 108',
        away_scorers: 'K. Mbappé 80',
        home_assists: 'A. Di María',
        away_assists: 'null'
      })
    ];
    ctrl.calculateStats();
    const topScorers = ctrl.getTopScorers();
    assertEquals(topScorers[0].player, 'L. Messi');
    assertEquals(topScorers[0].goals, 2);
  });

  test('CleanSheetController debe calcular vallas invictas', async () => {
    const ctrl = new CleanSheetController();
    const match = new Partido(1, 'ARG', 'BRA', '', '', '', 1, 0, [], 'FINALIZADO', 'sf', '', {
      home_team_id: '1',
      away_team_id: '2',
      home_score: '1',
      away_score: '0',
      finished: true
    });
    ctrl.matches = [match];
    
    // Mock APIService.getAllTeams temporalmente
    const origGetAllTeams = APIService.getAllTeams;
    APIService.getAllTeams = async () => [
      new Seleccion('1', 'Argentina', '', '', [new Jugador(23, 'E. Martínez', 23, 'Goalkeeper', 'Argentina')]),
      new Seleccion('2', 'Brazil', '', '', [])
    ];

    await ctrl.calculateStats();
    const topSheets = ctrl.getTopCleanSheets();
    assertEquals(topSheets[0].cleanSheets, 1);
    assertEquals(topSheets[0].teamId, '1');

    APIService.getAllTeams = origGetAllTeams;
  });

  test('EliminationController getKnockoutBracket() debe estructurar todas las fases', () => {
    const ctrl = new EliminationController();
    const bracket = ctrl.getKnockoutBracket();
    assertTrue('r32' in bracket);
    assertTrue('r16' in bracket);
    assertTrue('qf' in bracket);
    assertTrue('sf' in bracket);
    assertTrue('third' in bracket);
    assertTrue('final' in bracket);
  });

  test('MundialController getStadiumsByCountry() debe filtrar correctamente', () => {
    const ctrl = new MundialController();
    ctrl.stadiums = [
      { id: 1, country_en: 'United States' },
      { id: 2, country_en: 'Mexico' },
      { id: 3, country_en: 'United States' }
    ];
    const usStadiums = ctrl.getStadiumsByCountry('United States');
    assertEquals(usStadiums.length, 2);
  });

  test('AppController formatDateTime() debe formatear fechas correctamente', () => {
    const app = new AppController();
    const fecha = new Date(2026, 5, 11, 15, 0); // 11 de Junio de 2026, 15:00
    const str = app.formatDateTime(fecha);
    assertTrue(str.includes('11 de Junio de 2026'));
    assertTrue(str.includes('15:00'));
  });
});

// ============================================================================
// 7. EJECUCIÓN DEL TEST RUNNER
// ============================================================================
export async function runAllTests() {
  let passed = 0;
  let failed = 0;

  for (const s of registeredSuites) {
    console.log(`\n📦 [SUITE] ${s.name}`);
    console.log('--------------------------------------------------');
    for (const t of s.tests) {
      try {
        await t.fn();
        passed++;
        console.log(`  ✅ ${t.description}`);
      } catch (error) {
        failed++;
        console.error(`  ❌ ${t.description}`);
        console.error(`     └─ Motivo: ${error.message}`);
      }
    }
  }

  console.log('\n==================================================');
  console.log(`📊 RESUMEN DE PRUEBAS UNITARIAS`);
  console.log(`   Total de pruebas : ${passed + failed}`);
  console.log(`   ✅ Pasaron       : ${passed}`);
  console.log(`   ❌ Fallaron      : ${failed}`);
  console.log('==================================================\n');

  if (failed > 0) {
    console.log('⚠️ Algunas pruebas han fallado. Revisa los detalles arriba.');
  } else {
    console.log('🎉 ¡Todas las pruebas unitarias pasaron exitosamente!');
  }

  return { passed, failed, total: passed + failed };
}

// Ejecutar automáticamente al correr el archivo
await runAllTests();



