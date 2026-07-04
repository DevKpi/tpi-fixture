class Jugador{
    constructor(id, nombreCompleto, numero, posicion, seleccion, goles, asistencias, amarillas, rojas, rawPlayer = {}){
        this.id = id;
        this.nombreCompleto = nombreCompleto || rawPlayer.nombreCompleto || '';
        this.numero = parseInt(numero ?? rawPlayer.numero ?? 0);
        this.posicion = posicion || rawPlayer.posicion || '';
        this.seleccion = seleccion || rawPlayer.seleccion || '';
        this.goles = parseInt(goles ?? rawPlayer.goles ?? 0);
        this.asistencias = parseInt(asistencias ?? rawPlayer.asistencias ?? 0);
        this.amarillas = parseInt(amarillas ?? rawPlayer.amarillas ?? 0);
        this.rojas = parseInt(rojas ?? rawPlayer.rojas ?? 0);
        
        // Propiedades de la API para compatibilidad con las vistas
        this.name = this.nombreCompleto;
    }

    AgregarGol(){
        this.goles++;
    }

    AgregarAsistencia(){
        this.asistencias++;
    }

    AgregarAmarilla(){
        this.amarillas++;
    }

    AgregarRoja(){
        this.rojas++;
    }

    SumarValla(){
        this.vallasInvictas = (this.vallasInvictas || 0) + 1;
    }

    MostrarPosicion(){
        return this.posicion;
    }

}

export default Jugador;