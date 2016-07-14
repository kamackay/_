function runCode() {
    var codeElement = $('#jsCode');
    var codeText = codeElement.val();
    eval(codeText);
    //console.log(codeText);
}

const Keys = {
    codeStore: 'codeStore',
    formatOnSave: 'formatOnSave'
}

settings.prettyPrintOnSave = false;

$(document).ready(function () {
    settings.prettyPrintOnSave = (getData(Keys.formatOnSave) === 'true');
    if (!settings.prettyPrintOnSave) $('#formatWhenSave').prop('checked', false);
    collapseSettings();
    $(document).on('keydown', function (event) {
        switch (event.which) {
            case 83:
                if (event.ctrlKey) {
                    event.preventDefault();
                    //showSnackbar('You can\'t save me.');
                    if (settings.prettyPrintOnSave) formatCode();
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
    showWatermark();
    $.each($('*'), function (n, o) {
        $(this).addClass('unselectable');
    }); /**/
    setTimeout(function () {
        //loadJSAsync('https://googledrive.com/host/0B6vDuBGkfv-HaEh3Z0hBNUJuc1U/xregexp.js', 'xregxScript');
        loadJSAsync('https://googledrive.com/host/0B6vDuBGkfv-HaEh3Z0hBNUJuc1U/beautify.js', 'beautifyScript');
    }, 100);
    var codeElement = $('#jsCode');
    codeElement.on('keydown', function (e) {
        switch (e.which) {
            case 9:
                e.preventDefault();
                if (e.shiftKey) {
                    var start = codeElement.get(0).selectionStart;
                    var end = codeElement.get(0).selectionEnd;
                } else {
                    var start = codeElement.get(0).selectionStart;
                    var end = codeElement.get(0).selectionEnd;
                    codeElement.val(codeElement.val().substring(0, start) + "\t" + codeElement.val().substring(end));
                    codeElement.get(0).selectionStart =
                        codeElement.get(0).selectionEnd = start + 1;
                }
                break;
        }
    });
    var casheData = getData(Keys.codeStore);
    if (casheData && casheData.length) codeElement.val(casheData);
    setInterval(saveCode, 100);
});

function saveCode() {
    var codeElement = $('#jsCode');
    var newCode = codeElement.val();
    if (newCode !== code)
        storeData(Keys.codeStore, codeElement.val());
}

var code = "";

function beautifyAvailable() {
    return $('#beautifyScript').length;
}

function xRegXAvailable() {
    return $('#xregxScript').length
}

function refreshElements() {
    redirectTo('./');
    /*var newEl = $('*').find('*:not(.originalEl)');
    $.each(newEl, function (n, o) {
        $(this).remove();
    });/**/ //This code doesn't 100% work
}

function formatCode() {
    if (beautifyAvailable()) {
        var prettyCode = js_beautify($('#jsCode').val());
        $('#jsCode').val(prettyCode);
    } else toast('Still Loading, please wait one moment');
}

function minifyCode() {
    var minCode = js_minify($('#jsCode').val());
    $('#jsCode').val(minCode);
}

function formatOnSave() {
    settings.prettyPrintOnSave = !settings.prettyPrintOnSave;
    storeData(Keys.formatOnSave, settings.prettyPrintOnSave.toString());
}
