const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

let users = [];

// Handle socket.io connections
io.on('connection', (socket) => {
    let addedUser = false;

    // When a user joins the chat
    socket.on('user join', (username) => {
        if (addedUser) return;

        // Add the user to the list and mark them as added
        users.push(username);
        addedUser = true;
        socket.username = username;

        // Notify all clients about the new user and update the user list
        io.emit('user list', users);
        io.emit('user joined', username);
    });

    // When a user sends a chat message
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    // When a user disconnects
    socket.on('disconnect', () => {
        if (addedUser) {
            // Remove the user from the list
            users = users.filter(user => user !== socket.username);

            // Notify all clients about the user leaving and update the user list
            io.emit('user list', users);
            io.emit('user left', socket.username);
        }
    });

    // Allow clients to request the current user list
    socket.on('request user list', () => {
        io.emit('user list', users);
    });
});

// Set the server to listen on the specified port, with error handling
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
