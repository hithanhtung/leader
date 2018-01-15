$$.loader = {
    delayTime: 500,
    isHidden: function () {
        return $('#loader-bar').css('display') == 'none';
    },
    showIfHidden: function (percent) {
        if ($('#loader-bar').css('display') == 'none') $$.loader.show(true, percent);
    },
    show: function (visibility, percent) {
        var bar = $('#loader-bar');
        bar.children().eq(0).css('width', percent + '%').attr('aria-valuenow', percent);
        var timeout = (bar.css('display') == 'block' && !visibility) ? this.delayTime : 0;
        setTimeout(function () {
            visibility = visibility ? 'block' : 'none';
            bar.css('display', visibility);
            $('.loader-circle').css('display', visibility);
        }, timeout);
    }
};