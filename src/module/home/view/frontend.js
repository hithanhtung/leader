$$.home = {
    init: function () {
        var deadline = Math.round((new Date('1/20/2018 17:00:00')).getTime() / 1000);
        $('#retroclockbox1').flipcountdown({
            tick: function () {
                var nol = function (h) {
                    return h > 9 ? h : '0' + h;
                };

                var range = deadline - Math.round((new Date()).getTime() / 1000),
                    secday = 86400, sechour = 3600,
                    days = parseInt(range / secday),
                    hours = parseInt((range % secday) / sechour),
                    min = parseInt(((range % secday) % sechour) / 60),
                    sec = ((range % secday) % sechour) % 60;
                return nol(days) + ' ' + nol(hours) + ' ' + nol(min) + ' ' + nol(sec);
            }
        });
    }
};
$(document).ready($$.home.init);