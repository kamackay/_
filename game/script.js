$(document).ready(function () {
    collapseSettings('fast');
    removeContextMenu();
    $.each($('body').find('*'), function (n, o) {
        $(this).addClass('unselectable');
    });
    var begin = function () {
        toast('This page is not ready yet, please feel free to return to http://keithmackay.com');
    }
    $(document).on('mousedown', begin);
    $(document).on('keydown', begin);
});
