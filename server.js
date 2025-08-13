const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 8080;

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use('/hls', express.static(path.join(__dirname, '/sdcard/HLS')));

// Serve static files (optional for styling or assets)
//app.use(express.static(path.join(__dirname, 'public')));

// Route to render the admin page
app.get('/admin', (req, res) => {
    res.render('chat', { videoUrl: null });
});

app.get('/client', (req, res) => {
    res.render('clientn', { videoUrl: null });
});

// Route to handle video URL submission
app.post('/submit', (req, res) => {
    const videoUrl = req.body.videoUrl;

    // Emit video URL to all connected clients using Socket.io
    io.emit('videoUrl', videoUrl);

    // Respond back to the admin page with the same URL
    res.render('chat', { videoUrl: videoUrl });
});

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log(socket.id + '  connected');

    socket.on('play', () => {
        io.emit('play');
    });

    socket.on('message', (message, name) => {
        io.emit('rmessage',message,  name);
        console.log(message, name);
    });

    socket.on('pause', () => {
        io.emit('pause');
    });

    socket.on('seek', (time) => {
        io.emit('seek', time);
    });

    socket.on('disconnect', () => {
        console.log(socket.id + '  disconnected');
    });


   // On the server (Node.js with Socket.io)
socket.on('seekPosition', (currentTime) => {
    console.log('Current video seek position:', currentTime);
    // You can store the seek position or send it to other clients, as needed
        io.emit('seek', currentTime);
});




});

io.on('close', (socket) =>
{
 console.log(socket.id + "  disconnected");
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})
