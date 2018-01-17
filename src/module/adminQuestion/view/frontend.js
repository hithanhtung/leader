$$.aQuestion = {
    questionId: null,
    showNewQuestionModal: function (row, level) {
        if (row !== null) {
            row = $$.getRow(row, level);
            $$.aQuestion.questionId = this.getRowId(row);
            $('#qClip').val(row.attr('data-clipUrl'));
            $('#qContent').froalaEditor('html.set', row.attr('data-content'));
            $('#qAnswerA').val(row.attr('data-answerA'));
            $('#qAnswerB').val(row.attr('data-answerB'));
            $('#qAnswerC').val(row.attr('data-answerC'));
            $('#qAnswerD').val(row.attr('data-answerD'));
            if(row.attr('data-result') == undefined){
                $('#qResult input:radio[name=result]:checked').prop('checked', false);
            }else{
                $('#qResult input[value="' + row.attr('data-result') + '"]').prop('checked', true);
            }
            $('#qHint').val(row.attr('data-hint'));
        } else {
            $$.aQuestion.questionId = null;
            $('#qClip').val('');
            $('#qContent').froalaEditor('html.set', '');
            $('#qAnswerA').val('');
            $('#qAnswerB').val('');
            $('#qAnswerC').val('');
            $('#qAnswerD').val('');
            $('#qResult input:radio[name=result]:checked').prop('checked', false);
            $('#qHint').val('');
        }
        $('#qsModalError').html('');
        $('#modalQuestion').modal('show');
    },
    init: function () {
        $$.aQuestion.get();
        $('#qContent').froalaEditor({
            height: 200,
            width: 750
        });

        $('#menuQuestion').append('<span class="sr-only">(current)</span>').parent().addClass('active');

        $('#navbarSupportedContent ul').append(
            '<li class="nav-item navbar-toggler-right" style="margin-right: 60px">' +
            '   <a class="nav-link" href="#" onclick="$$.aQuestion.showNewQuestionModal(null); return false">' +
            '       <i class="large material-icons text-success">add_circle_outline</i>' +
            '   </a>' +
            '</li>'
        );
    },
    getRowId: function (row) {
        return row.attr('id').substring(10);
    },
    get: function () {
        $.ajax({
            type: 'get',
            url: '/adminQuestion/getAll',
            success: function (questions) {
                $$.aQuestion.render(questions);
            },
            error: function () {
                alert('Get all question have error !')
            }
        })
    },
    render: function (questions) {
        var table = $('#question').html('');
        if (questions.length > 0) {
            for (i = 0; i < questions.length; i++) {
                var qs = questions[i];
                table.append(
                    '<div class="card" id="questionId' + qs._id + '" data-result="'+qs.result + '" data-content="' + qs.content + '" data-answerA="' + qs.answerA + '" data-answerB="' + qs.answerB + '" data-answerC="' + qs.answerC + '" data-answerD="' + qs.answerD + '" data-hint="' + qs.hint + '" data-clipUrl="' + qs.clipUrl + '">' +
                    '   <div id="heading' + (i + 1) + '" role="tab" class="card-header">' +
                    '       <a data-toggle="collapse" data-parent="#question" href="#collapse' + (i + 1) + '" aria-expanded="true" aria-controls="collapse' + (i + 1) + '">Question ' + qs.index + '</a>' +
                    '       <a href="#">' +
                    '           <i class="large material-icons text-danger float-right" onclick="$$.aQuestion.delete(this,3); return false;">delete_forever</i>' +
                    '       </a>' +
                    '       <a href="#">' +
                    '           <i style="margin-right:6px" class="large material-icons text-success float-right" onclick="$$.aQuestion.showNewQuestionModal(this,3); return false;">edit</i>' +
                    '       </a>' +
                    '       <a href="#">' +
                    '           <i style="margin-right:6px" class="large material-icons text-primary float-right" onclick="$$.aQuestion.moveUp(this,3,true); return false;">arrow_upward</i>' +
                    '       </a>' +
                    '       <a href="#">' +
                    '           <i style="margin-right:6px" class="large material-icons text-primary float-right" onclick="$$.aQuestion.moveUp(this,3,false); return false;">arrow_downward</i>' +
                    '       </a>' +
                    '   </div>' +
                    '   <div id="collapse' + (i + 1) + '" role="tabpanel" aria-labelledby="heading' + (i + 1) + '" class="collapse show">' +
                    '       <div class="card-block">' +
                    '           <div role="alert" class="alert alert-primary">' + qs.content + '</div>' +
                    '           <div role="alert" class="alert alert-secondary"><strong>A. </strong>' + qs.answerA + '</div>' +
                    '           <div role="alert" class="alert alert-secondary"><strong>B. </strong>' + qs.answerB + '</div>' +
                    '           <div role="alert" class="alert alert-secondary"><strong>C. </strong>' + qs.answerC + '</div>' +
                    '           <div role="alert" class="alert alert-secondary"><strong>D. </strong>' + qs.answerD + '</div>' +
                    '           <div role="alert" class="alert alert-info"><strong>Hint. </strong>' + qs.hint + '</div>' +
                    '           <div role="alert" class="alert alert-info"><strong>Result. </strong>' + qs.result + '</div>' +
                    '           <div role="alert" class="alert alert-info"><strong>Clip. </strong>' + qs.clipUrl + '</div>' +
                    '       </div>' +
                    '   </div>' +
                    '</div>'
                );
            }
        }
    },
    onModalKeyup: function (e) {
        var char = e.which || e.keyCode;
        if (char === 13) $$.round3_1.save();
    },
    save: function () {
        var question = {
            id: $$.aQuestion.questionId,
            clipUrl: $('#qClip').val().trim(),
            content: $('#qContent').val().trim(),
            answerA: $('#qAnswerA').val().trim(),
            answerB: $('#qAnswerB').val().trim(),
            answerC: $('#qAnswerC').val().trim(),
            answerD: $('#qAnswerD').val().trim(),
            result: $('#qResult input:radio[name=result]:checked').val(),
            hint: $('#qHint').val().trim(),
        };
        if (question.content == '') {
            $('#qsModalError').html('Question content can not empty !');
            return;
        }
        if (question.answerA == '') {
            $('#qsModalError').html('Answer A can not empty !');
            return;
        }
        if (question.answerB == '') {
            $('#qsModalError').html('Answer B can not empty !');
            return;
        }
        if (question.answerC == '') {
            $('#qsModalError').html('Answer C can not empty !');
            return;
        }
        if (question.answerD == '') {
            $('#qsModalError').html('Answer D can not empty !');
            return;
        }

        $.ajax({
            type: ($$.aQuestion.questionId == null ? 'POST' : 'PUT'),
            url: '/adminQuestion',
            data: question,
            dataType: 'JSON',
            success: function (result) {
                if (result.error) {
                    $$.alert('Error: Save question has errors!');
                } else {
                    $$.aQuestion.get();
                }
                $('#modalQuestion').modal('hide');
            },
            error: function () {
                $$.alert('Error: Save question has errors!');
                $('#modalQuestion').modal('hide');
            }
        });
    },
    delete: function (row, level) {
        row = $$.getRow(row, level);
        var itemId = this.getRowId(row);
        $$.confirm('Delete question', 'Are you sure you want to delete this question ?', function () {
            $.ajax({
                type: 'DELETE',
                url: '/adminQuestion',
                data: {id: itemId},
                dataType: 'JSON',
                success: function (result) {
                    if (result.error) {
                        $$.alert('Error: Delete question has errors!');
                    } else {
                        $$.aQuestion.get();
                    }
                },
                error: function () {
                    $$.alert('Error: Delete question has errors!');
                }
            });
        });
    },
    moveUp: function (row, level, status) {
        row = $$.getRow(row, level);
        var itemId = this.getRowId(row);
        $$.confirm('Move question', 'Are you sure you want to move ' + (status ? 'up' : 'down') + ' this question ?', function () {
            $.ajax({
                type: 'put',
                url: '/adminQuestion/move',
                data: {id: itemId, status: status},
                dataType: 'JSON',
                success: function (result) {
                    if (result.error) {
                        $$.alert('Error: Move question has errors!');
                    } else {
                        $$.aQuestion.get();
                    }
                },
                error: function () {
                    $$.alert('Error: Move question has errors!');
                }
            });
        });
    }
};
$(document).ready($$.aQuestion.init);