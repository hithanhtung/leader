$$.aUser = {
    init: function () {
        $('#menuUser').append('<span class="sr-only">(current)</span>').parent().addClass('active');
    }
};
$(document).ready($$.aUser.init);