$(document).ready(function () {
    removeContextMenu();
    $(document).on('keydown', function (e) {
        switch (e.which) {
            case 115:
                if (e.ctrlKey || e.which === 19) e.preventDefault();
                break;
            case 116:
                e.preventDefault();
                showSnackbar('Refresh disabled. Just to be a dick.');
                break;
            case 83:
                if (e.ctrlKey) {
                    e.preventDefault();
                    showSnackbar("I cannot be saved");
                }
                break;
        }
    }); /**/
    $('#contents').append('<img class="full full-stretch" src="https://googledrive.com/host/0B6vDuBGkfv-HSjhIcnJEUF9yc0k/material_dark.jpg" />')
});
