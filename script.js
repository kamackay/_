$(document).ready(function () {
    removeContextMenu();
    $(document).on('keydown', function (e) {
        switch (e.which) {
            case 115:
                if (e.ctrlKey || e.which === 19) e.preventDefault();
                break;
            case 116:
                e.preventDefault();
                showSnackbar('Refresh disabled. Just to be a dick.');
                break;
            case 83:
                if (e.ctrlKey) {
                    e.preventDefault();
                    showSnackbar("I cannot be saved");
                }
                break;
        }
    }); /**/
    $('#contents').append('<img id="page-back" class="full" style="z-index: 100;opacity:0" src="https://googledrive.com/host/0B6vDuBGkfv-HSjhIcnJEUF9yc0k/material_dark.jpg" />');
    back = $('#page-back');
    back.load(function () {
        back.animate({
            opacity: 100
        }, {
            duration: 2000,
            queue: false,
            complete: dropIn
        });
    });
    var r = function () {
        var w = back.width(),
            w2 = $(window).width();
        if (w < w2) back.css('width', w2);
    };
    $(window).resize(r);
    r();
});
var back;

function dropIn() {
    var els = $('.dropIn');
    $.each(els, function (n, o) {
        var t = $(this);
        t.animate({
            top: t.attr('drop-top')
        }, {
            duration: t.attr('drop-time') || 2000,
            queue: false,
            easing: 'easeOutBounce'
        });
    });
    setTimeout(dropUp, 2000);
}

function dropUp() {
    var els = $('.dropUp');
    $.each(els, function (n, o) {
        var t = $(this);
        t.animate({
            top: t.attr('drop-top') || 0
        }, {
            duration: t.attr('drop-time') || 2000,
            queue: false,
            easing: 'easeOutBounce',
            complete: bounceUp
        });
    });
}

function bounceUp() {
    var els = $('.bounceUp');
    $.each(els, function (n, o) {
        var t = $(this);
        t.animate({
            top: t.attr('drop-top') || 0
        }, {
            duration: t.attr('drop-time') || 2000,
            queue: false,
            easing: 'easeOutBounce',
            complete: function () {
                $(window).resize(function () {
                    var e = $('.')
                    alert()
                });
            }
        });
    });
}
