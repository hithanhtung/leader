$$.aQuestion = {
    init: function () {
        $('#menuQuestion').append('<span class="sr-only">(current)</span>').parent().addClass('active');
    }
};
$(document).ready($$.aQuestion.init);