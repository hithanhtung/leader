$$.user = {
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

    renderRound1: function (result) {
        if (result.action == 'send') {
            $$.user.question = result.question;
            $('#questionContent').html('').css('display', 'none');
            $('#answerA').html('').css('display', 'none');
            $('#answerB').html('').css('display', 'none');
            $('#answerC').html('').css('display', 'none');
            $('#answerD').html('').css('display', 'none');
            $('#countdown1').css('display', 'none');
        } else if ($$.user.question.index == result.questionIndex) {
            $('#questionContent').html($$.user.question.content).css('display', 'block');
            $('#answerA').html('A. ' + $$.user.question.answerA).css('display', 'block');
            $('#answerB').html('B. ' + $$.user.question.answerB).css('display', 'block');
            $('#answerC').html('C. ' + $$.user.question.answerC).css('display', 'block');
            $('#answerD').html('D. ' + $$.user.question.answerD).css('display', 'block');

            $('#countdown1').css('display', 'block');
            $('#questionResult').css('display', result.action == 'result' ? 'block' : 'none')
            //TODO
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

    round1Select: function (sender) {
        sender = $(sender);
        var choice = sender.attr('data-value').trim().toLowerCase();
        $.ajax({
            type: 'PUT',
            url: '/user/round1/answer/' + $$.user.question.index + '/' + choice,
            success: function (result) {
                if (result.error) {
                    alert('User: ' + result.error + '!');
                } else {
                    $('#answerA').css('background-color', '#f5f5f5');
                    $('#answerB').css('background-color', '#f5f5f5');
                    $('#answerC').css('background-color', '#f5f5f5');
                    $('#answerD').css('background-color', '#f5f5f5');
                    sender.css('background-color', 'yellow');
                    //TODO: show result.time
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

        $$.user.getRound();
        $$.user.getPoint();

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