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
                    $.ajax({
                        type: 'GET',
                        url: '/admin/round1/state',
                        success: function (data) {
                            $('#round1QuestionIndex').html('Question: ' + data.action + ' ' + data.questionIndex);
                        },
                        error: function () {
                            alert('Error: ' + $$.capitalizeFirstLetter(action) + ' question ' + questionIndex + '!');
                        }
                    });
                }
            },
            error: function () {
                alert('Admin: Error when get round setting!')
            }
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

    init: function () {
        $('#menuHome').append('<span class="sr-only">(current)</span>').parent().addClass('active');
        $$.admin.getScreen();
        $$.admin.getOnline();
        $$.admin.getRound();
        $$.admin.getPoint();

        $$.socket.on('screen', function (screen) {
            $$.admin.renderScreen(screen.toLowerCase());
        });
        $$.socket.on('online', function (online) {
            $$.admin.renderOnline(online);
        });
        $$.socket.on('point', function (points) {
            $$.admin.renderPoint(points);
        });
        $$.socket.on('round1Do', function (data) {
            $('#round1QuestionIndex').html('Question: ' + data.action + ' ' + data.questionIndex);
        });
    }
};
$(document).ready($$.admin.init);