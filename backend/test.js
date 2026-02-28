const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('TEST SERVER WORKING');
});

app.listen(3000, () => {
  console.log('Test server started on port 3000');
});