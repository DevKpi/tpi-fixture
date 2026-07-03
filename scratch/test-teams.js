import https from 'https';

https.get('https://worldcup26.ir/get/teams', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Total teams:', parsed.teams ? parsed.teams.length : 'none');
      if (parsed.teams && parsed.teams.length > 0) {
        console.log('Sample team:', parsed.teams[0]);
      }
    } catch (e) {
      console.error('Error parsing JSON:', e.message);
    }
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
