class RegistroTabla{
    constructor(teamId, teamName){
        this.teamId = teamId;
        this.teamName = teamName;
        this.played = 0;
        this.wins = 0;
        this.draws = 0;
        this.losses = 0;
        this.goalsFor = 0;
        this.goalsAgainst = 0;
        this.goalDifference = 0;
        this.points = 0;
    }

    RegistrarResultado(golesFavor, golesContra){
        this.played++;
        this.goalsFor += golesFavor;
        this.goalsAgainst += golesContra;
        if (golesFavor > golesContra) {
            this.wins++;
            this.points += 3;
        } else if (golesFavor === golesContra) {
            this.draws++;
            this.points += 1;
        } else {
            this.losses++;
        }
        this.CalcularDiferencia();
    }

    CalcularDiferencia(){
        this.goalDifference = this.goalsFor - this.goalsAgainst;
    }

    CalcularPuntos(){
        return this.points;
    }

    Reiniciar(){
        this.played = 0;
        this.wins = 0;
        this.draws = 0;
        this.losses = 0;
        this.goalsFor = 0;
        this.goalsAgainst = 0;
        this.goalDifference = 0;
        this.points = 0;
    }
}

export default RegistroTabla;