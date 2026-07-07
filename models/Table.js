import RegistroTabla from './TableRegister.js';

class Tabla{
    constructor(grupo){
        this.grupo = grupo;
        this.registros = {};
    }

    ObtenerRegistro(teamId, teamName){
        if (!this.registros[teamId]) {
            this.registros[teamId] = new RegistroTabla(teamId, teamName);
        }
        return this.registros[teamId];
    }

    Calcular(partidos){
        partidos.forEach(match => {
            const finished = match.finished === 'TRUE' || match.finished === true || match.finished === 'true';
            if (!finished) return;

            const homeId = String(match.home_team_id);
            const awayId = String(match.away_team_id);
            const homeScore = parseInt(match.home_score) || 0;
            const awayScore = parseInt(match.away_score) || 0;

            const localReg = this.ObtenerRegistro(homeId, match.home_team_name_en);
            const awayReg = this.ObtenerRegistro(awayId, match.away_team_name_en);

            localReg.RegistrarResultado(homeScore, awayScore);
            awayReg.RegistrarResultado(awayScore, homeScore);
        });
    }

    MostrarOrden(equiposBase){
        // Inicializar los que no jugaron
        if (equiposBase) {
            equiposBase.forEach(t => {
                this.ObtenerRegistro(String(t.id), t.name_en || t.nombre);
            });
        }

        return Object.values(this.registros).sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
            return b.goalsFor - a.goalsFor;
        });
    }
}

export default Tabla;