/*  Menu and clicking on outer area */
function outAreaM(e) {
    var co1 = $("#cssmenu ul");
    if (e.target.id != co1 && !co1.has(e.target).length) {//co1.attr('id')
        if (co1.hasClass('open')) {
            co1.removeClass('open');
            co1.removeClass('p_anim');
            if ($('form').length) {
                $('form label').css('z-index', '1');
                $("[type=checkbox]").css('z-index', '1');
            }
        }
        if (document.body.removeEventListener)
            document.body.removeEventListener("mouseup", outAreaM);
        if (document.body.detachEvent)
            document.body.detachEvent("mouseup", outAreaM);//if IEv.8
        f_m = true;
    }
}
function outAreaP(e) {
    var co1 = $("#prompts");
    if (e.target.id != co1.attr('id') && !co1.has(e.target).length) {//co1.attr('id')
        $('#prompts').css('display', 'none');
        if (document.body.removeEventListener)
        document.body.removeEventListener("mouseup", outAreaP);
    if (document.body.detachEvent)
        document.body.detachEvent("mouseup", outAreaP);//if IEv.8
    }
}
$('#cssmenu #menu-btn').on('click', function() {
    var menu = $(this).next('ul');
    if (menu.hasClass('open')) {
        menu.removeClass('open');
        menu.removeClass('p_anim');
        if ($('form').length) {
            $('form label').css('z-index', '1');
            $("[type=checkbox]").css('z-index', '1');
        }
    }
    else {
        if (f_m == true) {
            f_m = false;
            return;
        }
        var $elem = $('#menu-btn');
        if ($('form').length) {
            $('form label').css('z-index', '-2');
            $("[type=checkbox]").css('z-index', '-2');
        }
        menu.addClass('p_anim');
        menu.addClass('open');
        if (document.body.addEventListener)
            document.body.addEventListener("mouseup", outAreaM);
        else if (document.body.attachEvent)
            document.body.attachEvent("mouseup", outAreaM);
    }
});

/* Open and close containers */
$('#switch').change(function() {
    if ($(this).is(":checked")) {
        flag = true;
        $('.articles').css('display', 'block');
    }
    else {
        flag = false;
        $('.articles').css('display', 'none');
    }
});
$('#close-p img').on('click', function() {
    $('#prompts').css('display', 'none');
});
$('#bti button').on('click', function() {
    $('#bgimg').css('z-index', '11');
    $('#fullimg').css('display', 'block');
});
$('#close-im img:first-child').on('click', function() {
    $('#fullimg').css('display', 'none');
    $('#bgimg').css('z-index', '-1');
});
$('#close-im img:last-child').on('click', function() {
    var im = $('#bgimg').attr('src'), a = $('#close-im').find('a');
    a.attr('href', im);
    a.download = im;
    $('#alert-b').css('display', 'block');
});
function onPrompts() {
    if ($('#prompts').attr('style').display == 'none') {
        $('#prompts').css('display', 'none');
        noOutAreaP();//$('#prompts').unbind('click', outAreaP);
    }
    else {
        $('#prompts').css('display', 'block');//$('#prompts').bind('click', outAreaP);
        if (document.body.addEventListener)
            document.body.addEventListener("mouseup", outAreaP);
        else if (document.body.attachEvent)
            document.body.attachEvent("mouseup", outAreaP);
    }
}

/* Footer */
$(window).scroll(function() {
    if (document.documentElement.scrollHeight > document.documentElement.clientHeight) {
        if ($("body").innerWidth() > 1024) {
            if ($(window).scrollTop() > 1) {
                $('#cssmenu').fadeOut(500);//$('#cssmenu').css('padding-top', '0');//$("#cssmenu").animate({'padding-top': '0'});
            }
            if ($(window).scrollTop() == 0) {
                $('#cssmenu').fadeIn(500);
            }
        }
        if (($(window).scrollTop() + $(window).height()) >= $(document).height()-70)//($(window).scrollTop() + $(window).height() == $(document).height()) {
            $('footer').fadeIn(500);//console.log("Block " + parseInt($(window).height() + $(window).scrollTop()) + " " +  $(document).height());
        else
            $('footer').fadeOut(500);
    }
});

/* Checking */
$('#email').bind('focusout', validE);
function validE() {
    $('.warning label').text('');
    var em = $('#email').val();
    if (!(validEmail(em)) && (em != "")) {
        $('.warning').css('background-color', 'rgba(180,40,0,.5)');//if full opacity, than equals #b42800
        $('.warning label').text('Your email is invalid. Try again');
        return false;
    }
    if ((em == "") || validEmail(em)) {
        $('.warning').css('background-color', 'rgba(0,0,0,0)');
        return false;
    }
}
function validEmail(em) {
    var ch = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return ch.test(em);
}
function validName(evt) {//Good function to check name, but user can input it in different language.
    var ch = evt.ch;
    if (ch != 0) {
        if (ch < 97 || ch > 122) {
            evt.preventDefault();
            return true;// !!! check simple ret
        }
    }
}
function validB(s) {
    var theEvent = s || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault)
            theEvent.preventDefault();
        return false;
    }
}
function validN() {
    var ch = event.keyCode;
    if (ch != 0) {
        if ((ch > 7 && ch < 33) || (ch > 64 && ch < 92) || (ch > 95 && ch < 123) || ch  == 39)
            return false;// !!! check simple ret, check if without brackets inside
        else {
            event.preventDefault();
            return true;
        }
    }
}
function validBs(str) {    
    var p = str.split(/[\.]/); // split(/[\.\-\/]/)
    var d = parseInt(p[0], 10), m = parseInt(p[1], 10), y = parseInt(p[2], 10);
    var date = new Date(y, m-1, d, 0, 0, 0, 0);
    if (y < 1900 || y > 2018)
        return false;
    return m === (date.getMonth() + 1) && d === date.getDate() && y === date.getFullYear();
}
$('#submit-bt').on('click', function() {
    var date = $('#birth').val(), txtarea = $('textarea').val(), name = $('.form-container').find('input:first-child').val();
    if (validBs(date) === false) console.log('Date is\'nt correct (mis.: 1186)'); 
    if ((validName(name) === false) || (validE() === false) || (txtarea == "")) {//(validBs(date) === false)
        if (langPage == "en")
            alert("Please, check if all the input fields filled right and try again.")//e.preventDefault();
        if (langPage == "uk")
            alert("Перевірте, будь ласка, чи усі поля заповнено вірно і повторіть спробу.")
    }
});