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

    updateRoundState: function(data) {

    },

    init: function () {
        $('#menuHome').append('<span class="sr-only">(current)</span>').parent().addClass('active');
        $$.updateRound(function(roundIndex) {
            if (roundIndex == 1) {
                $.ajax({
                    type: 'GET',
                    url: '/admin/round1/state',
                    success: function (result) {
                        if (result.error) {
                            alert('Error: ' + $$.capitalizeFirstLetter(action) + ' question ' + questionIndex + '! ' + result.error);
                        }
                    },
                    error: function () {
                        alert('Error: ' + $$.capitalizeFirstLetter(action) + ' question ' + questionIndex + '!');
                    }
                });
            }
        });

        $$.socket.on('round1Do', function (data) {
            $('#round1QuestionIndex').html('Question: ' + data.action + ' ' + data.questionIndex);
            // $('#round1Status').html($$.capitalizeFirstLetter(data.action) + ': ' + data.questionIndex);
        });
    }
};
$(document).ready($$.admin.init);