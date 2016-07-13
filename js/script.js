function runCode() {
    var codeElement = $('#jsCode');
    var codeText = codeElement.val();
    eval(codeText);
    //console.log(codeText);
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
});

function refreshElements() {
    var newEl = $('*').find('*:not(.originalEl)');
    $.each(newEl, function (n, o) {
        $(this).remove();
    });
    //$('body').remove();
    /*$.each($('*:not(.originalEl)'), function (n, o) {
        
    });/**/
}
