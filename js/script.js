function runCode() {
    var codeElement = $('#jsCode');
    var codeText = codeElement.val();
    eval(codeText);
    //console.log(codeText);
}

const Keys = {
    codeStore: 'codeStore'
}

$(document).ready(function () {
    $(document).on('keydown', function (event) {
        switch (event.which) {
            case 83:
                if (event.ctrlKey) {
                    event.preventDefault();
                    showSnackbar('You can\'t save me.');
                }
                break;
            case 116:
                event.preventDefault();
                showSnackbar('Refresh disabled. Just to be a dick.');
                break;
            default:
                //alert(event.which);
        }
    });
    $.each($('*'), function (n, o) {
        $(this).addClass('originalEl');
    });
    try {
        $.get('https://googledrive.com/host/0B6vDuBGkfv-HaEh3Z0hBNUJuc1U/beautify.js', function (data) {
            $('head').append('<script id="beautifyScript" class="originalEl" type="text/javascript">' + data + '</script>');
        });
    } catch (err) {
        console.log("Error loading script:: - " + err)
    }
    var codeElement = $('#jsCode');
    var casheData = getData(Keys.codeStore);
    if (casheData && casheData.length) codeElement.val(casheData);
    setInterval(function () {
        var newCode = codeElement.val();
        if (newCode !== code)
            storeData(Keys.codeStore, codeElement.val());

    }, 100);
});

var code = "";

function beautifyAvailable() {
    return $('#beautifyScript').length;
}

function refreshElements() {
    var newEl = $('*').find('*:not(.originalEl)');
    $.each(newEl, function (n, o) {
        $(this).remove();
    });
}

function formatCode() {
    if (beautifyAvailable()) {
        var prettyCode = js_beautify($('#jsCode').val());
        $('#jsCode').val(prettyCode);
    } else toast('Still Loading, please wait one moment');
}
