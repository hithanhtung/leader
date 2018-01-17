$$.mc = {
    init: function () {
        $$.socket.emit('login', $$.userId);
    }
};
$(document).ready($$.mc.init);