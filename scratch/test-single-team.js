import https from 'https';

https.get('https://worldcup26.ir/get/team/1', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Keys in response:', Object.keys(parsed));
      console.log('Full response:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.error('Error parsing JSON:', e.message);
    }
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
