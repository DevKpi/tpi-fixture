import https from 'https';

https.get('https://worldcup26.ir/get/groups', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Keys in response:', Object.keys(parsed));
      if (parsed.groups) {
        console.log('Total groups:', parsed.groups.length);
        console.log('Sample group:', parsed.groups[0]);
      } else {
        console.log('No groups field in response');
      }
    } catch (e) {
      console.error('Error parsing JSON:', e.message);
      console.log('Raw data preview:', data.substring(0, 500));
    }
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
