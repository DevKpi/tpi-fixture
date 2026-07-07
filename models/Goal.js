class Gol {
    constructor(id, jugador, minuto, etapa, asistidor){
        this.id = id;
        this.jugador = jugador;
        this.minuto = minuto;
        this.etapa = etapa;
        this.asistidor = asistidor;
    }

    MostrarDescripcion(){
        return `${this.jugador} ${this.minuto ? `(${this.minuto})` : ''}`;
    }

    static ParsearDeString(rawString) {
        if (!rawString) return null;
        const cleaned = rawString.trim().replace(/[{}"“”]/g, '');
        // Extraer nombre y minuto, ej "L. Messi 45+2'"
        const regex = /(.*?)\s+(\d+('|\+)?\d*'?)$/;
        const match = cleaned.match(regex);
        
        if (match) {
            return new Gol(null, match[1].trim(), match[2], '', null);
        }
        return new Gol(null, cleaned, '', '', null);
    }
}

export default Gol;