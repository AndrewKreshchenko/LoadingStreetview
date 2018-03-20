/* Load data by request */
var flag = false, f_m = false, langPage = $('html')[0].lang;
function loadData() {
    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");
    // load streetview
    var street = $('#street').val();
    var city = $('#city').val();
    if (langPage == "en")
        $greeting.text('So, the address is ' + street + ', ' + city + '.');
    if (langPage == "uk")
        $greeting.text('Отже, адреса: ' + street + ', ' + city + '.');
    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + street + ', ' + city + '';
    $body.append('<img id="bgimg" src="' + streetviewUrl + '">');
    $('#bti').css('display', 'block');
    if (flag === true) {
        loadArticles(city);
        loadfrWiki(city);
    }
    return false;
}
$('#form-container').submit(loadData); /* this line must be only after function loadData() */
function loadArticles(city) {
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
        'api-key': "e237bcbf9ed947349af0aac5fdb8525b",
        'q': city
    });
    $.ajax({
        url: url,
        method: 'GET',
    }).done(function(result) {
        //document.getElementById("nytimes-article").innerHTML = result.response.docs["0"].headline.main;
        //var nytElem = document.getElementById("nytimes-articles");
        //var createElem();
        //$nytHeaderElem.text('NewYorkTimes Articles about' + city);
        articles = result.response.docs;
        for (var i = 0; i < articles.length; i++) {
            $("#nytimes-articles").append('<li class="article">' + '<a href="' + articles[i].web_url + '">' + articles[i].headline.main + '</a>' + '<p>' + articles[i].snippet + '</p>' + '</li>');
            //console.log(result);
        }
    }).fail(function(err) {
        if (langPage == "en")
            $('#nytimes-articles').text("There are no articles yet for this location.");
        if (langPage == "uk")
            $('#nytimes-articles').text("Поки що немає статей для даної місцевості.");
        throw err;
    });
}
function correctLoc(value) {
	var bs = new RegExp("[ ]{1,}","g");
	return value.replace(bs, "_");
}	
function loadfrWiki(city) {
	//var nameL = $('#switch').val();
	var d = /^\d+$/;
	if ((city == "") || (city.match(d))) {
		alert("Please, check your input.");
		return;
	}
	$.ajax({
		type: "GET",
		url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + correctLoc(city) + "&callback=?",
		contentType: "application/json; charset=utf-8",
		async: false,
		dataType: "json",
		success: function (data, textStatus, jqXHR) {
			var markup = data.parse.text["*"];
			var i = $('<div></div>').html(markup);
            i.find('table').remove();// remove table, if it exists
			i.find('a').each(function() {
                $(this).replaceWith($(this).html());//remove links as they will not work
            });
            i.find('img').remove();// remove any images
			i.find('sup').remove();// remove any references
			i.find('.mw-ext-cite-error').remove();// remove cite error
			$('#wikipedia-links').html($(i));
		},
		error: function (errorMessage) {
            if (langPage == "en")
                $('#nytimes-articles').text("Wikipedia articles could not be found at this time. Try entering the address in different way.");
            if (lanPage == "uk")
                $('#nytimes-articles').text("Наразі не вдалося знайти статті Вікіпедії. Спробуйте ввести адресу інакше.");
        }
	});
}	

/*  Menu and clicking on outer area */
//$(document).ready(function() {
//$("body").mouseup(function(e) {//problem - always call jQuery function $(document).ready and checking when click, both if html container displays or not on the page
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
    /*$('#fullimg').append('<img src="' + im + '">');
    $('#fullimg a').attr('href', im);
    $('#fullimg').css('display', 'block');*/
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
    var p = str.split(/[\.]/);
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
