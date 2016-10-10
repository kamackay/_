(function () {
    var html_src;

    var loadJs = function (js, index) {
        try {
            if (index >= js.length) {
                console.log("scripts fully loaded");
                $('#loading').slideUp(1000, function () {
                    $('#loading').remove();
                    $('#rootCont').fadeIn();
                })
                return;
            }
            _get({
                url: js[index],
                done: function (a) {
                    var names = js[index].split('/');
                    var s = document.createElement('script');
                    s.name = names[names.length - 1].split('.')[0];
                    s.type = 'text/javascript';
                    s.innerHTML = a;
                    document.head.appendChild(s);
                    loadJs(js, index + 1);
                },
                fail(info) {
                    console.log("error loading " + js[index]);
                }
            })
        } catch (error) {
            console.log("error loading " + js[index]);
        }
    }
    _get({
        url: './load.json',
        done: function (data) {
            const head = document.getElementById('head');
            data.css.forEach(function (a) {
                head.innerHTML += '<link rel="stylesheet" href="' + a + '">'
            });
            loadJs(data.js, 0);
            _get({
                url: data.html_src,
                done: function (html) {
                    document.body.innerHTML += '<div style="height:100vh;width:100vw;display:none;" id="rootCont">' + html + '</div>';
                }
            });
            if (data.background_src) document.body.style.backgroundImage = "url(" + data.background_src + ")";
        }
    })
})();
