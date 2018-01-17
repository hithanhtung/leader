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

    renderRound: function (roundIndex) {
        $$.screen.roundIndex = roundIndex;

        $('.round').css('display', 'none');
        $('#round' + roundIndex).css('display', 'block');
    },
    renderRound1State: function (result) {
        if (result.action == 'send') {
            $$.screen.question = result.question;
            $('#questionContainer').css('display', 'block');
            $('#questionContent').html('');
            $('#answerA').html('');
            $('#answerB').html('');
            $('#answerC').html('');
            $('#answerD').html('');
        } else if (result.action == 'show' && $$.screen.question.index == result.questionIndex) {
            $('#questionContainer').css('display', 'block');
            $('#questionContent').html($$.screen.question.content);
            $('#answerA').html('A. ' + $$.screen.question.answerA);
            $('#answerB').html('B. ' + $$.screen.question.answerB);
            $('#answerC').html('C. ' + $$.screen.question.answerC);
            $('#answerD').html('D. ' + $$.screen.question.answerD);
        }
        //TODO
    },
    getRound: function () {
        $.ajax({
            type: 'get',
            url: '/state/round',
            success: function (result) {
                $$.screen.renderRound(result.round);

                if (result.round == 1) {
                    $.ajax({
                        type: 'GET',
                        url: '/admin/round1/state',
                        success: function (result) {
                            $$.screen.question = result.question;
                            $$.screen.renderRound1State(result);
                        },
                        error: function () {
                            alert('Screen: ' + $$.capitalizeFirstLetter(action) + ' question ' + questionIndex + '!');
                        }
                    });
                }
            },
            error: function () {
                alert('Screen: Error when get round setting!')
            }
        });
    },

    init: function () {
        $$.screen.getRound();
        $$.screen.getPoint();

        $$.socket.on('round', function (roundIndex) {
            $$.screen.renderRound(roundIndex);
        });
        $$.socket.on('point', function (points) {
            $$.screen.renderPoint(points);
        });
        $$.socket.on('round1Do', function (result) {
            if ($$.screen.roundIndex == 1) {
                $$.screen.renderRound1State(result);
            }
        });
    }
};
$(document).ready($$.screen.init);