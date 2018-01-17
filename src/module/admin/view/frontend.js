$$.admin = {
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

    renderOnlineData: function (online) {
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
                $$.admin.renderOnlineData(online);
            },
            error: function () {
                alert('Error: get online data!');
            }
        });
    },

    init: function () {
        $('#menuHome').append('<span class="sr-only">(current)</span>').parent().addClass('active');
        $$.updateRound(function (roundIndex) {
            if (roundIndex == 1) {
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
        });

        $$.admin.getOnline();

        $$.socket.on('round1Do', function (data) {
            $('#round1QuestionIndex').html('Question: ' + data.action + ' ' + data.questionIndex);
            // $('#round1Status').html($$.capitalizeFirstLetter(data.action) + ': ' + data.questionIndex);
        });

        $$.socket.on('online', function (online) {
            $$.admin.renderOnlineData(online);
        });
    }
};
$(document).ready($$.admin.init);