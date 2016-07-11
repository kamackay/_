const Modes = {
    month: 0,
    week: 1
};

const dataKey = 'CalMonth';

function storeMonth(month = displayDate) {
    storeData(dataKey, month.getFullYear() + '::' + month.getMonth());
}

function getStoredMonth() {
    try {
        var data = getData(dataKey);
        if (!data) return data;
        var arr = data.split('::');
        return new Date(parseInt(arr[0]), parseInt(arr[1]), 1);
    } catch (err) {
        console.log(err);
        return null;
    }
}

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
                        'max-width': w,
                        'height': h,
                        'max-height': h,
                        'font-size': h / 5
                    });
                    elem.setupHorizontalScroll();
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
            var usedEls = $('.month-day.used');
            $.get('https://googledrive.com/host/0B6vDuBGkfv-HaEh3Z0hBNUJuc1U/holidays.json', function (data) {
                for (var i = 0; i < data.holidays.length; i++) {
                    var holiday = data.holidays[i];
                    var holidate = holiday.date;
                    if (holiday.date.month == displayDate.getMonth()) {
                        var dayOfHoliday;
                        if (holiday.date.day) dayOfHoliday = $(usedEls.get(holiday.date.day));
                        if (dayOfHoliday.find('.holiday').length == 0) //Only allow one holiday per date, for now
                            dayOfHoliday.append('<div class="holiday">&nbsp;<br><a href="#" onclick="' + ((holiday.link == undefined) ? '' : 'openInNewTab(\'' + holiday.link + '\')') + '">' + holiday.name + '</a></div');
                    }
                }
            });
            break;
    };
}

function nextMonth() {
    if (!allowMonthChange) return;
    displayDate = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1);
    storeMonth();
    init();
}

function lastMonth() {
    if (!allowMonthChange) return;
    displayDate = new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1);
    storeMonth();
    init();
}

function todaysMonth() {
    if (!allowMonthChange) return;
    displayDate = new Date();
    storeMonth();
    init();
}

$(document).ready(function () {
    var cookieDate = getStoredMonth();
    if (cookieDate) {
        displayDate = cookieDate;
    }
    init();
    showWatermark();
    removeContextMenu();
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
});

function firstOfMonth(d = new Date()) {
    return new Date(d.getFullYear(), d.getMonth(), 0);
}
