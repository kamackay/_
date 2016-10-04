(function () {
  var loadJs = function (js, index) {
    index = index || 0
    _get({
      url: js[index],
      done: function (a) {
        var names = js[index].split('/')
        var s = document.createElement('script')
        s.id = names[names.length - 1]
        s.type = 'text/javascript'
        s.innerHTML = a
        document.head.appendElement(s)
        loadJs(js, index++)
      }
    })
  }
  _get({
    url: './load.json',
    done: function (data) {
      var b = ''
      const head = document.getElementById('head')
      data.css.forEach(function (a) {
        head.innerHTML += '<link rel="stylesheet" href="' + a + '">'
      })
      loadJs(data.js, 0)
    }
  })
})();
