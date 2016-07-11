const Modes = {
    month: 0,
    week: 1
};

var displayDate = new Date();

var mode = Modes.month;
var allowMonthChange = true;

function init() {
    var todayEl = $('#today');
    allowMonthChange = false;
    todayEl.typeOut(getMonthName(displayDate) + ', ' + displayDate.getFullYear().toString(), function () {
        allowMonthChange = true
    });
    switch (mode) {
        case Modes.month:
            var monthEl = $('#month');
            monthEl.html('');
            monthEl.append('<div class="month-head"></div><div class="month-head"></div><div class="month-head"></div><div class="month-head"></div><div class="month-head"></div><div class="month-head"></div><div class="month-head"></div>');
            monthEl.append('<div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div>');
            monthEl.append('<div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div>');
            monthEl.append('<div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div>');
            monthEl.append('<div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div>');
            monthEl.append('<div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div>');
            monthEl.append('<div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div><div class="month-day">&nbsp;</div>');
            var sizeFunc = function (anim = false) {
                var w = monthEl.width() / 7;
                var h = monthEl.height() / 6;
                var timeToShow = 500;
                $.each(monthEl.find('.month-day'), function (n, o) {
                    var elem = $(this);
                    elem.css({
                        'width': w,
                        'height': h,
                        'font-size': h / 5
                    });
                    if (anim) {
                        elem.css('display', 'none');
                        setTimeout(function () {
                            elem.fadeIn(1000);
                        }, timeToShow);
                        timeToShow += 100;
                    }
                });
                var index = 0,
                    arr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                $.each(monthEl.find('.month-head'), function (n, o) {
                    var elem = $(this);
                    elem.css({
                        'width': w,
                        'font-size': h / 7.5
                    });
                    if (anim) {
                        elem.css('display', 'none').html(arr[index++]);
                        setTimeout(function () {
                            elem.fadeIn();
                        }, 750);
                    }
                });
            }
            $(window).resize(function () {
                sizeFunc(false);
            });
            var today = new Date();
            var first = firstOfMonth(displayDate);
            var els = monthEl.find('.month-day');
            var f = first.getDay(),
                x = 1;
            var days = daysInMonth(displayDate);
            for (var i = f + 1; x <= days; i++, x++) {
                var elem = $(els.get(i));
                elem.html(x.toString());
                elem.addClass('used');
                if (x == today.getDate() && displayDate.getMonth() == today.getMonth() && displayDate.getFullYear() == today.getFullYear())
                    elem.addClass('today');
            }
            sizeFunc(true);
            break;
    };
}

function nextMonth() {
    if (!allowMonthChange) return;
    displayDate = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1);
    init();
}

function lastMonth() {
    if (!allowMonthChange) return;
    displayDate = new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1);
    init();
}

$(document).ready(function () {
    init();
    showWatermark();
});

function firstOfMonth(d = new Date()) {
    return new Date(d.getFullYear(), d.getMonth(), 0);
}
