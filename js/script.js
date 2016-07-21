function runCode() {
    var codeElement = $('#jsCode');
    var codeText = codeElement.val();
    eval(codeText);
    //console.log(codeText);
}

const Keys = {
    codeStore: 'codeStore',
    formatOnSave: 'formatOnSave',
    minComments: 'minComments',
    autoSave: 'autoSave',
    autoSaveTime: 'autoSaveTime'
}

settings.prettyPrintOnSave = false;
settings.keepCommentsOnMin = false;
settings.autoSave = false;
settings.autoSaveTime = 500;

$(document).ready(function () {
    settings.prettyPrintOnSave = (getData(Keys.formatOnSave) !== 'false');
    settings.keepCommentsOnMin = (getData(Keys.minComments) !== 'false');
    settings.autoSave = (getData(Keys.autoSave) !== 'false');
    if (!settings.prettyPrintOnSave) $('#formatWhenSave').prop('checked', false);
    if (!settings.keepCommentsOnMin) $('#commentsOnMin').prop('checked', false);
    if (!settings.autoSave) {
        $('#autoSaveToggle').prop('checked', false);
        $('#autoSaveSpan').fadeOut()
    } else autoSave();
    settings.autoSaveTime = parseFloat(getData(Keys.autoSaveTime) || '1000');
    collapseSettings();
    $(document).on('keydown', function (event) {
        switch (event.which) {
            case 83:
                if (event.ctrlKey) {
                    event.preventDefault();
                    //showSnackbar('You can\'t save me.');
                    saveCode(true);
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
    usingMaterialLoading()
    $.each($('*'), function (n, o) {
        $(this).addClass('unselectable');
    }); /**/
    setTimeout(function () {
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
    var autoSaveEl = $('#autoSaveTime');
    var r5 = function (e) {
        updateAutoSaveTime();
    };
    autoSaveEl.on('blur', r5).on('focusout', r5);
    autoSaveEl.val((settings.autoSaveTime / 1000).toString())

});

function updateAutoSaveTime(num) {
    var autoSaveEl = $('#autoSaveTime');
    var num = num || parseFloat(autoSaveEl.val()) * 1000;
    settings.autoSaveTime = num;
    storeData(Keys.autoSaveTime, num.toString())
}

function saveCode(alertAfter = false) {
    var codeElement = $('#jsCode');
    if (settings.prettyPrintOnSave) formatCode();
    var newCode = codeElement.val();
    if (newCode !== code) {
        storeData(Keys.codeStore, newCode);
        code = newCode;
    }
    if (alertAfter) toast('Saved Code Successfully!')
}

function autoSave() {
    if (!settings.autoSave) return;
    saveCode();
    console.log('autoSave');
    setTimeout(autoSave, settings.autoSaveTime)
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
}

function formatCode() {
    if (beautifyAvailable()) {
        var prettyCode = js_beautify($('#jsCode').val());
        $('#jsCode').val(prettyCode);
    } else toast('Still Loading, please wait one moment');
}

function minifyCode() {
    var minCode = js_minify($('#jsCode').val(), settings.keepCommentsOnMin);
    $('#jsCode').val(minCode);
}

function formatOnSave() {
    settings.prettyPrintOnSave = !settings.prettyPrintOnSave;
    storeData(Keys.formatOnSave, settings.prettyPrintOnSave.toString());
}

function toggleAutoSave() {
    settings.autoSave = !settings.autoSave;
    storeData(Keys.autoSave, settings.autoSave.toString());
    if (settings.autoSave) {
        $('#autoSaveSpan').fadeIn()
        autoSave();
    } else $('#autoSaveSpan').fadeOut()
}

function commentsOnMin() {
    settings.keepCommentsOnMin = !settings.keepCommentsOnMin;
    storeData(Keys.minComments, settings.keepCommentsOnMin.toString());
}

function downloadCode() {
    download('script.js', '//This code was generated on http://keithmackay.com/js/ \n\n' + js_beautify($('#jsCode').val()));
}

function help() {
    $.get('./help.html', function (data) {
        // popupForm(data);
    });
    popupForm('<div><h1>This feature is still being developed, please check back later to see if it has been completed. Sorry!</h1><div class="materialLoad"></div></div>')
}
