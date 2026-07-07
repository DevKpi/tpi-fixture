class Mundial {
    constructor(nombre, año, paises, grupos, fases, selecciones) {
        this.nombre = nombre;
        this.año = año;
        this.paises = paises;
        this.grupos = grupos;
        this.fases = fases;
        this.selecciones = selecciones;
    }

    AgregarGrupo(){

    }

    ObtenerGrupo(){

    }

    AgregarFase(){

    }

    ObtenerFase(){

    }

    ObtenerTodosPartidos(){

    }

    ObtenerSiguientePartido(partidos){
        const upcoming = partidos
            .filter(m => m.finished === 'FALSE' || m.finished === false)
            .sort((a, b) => {
                const dateA = typeof a.ObtenerFechaObj === 'function' ? a.ObtenerFechaObj() : new Date();
                const dateB = typeof b.ObtenerFechaObj === 'function' ? b.ObtenerFechaObj() : new Date();
                return dateA - dateB;
            });
        return upcoming.length > 0 ? upcoming[0] : null;
    }

    CalcularEstadisticasGlobales(partidos, equipos, grupos, estadios) {
        const totalMatches = partidos.length;
        const playedMatches = partidos.filter(m => m.finished === 'TRUE' || m.finished === true).length;
        const upcomingMatches = totalMatches - playedMatches;

        const totalGoals = partidos.reduce((sum, match) => {
            const homeGoals = parseInt(match.home_score) || 0;
            const awayGoals = parseInt(match.away_score) || 0;
            return sum + homeGoals + awayGoals;
        }, 0);

        return {
            totalMatches,
            playedMatches,
            upcomingMatches,
            progressPercent: totalMatches > 0 ? Math.round((playedMatches / totalMatches) * 100) : 0,
            totalGoals,
            averageGoalsPerMatch: totalMatches > 0 ? (totalGoals / totalMatches).toFixed(2) : 0,
            totalTeams: equipos.length,
            totalGroups: grupos.length,
            totalStadiums: estadios.length
        };
    }

}

export default Mundial;