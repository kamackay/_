var colCount, rowCount
var board
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
