$$.screen = {
    roundTime: 0,
    status: 'start',                //stop , start , reset
    renderPoint: function (points) {
        Object.keys(points).forEach(function eachKey(userId) {
            $('#userRound' + $$.screen.roundIndex + 'Box #userPoint' + userId).html('Point: ' + points[userId]);
            $('#pointContainer #userPoint' + userId).html('Điểm: ' + points[userId]);
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

    playAudioTick: function () {
        var audioTick = document.getElementById('audioTick');
        audioTick.play();
    },
    stopAudioTick: function () {
        var audioTick = document.getElementById('audioTick');
        audioTick.pause();
        audioTick.currentTime = 0;
    },

    renderRound1: function (result) {
        if (result.action == 'send') {
            $$.screen.question = result.question;
            $('#questionContainer').css('display', 'block');
            $('#questionContent').html('').css('display', 'none');
            $('#answerA').html('').css('display', 'none').css('background-color', '#f5f5f5');
            $('#answerB').html('').css('display', 'none').css('background-color', '#f5f5f5');
            $('#answerC').html('').css('display', 'none').css('background-color', '#f5f5f5');
            $('#answerD').html('').css('display', 'none').css('background-color', '#f5f5f5');
            $('#questionResult').css('display', 'none');
            $('#countDown').css('display', 'none');
        } else if ($$.screen.question.index == result.questionIndex) {
            $('#questionContainer').css('display', 'block');
            $('#questionContent').html($$.screen.question.content).css('display', 'block');
            $('#answerA').html('A. ' + $$.screen.question.answerA).css('display', 'block');
            $('#answerB').html('B. ' + $$.screen.question.answerB).css('display', 'block');
            $('#answerC').html('C. ' + $$.screen.question.answerC).css('display', 'block');
            $('#answerD').html('D. ' + $$.screen.question.answerD).css('display', 'block');

            $('#tableCountDown').css('display', 'block');
            $('#countDown').css('display', 'block');

            if (result.result) {
                $('#answer' + result.result.toUpperCase()).css('background-color', 'yellow');
            }
            console.log(result);

            if (result.action == 'show') {
                $$.screen.roundTime = Math.round(result.remainTime / 1000);
                $$.screen.status = 'stop';
                $$.screen.stopAudioTick();
            } else if (result.action == 'start') {
                $$.screen.roundTime = Math.round(result.remainTime / 1000);
                $$.screen.playAudioTick();
            } else {
                $$.screen.roundTime = 0;
                $$.screen.status = 'stop';
                $$.screen.stopAudioTick();
            }
        }
    },
    getRound1: function () {
        $.ajax({
            type: 'GET',
            url: '/admin/round1/state' + '?t=' + new Date().getTime(),
            success: function (result) {
                $$.screen.question = result.question;
                $$.screen.renderRound1(result);
            },
            error: function () {
                alert('Screen: ' + $$.capitalizeFirstLetter(action) + ' question ' + questionIndex + '!');
            }
        });
    },

    renderRound2: function (round2User) {
        if (round2User != '') {
            $('.userRound2').attr('src', '/img/user/' + round2User + '.png');
            $('.pointUserRound2').attr('id', 'userPoint' + round2User);
            $$.screen.getPoint();
        }
    },
    getRound2: function () {
        $.ajax({
            type: 'get',
            url: '/state/round2User',
            success: function (result) {
                if (result.error) {
                    alert('Screen: Error when get round2 user! ' + result.error)
                } else {
                    $$.screen.renderRound2(result.round2User);
                }
            },
            error: function () {
                alert('Screen: Error when get round2 user!')
            }
        });
    },

    renderRound3: function (round3User) {
        //TODO
    },
    getRound3: function () {
        $.ajax({
            type: 'get',
            url: '/state/round3User',
            success: function (result) {
                if (result.error) {
                    alert('Screen: Error when get round3 user! ' + result.error)
                } else {
                    $$.screen.renderRound3(result.round3User);
                }
            },
            error: function () {
                alert('Screen: Error when get round3 user!')
            }
        });
    },

    renderRound4: function (round4User) {
        //TODO
    },
    getRound4: function () {
        $.ajax({
            type: 'get',
            url: '/state/round4User',
            success: function (result) {
                if (result.error) {
                    alert('Screen: Error when get round4 user! ' + result.error)
                } else {
                    $$.screen.renderRound3(result.round4User);
                }
            },
            error: function () {
                alert('Screen: Error when get round4 user!')
            }
        });
    },

    renderRound: function (roundIndex) {
        $$.screen.roundIndex = roundIndex;
        $('.round').css('display', 'none');
        $('#round' + $$.screen.roundIndex).css('display', 'inline-block');
        $('#minus').css('display', 'none');

        if ($$.screen.roundIndex == 1) {
            $$.screen.getRound1();
        } else if ($$.screen.roundIndex == 2) {
            $$.screen.getRound2();
        } else if ($$.screen.roundIndex == 3) {
            $$.screen.getRound3();
        } else if ($$.screen.roundIndex == 4) {
            $$.screen.getRound4();
        }
    },
    getRound: function () {
        $.ajax({
            type: 'get',
            url: '/state/round',
            success: function (result) {
                if (1 <= result.round && result.round <= 4) {
                    $$.screen.renderRound(result.round);
                    $$.screen.getPoint();
                    $$.screen.getTime(result.round);
                }
            },
            error: function () {
                alert('Screen: Error when get round setting!')
            }
        });
    },

    getTime: function (roundIndex) {
        $.ajax({
            type: 'get',
            url: '/state/time',
            success: function (result) {
                // if (1 <= roundIndex && roundIndex <= 4) {
                //     $$.screen.roundTime = result['round' + roundIndex];
                // }
            },
            error: function () {
                alert('Screen: Error when get round time setting!')
            }
        });
    },

    renderScreen: function (screen) {
        $('.round').css('display', 'none');
        $('#tableCountDown').css('display', 'none');
        $('#pointContainer').css('display', 'none');
        if (screen == 'question') {
            $$.screen.getRound();
        } else {
            $('#pointContainer').css('display', 'block');
            $$.screen.getPoint();
            $$.screen.getQuestionsState();
        }
    },
    getScreen: function () {
        $.ajax({
            type: 'get',
            url: '/state/screen',
            success: function (result) {
                $$.screen.renderScreen(result.screen.toLowerCase());
            },
            error: function () {
                alert('Admin: Error when get screen setting!')
            }
        });
    },

    renderQuestionsState: function (state) {
        $('.userChoice').html('');
        Object.keys(state.answers).forEach(function eachKey(userId) {
            console.log(state.answers[userId]);
            $('#userChoice' + userId).html(state.answers[userId].answer.toUpperCase());
        });
    },
    getQuestionsState: function () {
        $.ajax({
            type: 'GET',
            url: '/state/questions',
            success: function (questionsState) {
                $$.screen.renderQuestionsState(questionsState);
            },
            error: function () {
                alert('Error: get questions state!');
            }
        });
    },

    init: function () {
        $$.screen.getScreen();
        $('#countDown').flipcountdown({
            tick: function () {
                var nol = function (h) {
                    return (h > 9 || h < -9) ? h : '0' + h;
                };

                if ($$.screen.status == 'start') {
                    $$.screen.roundTime--;
                }
                var range = $$.screen.roundTime,
                    secday = 86400, sechour = 3600,
                    min = parseInt(((range % secday) % sechour) / 60),
                    sec = ((range % secday) % sechour) % 60,
                    result = nol(min) + ' ' + nol(sec);
                if ($$.screen.roundTime == 0 && $$.screen.roundIndex != undefined) {
                    if ($$.screen.roundIndex == 1 || $$.screen.roundIndex == 3 || $$.screen.roundIndex == 4) {
                        $$.screen.status = 'stop';
                        $$.screen.stopAudioTick();
                    } else {
                        $('#minus').css('display', 'block');
                    }
                }
                return result;
            }
        });

        $$.socket.on('screen', function (screen) {
            $$.screen.renderScreen(screen.toLowerCase());
        });
        $$.socket.on('round', function (roundIndex) {
            $$.screen.getTime(roundIndex);
            $$.screen.renderRound(roundIndex);
            $$.screen.getPoint();
        });
        $$.socket.on('point', function (points) {
            $$.screen.renderPoint(points);
        });
        $$.socket.on('round1Do', function (result) {
            if ($$.screen.roundIndex == 1) {
                $$.screen.getRound1();
            }
        });
        $$.socket.on('round2User', function (round2User) {
            $$.screen.renderRound2(round2User.round2User);
        });
    }
};
$(document).ready($$.screen.init);