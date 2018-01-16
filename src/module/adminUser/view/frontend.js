$$.aUser = {
    init: function () {
        $('#menuUser').append('<span class="sr-only">(current)</span>').parent().addClass('active');
        $$.updateRound();
    }
};
$(document).ready($$.aUser.init);