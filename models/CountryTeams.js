class Seleccion{
    constructor(id, nombre, bandera, entrenador, jugadores, grupo, rawTeam = {}){
        this.id = id;
        this.nombre = nombre;
        this.bandera = bandera;
        this.entrenador = entrenador;
        this.jugadores = jugadores || []; // Lista de objetos Jugador
        this.grupo = rawTeam.groups || rawTeam.grupo || grupo || '';

        // Propiedades de la API para compatibilidad con las vistas existentes
        this.name_en = rawTeam.name_en || nombre || '';
        this.name_fa = rawTeam.name_fa || '';
        this.flag = rawTeam.flag || bandera || '';
        this.fifa_code = rawTeam.fifa_code || rawTeam.codigo || '';
        this.iso2 = rawTeam.iso2 || '';
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

    ObtenerArqueroTitular(){
        // Intentar buscar al jugador con rol de Goalkeeper
        const arquero = this.jugadores.find(j => j.posicion && (j.posicion.toLowerCase().includes('goalkeeper') || j.posicion.toLowerCase().includes('arquero') || j.posicion.toLowerCase().includes('portero')));
        if (arquero && arquero.nombre) return arquero.nombre;

        // Fallback al diccionario hardcodeado si la plantilla está vacía
        const goalies = {
            'Argentina': 'E. Martínez',
            'Mexico': 'L. Malagón',
            'Germany': 'M. ter Stegen',
            'Brazil': 'Alisson',
            'France': 'M. Maignan',
            'Spain': 'Unai Simón',
            'England': 'J. Pickford',
            'United States': 'M. Turner',
            'Canada': 'M. Crépeau',
            'Netherlands': 'B. Verbruggen',
            'Morocco': 'Y. Bounou',
            'Portugal': 'Diogo Costa',
            'Belgium': 'K. Casteels',
            'Uruguay': 'S. Rochet',
            'Colombia': 'C. Vargas',
            'Italy': 'G. Donnarumma',
            'Croatia': 'D. Livaković',
            'South Africa': 'R. Williams',
            'Japan': 'Z. Suzuki',
            'Ecuador': 'A. Domínguez',
            'Switzerland': 'Y. Sommer',
            'Paraguay': 'R. Fernández'
        };
        return goalies[this.name_en] || goalies[this.nombre] || `Golero de ${this.name_en || this.nombre}`;
    }
}

export default Seleccion;