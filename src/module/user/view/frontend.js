$$.user = {
    roundTime: 0,
    status: 'stop',
    selectedColor: 'deepskyblue',

    renderPoint: function (points) {
        $('#userPoint').html('Điểm: ' + points[$$.userId]);
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
            $('.answer').html('').css('display', 'none').css('background-color', '#f5f5f5').css('color', 'red');
            $('#questionResult').html('');
            $('#userDeltaPoint').html('');
            $('#countdown1').css('display', 'none');
        } else if ($$.user.question.index == data.questionIndex) {
            $('#questionContent').html($$.user.question.content).css('display', 'block');
            $('#answerA').html('A. ' + $$.user.question.answerA).css('display', 'block').css('color', 'red');
            $('#answerB').html('B. ' + $$.user.question.answerB).css('display', 'block').css('color', 'red');
            $('#answerC').html('C. ' + $$.user.question.answerC).css('display', 'block').css('color', 'red');
            $('#answerD').html('D. ' + $$.user.question.answerD).css('display', 'block').css('color', 'red');
            $('#countdown1').css('display', 'block');

            if (data.answer) {
                $('#answer' + data.answer.answer.toUpperCase())
                    .css({'background-color': $$.user.selectedColor, 'color': 'white'});
                $('#userDeltaPoint').html('Bạn lựa chọn ở giây thứ ' + data.answer.point + '.');
                if (data.result) {
                    var resultText = data.result.toLowerCase() == data.answer.answer.toLowerCase() ? 'ĐÚNG' : 'SAI';
                    $('#questionResult').html('Bạn đã lựa chọn <font color="red" size="5">' + resultText +
                        '</font>. Đáp án chính xác là <font color="red" size="5">' + data.result.toUpperCase() + '</font>.');
                } else {
                    $('#questionResult').html('');
                }
            } else {
                $('#userDeltaPoint').html('');
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
                    $('#userDeltaPoint').html('Bạn lựa chọn ở giây thứ ' + result.point + '.');
                    $('.answer').css('background-color', '#f5f5f5').css('color', 'red');
                    sender.css({
                        'background-color': $$.user.selectedColor,
                        'color': 'white'
                    });
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
            size: 'lg',
            tick: function () {
                var nol = function (h) {
                    return (h > 9 || h < -9) ? h : '0' + h;
                };

                if ($$.user.status == 'start') {
                    $$.user.roundTime--;
                }
                if ($$.user.roundTime <= 0) {
                    $$.user.roundTime = 0;
                    $$.user.status = 'stop'
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