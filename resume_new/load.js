(function () {
    var loadJs = function (js, index) {
        index = index || 0;
        _get({
            url: js[index],
            done: function (a) {
                var s = document.createElement("script");
                s.type = "text/javascript";
                s.innerHTML = a;
                document.head.appendElement(s);
                loadJs(js, index++);
            }
        });
    };
    _get({
        url: './load.json',
        done: function (data) {
            var b = '';
            const head = document.getElementById('head');
            data.css.forEach(function (a) {
                head.innerHTML += '<link rel="stylesheet" href="' + a + '">';
            });
            loadJs(data.js, 0);
        }
    });
})();
