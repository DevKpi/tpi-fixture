import fs from 'fs';
import path from 'path';

const realSquads = {
  "Argentina": ["E. Martínez", "G. Rulli", "J. Musso", "G. Montiel", "N. Molina", "L. Martínez", "N. Otamendi", "L. Balerdi", "C. Romero", "F. Medina", "N. Tagliafico", "L. Paredes", "R. De Paul", "E. Palacios", "E. Fernández", "A. Mac Allister", "G. Lo Celso", "V. Barco", "L. Messi", "N. Paz", "T. Almada", "N. González", "G. Simeone", "Lautaro Martínez", "J.M. López", "J. Álvarez"],
  "Brazil": ["Alisson", "Ederson", "Bento", "Danilo", "Yan Couto", "Marquinhos", "G. Magalhães", "Éder Militão", "Beraldo", "Bremer", "Wendell", "Guilherme Arana", "Casemiro", "B. Guimarães", "J. Gomes", "L. Paquetá", "Andreas Pereira", "Douglas Luiz", "Vini Jr.", "Rodrygo", "Raphinha", "Endrick", "Gabriel Martinelli", "Savinho", "Evanilson", "Richarlison"],
  "France": ["M. Maignan", "A. Areola", "B. Samba", "J. Koundé", "J. Clauss", "B. Pavard", "I. Konaté", "D. Upamecano", "W. Saliba", "T. Hernández", "F. Mendy", "A. Tchouaméni", "E. Camavinga", "N. Kanté", "A. Rabiot", "W. Zaïre-Emery", "Y. Fofana", "K. Mbappé", "A. Griezmann", "O. Dembélé", "K. Coman", "M. Thuram", "R. Kolo Muani", "B. Barcola", "C. Nkunku", "M. Diaby"],
  "England": ["J. Pickford", "A. Ramsdale", "D. Henderson", "K. Walker", "T. Alexander-Arnold", "J. Stones", "M. Guéhi", "L. Dunk", "J. Gomez", "E. Konsa", "L. Shaw", "K. Trippier", "D. Rice", "J. Bellingham", "C. Gallagher", "K. Mainoo", "A. Wharton", "P. Foden", "B. Saka", "C. Palmer", "J. Bowen", "E. Eze", "A. Gordon", "H. Kane", "O. Watkins", "I. Toney"],
  "Spain": ["U. Simón", "D. Raya", "A. Remiro", "D. Carvajal", "J. Navas", "R. Le Normand", "A. Laporte", "Nacho", "D. Vivian", "M. Cucurella", "A. Grimaldo", "Rodri", "M. Zubimendi", "F. Ruiz", "M. Merino", "Pedri", "F. López", "A. Baena", "L. Yamal", "N. Williams", "D. Olmo", "F. Torres", "A. Morata", "Joselu", "M. Oyarzabal", "A. Pérez"],
  "Germany": ["M. Neuer", "M. ter Stegen", "O. Baumann", "J. Kimmich", "B. Henrichs", "A. Rüdiger", "J. Tah", "N. Schlotterbeck", "W. Anton", "M. Mittelstädt", "D. Raum", "R. Andrich", "A. Pavlovic", "P. Groß", "I. Gündogan", "T. Kroos", "J. Musiala", "F. Wirtz", "L. Sané", "C. Führich", "T. Müller", "K. Havertz", "N. Füllkrug", "D. Undav", "M. Beier", "S. Gnabry"],
  "Portugal": ["D. Costa", "R. Patrício", "J. Sá", "J. Cancelo", "N. Semedo", "D. Dalot", "R. Dias", "Pepe", "A. Silva", "G. Inácio", "N. Mendes", "J. Palhinha", "R. Neves", "J. Neves", "Vitinha", "M. Nunes", "B. Fernandes", "B. Silva", "C. Ronaldo", "R. Leão", "J. Félix", "G. Ramos", "D. Jota", "P. Neto", "F. Conceição", "Otávio"],
  "Uruguay": ["S. Rochet", "S. Mele", "F. Israel", "N. Nández", "G. Varela", "R. Araujo", "J. Giménez", "S. Cáceres", "N. Marichal", "M. Olivera", "L. Olaza", "F. Valverde", "M. Ugarte", "R. Bentancur", "E. Martínez", "N. De la Cruz", "G. De Arrascaeta", "F. Pellistri", "M. Araújo", "B. Rodríguez", "F. Torres", "D. Núñez", "L. Suárez", "C. Olivera", "F. Viñas", "L. Rodríguez"],
  "Colombia": ["C. Vargas", "D. Ospina", "A. Montero", "D. Muñoz", "S. Arias", "D. Sánchez", "C. Cuesta", "Y. Mina", "J. Lucumí", "J. Mojica", "D. Machado", "J. Lerma", "R. Ríos", "M. Uribe", "K. Castaño", "J. Arias", "J. Rodríguez", "J. Quintero", "Y. Asprilla", "L. Díaz", "J. Córdoba", "R. Borré", "M. Borja", "L. Sinisterra", "J. Durán", "R. Colombia"],
  "Netherlands": ["B. Verbruggen", "M. Flekken", "J. Bijlow", "D. Dumfries", "L. Geertruida", "V. van Dijk", "N. Aké", "S. de Vrij", "M. de Ligt", "M. van de Ven", "D. Blind", "J. Schouten", "T. Reijnders", "F. de Jong", "G. Wijnaldum", "J. Veerman", "R. Gravenberch", "X. Simons", "C. Gakpo", "M. Depay", "W. Weghorst", "D. Malen", "S. Bergwijn", "J. Frimpong", "B. Brobbey", "J. Zirkzee"],
  "Italy": ["G. Donnarumma", "G. Vicario", "A. Meret", "G. Di Lorenzo", "R. Bellanova", "A. Bastoni", "R. Calafiori", "A. Buongiorno", "G. Mancini", "F. Gatti", "F. Dimarco", "A. Cambiaso", "N. Barella", "Jorginho", "B. Cristante", "D. Frattesi", "L. Pellegrini", "N. Fagioli", "M. Folorunsho", "F. Chiesa", "G. Scamacca", "M. Retegui", "M. Zaccagni", "G. Raspadori", "S. El Shaarawy", "R. Orsolini"],
  "Belgium": ["K. Casteels", "M. Sels", "T. Kaminski", "T. Castagne", "T. Meunier", "W. Faes", "J. Vertonghen", "Z. Debast", "A. Theate", "M. De Cuyper", "A. Onana", "Y. Tielemans", "O. Mangala", "A. Vranckx", "A. Vermeeren", "K. De Bruyne", "J. Doku", "L. Trossard", "Y. Carrasco", "R. Lukaku", "L. Openda", "C. De Ketelaere", "J. Bakayoko", "D. Lukebakio", "M. Batshuayi", "T. Hazard"],
  "Croatia": ["D. Livakovic", "I. Ivusic", "N. Labrovic", "J. Stanisic", "J. Juranovic", "J. Sutalo", "J. Gvardiol", "D. Vida", "M. Erlic", "M. Pongracic", "B. Sosa", "M. Brozovic", "M. Kovacic", "L. Modric", "M. Pasalic", "L. Majer", "L. Ivanusec", "M. Baturina", "P. Sucic", "A. Kramaric", "B. Petkovic", "I. Perisic", "A. Budimir", "M. Pjaca", "M. Pasalic", "N. Vlasic"],
  "Mexico": ["J. González", "L. Malagón", "C. Acevedo", "J. Sánchez", "I. Reyes", "C. Montes", "J. Vásquez", "V. Guzmán", "G. Arteaga", "B. García", "E. Álvarez", "L. Romo", "E. Sánchez", "L. Chávez", "O. Pineda", "C. Rodríguez", "F. Beltrán", "M. Flores", "S. Giménez", "G. Martínez", "J. Quiñones", "U. Antuna", "R. Alvarado", "C. Huerta", "A. Vega", "H. Lozano"],
  "United States": ["M. Turner", "E. Horvath", "S. Johnson", "S. Dest", "J. Scally", "C. Richards", "T. Ream", "M. Robinson", "C. Carter-Vickers", "A. Robinson", "K. Lund", "T. Adams", "W. McKennie", "Y. Musah", "G. Reyna", "J. Cardoso", "M. Tillman", "L. de la Torre", "C. Pulisic", "T. Weah", "F. Balogun", "R. Pepi", "J. Sargent", "H. Wright", "B. Aaronson", "T. Tillman"],
  "Ecuador": ["H. Galíndez", "A. Domínguez", "M. Ramírez", "A. Preciado", "J. Hurtado", "F. Torres", "W. Pacho", "P. Hincapié", "J. Ordóñez", "L. Realpe", "J. Chávez", "M. Caicedo", "C. Gruezo", "A. Franco", "K. Páez", "J. Cifuentes", "J. Ortiz", "J. Sarmiento", "J. Yeboah", "A. Mena", "A. Minda", "E. Valencia", "K. Rodríguez", "J. Caicedo", "E. Valencia", "G. Plata"],
  "Senegal": ["E. Mendy", "S. Dieng", "M. Diaw", "K. Koulibaly", "A. Diallo", "M. Niakhaté", "A. Seck", "F. Mendy", "I. Jakobs", "N. Mendy", "I. Gueye", "P. Sarr", "C. Kouyaté", "P. Ciss", "K. Diatta", "L. Camara", "S. Mané", "I. Sarr", "H. Diallo", "N. Jackson", "B. Dia", "I. Ndiaye", "A. Sima", "B. Dieng", "A. Diallo", "M. Lopy"],
  "Morocco": ["Y. Bounou", "M. Mohamedi", "M. Benabid", "A. Hakimi", "N. Mazraoui", "N. Aguerd", "R. Saïss", "C. Riad", "Y. Attiyat Allah", "A. Abqar", "S. Amrabat", "A. Ounahi", "I. Saibari", "B. El Khannouss", "A. Richardson", "O. El Azzouzi", "H. Ziyech", "B. Díaz", "A. Adli", "S. Boufal", "A. Ezzalzouli", "E. Ben Seghir", "Y. En-Nesyri", "A. El Kaabi", "S. Rahimi", "I. Akhomach"],
  "Japan": ["Z. Suzuki", "D. Maekawa", "T. F. Kokubo", "T. Tomiyasu", "K. Itakura", "H. Ito", "S. Taniguchi", "Y. Sugawara", "D. Hashioka", "Y. Nakayama", "W. Endo", "H. Morita", "A. Tanaka", "R. Hatate", "T. Kubo", "K. Mitoma", "J. Ito", "T. Minamino", "R. Doan", "K. Nakamura", "A. Ueda", "D. Maeda", "T. Asano", "K. Ogawa", "Y. Soma", "K. Kamada"],
  "South Korea": ["J. Hyeon-woo", "S. Bum-keun", "L. Chang-geun", "K. Min-jae", "S. Young-woo", "K. Jin-su", "K. Moon-hwan", "J. Seung-hyun", "C. Yu-min", "K. Kwon", "H. In-beom", "L. Kang-in", "L. Jae-sung", "J. Woo-young", "P. Yong-woo", "H. Seon-min", "S. Heung-min", "H. Hee-chan", "C. Gue-sung", "O. Hyeon-gyu", "J. Min-kyu", "L. Dong-gyeong", "B. Seung-ho", "U. Won-sang", "K. Ji-soo", "S. Min-kyu"],
  "Switzerland": ["Y. Sommer", "G. Kobel", "Y. Mvogo", "M. Akanji", "F. Schär", "N. Elvedi", "R. Rodríguez", "S. Widmer", "L. Stergiou", "C. Zesiger", "G. Xhaka", "R. Freuler", "D. Zakaria", "M. Aebischer", "V. Sierro", "X. Shaqiri", "R. Vargas", "D. Ndoye", "F. Rieder", "B. Embolo", "Z. Amdouni", "K. Duah", "S. Zuber", "R. Steffen", "N. Okafor", "A. Jashari"],
  "Turkey": ["M. Günok", "U. Çakir", "A. Bayindir", "M. Demiral", "A. Bardakci", "S. Akaydin", "M. Müldür", "Z. Çelik", "F. Kadioglu", "A. Kaplan", "H. Çalhanoglu", "K. Ayhan", "S. Özcan", "O. Kökçü", "I. Yüksek", "A. Güler", "K. Yildiz", "B. Yilmaz", "K. Aktürkoglu", "I. Kahveci", "Y. Yazici", "C. Tosun", "S. Kilicsoy", "Y. Akgün", "B. Özcan", "A. Ömür"],
  "Austria": ["P. Pentz", "H. Lindner", "N. Hedl", "S. Posch", "K. Danso", "P. Lienhart", "M. Wöber", "P. Mwene", "A. Prass", "F. Grillitsch", "N. Seiwald", "M. Sabitzer", "K. Laimer", "C. Baumgartner", "R. Schmid", "M. Gregoritsch", "M. Arnautovic", "P. Wimmer", "A. Weimann", "M. Entrup", "L. Querfeld", "G. Trauner", "F. Kainz", "M. Grüll", "A. Schlager", "S. Lainer"],
  "Egypt": ["M. El Shenawy", "A. El Shenawy", "M. Gabaski", "A. Hegazi", "M. Abdelmonem", "Y. Ibrahim", "M. Hany", "O. Kamal", "A. Fotouh", "M. Hamdi", "M. Elneny", "H. Fathi", "M. Attia", "E. Ashour", "A. Zizo", "M. Salah", "T. Trezeguet", "M. Marmoush", "M. Mohamed", "M. Kahraba", "A. Rayan", "M. Shalaby", "A. Kouka", "M. Fathi", "M. Lasheen", "Z. Sayed"],
  "Ivory Coast": ["Y. Fofana", "C. Folly", "B. Sangaré", "E. Ndicka", "O. Kossounou", "W. Boly", "S. Aurier", "W. Singo", "G. Konan", "I. Diallo", "S. Fofana", "F. Kessié", "I. Sangaré", "J. Seri", "S. Adingra", "N. Pépé", "J. Boga", "M. Gradel", "S. Haller", "J. Krasso", "O. Diakité", "C. Kouamé", "E. Agbadou", "O. Ndicka", "I. Doumbia", "S. Diakité"],
  "Algeria": ["A. Mandi", "A. Oukidja", "M. Zeghba", "R. Bensebaini", "M. Tougai", "A. Touba", "Y. Atal", "K. Guitoun", "R. Aït-Nouri", "I. Bennacer", "H. Aouar", "N. Bentaleb", "R. Zerrouki", "S. Feghouli", "R. Mahrez", "S. Benrahma", "A. Gouiri", "B. Bounedjah", "M. Amoura", "A. Ounas", "F. Chaïbi", "Y. Belaïli", "I. Slimani", "B. Brahimi", "M. Zorgane", "A. Kadri"],
  "Ghana": ["L. Ati-Zigi", "R. Ofori", "J. Wollacott", "M. Salisu", "A. Djiku", "D. Amartey", "A. Seidu", "G. Mensah", "D. Odoi", "T. Partey", "S. Abdul Samed", "E. Addo", "M. Ashimeru", "M. Kudus", "J. Ayew", "A. Semenyo", "I. Williams", "A. Nuamah", "E. Nuamah", "I. Osman", "A. Bukari", "K. Schindler", "E. Owusu", "J. Paintsil", "A. Baba", "B. Tetteh"],
  "Saudi Arabia": ["M. Al-Owais", "N. Al-Aqidi", "A. Al-Najjar", "H. Tambakti", "A. Al-Bulaihi", "A. Lajami", "S. Abdulhamid", "Y. Al-Shahrani", "A. Hazazi", "M. Kanno", "S. Al-Faraj", "A. Al-Malki", "F. Al-Ghamdi", "S. Al-Dawsari", "F. Al-Buraikan", "S. Al-Shehri", "A. Ghareeb", "A. Radif", "M. Maran", "S. Al-Najei", "A. Al-Hassan", "M. Al-Khaibari", "F. Al-Muwallad", "A. Al-Saluli", "S. Al-Ghannam", "H. Kadesh"],
  "Iran": ["A. Beiranvand", "H. Hosseini", "P. Niazmand", "S. Khalilzadeh", "M. Pouraliganji", "H. Kanaani", "R. Rezaeian", "S. Moharrami", "E. Hajsafi", "M. Mohammadi", "S. Ezatolahi", "A. Nourollahi", "S. Ghoddos", "O. Ebrahimi", "A. Jahanbakhsh", "M. Taremi", "S. Azmoun", "M. Mohebi", "M. Torabi", "A. Gholizadeh", "K. Ansarifard", "R. Asadi", "M. Ghayedi", "A. Jalali", "S. Fallah", "S. Hosseini"],
  "Australia": ["M. Ryan", "J. Gauci", "L. Thomas", "H. Souttar", "K. Rowles", "C. Burgess", "A. Behich", "J. Bos", "N. Atkinson", "G. Jones", "J. Irvine", "C. Metcalfe", "A. O'Neill", "K. Baccus", "R. McGree", "M. Boyle", "C. Goodwin", "M. Duke", "K. Yengi", "S. Silvera", "B. Fornaroli", "J. Maclaren", "A. Mabil", "M. Luongo", "P. Yazbek", "J. Iredale"],
  "Canada": ["M. Crépeau", "D. St. Clair", "T. McGill", "A. Davies", "A. Johnston", "K. Miller", "D. Cornelius", "M. Bombito", "R. Laryea", "L. Singh", "S. Eustáquio", "I. Koné", "M. Choinière", "S. Piette", "T. Buchanan", "J. David", "C. Larin", "L. Millar", "J. Shaffelburg", "T. Bair", "I. Ugbo", "C. Laryea", "A. Ahmed", "K. Osorio", "J. Waterman", "K. Hiebert"],
  "Serbia": ["P. Rajkovic", "V. Milinkovic-Savic", "D. Petrovic", "N. Milenkovic", "S. Pavlovic", "M. Veljkovic", "S. Babic", "U. Spajic", "S. Milinkovic-Savic", "N. Gudelj", "I. Ilic", "S. Lukic", "N. Maksimovic", "D. Tadic", "A. Zivkovic", "F. Kostic", "M. Gacinovic", "A. Mitrovic", "D. Vlahovic", "L. Jovic", "P. Ratkov", "L. Samardzic", "V. Birmancevic", "N. Radonjic", "F. Mladenovic", "S. Mijailovic"],
  "Scotland": ["A. Gunn", "Z. Clark", "L. Kelly", "K. Tierney", "A. Robertson", "G. Hanley", "J. Hendry", "R. Porteous", "S. McKenna", "A. Ralston", "G. Taylor", "S. McTominay", "J. McGinn", "C. McGregor", "B. Gilmour", "R. Christie", "S. Armstrong", "R. Jack", "C. Adams", "L. Shankland", "J. Forrest", "T. Conway", "M. McLean", "G. Hanley", "S. McKenna", "R. McCrorie"],
  "Czech Republic": ["J. Stanek", "M. Kovar", "V. Jaros", "T. Holes", "R. Hranac", "L. Krejci", "V. Coufal", "D. Doudera", "D. Jurasek", "T. Vlcek", "T. Soucek", "L. Provod", "P. Sulc", "A. Barak", "M. Sadilek", "V. Cerny", "O. Lingr", "M. Jurasek", "P. Schick", "A. Hlozek", "J. Kuchta", "T. Chory", "M. Chytil", "D. Zima", "T. Holes", "J. Stanek"],
  "Norway": ["Ö. Nyland", "E. Selvik", "M. Dyngeland", "K. Ajer", "L. Östigard", "S. Strandberg", "B. Meling", "J. Ryerson", "M. Pedersen", "M. Ödegaard", "S. Berge", "P. Berg", "F. Aursnes", "O. Solbakken", "A. Nusa", "O. Bobb", "M. Elyounoussi", "E. Haaland", "A. Sörloth", "J. Larsen", "H. Vetlesen", "K. Thorstvedt", "A. Schjelderup", "D. Donnum", "K. Thorstvedt", "S. Berge"],
  "Sweden": ["R. Olsen", "K. Nordfeldt", "V. Johansson", "V. Lindelöf", "I. Hien", "C. Starfelt", "L. Augustinsson", "E. Krafth", "E. Holm", "D. Kulusevski", "M. Svanberg", "J. Cajuste", "S. Gustafson", "A. Salétros", "E. Forsberg", "A. Isak", "V. Gyökeres", "A. Elanga", "J. Karlsson", "G. Nyberg", "S. Nanasi", "A. Isak", "V. Gyökeres", "H. Larsson", "C. Nyman", "A. Ekdal"],
  "Uzbekistan": ["U. Yusupov", "A. Nematov", "B. Ergashev", "A. Khusanov", "R. Ashurmatov", "U. Eshmurodov", "F. Sayfiev", "K. Alikulov", "O. Shukurov", "O. Khalbekov", "J. Masharipov", "O. Urunov", "A. Fayzullaev", "E. Shomurodov", "I. Sergeev", "H. Erkinov", "A. Turgunboev", "S. Nasrullaev", "A. Abdullaev", "D. Khashimov", "I. Kobilov", "S. Andreev", "D. Hamdamov", "J. Iskanderov", "S. Muhammadjonov", "A. Amanov"],
  "Iraq": ["J. Hasan", "F. Talib", "A. Basil", "A. Adnan", "R. Sulaka", "S. Natiq", "H. Ali", "M. Doski", "A. Yahya", "A. Attwan", "O. Rashid", "Z. Iqbal", "A. Ammari", "I. Bayesh", "Y. Amyn", "B. Resan", "A. Hussein", "M. Ali", "A. Al-Hamadi", "A. Jasim", "M. M. Ali", "A. Ghadhban", "F. Jassim", "H. Jabbar", "A. Farhan", "Z. Tahseen"],
  "Qatar": ["M. Barsham", "S. Al-Sheeb", "S. Zakaria", "B. Al-Rawi", "T. Salman", "L. Mendes", "P. Miguel", "H. Al-Amin", "A. Hatem", "J. Gaber", "M. Waad", "A. Fatehi", "M. Meshaal", "H. Al-Haydos", "A. Afif", "A. Ali", "Y. Abdurisag", "I. Mohammad", "K. Mazeed", "A. Al-Rawi", "T. Al-Abdullah", "M. Ali", "A. Al-Ahrak", "N. Al-Yazidi", "A. Surag", "S. Al-Brake"],
  "Tunisia": ["A. Dahmen", "B. Ben Said", "M. Hassen", "M. Talbi", "Y. Meriah", "O. Haddadi", "A. Maaloul", "W. Kechrida", "M. Dräger", "E. Skhiri", "A. Laidouni", "M. Ben Romdhane", "H. Mejbri", "A. Ben Slimane", "Y. Msakni", "N. Sliti", "S. Jaziri", "I. Jebali", "T. Khenissi", "A. Ben Romdhane", "F. Sassi", "G. Chalali", "W. Khazri", "H. Rafia", "A. Abdi", "S. Bguir"],
  "Cape Verde": ["Vozinha", "M. Rosa", "D. Silva", "L. Costa", "P. Pico", "D. Tavares", "J. Paulo", "S. Moreira", "K. Pina", "J. Monteiro", "D. Pina", "P. Andrade", "R. Mendes", "Bebé", "J. Tavares", "G. Rodrigues", "W. Semedo", "G. Borges", "D. Tavares", "S. Fortes", "H. Tavares", "J. Correia", "B. Leite", "C. Tavares", "E. Borges", "E. Rocha"],
  "Paraguay": ["C. Coronel", "A. Silva", "R. Fernández", "G. Gómez", "J. Alonso", "F. Balbuena", "O. Alderete", "M. Espinoza", "I. Ramírez", "M. Villasanti", "A. Cubas", "R. Sánchez", "M. Rojas", "D. Gómez", "M. Almirón", "J. Enciso", "R. Sosa", "A. Sanabria", "A. Bareiro", "D. González", "C. Domínguez", "H. Martínez", "B. Riveros", "M. Rojas", "O. Romero", "A. Romero"],
  "Panama": ["O. Mosquera", "L. Mejía", "C. Samudio", "F. Escobar", "A. Andrade", "J. Córdoba", "M. Murillo", "E. Davis", "A. Carrasquilla", "C. Martínez", "A. Godoy", "J. Welch", "E. Bárcenas", "J. Rodríguez", "I. Díaz", "J. Fajardo", "C. Waterman", "E. Guerrero", "C. Blackman", "J. Díaz", "A. Stephens", "R. Miller", "C. Harvey", "G. Torres", "A. Quintero", "A. Machado"],
  "Bosnia and Herzegovina": ["I. Sehic", "N. Vasilj", "K. Piric", "A. Ahmedhodzic", "S. Kolasinac", "D. Hadzikadunic", "A. Dedic", "J. Gazibegovic", "M. Pjanic", "R. Krunic", "A. Hadziahmetovic", "G. Cimirot", "B. Tahirovic", "M. Stevanovic", "E. Dzeko", "E. Demirovic", "S. Prevljak", "L. Menalo", "H. Tabakovic", "D. Varesanovic", "S. Loncar", "A. Kovacevic", "E. Civic", "S. Sanicanin", "N. Mujakic", "A. Gojak"],
  "New Zealand": ["M. Crocombe", "O. Sail", "A. Paulsen", "L. Cacace", "M. Boxall", "T. Smith", "F. Surman", "D. Ingham", "T. Payne", "M. Garbett", "S. Singh", "M. Stamenic", "J. Bell", "A. Rufer", "C. Wood", "E. Just", "B. Waine", "C. McCowatt", "M. Mata", "K. Barbarouses", "B. Old", "O. Greive", "J. Herdman", "D. Bindon", "L. Gillion", "T. Bindon"],
  "Curaçao": ["E. Room", "T. Bodak", "R. Doornbusch", "J. Gaari", "C. Martina", "J. Floranus", "S. Carmelia", "R. Janga", "L. Bacuna", "J. Bacuna", "K. Felida", "R. Anita", "X. Severina", "K. Antonisse", "R. Janga", "G. Roemeratoe", "J. Locadia", "J. Margaritha", "E. Kuwas", "B. Kuwas", "C. Benschop", "S. Kastaneer", "V. Anita", "J. Van Kessel", "D. Benschop", "G. Kastaneer"],
  "DR Congo": ["L. Mpasi", "D. Bertaud", "S. Siadi", "C. Mbemba", "A. Masuaku", "H. Inonga", "G. Kalulu", "J. Kayembe", "S. Moutoussamy", "C. Pickel", "A. Tshibola", "Y. Wissa", "C. Bakambu", "T. Bongonda", "G. Diangana", "F. Mayele", "S. Banza", "M. Elia", "E. Ogbodo", "B. Badiashile", "J. Leko", "J. Mpanzu", "E. Kabongo", "K. Diatta", "I. Luvumbo", "M. Katompa"],
  "Jordan": ["Y. Abu Laila", "A. Al-Fakhouri", "A. Juaidi", "Y. Al-Arab", "A. Nasib", "S. Al-Ajalin", "I. Haddad", "M. Abu Hasheesh", "N. Al-Rashdan", "N. Al-Rawabdeh", "R. Ayed", "I. Sadeh", "M. Al-Taamari", "A. Olwan", "Y. Al-Naimat", "M. Abu Taha", "S. Al-Hourani", "B. Al-Basha", "H. Al-Dardour", "Y. Al-Baour", "B. Abdul-Rahman", "M. Al-Mardi", "A. Ersan", "F. Shilbaya", "S. Zraiqat", "O. Hani"]
};

// Generador genérico si falta alguna
function fillSquad(teamName, fifaCode, currentSquad) {
  const squad = [...currentSquad];
  const total = squad.length;
  for (let i = total + 1; i <= 26; i++) {
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
    
    let realPlayers = realSquads[tName] || realSquads[team.name_en] || [];
    // Recortar a 26 si me pasé
    realPlayers = realPlayers.slice(0, 26);
    const fullNames = fillSquad(tName, fCode, realPlayers);

    const newPlantilla = fullNames.map((name, idx) => {
      let pos = 'Defensa';
      if (idx === 0 || idx === 1 || idx === 2) pos = 'Portero';
      else if (idx < 9) pos = 'Defensa';
      else if (idx < 17) pos = 'Mediocampista';
      else pos = 'Delantero';
      
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
  console.log('Successfully updated teams.json with 26-man squads for all 48 teams!');
} catch (e) {
  console.error('Error updating teams:', e);
}
