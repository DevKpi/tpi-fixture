class Mundial {
    constructor(nombre, año, paises, grupos, fases, selecciones, partidos = [], estadios = []) {
        this.nombre = nombre;
        this.año = año;
        this.paises = paises || [];
        this.grupos = grupos || [];
        this.fases = fases || [];
        this.selecciones = selecciones || [];
        this.partidos = partidos || [];
        this.estadios = estadios || [];
    }

    AgregarGrupo(grupo) {
        this.grupos.push(grupo);
    }

    ObtenerGrupo(nombre) {
        return this.grupos.find(g => (g.group || g.name || g.nombre) === nombre);
    }

    AgregarFase(fase) {
        this.fases.push(fase);
    }

    ObtenerFase(nombreFase) {
        return this.fases.find(f => (f.nombre || f.type) === nombreFase);
    }

    ObtenerTodosPartidos() {
        return this.partidos;
    }

    ObtenerPartidosPorFase(fase) {
        if (fase === 'group') {
            return this.partidos.filter(m => typeof m.EsFaseDeGrupos === 'function' ? m.EsFaseDeGrupos() : false);
        }
        return this.partidos.filter(m => m.type === fase);
    }

    ObtenerSiguientePartido() {
        const upcoming = this.partidos
            .filter(m => m.finished === 'FALSE' || m.finished === false)
            .sort((a, b) => {
                const dateA = typeof a.ObtenerFechaObj === 'function' ? a.ObtenerFechaObj() : new Date();
                const dateB = typeof b.ObtenerFechaObj === 'function' ? b.ObtenerFechaObj() : new Date();
                return dateA - dateB;
            });
        return upcoming.length > 0 ? upcoming[0] : null;
    }

    ObtenerPartidosRecientes(limit = 5) {
        return this.partidos
            .filter(m => m.finished === 'TRUE' || m.finished === true)
            .sort((a, b) => {
                const dateA = typeof a.ObtenerFechaObj === 'function' ? a.ObtenerFechaObj() : new Date();
                const dateB = typeof b.ObtenerFechaObj === 'function' ? b.ObtenerFechaObj() : new Date();
                return dateB - dateA;
            })
            .slice(0, limit);
    }

    CalcularEstadisticasGlobales() {
        const totalMatches = this.partidos.length;
        const playedMatches = this.partidos.filter(m => m.finished === 'TRUE' || m.finished === true).length;
        const upcomingMatches = totalMatches - playedMatches;

        const totalGoals = this.partidos.reduce((sum, match) => {
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
            totalTeams: this.selecciones.length,
            totalGroups: this.grupos.length,
            totalStadiums: this.estadios.length
        };
    }

    ObtenerGoleadores(limit = 10) {
        const scorers = {};

        this.partidos.forEach(match => {
            const locales = typeof match.ObtenerGoleadoresLocales === 'function' ? match.ObtenerGoleadoresLocales() : [];
            const visitantes = typeof match.ObtenerGoleadoresVisitantes === 'function' ? match.ObtenerGoleadoresVisitantes() : [];

            locales.forEach(gol => {
                const playerName = typeof gol === 'object' && gol !== null ? gol.jugador : gol;
                scorers[playerName] = (scorers[playerName] || 0) + 1;
            });

            visitantes.forEach(gol => {
                const playerName = typeof gol === 'object' && gol !== null ? gol.jugador : gol;
                scorers[playerName] = (scorers[playerName] || 0) + 1;
            });
        });

        return Object.entries(scorers)
            .map(([player, goals]) => ({ player, goals }))
            .sort((a, b) => b.goals - a.goals)
            .slice(0, limit);
    }

    ObtenerFixture(filter = 'all') {
        const groupMatches = this.ObtenerPartidosPorFase('group');
        const knockoutMatches = this.partidos.filter(m => m.type !== 'group'); // todo lo que no es grupo

        if (filter === 'group') return groupMatches;
        if (filter === 'knockout') return knockoutMatches;

        return {
            groupStage: groupMatches,
            knockoutStage: knockoutMatches
        };
    }
}

export default Mundial;