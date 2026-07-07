import Tabla from './Table.js';

class Grupo {
    constructor(id, nombre, selecciones, partidos) {
        this.id = id;
        this.nombre = nombre;
        this.selecciones = selecciones || [];
        this.partidos = partidos || [];
        this.tabla = null;
    }

    AgregarSeleccion(seleccion) {
        this.selecciones.push(seleccion);
    }

    AgregarPartido(partido) {
        this.partidos.push(partido);
    }

    CalcularTabla() {
        this.tabla = new Tabla(this.nombre);
        this.tabla.Calcular(this.partidos);
        return this.tabla.MostrarOrden(this.selecciones);
    }

    ObtenerClasificados() {
        const standingsList = this.CalcularTabla();
        return {
            clasificados: standingsList.slice(0, 2),
            eliminados: standingsList.slice(2)
        };
    }

    EstaCompleto() {
        if (this.partidos.length === 0) return false;
        const finishedMatches = this.partidos.filter(m => m.finished === 'TRUE' || m.finished === true || m.finished === 'true').length;
        return finishedMatches === this.partidos.length;
    }

    MostrarPartidos() {
        return this.partidos;
    }
}

export default Grupo;