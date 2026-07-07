class Eliminatoria {
    constructor(partido) {
        if (!partido) return;
        this.id = partido.id;
        this.nombre = typeof partido.ObtenerNombreFase === 'function' ? partido.ObtenerNombreFase() : partido.type;
        this.fase = partido.type;
        this.partido = partido;
        
        // equipos
        this.equipo1 = {
            id: partido.home_team_id,
            nombre: partido.home_team_name_en,
            goles: parseInt(partido.home_score) || 0
        };
        this.equipo2 = {
            id: partido.away_team_id,
            nombre: partido.away_team_name_en,
            goles: parseInt(partido.away_score) || 0
        };

        this.ganador = this.MostrarGanador();
    }

    MostrarGanador() {
        const finished = this.partido.finished === 'TRUE' || this.partido.finished === true;
        if (!finished) return null;

        // Lógica de penales (asumiendo que en un torneo real se usa home_penalty_score, pero por ahora solo diferenciamos por goles)
        if (this.equipo1.goles > this.equipo2.goles) return this.equipo1;
        if (this.equipo2.goles > this.equipo1.goles) return this.equipo2;
        
        // Empate - debería haber penales, devolvemos 'Empate' temporalmente
        return 'Empate';
    }

    MostrarResumen() {
        return `${this.nombre}: ${this.equipo1.nombre} (${this.equipo1.goles}) vs ${this.equipo2.nombre} (${this.equipo2.goles})`;
    }
}

export default Eliminatoria;