var colCount, rowCount
var board

$.fn.animateRotate = function (angle, duration, easing, complete) {
    var args = $.speed(duration, easing, complete);
    var step = args.step;
    return this.each(function (i, e) {
        args.complete = $.proxy(args.complete, e);
        args.step = function (now) {
            $.style(e, 'transform', 'rotate(' + now + 'deg)');
            if (step) return step.apply(e, arguments);
        };

        $({
            deg: 0
        }).animate({
            deg: angle
        }, args);
    });
};

$(document).ready(function () {
    board = $('#board')
    colCount = 8 //Android.getColumnCount()
    rowCount = 12 //Android.getRowCount()
    for (var y = 0; y < rowCount; y++) {
        rowEl = '<div class="row">'
        for (var x = 0; x < colCount; x++) {
            rowEl += '<div class="tile" id="tile' + y.toString() + x.toString() + '"></div>'
        }
        rowEl += '</div>'
        board.append(rowEl)
    }
    setSizes()
    $(window).resize(setSizes)
    setTimeout(function () {
        animTileAway(2, 2);
    }, 1000)
})

function setSizes() {
    var board = $('#board');
    var size = Math.min(board.width() / colCount, board.height() / rowCount);
    $.each(board.find('*.row'), function (n, o) {
        $(this).css('height', size - 6);
    });
    $.each(board.find('*.tile'), function (n, o) {
        $(this).css('height', size - 6).css('width', (board.width() * .12) - 2);
    });
}

function animTileAway(x, y) {
    var id = 'tile' + y.toString() + x.toString()
    var el = $('#' + id)
    var pos = el.offset();
    $('body').append('<div class="animationTile" id="anim' + id + '" style="top:' + pos.top + 'px;left:' + pos.left + 'px;height:' + el.height() + 'px;width:' + el.width() + 'px;"></div>')
    var animEl = $('#anim' + id);
    var maxX = $(window).width() * 1.5;
    var newX = Math.random() * (maxX - (-1 * maxX)) + (-1 * maxX);
    animEl.animate({
        top: $(window).height() * 1.5
    }, {
        duration: 3000,
        easing: 'swing',
        queue: false
    }).animate({
        left: newX
    }, {
        duration: 2000,
        easing: 'swing',
        queue: false
    })
    animEl.animateRotate(5000, 5000, 'linear')
}
