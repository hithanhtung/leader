$$.aQuestion = {
    init: function () {
        $('#menuQuestion').append('<span class="sr-only">(current)</span>').parent().addClass('active');
        $$.updateRound();
    }
};
$(document).ready($$.aQuestion.init);