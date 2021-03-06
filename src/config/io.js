module.exports = (app, http) => {
    app.online = [false, false, false, false, false, false, false, false, false, false, false];
    app.questions = {};
    app.answers = {};
    app.answerDeadline = null;
    app.round1RemainTime = 0;

    app.round2User = '';
    app.round2Deadline = null;

    app.round3Deadline = null;
    app.round4Deadline = null;

    app.setOnline = (index, value) => {
        app.online[index] = value;
        app.io.emit('online', app.online);
    };

    app.io = require('socket.io')(http);
    app.io.on('connection', (socket) => {
        // console.log('User connected');
        var userIndex = null;

        socket.on('login', (index) => {
            console.log('User ' + index + ' login!');
            try {
                app.setOnline(index, true);
                userIndex = index;
            } catch (ex) {
            }
        });

        socket.on('disconnect', () => {
            console.log('User ' + userIndex + ' disconnected!');
            try {
                app.setOnline(userIndex, false);
            } catch (ex) {
            }
        });
    });
};