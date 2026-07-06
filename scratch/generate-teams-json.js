import https from 'https';
import fs from 'fs';
import path from 'path';

https.get('https://worldcup26.ir/get/teams', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      const apiTeams = parsed.teams || [];
      
      if (apiTeams.length === 0) {
        console.error('No teams found in API');
        return;
      }
      
      const coaches = {
        'Argentina': 'Lionel Scaloni',
        'France': 'Didier Deschamps',
        'Brazil': 'Dorival Júnior',
        'Spain': 'Luis de la Fuente',
        'Germany': 'Julian Nagelsmann',
        'England': 'Thomas Tuchel',
        'Portugal': 'Roberto Martínez',
        'Italy': 'Luciano Spalletti',
        'Uruguay': 'Marcelo Bielsa',
        'Colombia': 'Néstor Lorenzo',
        'Mexico': 'Javier Aguirre',
        'United States': 'Mauricio Pochettino',
        'Canada': 'Jesse Marsch'
      };

      const realPlayers = {
        'Argentina': [
          { name: 'E. Martínez', pos: 'Portero', num: 23 },
          { name: 'G. Rulli', pos: 'Portero', num: 1 },
          { name: 'W. Benítez', pos: 'Portero', num: 12 },
          { name: 'N. Molina', pos: 'Defensa', num: 4 },
          { name: 'C. Romero', pos: 'Defensa', num: 13 },
          { name: 'N. Otamendi', pos: 'Defensa', num: 19 },
          { name: 'L. Martínez', pos: 'Defensa', num: 25 },
          { name: 'G. Montiel', pos: 'Defensa', num: 8 },
          { name: 'N. Tagliafico', pos: 'Defensa', num: 3 },
          { name: 'M. Acuña', pos: 'Defensa', num: 6 },
          { name: 'R. De Paul', pos: 'Mediocampista', num: 7 },
          { name: 'A. Mac Allister', pos: 'Mediocampista', num: 20 },
          { name: 'E. Fernández', pos: 'Mediocampista', num: 24 },
          { name: 'L. Paredes', pos: 'Mediocampista', num: 5 },
          { name: 'G. Lo Celso', pos: 'Mediocampista', num: 16 },
          { name: 'Ex. Palacios', pos: 'Mediocampista', num: 14 },
          { name: 'L. Messi', pos: 'Delantero', num: 10 },
          { name: 'A. Di María', pos: 'Delantero', num: 11 },
          { name: 'L. Martínez', pos: 'Delantero', num: 22 },
          { name: 'J. Álvarez', pos: 'Delantero', num: 9 },
          { name: 'N. González', pos: 'Delantero', num: 15 },
          { name: 'A. Garnacho', pos: 'Delantero', num: 17 },
          { name: 'V. Carboni', pos: 'Delantero', num: 21 }
        ],
        'Mexico': [
          { name: 'L. Malagón', pos: 'Portero', num: 1 },
          { name: 'G. Ochoa', pos: 'Portero', num: 13 },
          { name: 'J. González', pos: 'Portero', num: 12 },
          { name: 'C. Montes', pos: 'Defensa', num: 3 },
          { name: 'J. Vásquez', pos: 'Defensa', num: 5 },
          { name: 'J. Sánchez', pos: 'Defensa', num: 19 },
          { name: 'G. Arteaga', pos: 'Defensa', num: 2 },
          { name: 'B. González', pos: 'Defensa', num: 26 },
          { name: 'I. Reyes', pos: 'Defensa', num: 4 },
          { name: 'J. Araujo', pos: 'Defensa', num: 18 },
          { name: 'E. Álvarez', pos: 'Mediocampista', num: 4 },
          { name: 'L. Chávez', pos: 'Mediocampista', num: 24 },
          { name: 'L. Romo', pos: 'Mediocampista', num: 7 },
          { name: 'E. Sánchez', pos: 'Mediocampista', num: 14 },
          { name: 'C. Rodríguez', pos: 'Mediocampista', num: 8 },
          { name: 'O. Pineda', pos: 'Mediocampista', num: 17 },
          { name: 'S. Giménez', pos: 'Delantero', num: 9 },
          { name: 'U. Antuna', pos: 'Delantero', num: 15 },
          { name: 'J. Quiñones', pos: 'Delantero', num: 16 },
          { name: 'R. Alvarado', pos: 'Delantero', num: 25 },
          { name: 'C. Huerta', pos: 'Delantero', num: 21 },
          { name: 'A. Vega', pos: 'Delantero', num: 10 },
          { name: 'G. Martínez', pos: 'Delantero', num: 22 }
        ]
      };

      const finalTeamsList = apiTeams.map(team => {
        const name = team.name_en;
        const coach = coaches[name] || `DT de ${name}`;
        
        let squad = [];
        const hasRealSquad = realPlayers[name];
        
        if (hasRealSquad) {
          squad = realPlayers[name].map((p, idx) => ({
            id: `${team.id}-${idx + 1}`,
            nombreCompleto: p.name,
            numero: p.num,
            posicion: p.pos,
            seleccion: name,
            goles: 0,
            asistencias: 0,
            amarillas: 0,
            rojas: 0,
            edad: Math.floor(Math.random() * 12) + 20 // 20 a 31 años
          }));
        } else {
          // Generar plantilla genérica para otros países
          for (let i = 1; i <= 23; i++) {
            let pos = 'Defensa';
            if (i <= 3) pos = 'Portero';
            else if (i <= 10) pos = 'Defensa';
            else if (i <= 17) pos = 'Mediocampista';
            else pos = 'Delantero';
            
            squad.push({
              id: `${team.id}-${i}`,
              nombreCompleto: `Jugador ${i} (${team.fifa_code})`,
              numero: i,
              posicion: pos,
              seleccion: name,
              goles: 0,
              asistencias: 0,
              amarillas: 0,
              rojas: 0,
              edad: Math.floor(Math.random() * 15) + 19
            });
          }
        }
        
        return {
          id: String(team.id),
          nombre: name,
          codigo: team.fifa_code,
          bandera: team.flag,
          entrenador: coach,
          plantilla: squad
        };
      });

      const destPath = 'C:\\Users\\thiag\\Desktop\\Webs\\ISFT 118\\tpi-fixture\\data\\teams.json';
      fs.writeFileSync(destPath, JSON.stringify(finalTeamsList, null, 2));
      console.log('Successfully generated teams.json with 48 teams and rosters!');
      
      // Also cache in localStorage for client-side use
      // We will let the app load it from localStorage if needed
    } catch (e) {
      console.error('Error parsing/writing JSON:', e.message);
    }
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
