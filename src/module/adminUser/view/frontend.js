$$.aUser = {
    showNewUserModal: function () {
        alert('TODO');
    },

    init: function () {
        $('#menuUser').append('<span class="sr-only">(current)</span>').parent().addClass('active');

        $('#navbarSupportedContent ul').append(
            '<li class="nav-item navbar-toggler-right" style="margin-right: 60px">' +
            '   <a class="nav-link" href="#" onclick="$$.aUser.showNewUserModal(); return false">' +
            '       <i class="large material-icons text-warning">person_add</i>' +
            '   </a>' +
            '</li>'
        );
    }
};
$(document).ready($$.aUser.init);