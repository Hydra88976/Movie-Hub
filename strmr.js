const express = require('express');
const path = require('path');

const app = express();
const port = 4000;

// Serve static files (HLS .m3u8 and .ts files)
app.use('/hls', express.static(path.join(__dirname, '/sdcard/HLS')));

// Route to serve the main page (with the video player)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client.ejs'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
