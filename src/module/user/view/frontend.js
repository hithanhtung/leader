$$.user = {
    init: function () {
        $$.socket.emit('login', $$.userId);
    }
};
$(document).ready($$.user.init);