$(document).ready(function () {
    collapseSettings('fast');
    removeContextMenu();
    $.each($('body').find('*'), function (n, o) {
        $(this).addClass('unselectable');
    });
});
