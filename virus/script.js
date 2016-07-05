var Types = {
    windows10: 1,
    crazy: 2
}

var bar, num, txt, maxTime = 100000,
    type = 1;

$(document).ready(function () {
    removeContextMenu();
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
            };
            $(window).resize(f);
            f();
            num = 0;
            setTimeout(increment, Math.random(Math.random() * (maxTime - 5000 + 1)) + 5000);
            showSnackbar('Press F11 to go full screen. It\'s more convincing');
            break;
    }
});

function increment() {
    num += .01;
    bar.animate(num);
    txt.html((Math.floor(num * 100)).toString() + '%');
    setTimeout(increment, Math.random(Math.random() * (num / 2) * (maxTime - 5000 + 1)) + 5000);
}
