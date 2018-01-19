$$.user = {
    roundTime: 0,
    status: 'stop',

    renderPoint: function (points) {
        $('#userPoint').html(points[$$.userId]);
    },
    getPoint: function () {
        $.ajax({
            type: 'get',
            url: '/state/point',
            success: function (result) {
                $$.user.renderPoint(result.points);
            },
            error: function () {
                alert('Admin: Error when get point setting!')
            }
        });
    },

    renderRound1: function (data) {
        if (data.action == 'send') {
            $$.user.question = data.question;
            $('#questionContent').html('').css('display', 'none');
            $('#answerA').html('').css('display', 'none').css('background-color', '#f5f5f5');
            $('#answerB').html('').css('display', 'none').css('background-color', '#f5f5f5');
            $('#answerC').html('').css('display', 'none').css('background-color', '#f5f5f5');
            $('#answerD').html('').css('display', 'none').css('background-color', '#f5f5f5');
            $('#questionResult').css('display', 'none');
            $('#userDeltaPoint').css('display', 'none');
            $('#countdown1').css('display', 'none');
        } else if ($$.user.question.index == data.questionIndex) {
            $('#questionContent').html($$.user.question.content).css('display', 'block');
            $('#answerA').html('A. ' + $$.user.question.answerA).css('display', 'block');
            $('#answerB').html('B. ' + $$.user.question.answerB).css('display', 'block');
            $('#answerC').html('C. ' + $$.user.question.answerC).css('display', 'block');
            $('#answerD').html('D. ' + $$.user.question.answerD).css('display', 'block');

            $('#questionResult').css('display', data.action == 'result' ? 'block' : 'none')
                .html(data.answer ? data.answer.answer.toUpperCase() : '');
            $('#userDeltaPoint').css('display', data.action == 'result' ? 'block' : 'none')
                .html(data.answer ? data.answer.point : '');
            $('#countdown1').css('display', 'block');

            if (data.answer) {
                $('#answer' + data.answer.answer.toUpperCase()).css('background-color', 'yellow');
            }

            if (data.action == 'show') {
                $$.user.roundTime = Math.round(data.remainTime / 1000);
                $$.user.status = 'stop';
            } else if (data.action == 'start') {
                $$.user.roundTime = Math.round(data.remainTime / 1000);
                $$.user.status = 'start';
            } else {
                $$.user.roundTime = 0;
                $$.user.status = 'stop';
            }
        }

        $.ajax({
            type: 'PUT',
            url: '/user/round1/question/' + $$.user.question.index,
            success: function (reportResult) {
                if (reportResult.error) {
                    alert('User: ' + error);
                }
            },
            error: function () {
                alert('User: Report question has error!');
            }
        });
    },
    getRound1: function () {
        if ($$.user.roundIndex == 1) {
            $.ajax({
                type: 'GET',
                url: '/admin/round1/state',
                success: function (result) {
                    $$.user.question = result.question;
                    $$.user.renderRound1(result);
                    console.log(result);
                },
                error: function () {
                    alert('User: ' + $$.capitalizeFirstLetter(action) + ' question ' + questionIndex + '!');
                }
            });
        }
    },
    getRound: function () {
        $.ajax({
            type: 'get',
            url: '/state/round',
            success: function (result) {
                $$.user.roundIndex = result.round;
                $$.user.getRound1();
            },
            error: function () {
                alert('User: Error when get round setting!')
            }
        });
    },

    getTime: function () {
        $.ajax({
            type: 'get',
            url: '/state/time',
            success: function (result) {
                $$.user.round1Time = result.round1;
            },
            error: function () {
                alert('Admin: Error when get time setting!')
            }
        });
    },

    round1Select: function (sender) {
        sender = $(sender);
        var choice = sender.attr('data-value').trim().toLowerCase(),
            point = Math.round($$.user.roundTime);
        $.ajax({
            type: 'PUT',
            url: '/user/round1/answer/' + $$.user.question.index + '/' + choice + '/' + point + '?t=' + (new Date()).getTime(),
            success: function (result) {
                if (result.error) {
                    $$.alert('User: ' + result.error + '!');
                } else {
                    $('#answerA').css('background-color', '#f5f5f5');
                    $('#answerB').css('background-color', '#f5f5f5');
                    $('#answerC').css('background-color', '#f5f5f5');
                    $('#answerD').css('background-color', '#f5f5f5');
                    sender.css('background-color', 'yellow');
                    //TODO: show result.point
                }
            },
            error: function () {
                alert('User: Send answer has errors!');
            }
        });
    },

    init: function () {
        $$.socket.emit('login', $$.userId);
        $('#userAvatar').attr('src', '/img/user/' + $$.userId + '.png');

        $('#countdown1').flipcountdown({
            tick: function () {
                var nol = function (h) {
                    return (h > 9 || h < -9) ? h : '0' + h;
                };

                if ($$.user.status == 'start') {
                    $$.user.roundTime--;
                }
                if ($$.user.roundTime <= 0) {
                    $$.user.roundTime = 0;
                    $$.user.status == 'stop'
                }
                return nol($$.user.roundTime);
            }
        });

        $$.user.getRound();
        $$.user.getPoint();
        $$.user.getTime();

        $$.socket.on('round', function (roundIndex) {
            $$.user.renderRound(roundIndex);
        });
        $$.socket.on('point', function (points) {
            $$.user.renderPoint(points);
        });
        $$.socket.on('round1Do', function (result) {
            $$.user.getRound1();
        });
    }
};
$(document).ready($$.user.init);