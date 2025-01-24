const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // Allow any origin for testing purposes
        methods: ["GET", "POST"]
    }
});

let viewerSocket = null;
let screenShareSocket = null;

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle screen data from the screen-sharing client
    socket.on('screen-data', (frame) => {
        if (viewerSocket) {
            console.log('Sending frame to viewer');
            viewerSocket.emit('screen-data', frame);
        }
    });

    // Handle viewer connection
    socket.on('viewer', () => {
        viewerSocket = socket;
        console.log('Viewer connected');
        socket.on('disconnect', () => {
            console.log('Viewer disconnected');
            viewerSocket = null;
        });
    });

    // Handle screen-sharing connection
    socket.on('screen-share', () => {
        screenShareSocket = socket;
        console.log('Screen-share client connected');
        socket.on('disconnect', () => {
            console.log('Screen-share client disconnected');
            screenShareSocket = null;
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://192.168.31.10:${PORT}`);
});
