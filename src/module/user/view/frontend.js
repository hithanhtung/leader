$$.user = {
    renderPoint: function (points) {
        //TODO
        // Object.keys(points).forEach(function eachKey(userId) {
        //     $('#userPoint' + userId).html(points[userId]);
        // });
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
            $('#questionContent').html('');
            $('#answerA').html('');
            $('#answerB').html('');
            $('#answerC').html('');
            $('#answerD').html('');
        } else if (result.action == 'show' && $$.user.question.index == result.questionIndex) {
            $('#questionContent').html($$.user.question.content);
            $('#answerA').html('A. ' + $$.user.question.answerA);
            $('#answerB').html('B. ' + $$.user.question.answerB);
            $('#answerC').html('C. ' + $$.user.question.answerC);
            $('#answerD').html('D. ' + $$.user.question.answerD);
        }
        //TODO

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
    getRound: function () {
        $.ajax({
            type: 'get',
            url: '/state/round',
            success: function (result) {
                if (result.round == 1) {
                    $$.user.roundIndex = 1;

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
            error: function () {
                alert('User: Error when get round setting!')
            }
        });
    },

    init: function () {
        $$.socket.emit('login', $$.userId);

        $$.user.getRound();
        $$.user.getPoint();

        $$.socket.on('round', function (roundIndex) {
            $$.user.renderRound(roundIndex);
        });
        $$.socket.on('point', function (points) {
            $$.user.renderPoint(points);
        });
        $$.socket.on('round1Do', function (result) {
            if ($$.user.roundIndex == 1) {
                $$.user.renderRound1(result);
            }
        });
    }
};
$(document).ready($$.user.init);