function scrollToTop() {

}

$(document).ready(function () {
    setSizes();
    if (isMobileDevice()) {
        $('#resumeiFrame').hide();
        $('#keithImg').hide();
        $('#ncsuLogo').hide();
    }
});

$(window).resize(function () {
    setSizes();
});

function setSizes() {
    locateFooter();
    var jumbo = $('#top');
    jumbo.css('height', $(window).height()).css('top', 0);
}

function locateFooter() {
    var footer = $('footer');
    footer.css('top', $(window).height()).css('width', $(window).width());
}

function showFooter() {
    var footer = $('footer');
    footer.animate({
        top: $(window).height() - footer.height()
    }, {
        duration: 500,
        easing: 'linear',
        queue: false
    });
}

function hideFooter() {
    var footer = $('footer');
    footer.animate({
        top: $(window).height()
    }, {
        duration: 500,
        easing: 'linear',
        queue: false
    });
}

function showHeader() {
    $('nav.navbar-fixed-top').fadeIn('fast');
    $('nav.navbar-fixed-top').css('opacity', 1);
}

function hideHeader(speed) {
    speed = speed || 200;
    var navs = $('nav.navbar-fixed-top');
    $.each(navs, function (n, o) {
        $(this).fadeOut(speed);
    });
}
$(document).ready(hideHeader);

function noInfo() {
    showSnackbar('Sorry, NC State doesn\'t seem to have any information on this course online');
}
