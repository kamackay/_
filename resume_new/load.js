(function () {
    _get({
        url: './load.json',
        done: function (data) {
            var b = '';
            const head = document.getElementById('head');
            data.css.forEach(function (a) {
                head.innerHTML += '<link rel="stylesheet" href="' + a + '">';
            });
            data.js.forEach(function (a) {
                _loadResource(a);
            });
            console.log(head.innerHTML);
        }
    });
})();
