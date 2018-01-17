$$.screen = {
    renderPoint: function (points) {
        Object.keys(points).forEach(function eachKey(userId) {
            $('#userPoint' + userId).html(points[userId]);
        });
    },
    getPoint: function () {
        $.ajax({
            type: 'get',
            url: '/state/point',
            success: function (result) {
                $$.screen.renderPoint(result.points);
            },
            error: function () {
                alert('Admin: Error when get point setting!')
            }
        });
    },

    init: function () {
        $$.screen.getPoint();

        $$.socket.on('point', function (points) {
            $$.screen.renderPoint(points);
        });
    }
};
$(document).ready($$.screen.init);