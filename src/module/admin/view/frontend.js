$$.admin = {
    init: function () {
        $('#menuHome').append('<span class="sr-only">(current)</span>').parent().addClass('active');

        $$.updateRound();
    }
};
$(document).ready($$.admin.init);