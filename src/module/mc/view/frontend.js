$$.mc = {
    init: function () {
        $$.mc.getOnline();
        $$.mc.getPoint();
        $$.mc.getRound();
        var trEle = $('#tdEle').parent();
        trEle.css('height', '20px');

        $$.socket.on('point', function (points) {
            $$.mc.renderPoint(points);
        });
        $$.socket.on('round', function (roundIndex) {
            $$.mc.renderRound(roundIndex);
        });
        $$.socket.on('round1Do', function (result) {
            $$.mc.getRound1();
        });

        $$.socket.emit('login', $$.userId);
    },

    renderRound1State: function (result) {
        console.log(result);
        if (result.action == 'send') {
            $$.mc.question = result.question;
            $('#questionContainer').css('display', 'block');
            $('#questionContent').html('');
            $('#answerA').html('');
            $('#answerB').html('');
            $('#answerC').html('');
            $('#answerD').html('');
            $('#hint').html('');
            $('#result').html('');
        } else if (result.action == 'show' && $$.mc.question.index == result.questionIndex) {
            $('#questionContainer').css('display', 'block');
            $('#questionContent').html($$.mc.question.content);
            $('#answerA').html('A. ' + $$.mc.question.answerA);
            $('#answerB').html('B. ' + $$.mc.question.answerB);
            $('#answerC').html('C. ' + $$.mc.question.answerC);
            $('#answerD').html('D. ' + $$.mc.question.answerD);
            $('#hint').html('Hint: ' + $$.mc.question.hint);
            $('#result').html('Result: ' + $$.mc.question.result.toUpperCase());
        }
        //TODO
    },
    getRound1: function () {
        if ($$.mc.roundIndex == 1) {
            $.ajax({
                type: 'GET',
                url: '/admin/round1/state',
                success: function (result) {
                    $$.mc.question = result.question;
                    $$.mc.renderRound1State(result);
                },
                error: function () {
                    alert('Screen: ' + $$.capitalizeFirstLetter(action) + ' question ' + questionIndex + '!');
                }
            });
        }
    },

    renderRound: function (roundIndex) {
        $$.mc.roundIndex = roundIndex;

        $('.round').css('display', 'none');
        $('#round' + roundIndex).css('display', 'block');
    },
    getRound: function () {
        $.ajax({
            type: 'get',
            url: '/state/round',
            success: function (result) {
                $$.mc.renderRound(result.round);
                $$.mc.getRound1();
            },
            error: function () {
                alert('Screen: Error when get round setting!')
            }
        });
    },

    renderOnline: function (online) {
        for (var i = 0; i < online.length; i++) {
            if (online[i]) {
                $('#userStatus' + i).addClass('badge-success').removeClass('badge-default');
            } else {
                $('#userStatus' + i).addClass('badge-default').removeClass('badge-success');
            }
        }
    },
    getOnline: function () {
        $.ajax({
            type: 'GET',
            url: '/state/online',
            success: function (online) {
                $$.mc.renderOnline(online);
            },
            error: function () {
                alert('Error: get online data!');
            }
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
                $$.mc.renderPoint(result.points);
            },
            error: function () {
                alert('Admin: Error when get point setting!')
            }
        });
    },
};
$(document).ready($$.mc.init);