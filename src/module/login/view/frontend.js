$$.login = {
    init: function () {

    },
    loginOnclick: function () {
        var data = {
            id: $('#username').val(),
            password: $('#password').val()
        };
        if (data.id == '') {
            $('#loginError').html('Username can not empty!');
            return;
        }
        ;
        if (data.password == '') {
            $('#loginError').html('Password can not empty!');
            return;
        }
        ;
        $.ajax({
            type: 'post',
            url: '/login',
            data: data,
            dataType: "JSON",
            success: function (result) {
                if (result.error) {
                    $('#loginError').html(result.error);
                } else if (result.role == 'admin') {
                    window.location = '/admin';
                } else if (result.role == 'user') {
                    window.location = '/user';
                } else {
                    window.location = '/logout'
                }
            },
            error: function () {
                $('#loginError').html('Login failed !');
            }
        })
    }
};
$(document).ready($$.login.init);