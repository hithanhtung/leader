$$.login = {
    init: function () {
        $('#username').focus();
    },

    loginOnKeyup: function (e) {
        var char = e.which || e.keyCode;
        if (char == 13) {
            $$.login.loginOnClick();
        }
    },

    loginOnClick: function () {
        var data = {
            id: $('#username').val().trim(),
            password: $('#password').val()
        };
        if (data.id == '') {
            $('#loginError').html('Username can not empty!').focus();
            return false;
        }
        if (data.password == '') {
            $('#loginError').html('Password can not empty!').focus();
            return false;
        }

        $.ajax({
            type: 'post',
            url: '/login',
            data: data,
            dataType: 'JSON',
            success: function (result) {
                if (result.error) {
                    $('#loginError').html(result.error);
                } else if (result.role == 'admin') {
                    window.location = '/admin';
                } else if (result.role == 'user') {
                    window.location = '/user';
                } else if (result.role == 'mc') {
                    window.location = '/mc';
                } else {
                    window.location = '/logout'
                }
            },
            error: function () {
                $('#loginError').html('Login failed !');
            }
        });
        return false;
    }
};
$(document).ready($$.login.init);