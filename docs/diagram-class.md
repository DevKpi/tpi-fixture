# Diagrama de clases - FIFA World Cup 2026 (Fase 1)

> Estado: Implementado en código (`/modelos`). Las 8 entidades del enunciado
> original (Usuario, Mundial, Grupo, Selección, Jugador, Partido, Gol, Fase)
> más LlaveEliminatoria, Tabla y RegistroTabla como clases de soporte.

```mermaid
classDiagram
    class Usuario {
        -id: string
        -nombre: string
        -email: string
        -rol: string
        -fechaRegistro: Date
        +puedeEditarPartido(): boolean
        +puedeVerTodo(): boolean
    }

    class Mundial {
        -nombre: string
        -año: number
        -paisesAnfitriones: string[]
        -grupos: Grupo[]
        -fases: Fase[]
        -selecciones: Map
        +agregarGrupo(grupo): void
        +obtenerGrupo(id): Grupo
        +agregarFase(fase): void
        +obtenerFase(tipo): Fase
        +obtenerTodosPartidos(): Partido[]
        +obtenerSiguientePartido(): Partido
        +calcularTiempoAlSiguientePartido(): object
        +obtenerTopGoleadores(limite): Jugador[]
        +cargarDatos(fixture, equipos): void
    }

    class Grupo {
        -id: string
        -nombre: string
        -selecciones: Selección[]
        -partidos: Partido[]
        +agregarSelección(seleccion): boolean
        +agregarPartido(partido): void
        +obtenerPartidos(): Partido[]
        +calcularTabla(): Tabla
        +obtenerClasificados(): Selección[]
    }

    class Selección {
        -id: string
        -nombre: string
        -codigo: string
        -bandera: string
        -entrenador: string
        -plantilla: Jugador[]
        -grupo: Grupo
        +agregarJugador(jugador): boolean
        +obtenerJugador(numero): Jugador
        +obtenerPortero(): Jugador
        +calcularEstadísticas(): object
    }

    class Jugador {
        -id: string
        -nombre: string
        -numero: number
        -posicion: string
        -edad: number
        -seleccion: Selección
        -golesEnTorneo: number
        -asistencias: number
        -tarjetasAmarillas: number
        -tarjetasRojas: number
        +agregarGol(): void
        +agregarAsistencia(): void
        +agregarTarjeta(tipo): void
        +obtenerEstadísticas(): object
        +esDelantero(): boolean
        +esDefensa(): boolean
        +esPortero(): boolean
    }

    class Partido {
        -id: string
        -seleccionLocal: Selección
        -seleccionVisitante: Selección
        -fechaHora: Date
        -estadio: string
        -arbitro: string
        -golesLocal: number
        -golesVisitante: number
        -goles: Gol[]
        -estado: string
        -fase: string
        -grupo: string
        +registrarGol(jugador, minuto, tipo, asistencia): boolean
        +obtenerGoles(): Gol[]
        +obtenerResultado(): object
        +obtenerGanador(): Selección
        +obtenerEmpate(): boolean
        +obtenerPuntosLocal(): number
        +obtenerPuntosVisitante(): number
        +iniciar(): boolean
        +finalizar(): boolean
    }

    class Gol {
        -id: string
        -jugador: Jugador
        -minuto: number
        -tipo: string
        -asistencia: Jugador
        -fechaRegistro: Date
        +obtenerDescripcion(): string
        +esPenal(): boolean
        +esAutogol(): boolean
        +esValido(): boolean
    }

    class Fase {
        -id: string
        -nombre: string
        -tipo: string
        -partidos: Partido[]
        -fechaInicio: Date
        -fechaFin: Date
        +agregarPartido(partido): void
        +obtenerPartidos(): Partido[]
        +obtenerPartidosPendientes(): Partido[]
        +obtenerPartidosFinalizados(): Partido[]
        +estaCompleta(): boolean
    }

    class LlaveEliminatoria {
        -id: string
        -nombre: string
        -equipo1: Selección
        -equipo2: Selección
        -partido: Partido
        -ganador: Selección
        -fase: Fase
        +asignarPartido(partido): void
        +determinarGanador(): Selección
        +obtenerResumen(): object
    }

    class Tabla {
        -grupo: Grupo
        -registros: RegistroTabla[]
        +obtenerRegistro(seleccion): RegistroTabla
        +recalcular(): void
        +obtenerOrdenado(): RegistroTabla[]
    }

    class RegistroTabla {
        -seleccion: Selección
        -partidosJugados: number
        -victorias: number
        -empates: number
        -derrotas: number
        -golesAFavor: number
        -golesEnContra: number
        +registrarResultado(golesPropios, golesRivales): void
        +calcularDiferencia(): number
        +calcularPuntos(): number
        +reiniciar(): void
    }

    %% Relaciones
    Mundial "1" --> "8" Grupo : contiene
    Mundial "1" --> "*" Fase : organiza
    Mundial "1" --> "32" Selección : registra

    Grupo "1" --> "4" Selección : agrupa
    Grupo "1" --> "6" Partido : round-robin
    Grupo "1" --> "1" Tabla : calcula

    Selección "1" --> "23" Jugador : plantilla

    Partido "1" --> "1" Selección : local
    Partido "1" --> "1" Selección : visitante
    Partido "1" --> "*" Gol : registra

    Gol "1" --> "1" Jugador : marcado por
    Gol "0..1" --> "1" Jugador : asistencia

    Fase "1" --> "*" Partido : contiene
    Fase "1" --> "*" LlaveEliminatoria : genera (Fase 2)

    LlaveEliminatoria "1" --> "2" Selección : enfrenta
    LlaveEliminatoria "1" --> "0..1" Partido : define

    Tabla "1" --> "4" RegistroTabla : contiene
    RegistroTabla "1" --> "1" Selección : registra

    Usuario "1" --> "*" Partido : consulta
```

