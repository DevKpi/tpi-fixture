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
        const matchesWithScorers = parsed.games.filter(g => g.home_scorers && g.home_scorers !== 'null' && g.home_scorers !== '');
        console.log('Matches with scorers:', matchesWithScorers.length);
        matchesWithScorers.slice(0, 10).forEach(g => {
          console.log(`ID: ${g.id} | Home scorers: ${g.home_scorers} | Away scorers: ${g.away_scorers}`);
        });
      }
    } catch (e) {
      console.error('Error:', e.message);
    }
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
