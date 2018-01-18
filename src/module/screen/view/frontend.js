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

    renderRound1: function (result) {
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
    getRound1: function () {
        $.ajax({
            type: 'GET',
            url: '/admin/round1/state',
            success: function (result) {
                $$.screen.question = result.question;
                $$.screen.renderRound1(result);
            },
            error: function () {
                alert('Screen: ' + $$.capitalizeFirstLetter(action) + ' question ' + questionIndex + '!');
            }
        });
    },

    getRound2: function () {
        //TODO
    },

    getRound3: function () {
        //TODO
    },

    getRound4: function () {
        //TODO
    },

    renderRound: function () {
        $('.round').css('display', 'none');
        $('#round' + $$.screen.roundIndex).css('display', 'block');
    },
    getRound: function () {
        $.ajax({
            type: 'get',
            url: '/state/round',
            success: function (result) {
                if (1 <= result.round && result.round <= 4) {
                    $$.screen.roundIndex = result.round;
                    $$.screen.renderRound();

                    if ($$.screen.roundIndex == 1) {
                        $$.screen.getRound1();
                    } else if ($$.screen.roundIndex == 2) {
                        $$.screen.getRound2();
                    } else if ($$.screen.roundIndex == 3) {
                        $$.screen.getRound3();
                    } else if ($$.screen.roundIndex == 4) {
                        $$.screen.getRound4();
                    }
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
                $$.screen.getRound1();
            }
        });
    }
};
$(document).ready($$.screen.init);