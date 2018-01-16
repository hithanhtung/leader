$$.aQuestion = {
    showNewQuestionModal: function () {
        $('#modalQuestion').modal('show');
    },

    init: function () {
        $('#menuQuestion').append('<span class="sr-only">(current)</span>').parent().addClass('active');

        $('#navbarSupportedContent ul').append(
            '<li class="nav-item navbar-toggler-right" style="margin-right: 60px">' +
            '   <a class="nav-link" href="#" onclick="$$.aQuestion.showNewQuestionModal(); return false">' +
            '       <i class="large material-icons text-success">add_circle_outline</i>' +
            '   </a>' +
            '</li>'
        );
    }
};
$(document).ready($$.aQuestion.init);