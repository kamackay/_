var colCount, rowCount
var board
const maxTileVal = 8;

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
    setupTiles();
})

function tileClick(e) {

}

function setSizes() {
    var board = $('#board');
    var size = Math.min(board.width() / colCount, board.height() / rowCount);
    $.each(board.find('*.row'), function (n, o) {
        $(this).css('height', size - 6);
    });
    $.each(board.find('*.tile'), function (n, o) {
        var t = $(this);
        t.css('height', size - 6).css('width', (board.width() * .12) - 2);
        t.on('click', tileClick);
    });
}

function animTileAway(x, y) {
    var id = 'tile' + y.toString() + x.toString()
    var el = $('#' + id)
    var pos = el.offset();
    $('body').append('<div class="animationTile" id="anim' + id + '" style="top:' + pos.top + 'px;left:' + pos.left + 'px;height:' + el.height() + 'px;width:' + el.width() + 'px;"></div>')
    var animEl = $('#anim' + id);
    var classes = el.attr('class').split(/\s+/);
    var valClass = '';
    for (var i = 0; i < classes.length; i++)
        if (classs[i].startsWith('filled-')) valClass = classes[i];
    var w = $(window).width();
    var maxX = (pos.left > w / 2) ? w * 1.5 : w / 1.5;
    var minX = (pos.left > w / 2) ? w / 3 : (-1 / 3) * w;
    var newX = Math.random() * (maxX - minX) + minX;
    animEl.animate({
        top: $(window).height() * 1.5
    }, {
        duration: 2500,
        easing: 'swing',
        queue: false
    }).animate({
        left: newX
    }, {
        duration: 1500,
        easing: 'swing',
        queue: false
    })
    animEl.animateRotate(3000, 3000, 'linear', function () {
        animEl.remove();
    })
}

function getTile(x, y) {
    return $('#tile' + y.toString() + x.toString());
}

function setupTiles() {
    var numFilled = 0,
        maxVal = colCount * rowCount;
    for (var x = 0; x < colCount; x++) {
        for (var y = 0; y < rowCount; y++) {
            if (numFilled < maxVal && randBool()) {
                setFilled(x, y);
                numFilled++;
            }
        }
    }
}

function randBool() {
    return Math.random() > .5;
}

function setFilled(x, y) {
    var tile = $('#tile' + y.toString() + x.toString());
    tile.addClass('filled');
    var tileVal = Math.floor(Math.random() * maxTileVal);
    tile.addClass('filled-' + tileVal.toString());
}
