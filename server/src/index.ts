import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const port = 8000;  
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

const connectedUsers: { [key: string]: string } = {};


io.on('connection', (socket) => {


    socket.on('register_user', (userId) => {
        connectedUsers[socket.id] = userId;
        io.emit('update_user_list', Object.values(connectedUsers));
    });

    socket.on('send_message', (data) => {
        socket.broadcast.emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        delete connectedUsers[socket.id];
        io.emit('update_user_list', Object.values(connectedUsers));
    });

    socket.on('typing', () => {
        socket.broadcast.emit('user_typing');

    });

    socket.on('stop_typing', () => {
        socket.broadcast.emit('user_stop_typing');
    });

});



server.listen(port, () => {  
    console.log(`listening on localhost:${port}`);
});
