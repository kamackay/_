var Types = {
    windows10: 1,
    error: 2,
    code: 3
}

var bar, num, txt, maxTime = 100000,
    type = 1;

var opt = {
    typingSpeedMin: 20,
    typingSpeedMax: 200,
    formatNewLines: true
}

$.fn.flash = function (interval) {
    var vis = true,
        t = $(this);
    window.setInterval(function () {
        if (vis) t.fadeOut(100);
        else t.fadeIn(100);
        vis = !vis;
    }, interval);
}

$.fn.typeOut = function (str, complete = function () {}) {
    if (str.length === 0) {
        complete();
        return;
    }
    var t = $(this);
    var c = str.charAt(0);
    var s;
    switch (c) {
        case "\n":
            s = "<br>"
            break;
        case '\t':
            s = '<p style="display:inline-block;">&nbsp;&nbsp;&nbsp;&nbsp;</p>';
            break;
        case ' ':
            c = '&nbsp;';
        default:
            s = '<p style="display:inline-block;">' + c + '</p>';
            break;
    }
    t.append(s);
    setTimeout(function () {
        t.typeOut(str.substr(1))
    }, rand(opt.typingSpeedMin, opt.typingSpeedMax));
}

$(document).ready(function () {
    removeContextMenu();
    var search = window.location.search.substr(1);
    var params = search.split('&');
    try {
        var t = params[0].split('=')[1];
        if (t === 'win10') {
            //Default, so just move on
        } else if (t === 'error') {
            type = Types.error;
        } else if (t === 'code') {
            type = Types.code;
        }
    } catch (ex) {}
    if (isMobileDevice()) showSnackbar('This webpage is not meant for a mobile device, so it may not look correct');
    $(document).on('keydown', function (e) {
        switch (e.which) {
            case 83:
                if (e.ctrlKey) {
                    e.preventDefault();
                    // Save Event here
                }
                break;
            case 116:
                e.preventDefault();
                switch (type) {
                    case Types.windows10:
                        window.location.search = "type=error";
                        break;
                    case Types.error:
                        $('#cursors').html('');
                        break;
                }
                break;
        }
    });
    switch (type) {
        case Types.windows10:
            $('#win10').removeClass('hidden');
            bar = new ProgressBar.Circle('#progress', {
                strokeWidth: 2,
                easing: 'linear',
                duration: 1400,
                color: '#0b9dd5',
                trailColor: '#eee',
                trailWidth: 2,
                svgStyle: null
            });
            txt = $('#text');
            var f = function () {
                var h = $('#progress').height();
                txt.css('top', h * -1).css('height', h);
                txt.css('padding-top', (h - parseFloat(txt.css('font-size')) * 2) / 2);
                var height = $(window).height();
                $.each($('body').find('.dynamic-font'), function (n, o) {
                    var t = $(this);
                    t.css('font-size', parseFloat(t.attr('dyn-font-size')) / 100 * height);
                });

            };
            $(window).resize(f);
            f();
            num = 0;
            setTimeout(increment, Math.random(Math.random() * (maxTime - 5000 + 1)) + 5000);
            showSnackbar('Press F11 to go full screen. It\'s more convincing');
            break;
        case Types.error:
            $('#error').removeClass('hidden');
            var curs = $('#cursors');
            curs.mousemove(function (e) {
                curs.append('<img src="./img/stopped.png" style="display:block;height:200px;position:fixed;top:' + e.pageY.toString() + 'px;left:' + (e.pageX - 100).toString() + 'px;"/>');
            });
            curs.mousedown(function (e) {
                e.preventDefault();
            });
            var currentdate = new Date();
            $('#errTime').html((currentdate.getHours() % 12).toString() + ':' + currentdate.getMinutes().toString() + ' ' + (currentdate.getHours() > 12 ? 'PM' : 'AM'));
            break;
        case Types.code:
            $('#code').removeClass('hidden');
            $.get("https://googledrive.com/host/0B6vDuBGkfv-HaEh3Z0hBNUJuc1U/random.txt", function (data) {
                $('#randomCode').typeOut(data);
            });
            $('#uploadingPass').flash(500);
            break;
    }
});

function increment() {
    if (num > .99) {
        num = 0;
        try {
            for (var i = 1; i <= 4; i++) {
                var el = $('#winText' + i.toString());
                if (!el.hasClass('selected')) {
                    el.addClass('selected');
                    break;
                }
            }
        } catch (err) {}
    }
    num += .01;
    bar.animate(num);
    txt.html((Math.floor(num * 100)).toString() + '%');
    setTimeout(increment, (num * 200) * (Math.random(Math.random() * (maxTime - 5000 + 1)) + 2000));
}
