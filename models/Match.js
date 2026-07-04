class Partido{
    constructor(id, seleccionLocal, seleccionVisitante, fechaHora, estadio, arbitro, golLocal, golVisitante, goles, estado, fase, grupo, rawMatch = {}){
        this.id = id;
        this.seleccionLocal = seleccionLocal;
        this.seleccionVisitante = seleccionVisitante;
        this.fechaHora = fechaHora;
        this.estadio = estadio;
        this.arbitro = arbitro;
        this.golLocal = golLocal;
        this.golVisitante = golVisitante;
        this.goles = goles; // Lista de goles
        this.estado = estado; // 'PENDIENTE' / 'FINALIZADO'
        this.fase = fase;
        this.grupo = grupo;

        // Propiedades de la API para compatibilidad con vistas
        this.home_team_id = rawMatch.home_team_id || '';
        this.away_team_id = rawMatch.away_team_id || '';
        this.home_score = String(golLocal ?? rawMatch.home_score ?? '0');
        this.away_score = String(golVisitante ?? rawMatch.away_score ?? '0');
        this.home_team_name_en = rawMatch.home_team_name_en || seleccionLocal || '';
        this.away_team_name_en = rawMatch.away_team_name_en || seleccionVisitante || '';
        this.home_team_label = rawMatch.home_team_label || '';
        this.away_team_label = rawMatch.away_team_label || '';
        this.local_date = rawMatch.local_date || fechaHora || '';
        this.finished = rawMatch.finished ?? (estado === 'FINALIZADO');
        this.type = rawMatch.type || fase || '';
        this.home_scorers = rawMatch.home_scorers || 'null';
        this.away_scorers = rawMatch.away_scorers || 'null';
        this.home_assists = rawMatch.home_assists || 'null';
        this.away_assists = rawMatch.away_assists || 'null';
        this.winner_decided = rawMatch.winner_decided || '';
    }

    RegistrarGol(equipo, jugador, minuto, tipo, asistencia){
        // Método de soporte para registrar un gol
        const golInfo = `${jugador} ${minuto}'${tipo === 'PENAL' ? ' (p)' : (tipo === 'AUTOGOL' ? '(OG)' : '')}`;
        if (equipo === 'local') {
            const current = this.home_scorers === 'null' ? [] : this.home_scorers.split(',');
            current.push(golInfo);
            this.home_scorers = current.join(',');
            this.golLocal = String(parseInt(this.golLocal || 0) + 1);
            this.home_score = this.golLocal;
        } else {
            const current = this.away_scorers === 'null' ? [] : this.away_scorers.split(',');
            current.push(golInfo);
            this.away_scorers = current.join(',');
            this.golVisitante = String(parseInt(this.golVisitante || 0) + 1);
            this.away_score = this.golVisitante;
        }
        if (asistencia) {
            if (equipo === 'local') {
                const curAssists = this.home_assists === 'null' ? [] : this.home_assists.split(',');
                curAssists.push(asistencia);
                this.home_assists = curAssists.join(',');
            } else {
                const curAssists = this.away_assists === 'null' ? [] : this.away_assists.split(',');
                curAssists.push(asistencia);
                this.away_assists = curAssists.join(',');
            }
        }
    }

    ObtenerGoles(){
        return {
            local: this.home_scorers === 'null' ? [] : this.home_scorers.split(','),
            visitante: this.away_scorers === 'null' ? [] : this.away_scorers.split(',')
        };
    }

    ObtenerResultado(){
        return {
            golesLocal: parseInt(this.home_score) || 0,
            golesVisitante: parseInt(this.away_score) || 0,
            ganador: this.ObtenerGanador()
        };
    }

    ObtenerGanador() {
        const local = parseInt(this.home_score) || 0;
        const visitante = parseInt(this.away_score) || 0;
        if (local > visitante) return 'local';
        if (visitante > local) return 'visitante';
        return 'empate';
    }

    ObtenerPuntosLocal(){
        const res = this.ObtenerGanador();
        if (res === 'local') return 3;
        if (res === 'empate') return 1;
        return 0;
    }

    ObtenerPuntosVisitante(){
        const res = this.ObtenerGanador();
        if (res === 'visitante') return 3;
        if (res === 'empate') return 1;
        return 0;
    }

    IniciarPartido(){
        this.estado = 'PENDIENTE';
        this.finished = false;
    }

    FinalizarPartido(){
        this.estado = 'FINALIZADO';
        this.finished = true;
    }
    
}

export default Partido;