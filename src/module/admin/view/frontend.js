$$.admin = {
    selectScreen: function (value) {
        $.ajax({
            type: 'put',
            url: '/state/screen/' + value,
            success: function (result) {
                if (result.error) {
                    alert('Admin: ' + result.error);
                }
            },
            error: function () {
                alert('Admin: Error when get round setting!')
            }
        });
    },
    renderScreen: function (screen) {
        $('.round1Screen').attr('checked', null)
            .parent().removeClass('active');
        $('#round1Screen' + $$.capitalizeFirstLetter(screen)).attr('checked', '')
            .parent().addClass('active');
    },
    getScreen: function () {
        $.ajax({
            type: 'get',
            url: '/state/screen',
            success: function (result) {
                $$.admin.renderScreen(result.screen.toLowerCase());
            },
            error: function () {
                alert('Admin: Error when get screen setting!')
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
                $$.admin.renderOnline(online);
            },
            error: function () {
                alert('Error: get online data!');
            }
        });
    },

    renderQuestionsState: function (state) {
        Object.keys(state.questions).forEach(function eachKey(userId) {
            var currentQuestion = state.questions[userId],
                currentAnswer = state.answers[userId],
                hasAnswer = !(currentAnswer == undefined || currentAnswer == null),
                answerText = hasAnswer ? ' => ' + currentAnswer.answer.toUpperCase() : '';
            var userQuestion = $('#userQuestion' + userId)
                .attr('data-question', currentQuestion).html('Q' + currentQuestion + answerText);

            if (hasAnswer) {
                $('#userDeltaPoint' + userId).val(currentAnswer.point);
                userQuestion.attr('data-answer', currentAnswer.answer)
                    .attr('data-point', currentAnswer.point);
            }
        });
    },
    getQuestionsState: function () {
        $.ajax({
            type: 'GET',
            url: '/state/questions',
            success: function (questionsState) {
                $$.admin.renderQuestionsState(questionsState);
            },
            error: function () {
                alert('Error: get questions state!');
            }
        });
    },

    getRound1State: function () {
        $.ajax({
            type: 'GET',
            url: '/admin/round1/state',
            success: function (data) {
                var resultText = (data.action == 'stop' || data.action == 'result') && data.question ?
                ' => ' + data.question.result.toUpperCase() : '';
                $('#round1QuestionIndex').html('Question: ' + data.action + ' ' + data.questionIndex + resultText);
            },
            error: function () {
                alert('Admin: Error when get round 1 state!')
            }
        });
    },

    selectRound: function (sender) {
        sender = $(sender);
        $$.confirm('Change round', 'Are you sure you want to change round "<b>' + sender.html() + '</b>"?', function () {
            var menuRound = $('#menuRound'),
                roundValue = sender.attr('data-value');
            $.ajax({
                type: 'put',
                url: '/state/round',
                data: {key: 'round', value: roundValue},
                dataType: 'JSON',
                success: function (result) {
                    if (result.error) {
                        alert(result.error);
                    } else {
                        menuRound.attr('data-value', roundValue).html(sender.html());
                    }
                },
                error: function () {
                    alert('Admin: Error when get round setting!')
                }
            });
        });
    },
    getRound: function () {
        $.ajax({
            type: 'get',
            url: '/state/round',
            success: function (result) {
                var menuRound = $('#menuRound'),
                    dropdownMenus = menuRound.next().children().eq(result.round);
                menuRound.attr('data-value', result.round).html(dropdownMenus.html());

                if (result.round == 1) {
                    $$.admin.getRound1State();
                }
            },
            error: function () {
                alert('Admin: Error when get round setting!')
            }
        });
    },

    addAllPoints: function () {
        //TODO:
    },
    setAllPoints: function (value) {
        $$.confirm('Set all point', 'Are you sure?', function () {
            $.ajax({
                type: 'put',
                url: '/state/all_point/' + value,
                success: function (result) {
                    if (result.error) {
                        alert('Admin: Error when set all points!')
                    } else {
                        $('.userDeltaPoint').val(value);
                    }
                },
                error: function () {
                    alert('Admin: Error when set all points!')
                }
            });
        });
    },
    setPoint: function (sender, delta) {
        var tr = $(sender).parent().parent(),
            username = tr.attr('data-username'),
            point = tr.children().eq(1).children().eq(0).val();
        $.ajax({
            type: 'put',
            url: '/state/point',
            data: {username: username, point: point * delta},
            dataType: 'JSON',
            success: function (result) {
                if (result.error) {
                    alert('Admin: Error when set point!')
                }
            },
            error: function () {
                alert('Admin: Error when set point!')
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
                $$.admin.renderPoint(result.points);
            },
            error: function () {
                alert('Admin: Error when get point setting!')
            }
        });
    },

    setTime: function (roundIndex) {
        var time = $('#roundTime' + roundIndex).val();
        try {
            time = parseInt(time);
        } catch (ex) {
            time = -1;
        }
        if (time < 0) {
            alert('Admin: Invalid time!');
            return;
        }

        $.ajax({
            type: 'PUT',
            url: '/state/time/' + roundIndex + '/' + time,
            success: function (result) {
                if (result.error) {
                    alert('Error: set time of round ' + roundIndex + '! ' + result.error);
                } else {
                    alert('Success: set time of round ' + roundIndex + '!');
                }
            },
            error: function () {
                alert('Error: set time of round ' + roundIndex + '!');
            }
        });
    },
    getTime: function () {
        $.ajax({
            type: 'get',
            url: '/state/time',
            success: function (result) {
                if (result.round1) $('#roundTime1').val(result.round1);
                if (result.round2) $('#roundTime2').val(result.round2);
                if (result.round3) $('#roundTime3').val(result.round3);
                if (result.round4) $('#roundTime4').val(result.round4);
            },
            error: function () {
                alert('Admin: Error when get time setting!')
            }
        });
    },

    round1Do: function (sender, action) {
        var questionIndex = $(sender).parent().attr('data-value');
        $.ajax({
            type: 'PUT',
            url: '/admin/round1/' + action + '/' + questionIndex,
            success: function (result) {
                if (result.error) {
                    alert('Error: ' + $$.capitalizeFirstLetter(action) + ' question ' + questionIndex + '! ' + result.error);
                }
            },
            error: function () {
                alert('Error: ' + $$.capitalizeFirstLetter(action) + ' question ' + questionIndex + '!');
            }
        });
    },

    renderRound2User: function (username) {
        $('.button-start2').removeClass('badge-warning').addClass('badge-default');
        $('#userRound2' + username).addClass('badge-warning');
    },
    getRound2User: function () {
        $.ajax({
            type: 'get',
            url: '/state/round2User',
            success: function (result) {
                if (result.error) {
                    alert('Admin: Error when get round2 user! ' + result.error)
                } else {
                    $$.admin.renderRound2User(result.round2User);
                }
            },
            error: function () {
                alert('Admin: Error when get round2 user!')
            }
        });
    },
    startRound2: function (username) {
        $.ajax({
            type: 'PUT',
            url: '/state/round2User/' + username,
            success: function (result) {
                if (result.error) {
                    alert('Error: ' + username + ' start round 2! ' + result.error);
                } else {
                    $$.admin.renderRound2User(username);
                }
            },
            error: function () {
                alert('Error: ' + username + ' start round 2!');
            }
        });
    },
    stopRound2: function () {
        $.ajax({
            type: 'DELETE',
            url: '/state/round2User/',
            success: function (result) {
                if (result.error) {
                    alert('Error: ' + username + ' start round 2! ' + result.error);
                } else {
                    $$.admin.renderRound2User(username);
                }
            },
            error: function () {
                alert('Error: ' + username + ' start round 2!');
            }
        });
    },

    renderRound3User: function (data) {
        $('#round3User1').val(data.round3User1);
        $('#round3User2').val(data.round3User2);
        $('#round3User3').val(data.round3User3);
        $('#round3User4').val(data.round3User4);
    },
    getRound3User: function () {
        $.ajax({
            type: 'get',
            url: '/state/round3User',
            success: function (result) {
                if (result.error) {
                    alert('Admin: Error when get round3 user! ' + result.error)
                } else {
                    $$.admin.renderRound3User(result);
                }
            },
            error: function () {
                alert('Admin: Error when get round3 user!')
            }
        });
    },
    setRound3User: function (index) {
        var username = $('#round3User' + index).val();
        $.ajax({
            type: 'PUT',
            url: '/state/round3User/' + index + '/' + username,
            success: function (result) {
                if (result.error) {
                    alert('Error: ' + username + ' start round 3! ' + result.error);
                }
            },
            error: function () {
                alert('Error: ' + username + ' start round 3!');
            }
        });
    },

    renderRound4User: function (data) {
        $('#round4User1').val(data.round4User1);
        $('#round4User2').val(data.round4User2);
    },
    getRound4User: function () {
        $.ajax({
            type: 'get',
            url: '/state/round4User',
            success: function (result) {
                if (result.error) {
                    alert('Admin: Error when get round4 user! ' + result.error)
                } else {
                    $$.admin.renderRound4User(result);
                }
            },
            error: function () {
                alert('Admin: Error when get round4 user!')
            }
        });
    },
    setRound4User: function (index) {
        var username = $('#round4User' + index).val();
        $.ajax({
            type: 'PUT',
            url: '/state/round4User/' + index + '/' + username,
            success: function (result) {
                if (result.error) {
                    alert('Error: ' + username + ' start round 4! ' + result.error);
                }
            },
            error: function () {
                alert('Error: ' + username + ' start round 4!');
            }
        });
    },

    init: function () {
        $('#menuHome').append('<span class="sr-only">(current)</span>').parent().addClass('active');
        $$.admin.getScreen();
        $$.admin.getOnline();
        $$.admin.getQuestionsState();
        $$.admin.getRound();
        $$.admin.getPoint();
        $$.admin.getTime();
        $$.admin.getRound2User();
        $$.admin.getRound3User();
        $$.admin.getRound4User();

        $$.socket.on('screen', function (screen) {
            $$.admin.renderScreen(screen.toLowerCase());
        });
        $$.socket.on('online', function (online) {
            $$.admin.renderOnline(online);
        });
        $$.socket.on('questions_state', function (questionsState) {
            $$.admin.renderQuestionsState(questionsState);
        });
        $$.socket.on('point', function (points) {
            console.log('point', points);
            $$.admin.renderPoint(points);
        });
        $$.socket.on('round1Do', function (data) {
            $$.admin.getRound1State();
            // $('#round1QuestionIndex').html('Question: ' + data.action + ' ' + data.questionIndex + resultText);
        });
        $$.socket.on('round2User', function (data) {
            $$.admin.renderRound2User(data.round2User);
        });
        $$.socket.on('round3User', function () {
            $$.admin.getRound3User();
        });
        $$.socket.on('round4User', function () {
            $$.admin.getRound4User();
        });
    }
};
$(document).ready($$.admin.init);