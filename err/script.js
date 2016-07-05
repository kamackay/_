var Types = {
    windows10: 1,
    error: 2
}

var bar, num, txt, maxTime = 100000,
    type = 1;

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
        }
    } catch (ex) {}
    //if (isMobileDevice()) return;
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
                if (type !== Types.error) window.location.search = "type=error";
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
                curs.append('<img src="./img/stopped.png" style="display:block;height:200px;position:fixed;top:' + e.pageY.toString() + 'px;left:' + e.pageX.toString() + 'px;"/>');
            });
            curs.mousedown(function (e) {
                e.preventDefault();
            });
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
    setTimeout(increment, (num * 50) * (Math.random(Math.random() * (maxTime - 5000 + 1)) + 5000));
}
