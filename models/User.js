class Usuario {
    #password
    constructor(id, email, pass) {
        this.id = id;
        this.email = email;
        this.#password = pass;
        this.progress = 0;
    }

    AnotarResultados(partidos){
        const totalMatches = 104;
        const finishedMatches = partidos.filter(m => m.finished === 'TRUE' || m.finished === true || m.finished === 'true').length;
        this.progress = Math.round((finishedMatches / totalMatches) * 100);
        
        return {
            finishedMatches,
            totalMatches,
            percentage: this.progress
        };
    }

    static LogIn(username){
        if (!username) return false;
        localStorage.setItem('worldcup2026_user', username);
        return true;
    }

    static LogOut(){
        localStorage.removeItem('worldcup2026_user');
    }

    static ObtenerUsuarioActual() {
        const username = localStorage.getItem('worldcup2026_user');
        if (username) {
            return new Usuario(username, username, null);
        }
        return null;
    }
}

export default Usuario;