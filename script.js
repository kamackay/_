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
        var el = $('#' + below);
        next.animate({
            top: el.position().top + el.outerHeight() + 10
        }, {
            queue: false,
            duration: parseInt(next.attr('anim-dest-top-time')) || 5000

        })
    }
}
