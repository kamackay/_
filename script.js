var numAnimated = 0;

$(document).ready(function () {
    removeContextMenu();
    setTimeout(function () {
        $('#header').animate({
            top: '-100%'
        }, {
            duration: 5000,
            queue: false
        });
        scrollNext();
    }, 5000);
});

function scrollNext() {
    var next = $('#queue' + numAnimated.toString());
    if (!next.length) return;
    next.animate({
        top: next.attr('anim-dest-top')
    }, {
        duration: parseInt(next.attr('anim-dest-top-time')) || 5000,
        queue: false,
        complete: function () {
            numAnimated++;
            var n = $('#queue' + numAnimated.toString());
            setTimeout(scrollNext, parseInt(n.attr("anim-delay")) || 1000);
        }
    }).animate({
        left: next.attr('anim-dest-left')
    }, {
        duration: parseInt(next.attr('anim-dest-left-time')) || 5000,
        queue: false
    });
    var below = next.attr('anim-dest-below');
    if (below !== undefined) {
        var el = $('#' + below.split(':')[0]);
        next.animate({
            top: el.position().top + el.outerHeight() + parseInt(below.split(':')[1]) || 10
        }, {
            queue: false,
            duration: parseInt(next.attr('anim-dest-top-time')) || 5000

        });
    }
    var styles = next.find('.styleme');
    $.each(styles, function (n, o) {
        var obj = $(this);
        var h = obj.attr('style-height');
        if (h)
            obj.animate({
                height: $(window).height() * parseInt(h) * .01
            }, {
                duration: 5000,
                queue: false
            });
        var w = obj.attr('style-width');
        if (w)
            obj.animate({
                width: $(window).width() * parseInt(w) * .01
            }, {
                duration: 5000,
                queue: false
            });
    });
}
