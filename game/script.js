var started = false;
var curs;
$(document).ready(function () {
    collapseSettings('fast');
    removeContextMenu();
    curs = $('#cursorImg')
    $.each($('body').find('*'), function (n, o) {
        $(this).addClass('unselectable');
    });
    var begin = function () {
        if (!started) {
            toast('This page is not ready yet, please feel free to return to http://keithmackay.com');
            started = true;
            $('#pressToBegin').fadeOut();
        }
    }
    $(document).on('mousedown', begin);
    $(document).on('keydown', begin);
    $('*').mousemove(function (e) {
        curs.css('top', e.pageY).css('left', e.pageX);
    });
});
