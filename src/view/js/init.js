$$.cookie = function (cname, cvalue, exdays) {
    if (cvalue === undefined) {
        var name = cname + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    } else {
        if (exdays === undefined) exdays = 60;
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        document.cookie = cname + '=' + cvalue + ';expires=' + d.toUTCString() + ';path=/';
    }
};

$$.alert = function (text) {
    $('#modalAlert .modal-body p').html(text);
    $('#modalAlert').modal('show');
};

$$.confirm = function (title, text, okDone) {
    $('#modalConfirm .confirmYes').unbind().click(okDone);
    $('#modalConfirm .modal-header .modal-title').html(title);
    $('#modalConfirm .modal-body p').html(text);
    $('#modalConfirm').modal('show');
};

$$.dateToString = function (date) {
    date = new Date(date);
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
};

$$.timeParam = function () {
    return '?t=' + new Date().getTime();
};

$$.download = function (uri) {
    var link = document.createElement('a');
    link.target = '_blank';
    link.href = uri;
    link.click();
};

$$.isEmail = function (email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
};

$$.getRow = function (item, level) {
    item = $(item);
    while (level > 0) {
        item = item.parent();
        level--;
    }
    return item;
};

$$.capitalizeFirstLetter = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

$(document).ready(function () {
    $$.connected = null;
    $$.socket = io();
    $$.socket.on('connect', function () {
        if ($$.connected == null) {
            $$.connected = true;
        } else {
            location.reload();
        }
    });
    $$.socket.on('reconnect_attempt', function (attemptNumber) {
        $$.connected = -attemptNumber;
    });
});