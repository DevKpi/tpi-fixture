// modelos/Fase.js

class Fase {
  constructor(id, nombre, tipo) {
    this.id = id;
    this.nombre = nombre; // 'Fase de Grupos', 'Octavos de Final', etc.
    this.tipo = tipo; // 'GRUPOS', 'OCTAVOS', 'CUARTOS', 'SEMIFINAL', 'FINAL'
    this.partidos = []; // array de Partido
    this.fechaInicio = null;
    this.fechaFin = null;
  }

  agregarPartido(partido) {
    partido.fase = this.id;
    this.partidos.push(partido);
  }

  obtenerPartidos() {
    return this.partidos;
  }

  obtenerPartidosPendientes() {
    return this.partidos.filter(p => p.estado === 'PENDIENTE');
  }

  obtenerPartidosFinalizados() {
    return this.partidos.filter(p => p.estado === 'FINALIZADO');
  }

  checkEstadoFase() {
    return this.partidos.every(p => p.estado === 'FINALIZADO');
  }
}

export default Fase;
