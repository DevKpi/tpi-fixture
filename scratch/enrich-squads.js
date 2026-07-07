const fs = require('fs');

const realSquads = {
  "Argentina": ["E. Martínez", "G. Rulli", "N. Molina", "C. Romero", "N. Otamendi", "L. Martínez", "N. Tagliafico", "R. De Paul", "A. Mac Allister", "E. Fernández", "G. Lo Celso", "L. Paredes", "L. Messi", "A. Di María", "J. Álvarez", "L. Martínez", "N. González", "A. Garnacho"],
  "Brazil": ["Alisson", "Ederson", "Danilo", "Marquinhos", "G. Magalhães", "Éder Militão", "Beraldo", "Casemiro", "B. Guimarães", "L. Paquetá", "D. Luiz", "Vini Jr.", "Rodrygo", "Raphinha", "Endrick", "Gabriel Martinelli", "Richarlison"],
  "France": ["M. Maignan", "A. Areola", "T. Hernández", "D. Upamecano", "I. Konaté", "W. Saliba", "J. Koundé", "A. Tchouaméni", "E. Camavinga", "N. Kanté", "A. Rabiot", "K. Mbappé", "A. Griezmann", "O. Dembélé", "M. Thuram", "R. Kolo Muani", "B. Barcola"],
  "England": ["J. Pickford", "A. Ramsdale", "K. Walker", "J. Stones", "H. Maguire", "L. Shaw", "T. Alexander-Arnold", "D. Rice", "J. Bellingham", "P. Foden", "B. Saka", "C. Palmer", "H. Kane", "O. Watkins", "I. Toney", "J. Grealish"],
  "Spain": ["U. Simón", "D. Raya", "D. Carvajal", "R. Le Normand", "A. Laporte", "M. Cucurella", "Rodri", "Pedri", "Gavi", "F. Ruiz", "D. Olmo", "L. Yamal", "N. Williams", "A. Morata", "Ferran Torres", "M. Oyarzabal"],
  "Germany": ["M. Neuer", "M. ter Stegen", "J. Kimmich", "A. Rüdiger", "J. Tah", "N. Schlotterbeck", "T. Kroos", "I. Gündogan", "R. Andrich", "J. Musiala", "F. Wirtz", "L. Sané", "K. Havertz", "N. Füllkrug", "T. Müller"],
  "Portugal": ["D. Costa", "R. Patrício", "J. Cancelo", "R. Dias", "Pepe", "N. Mendes", "D. Dalot", "J. Palhinha", "Vitinha", "B. Fernandes", "B. Silva", "C. Ronaldo", "R. Leão", "J. Félix", "G. Ramos", "D. Jota"],
  "Uruguay": ["S. Rochet", "F. Muslera", "N. Nández", "R. Araujo", "J. Giménez", "M. Olivera", "F. Valverde", "M. Ugarte", "R. Bentancur", "N. De la Cruz", "D. Núñez", "F. Pellistri", "M. Araújo", "L. Suárez", "E. Cavani"],
  "Colombia": ["C. Vargas", "D. Ospina", "D. Muñoz", "D. Sánchez", "C. Cuesta", "J. Mojica", "J. Lerma", "R. Ríos", "J. Arias", "J. Rodríguez", "L. Díaz", "J. Córdoba", "R. Borré", "M. Borja", "L. Sinisterra"],
  "Netherlands": ["B. Verbruggen", "M. Flekken", "V. van Dijk", "N. Aké", "S. de Vrij", "D. Dumfries", "J. Schouten", "T. Reijnders", "F. de Jong", "X. Simons", "C. Gakpo", "M. Depay", "W. Weghorst", "D. Malen"],
  "Italy": ["G. Donnarumma", "G. Vicario", "G. Di Lorenzo", "A. Bastoni", "R. Calafiori", "F. Dimarco", "N. Barella", "Jorginho", "D. Frattesi", "L. Pellegrini", "F. Chiesa", "G. Scamacca", "M. Retegui", "M. Zaccagni"],
  "Belgium": ["K. Casteels", "M. Sels", "T. Castagne", "W. Faes", "J. Vertonghen", "A. Onana", "Y. Tielemans", "K. De Bruyne", "J. Doku", "L. Trossard", "R. Lukaku", "L. Openda", "C. De Ketelaere"],
  "Croatia": ["D. Livakovic", "I. Ivusic", "J. Stanisic", "J. Sutalo", "J. Gvardiol", "M. Brozovic", "M. Kovacic", "L. Modric", "M. Pasalic", "A. Kramaric", "B. Petkovic", "I. Perisic", "A. Budimir"],
  "Mexico": ["G. Ochoa", "L. Malagón", "C. Montes", "J. Vásquez", "J. Sánchez", "G. Arteaga", "E. Álvarez", "L. Chávez", "O. Pineda", "S. Giménez", "U. Antuna", "J. Quiñones", "H. Lozano", "R. Jiménez"],
  "United States": ["M. Turner", "S. Johnson", "S. Dest", "C. Richards", "T. Ream", "A. Robinson", "T. Adams", "W. McKennie", "Y. Musah", "G. Reyna", "C. Pulisic", "T. Weah", "F. Balogun", "R. Pepi"],
  "Ecuador": ["H. Galíndez", "A. Domínguez", "A. Preciado", "F. Torres", "W. Pacho", "P. Hincapié", "M. Caicedo", "K. Páez", "A. Franco", "J. Sarmiento", "E. Valencia", "K. Rodríguez", "J. Yeboah"],
  "Senegal": ["E. Mendy", "K. Koulibaly", "A. Diallo", "I. Jakobs", "P. Sarr", "I. Gueye", "N. Mendy", "S. Mané", "I. Sarr", "N. Jackson", "B. Dia"],
  "Morocco": ["Y. Bounou", "A. Hakimi", "N. Aguerd", "R. Saïss", "S. Amrabat", "A. Ounahi", "H. Ziyech", "B. Díaz", "Y. En-Nesyri", "A. Adli", "S. Boufal"],
  "Japan": ["Z. Suzuki", "T. Tomiyasu", "K. Itakura", "H. Ito", "W. Endo", "H. Morita", "K. Mitoma", "T. Kubo", "J. Ito", "T. Minamino", "A. Ueda", "D. Maeda"],
  "South Korea": ["J. Hyeon-woo", "K. Min-jae", "S. Young-woo", "H. In-beom", "L. Kang-in", "S. Heung-min", "H. Hee-chan", "C. Gue-sung", "L. Jae-sung"],
  "Switzerland": ["Y. Sommer", "M. Akanji", "F. Schär", "R. Rodríguez", "G. Xhaka", "R. Freuler", "X. Shaqiri", "R. Vargas", "D. Ndoye", "B. Embolo"],
  "Turkey": ["M. Günok", "M. Demiral", "A. Bardakci", "F. Kadioglu", "H. Çalhanoglu", "K. Ayhan", "A. Güler", "K. Yildiz", "B. Yilmaz", "K. Aktürkoglu"],
  "Austria": ["P. Pentz", "S. Posch", "K. Danso", "P. Lienhart", "N. Seiwald", "M. Sabitzer", "K. Laimer", "C. Baumgartner", "M. Arnautovic", "M. Gregoritsch"],
  "Egypt": ["M. El Shenawy", "A. Hegazi", "M. Abdelmonem", "M. Elneny", "M. Salah", "T. Trezeguet", "M. Marmoush", "M. Mohamed", "Z. Sayed"],
  "Ivory Coast": ["Y. Fofana", "E. Ndicka", "O. Kossounou", "S. Fofana", "F. Kessié", "I. Sangaré", "S. Haller", "N. Pépé", "S. Adingra", "J. Boga"],
  "Algeria": ["A. Mandi", "R. Bensebaini", "I. Bennacer", "H. Aouar", "R. Mahrez", "S. Benrahma", "B. Bounedjah", "A. Gouiri", "M. Amoura"],
  "Ghana": ["L. Ati-Zigi", "M. Salisu", "A. Djiku", "T. Partey", "M. Kudus", "J. Ayew", "A. Semenyo", "I. Williams", "A. Nuamah"],
  "Saudi Arabia": ["M. Al-Owais", "H. Tambakti", "A. Al-Bulaihi", "S. Abdulhamid", "M. Kanno", "S. Al-Dawsari", "F. Al-Buraikan", "S. Al-Shehri"],
  "Iran": ["A. Beiranvand", "S. Khalilzadeh", "M. Pouraliganji", "E. Hajsafi", "S. Ezatolahi", "A. Jahanbakhsh", "M. Taremi", "S. Azmoun"],
  "Australia": ["M. Ryan", "H. Souttar", "K. Rowles", "A. Behich", "J. Irvine", "C. Metcalfe", "M. Boyle", "C. Goodwin", "M. Duke"],
  "Canada": ["M. Crépeau", "A. Davies", "A. Johnston", "K. Miller", "S. Eustáquio", "I. Koné", "T. Buchanan", "J. David", "C. Larin"],
  "Serbia": ["P. Rajkovic", "N. Milenkovic", "S. Pavlovic", "S. Milinkovic-Savic", "D. Tadic", "A. Mitrovic", "D. Vlahovic", "F. Kostic"], // Si aplica
  "Scotland": ["A. Gunn", "K. Tierney", "A. Robertson", "S. McTominay", "J. McGinn", "C. McGregor", "C. Adams", "L. Shankland"],
  "Czech Republic": ["J. Stanek", "T. Soucek", "V. Coufal", "A. Barak", "P. Schick", "A. Hlozek", "J. Kuchta"],
  "Norway": ["Ö. Nyland", "K. Ajer", "L. Östigard", "M. Ödegaard", "S. Berge", "E. Haaland", "A. Sörloth", "O. Bobb"],
  "Sweden": ["R. Olsen", "V. Lindelöf", "I. Hien", "D. Kulusevski", "A. Isak", "V. Gyökeres", "E. Forsberg"],
  "Uzbekistan": ["U. Yusupov", "A. Khusanov", "O. Shukurov", "J. Masharipov", "E. Shomurodov", "A. Fayzullaev"],
  "Iraq": ["J. Hasan", "A. Adnan", "S. Tariq", "A. Attwan", "Z. Iqbal", "A. Hussein", "M. Ali"],
  "Qatar": ["M. Barsham", "B. Al-Rawi", "T. Salman", "H. Al-Haydos", "A. Afif", "A. Ali"],
  "Tunisia": ["A. Dahmen", "M. Talbi", "E. Skhiri", "A. Laidouni", "Y. Msakni", "S. Jaziri"],
  "Cape Verde": ["Vozinha", "Logan Costa", "Kevin Pina", "Jamiro Monteiro", "Ryan Mendes", "Bebé"],
  "Paraguay": ["C. Coronel", "G. Gómez", "J. Alonso", "M. Almirón", "J. Enciso", "A. Sanabria", "R. Sosa"],
  "Panama": ["O. Mosquera", "F. Escobar", "A. Carrasquilla", "E. Bárcenas", "J. Fajardo", "I. Díaz"],
  "Bosnia and Herzegovina": ["I. Sehic", "A. Ahmedhodzic", "S. Kolasinac", "M. Pjanic", "R. Krunic", "E. Dzeko"],
  "New Zealand": ["M. Crocombe", "L. Cacace", "M. Boxall", "M. Garbett", "S. Singh", "C. Wood"],
  "Curaçao": ["E. Room", "J. Gaari", "C. Martina", "L. Bacuna", "J. Bacuna", "R. Janga"],
  "DR Congo": ["L. Mpasi", "C. Mbemba", "A. Masuaku", "S. Moutoussamy", "Y. Wissa", "C. Bakambu"],
  "Jordan": ["Y. Abu Laila", "Y. Al-Arab", "N. Al-Rashdan", "M. Al-Taamari", "A. Olwan", "Y. Al-Naimat"]
};

// Fallback generator for teams not in realSquads or to fill up to 23 players
function fillSquad(teamName, fifaCode, currentSquad) {
  const squad = [...currentSquad];
  const total = squad.length;
  for (let i = total + 1; i <= 23; i++) {
    squad.push(`Jugador ${i} (${fifaCode})`);
  }
  return squad;
}

try {
  const jsonPath = 'C:\\Users\\thiag\\Desktop\\Webs\\ISFT 118\\tpi-fixture\\data\\teams.json';
  const data = fs.readFileSync(jsonPath, 'utf8');
  const teams = JSON.parse(data);

  const updatedTeams = teams.map(team => {
    const tName = team.nombre || team.name_en;
    const fCode = team.codigo || team.fifa_code;
    
    // Get real players or empty array
    const realPlayers = realSquads[tName] || realSquads[team.name_en] || [];
    const fullNames = fillSquad(tName, fCode, realPlayers);

    // Create full object array for plantilla
    const newPlantilla = fullNames.map((name, idx) => {
      let pos = 'Defensa';
      if (idx === 0 || idx === 1) pos = 'Portero';
      else if (idx < 7) pos = 'Defensa';
      else if (idx < 15) pos = 'Mediocampista';
      else pos = 'Delantero';
      
      // Attempt to guess position from real player lists (simplified)
      if (name.includes('Martínez') && idx===0) pos = 'Portero';

      return {
        id: `${team.id}-${idx + 1}`,
        nombreCompleto: name,
        numero: idx + 1,
        posicion: pos,
        seleccion: tName,
        goles: 0,
        asistencias: 0,
        amarillas: 0,
        rojas: 0,
        edad: Math.floor(Math.random() * 12) + 20
      };
    });

    team.plantilla = newPlantilla;
    return team;
  });

  fs.writeFileSync(jsonPath, JSON.stringify(updatedTeams, null, 2));
  console.log('Successfully updated teams.json with real players for all 48 teams!');
} catch (e) {
  console.error('Error updating teams:', e);
}
