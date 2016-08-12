var colCount, rowCount
var board
$(document).ready(function () {
  board = $('#board')
  colCount = Android.getColumnCount()
  rowCount = Android.getRowCount()
  // Android.toast('rows = ' + rowCount.toString())
  // Android.toast('columns = ' + colCount.toString())
  for (var y = 0; y < rowCount; y++) {
    var rowElement = "<div class='row'>"
    for (var x = 0; x < colCount; x++) {
      rowElement += '<div class="tile" id="tile' + x.toString() + y.toString() + '"></div>'
    }
    rowElement += '</div>'
    // Android.log(rowElement)
    board.append(rowElement)
  }
})
