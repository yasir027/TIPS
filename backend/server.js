const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // Allow connections from any origin
        methods: ["GET", "POST"]
    }
});

// Enable CORS for API routes
app.use(cors());

// Serve a simple API endpoint to check if the server is running
app.get('/', (req, res) => {
    res.send('Screen Mirroring Backend is Running!');
});

// Store connected clients
let viewerSocket = null;
let screenShareSocket = null;

// Socket.IO Communication
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle screen data from the computer (screen-sharing)
    socket.on('screen-data', (data) => {
        if (viewerSocket) {
            console.log(`Sending frame to viewer (client ID: ${viewerSocket.id})`);
            viewerSocket.emit('screen-data', data);
        } else {
            console.warn('No viewer connected. Frame not sent.');
        }
    });

    // Handle phone connection for viewing
    socket.on('viewer', () => {
        console.log('Viewer connected:', socket.id);
        if (!viewerSocket) {
            viewerSocket = socket;
            console.log('Viewer successfully connected!');
        } else {
            console.log('Viewer already connected. Reusing the existing connection.');
        }

        // Handle disconnection of viewer
        socket.on('disconnect', () => {
            console.log('Viewer disconnected:', socket.id);
            if (viewerSocket === socket) {
                viewerSocket = null; // Reset viewerSocket when viewer disconnects
                console.log('Viewer connection cleared.');
            }
        });
    });

    // Handle computer (screen-sharing) connection
    socket.on('screen-share', () => {
        console.log('Screen share client connected:', socket.id);
        screenShareSocket = socket;

        // Handle disconnection of screen-sharing client
        socket.on('disconnect', () => {
            console.log('Screen-share client disconnected:', socket.id);
            if (screenShareSocket === socket) {
                screenShareSocket = null; // Reset screenShareSocket when disconnected
                console.log('Screen-share client connection cleared.');
            }
        });
    });

    // Handle disconnection of any client
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        // If a screen-share client disconnects, reset their reference
        if (screenShareSocket === socket) {
            screenShareSocket = null;
            console.log('Screen-share client cleared on disconnect.');
        }
    });
});

// Error handling for uncaught exceptions or unhandled promise rejections
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1); // Exit the process with an error code
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
    process.exit(1); // Exit the process with an error code
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://192.168.1.16:${PORT}`);
});
117
