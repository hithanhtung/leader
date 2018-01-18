$$.home = {
    init: function () {
        $$.home.getPoint();
        var deadline = Math.round((new Date('1/20/2018 17:00:00')).getTime() / 1000);
        $('#retroclockbox1').flipcountdown({
            tick: function () {
                var nol = function (h) {
                    return h > 9 ? h : '0' + h;
                };

                var range = deadline - Math.round((new Date()).getTime() / 1000),
                    secday = 86400, sechour = 3600,
                    days = parseInt(range / secday),
                    hours = parseInt((range % secday) / sechour),
                    min = parseInt(((range % secday) % sechour) / 60),
                    sec = ((range % secday) % sechour) % 60,
                    result = nol(days) + ' ' + nol(hours) + ' ' + nol(min) + ' ' + nol(sec);
                if (result == '00 00 00 00' || days < 0 || hours < 0 || min < 0 || sec < 0) {
                    $('#tableCountDown').css('display', 'none');
                    $('#pointTable1').css('display', 'inline-block');
                    $('#pointTable2').css('display', 'inline-block');
                    return;
                }
                return result;
            }
        });

        $$.socket.on('point', function (points) {
            $$.home.renderPoint(points);
        });
    },
    renderPoint: function (points) {
        Object.keys(points).forEach(function eachKey(userId) {
            $('#userPoint' + userId).html('Point: ' + points[userId]);
        });
    },
    getPoint: function () {
        $.ajax({
            type: 'get',
            url: '/state/point',
            success: function (result) {
                $$.home.renderPoint(result.points);
            },
            error: function () {
                alert('Admin: Error when get point setting!')
            }
        });
    },
};
$(document).ready($$.home.init);