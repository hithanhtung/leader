$$.screen = {
    roundTime: 0,
    status: 'stop',                //stop , start
    selectedColor: 'deepskyblue',

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
    playAudioAlarm: function () {
        var audioAlarm = document.getElementById('audioAlarm');
        audioAlarm.play();
    },

    renderRound1: function (result) {
        if (result.action == 'send') {
            $$.screen.question = result.question;
            $('#questionContainer').css('display', 'block');
            $('#questionContent').html('').css('display', 'none');
            $('.answer').html('').css('display', 'none').css('background-color', '#f5f5f5').css('color', 'red');
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
                $('#answer' + result.result.toUpperCase()).css('background-color', $$.screen.selectedColor).css('color', 'white');
            }
            console.log(result);

            if (result.action == 'show') {
                $$.screen.roundTime = Math.round(result.remainTime / 1000);
                $$.screen.status = 'stop';
                $$.screen.stopAudioTick();
            } else if (result.action == 'start') {
                $$.screen.roundTime = Math.round(result.remainTime / 1000);
                $$.screen.status = 'start';
                $$.screen.playAudioTick();
            } else {
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
            $('#countDown').css('display', 'block');
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
        if (round3User != '') {
            $('#countDown').css('display', 'block');
            if (round3User.round3User1 != '') {
                $('.userRound3-1').attr('src', '/img/user/' + round3User.round3User1 + '.png');
                $('.pointUserRound3-1').attr('id', 'userPoint' + round3User.round3User1);
            }
            ;
            if (round3User.round3User2 != '') {
                $('.userRound3-2').attr('src', '/img/user/' + round3User.round3User2 + '.png');
                $('.pointUserRound3-2').attr('id', 'userPoint' + round3User.round3User2);
            }
            ;
            if (round3User.round3User3 != '') {
                $('.userRound3-3').attr('src', '/img/user/' + round3User.round3User3 + '.png');
                $('.pointUserRound3-3').attr('id', 'userPoint' + round3User.round3User3);
            }
            ;
            if (round3User.round3User4 != '') {
                $('.userRound3-4').attr('src', '/img/user/' + round3User.round3User4 + '.png');
                $('.pointUserRound3-4').attr('id', 'userPoint' + round3User.round3User4);
            }
            ;
            $$.screen.getPoint();
        }
    },
    getRound3: function () {
        $.ajax({
            type: 'get',
            url: '/state/round3User',
            success: function (result) {
                if (result.error) {
                    alert('Screen: Error when get round3 user! ' + result.error)
                } else {
                    $$.screen.renderRound3(result);
                }
            },
            error: function () {
                alert('Screen: Error when get round3 user!')
            }
        });
    },

    renderRound4: function (round4User) {
        if (round4User != '') {
            console.log(round4User);
            if (round4User.round4User1 != '') {
                $('.userRound4-2').attr('src', '/img/user/' + round4User.round4User1 + '.png');
                $('.pointUserRound4-2').attr('id', 'userPoint' + round4User.round4User1);
            }
            ;
            if (round4User.round4User2 != '') {
                $('.userRound4-3').attr('src', '/img/user/' + round4User.round4User2 + '.png');
                $('.pointUserRound4-3').attr('id', 'userPoint' + round4User.round4User2);
            }
            ;
            $$.screen.getPoint();
        }
    },
    getRound4: function () {
        $.ajax({
            type: 'get',
            url: '/state/round4User',
            success: function (result) {
                if (result.error) {
                    alert('Screen: Error when get round4 user! ' + result.error)
                } else {
                    $$.screen.renderRound4(result);
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
                if (2 <= roundIndex && roundIndex <= 4) {
                    $$.screen.status = 'stop';
                    $$.screen.roundTime = result['round' + roundIndex];
                }
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
            $('#tableCountDown').css('display', 'block');
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
                        if ($$.screen.status == 'start') {
                            $$.screen.playAudioAlarm();
                        }
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
        $$.socket.on('questions_state', function (result) {
            console.log(result);
        });
        $$.socket.on('user_choice', function (result) {
            if ($$.screen.roundIndex == 1 && $$.screen.status == 'start') {
                var audio = document.getElementById('audioChoice' + result.user);
                audio.play();
            }
        });
    }
};
$(document).ready($$.screen.init);