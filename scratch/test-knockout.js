import https from 'https';

https.get('https://worldcup26.ir/get/games', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.games) {
        const ko = parsed.games.filter(g => g.type !== 'group');
        console.log('Knockout games:');
        ko.forEach(g => {
          console.log(`ID: ${g.id} | Phase: ${g.type} | Home: ${g.home_team_name_en || g.home_team_label} vs Away: ${g.away_team_name_en || g.away_team_label}`);
        });
      }
    } catch (e) {
      console.error('Error parsing JSON:', e.message);
    }
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
