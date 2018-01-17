$$.aUser = {
    userId: null,
    activeSpan: '<i class="large material-icons" style="color: blue">check</i>',
    unactiveSpan: '<i class="large material-icons" style="color: gray">close</i>',

    init: function () {
        $('#menuUser').append('<span class="sr-only">(current)</span>').parent().addClass('active');
        $('#userModal').on('shown.bs.modal', function () {
            $('#username').focus();
        });
        $('#userInfoModal').on('shown.bs.modal', function () {
            $('#username').focus();
        });

        $('#navbarSupportedContent ul').append(
            '<li class="nav-item navbar-toggler-right" style="margin-right: 60px">' +
            '   <a class="nav-link" href="#" onclick="$$.aUser.showModal(); return false">' +
            '       <i class="large material-icons text-warning">person_add</i>' +
            '   </a>' +
            '</li><li class="nav-item navbar-toggler-right" style="margin-right: 120px">' +
            '   <a class="nav-link" href="#" onclick="$$.aUser.lockAll(null); return false">' +
            '       <i class="large material-icons text-primary">lock_outline</i>' +
            '   </a>' +
            '</li>'
        );

        $$.aUser.get();
    },

    getRowId: function (row) {
        return row.attr('id').substring(10);
    },

    render: function (users) {
        var table = $('#userTable tbody').html('');
        if (users.length > 0) {
            for (i = 0; i < users.length; i++) {
                var user = users[i];
                table.append(
                    '<tr id="userItemId' + user._id + '" data-password="' + user.password + '" data-username="' + user.username + '" data-role="' + user.role + '"data-active="' + user.active + '">' +
                    '   <td style="text-align:left">' + (i + 1) + '</td>' +
                    '   <td ' + (user.active ? 'style="width:auto; text-align: center;"' : ' style="color:gray; width:auto; text-align: center;"') + '>' + user.username + '</td>' +
                    '   <td style="width:auto; text-align: center;">' + user.role + '</td>' +
                    '   <td class="text-center"><a href="#" onclick="$$.aUser.toggleActive(this, 2); return false">' + (user.active ? this.activeSpan : this.unactiveSpan) + '</a></td>' +
                    '   <td class="text-center"><div style="display: inline-flex">' +
                    '       <a href="#" onclick="$$.aUser.showModalInfo(this, 3); return false" style="margin:0 3px">' +
                    '           <i class="large material-icons" style="color:black">edit</i>' +
                    '       </a>' +
                    '       <a href="#" onclick="$$.aUser.showModalPassword(this, 3); return false" style="margin:0 3px">' +
                    '           <i class="large material-icons" style="color:green">vpn_key</i>' +
                    '       </a>' +
                    '       <a href="#" onclick="$$.aUser.delete(this, 3); return false" style="margin:0 3px">' +
                    '           <i class="large material-icons" style="color:red">delete_forever</i>' +
                    '       </a>' +
                    '   </div></td>' +
                    '</tr>'
                );
            }
        }
    },

    get: function () {
        $.ajax({
            type: 'get',
            url: '/admin/user/getAll',
            success: function (users) {
                if (users.length != 0 && users[0] != undefined) {
                    if (users[0].active) {
                        $('#btnLockAll span').attr('style', 'color:blue;');
                        $('#btnLockAll span').attr('title', 'Lock');
                    } else {
                        $('#btnLockAll span').attr('style', 'color:gray;');
                        $('#btnLockAll span').attr('title', 'Unlock');
                    }
                }
                $$.aUser.render(users);
            },
            error: function () {
                alert('Get all user have error !')
            }
        })
    },

    showModal: function () {
        $$.aUser.userId = null;
        $('#username').val('');
        $('#password').val('');
        $('#confirmPassword').val('');
        $('#userRole').val('user');
        $('#userActive').prop('checked', true);
        $('#userModalError').html('');

        $('#userModal').modal('show');
    },
    showModalInfo: function (row, level) {
        row = $$.getRow(row, level);
        $$.aUser.userId = $$.aUser.getRowId(row);
        $('#newUsername').val(row.attr('data-username'));
        $('#newRole').val(row.attr('data-role'));
        $('#newActive').prop('checked', (row.attr('data-active') == 'true'));
        $('#userInfoModalError').html('');

        $('#userInfoModal').modal('show');
    },
    showModalPassword: function (row, level) {
        row = $$.getRow(row, level);
        $$.aUser.userId = $$.aUser.getRowId(row);
        $('#newPassword').val('');
        $('#confirmNewPassword').val('');

        $('#userPasswordModalError').html('');

        $('#userPasswordModal').off('shown.bs.modal').on('shown.bs.modal', function () {
            $('#username').focus();
        }).modal('show');
    },
    onModalKeyup: function (e) {
        var char = e.which || e.keyCode;
        if (char === 13) $$.aUser.save();
    },
    lockAll: function () {
        $.ajax({
            type: 'PUT',
            url: '/admin/user/lockAll',
            success: function (result) {
                if (result.err) {
                    console.log(result.err);
                    alert('Error: Lock all user has errors!');
                } else {
                    $$.aUser.get();
                }
            },
            error: function () {
                alert('Error: Lock all user has errors!');
            }
        });
    },

    saveNewPassword: function () {
        var item = {
            id: $$.aUser.userId,
            password: $('#newPassword').val(),
            confirmPassword: $('#confirmNewPassword').val(),
        };
        if (item.password === '') {
            $('#userPasswordModalError').html('The password is empty!');
            $('#newPassword').focus();
            return;
        }
        ;
        if (item.confirmPassword === '') {
            $('#userPasswordModalError').html('The confirm password is empty!');
            $('#confirmNewPassword').focus();
            return;
        }
        ;
        if (item.password != item.confirmPassword) {
            $('#userPasswordModalError').html('The confirm password is different the password!');
            $('#confirmNewPassword').focus();
            return;
        }
        $.ajax({
            type: 'PUT',
            url: '/admin/user',
            data: item,
            dataType: 'JSON',
            success: function (result) {
                if (result.error) {
                    alert('Error: Save new password has errors!' + result.error);
                } else {
                    $$.aUser.get();
                }
                $('#userPasswordModal').modal('hide');
            },
            error: function () {
                alert('Error: Save new password has errors!');
                $('#userPasswordModal').modal('hide');
            }
        });
    },
    save: function () {
        var item = {
            id: $$.aUser.userId,
            username: $('#newUsername').val().trim(),
            role: $('#newRole').val().trim(),
            active: $('#newActive').prop('checked')
        };
        if (item.username === '') {
            $('#userModalError').html('The username is empty!');
            $('#newUsername').focus();
            return;
        }
        ;
        $.ajax({
            type: 'PUT',
            url: '/admin/user',
            data: item,
            dataType: 'JSON',
            success: function (result) {
                if (result.error) {
                    alert('Error: Save user has errors!' + result.error);
                } else {
                    $$.aUser.get();
                }
                $('#userInfoModal').modal('hide');
            },
            error: function () {
                alert('Error: Save user has errors!');
                $('#userInfoModal').modal('hide');
            }
        });
    },
    addUser: function () {
        var item = {
            id: $$.aUser.userId,
            username: $('#username').val().trim(),
            password: $('#password').val(),
            confirmPassword: $('#confirmPassword').val(),
            role: $('#userRole').val().trim(),
            active: $('#userActive').prop('checked')
        };
        if (item.username === '') {
            $('#userModalError').html('The username is empty!');
            $('#username').focus();
            return;
        }
        ;
        if (item.password === '') {
            $('#userModalError').html('The password is empty!');
            $('#password').focus();
            return;
        }
        ;
        if (item.confirmPassword === '') {
            $('#userModalError').html('The confirm password is empty!');
            $('#confirmPassword').focus();
            return;
        }
        ;
        if (item.password != item.confirmPassword) {
            $('#userModalError').html('The confirm password is different the password!');
            $('#confirmPassword').focus();
            return;
        }
        $.ajax({
            type: 'POST',
            url: '/admin/user',
            data: item,
            dataType: 'JSON',
            success: function (result) {
                if (result.error) {
                    alert('Error: Save user has errors!' + result.error);
                } else {
                    $$.aUser.get();
                }
                $('#userModal').modal('hide');
            },
            error: function () {
                alert('Error: Save user has errors!');
                $('#userModal').modal('hide');
            }
        });
    },

    delete: function (row, level) {
        row = $$.getRow(row, level);
        var itemId = this.getRowId(row),
            username = row.attr('data-username');
        console.log(itemId);
        $$.confirm('Delete user', 'Are you sure you want to delete this user "' + username + '"?', function () {
            console.log('ok');
            $.ajax({
                type: 'DELETE',
                url: '/admin/user',
                data: {id: itemId},
                dataType: 'JSON',
                success: function (result) {
                    if (result.error) {
                        $$.alert('Error: Delete user has errors!');
                    } else {
                        $$.aUser.get();
                    }
                },
                error: function () {
                    $$.alert('Error: Delete user has errors!');
                }
            });
        });
    },
    toggleActive: function (row, level) {
        row = $$.getRow(row, level);
        var itemId = this.getRowId(row),
            itemActive = !$$.aUser.parseBool(row.attr('data-active'));
        $.ajax({
            type: 'PUT',
            url: '/admin/user',
            data: {id: itemId, active: itemActive},
            dataType: 'JSON',
            success: function (result) {
                if (result.error) {
                    console.log(result.error);
                    alert('Error: Update user has errors!');
                } else {
                    console.log(result);
                    row.attr('data-active', result.item.active);
                    row.children().eq(1).css('color', result.item.active ? '' : 'gray');
                    row.children().eq(3).children().eq(0).html(result.item.active ? $$.aUser.activeSpan : $$.aUser.unactiveSpan);
                }
            },
            error: function () {
                $$.alert('Error: Update user has errors!');
            }
        });
    },
    parseBool: function (obj) {
        return obj.toString().toLowerCase() === 'true';
    }
};
$(document).ready($$.aUser.init);