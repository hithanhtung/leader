module.exports = (app, http) => {
    app.io = require('socket.io')(http);
    app.io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
};