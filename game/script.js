var started = false;
var curs;
var mousePos = {
    x: 0,
    y: 0
}
var shoot = function () {
    $('body').append('<img class="unselectable" src="' + getBulletImage() + '" style="position:fixed;top:' + mousePos.y + 'px;left:' + mousePos.x + 'px;"/>')
}
$(document).ready(function () {
    collapseSettings('fast');
    removeContextMenu();
    curs = $('#cursorImg')
    curs.css('display', 'none');
    $.each($('body').find('*'), function (n, o) {
        $(this).addClass('unselectable');
    });
    var begin = function () {
        if (!started) {
            started = true;
            curs.fadeIn();
            toast('This page is not ready yet, please feel free to return to http://keithmackay.com');
            $('#pressToBegin').fadeOut();
        } else shoot()
    }
    $(document).on('mousedown', begin);
    $(document).on('keydown', begin);
    $('*').mousemove(function (e) {
        curs.css('top', e.pageY).css('left', e.pageX);
        mousePos.x = e.pageX;
        mousePos.y = e.pageY;
    });
    $('*').on('dragstart', function (e) {
        e.preventDefault();
    })
});

function getBulletImage() {
    return 'bullet' + randInt(1, 2).toString() + '.png';

}
