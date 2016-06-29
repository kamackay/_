const maxWidth = 700;


const calcTypes = {
    none: 0,
    add: 1,
    minus: 2,
    multiply: 3,
    divide: 4,
    exp: 5,
    solution: 6
};

function showInOutput(str, newLn = true, tab = 0) {
    var out = $('#output');
    if (newLn) out.append('<br>');
    for (var i = 0; i < tab; i++) out.append('    ');
    out.append(str);
}
const win = $(window);

var f = function () {
    var size = win.height() / 10;
    var mobile = isMobileDevice();
    var calc = $('body').find('.calculator');
    var numbers = calc.find('.numbers');
    var buttons = calc.find('.btn:not(.btn-small)');
    if (mobile || win.height() > win.width() * 1.5) calc.css('width', '100%');
    else {
        var a = win.width();
        var n = Math.min(a, a / Math.cbrt(a + maxWidth) + maxWidth);
        calc.css('width', n);
    }
    var w = (numbers.width() / 4) - 1;
    $.each(buttons, function (n, o) {
        var t = $(this);
        t.css('width', w).css('font-size', Math.max(size / 2, 30));
        t.css('height', Math.max(75, size));
    });
    calc.find('.smaller > *').css('height', (numbers.height() / 5));
    calc.find('.console').css('height', size * 2).css('width', w * 4).css('font-size', w / 4);
    $('#bottomButtons').css('height', size * 3);
};

($(document).ready(function () {
    $('#output').html("Output:<br>");
    $(document).on('keydown', function (e) {
        if (e.shiftKey) {
            if (e.which === 54) calcButton('exp');
            return;
        } else if (e.ctrlKey) {
            e.preventDefault();
            return;
        }
        switch (e.which) {
            case 8:
                calcButton('back');
                break;
            case 115:
                if (e.ctrlKey || e.which === 19) e.preventDefault();
                break;
            case 13:
                calcButton('equal');
                break;
            case 190:
            case 110:
                calcButton('period');
                break;
            case 43:
            case 107:
                calcButton('plus');
                break;
            case 47:
                calcButton('divide');
                break;
            case 27:
            case 46:
                calcButton('clear');
                break;
            case 106:
            case 88:
                calcButton('multiply');
                break;
            case 116:
                e.preventDefault();
                showSnackbar('Refresh disabled. Just to be a dick.');
                break;
            default:
                var a = e.which - 48;
                if (a >= 0 && a <= 9) calcButton(a);
                else if (a >= 48 && a <= 57) calcButton(a - 48);
                //else alert(e.which);
                break;
                //Keys to ignore
            case 16:

        }
    });
    var scrollHorizontal = function (event, delta) {
        this.scrollLeft -= (delta * 30);
        event.preventDefault();
    };
    $('#numberStore').mousewheel(scrollHorizontal);
    $('#bottomButtons').mousewheel(scrollHorizontal);
    f();
    $(window).resize(f);
    con = $('#numberIn');
    store = $('#numberStore');
    removeContextMenu();
    /**/
    if (isMobileDevice()) {
        var elems = $('body').find('.calculator.well');
        $.each(elems, function (n, o) {
            $(this).removeClass('well');
        });
    } else {
        showWatermark();
    } /**/
    window.setInterval(f, 1000);
}));

var con, store;

function calcButton(btn) {
    if (btn === 'clear') {
        con.html('0');
        store.html('');
        calc = calcTypes.none;
    } else if (btn === 'plus') { //-----------Addition
        if (con.html() !== '') transfer('+');
        calc = calcTypes.add; //--------------Subtraction
    } else if (btn === 'minus') {
        if (con.html() !== '') transfer('-');
        calc = calcTypes.minus;
    } else if (btn === 'equal') { //---------Equal
        if (calc === calcTypes.none) {
            eq(con.html());
        } else if (calc === calcTypes.add || calc === calcTypes.minus || calc === calcTypes.multiply || calc === calcTypes.divide || calc === calcTypes.exp)
            basicCalc(calc);
        calc = calcTypes.none;
    } else if (btn === 'divide') {
        if (con.html() !== '') transfer('&divide;');
        calc = calcTypes.divide;
    } else if (btn === 'period') {
        if (!con.html().includes('.')) con.append('.');
    } else if (btn === 'multiply') {
        if (con.html() !== '') transfer('<i style="font-size: inherit;" class="material-icons">clear</i>');
        calc = calcTypes.multiply;
    } else if (btn === 'back') {
        var current = con.html();
        if (current.length > 0)
            con.html(current.substr(0, current.length - 1));
    } else if (btn === 'sqrt') {

    } else if (btn === 'exp') {
        if (con.html() !== '') transfer('^');
        calc = calcTypes.exp;
    } else {
        if (con.html() === '0') con.html('');
        con.append(btn);
    }
}

function basicCalc(kind) {
    var solution;
    try {
        var n = parseFloat(con.html());
        store.append(' ' + n.toString() + " ");
        switch (kind) {
            case calcTypes.add:
                solution = last + n;
                break;
            case calcTypes.minus:
                solution = last - n;
                break;
            case calcTypes.divide:
                solution = last / n;
                break;
            case calcTypes.multiply:
                solution = last * n;
                break;
            case calcTypes.exp:
                solution = Math.pow(last, n);
                break;
        }
        eq(solution);
        con.html(solution.toString());
    } catch (err) {
        alert(err);
    }
}

function transfer(extra = '', insertZero = true) {
    store.html(con.html() + (extra ? ' ' + extra : ''));
    last = parseFloat(con.html());
    con.html(insertZero ? '0' : '');
}

function eq(num) {
    con.html('');
    store.append('= ' + num.toString() + ' ');
}

function allPrimes() {
    var n = parseFloat(con.html());
    store.html(getAllPrimes(n));
}

function getAllPrimes(n = 50) {
    var res = 'Primes of ' + n.toString() + ' = [';
    while (n % 2 == 0) {
        res += '2, ';
        n = n / 2;
    }
    for (var i = 3; i <= Math.sqrt(n); i = i + 2) {
        while (n % i == 0) {
            res += i.toString() + ', ';
            n = n / i;
        }
    }
    if (n > 2) res += n.toString() + ', ';
    res = res.trim().replace(/,\s*$/, "") + ']';
    return res;
}

var last;

var calc = calcTypes.none;
