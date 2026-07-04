class Seleccion{
    constructor(id, nombre, bandera, entrenador, jugadores, grupo, rawTeam = {}){
        this.id = id;
        this.nombre = nombre;
        this.bandera = bandera;
        this.entrenador = entrenador;
        this.jugadores = jugadores || []; // Lista de objetos Jugador
        this.grupo = grupo;

        // Propiedades de la API para compatibilidad con las vistas existentes
        this.name_en = rawTeam.name_en || nombre || '';
        this.name_fa = rawTeam.name_fa || '';
        this.flag = rawTeam.flag || bandera || '';
        this.fifa_code = rawTeam.fifa_code || rawTeam.codigo || '';
        this.iso2 = rawTeam.iso2 || '';
        this.groups = rawTeam.groups || rawTeam.grupo || grupo || '';
        this.plantilla = this.jugadores;
    }

    AgregarJugador(jugador){
        this.jugadores.push(jugador);
        this.plantilla = this.jugadores;
    }

    ObtenerJugador(numero){
        return this.jugadores.find(j => j.numero === parseInt(numero) || j.numero === String(numero));
    }

    ListarPlantilla(){
        return this.jugadores;
    }

    CalcularStats(){
        let golesTotal = 0;
        let asistenciasTotal = 0;
        this.jugadores.forEach(j => {
            golesTotal += (j.goles || 0);
            asistenciasTotal += (j.asistencias || 0);
        });
        return {
            goles: golesTotal,
            asistencias: asistenciasTotal,
            plantillaCount: this.jugadores.length
        };
    }
}

export default Seleccion;