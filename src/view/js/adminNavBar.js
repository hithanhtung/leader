$$.logout = function () {
    $$.confirm('Logout', 'Are you sure you want to logout?', function () {
        window.location = '/logout';
    });
};

$(document).ready(function () {
});