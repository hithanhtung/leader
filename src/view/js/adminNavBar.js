$$.logout = function () {
    $$.confirm('Logout', 'Are you sure you want to logout?', function () {
        window.location = '/logout';
    });
};

$$.selectRound = function (sender) {
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
                    console.log(result.error);
                } else {
                    menuRound.attr('data-value', roundValue).html(sender.html());
                }
            },
            error: function () {
                console.log('Admin: Error when get round setting!')
            }
        });
    });
};

$$.updateRound = function () {
    $.ajax({
        type: 'get',
        url: '/state/round',
        data: {key: 'round'},
        dataType: 'JSON',
        success: function (result) {
            var menuRound = $('#menuRound'),
                dropdownMenus = menuRound.next().children().eq(result.round);
            menuRound.attr('data-value', result.round).html(dropdownMenus.html())
                .parent().css('display', 'block');
        },
        error: function () {
            console.log('Admin: Error when get round setting!')
        }
    });
};