/* Load data by request */
var flag = false, f_m = false, langPage = document.getElementsByTagName('html')[0].lang;
var geocoder;
var map;

function loadData(event) {
    var wikiElem = document.getElementById('wikipedia-links');
    var greeting = document.getElementById('greeting');
    // clear out old data before new request
    wikiElem.innerText = '';
    //nytElem.innerText = '';
    // load streetview
    var street = document.getElementById('street').value;
    var city = document.getElementById('city').value;
    if (langPage == 'en')
        greeting.innerText = 'So, the address is ' + street + ', ' + city + '.';
    if (langPage == 'uk')
        greeting.innerText = 'Отже, адреса: ' + street + ', ' + city + '.';
    //var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + street + ', ' + city + '';
    //var str1 = 'http://maps.googleapis.com/maps/api/streetview?size=500x500&sensor=false&location=' + street + ', ' + city + '">';
    //console.log('str1: ', str1);
    //streetviewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=400x400&location=47.5763831,-122.4211769&fov=80&heading=70&pitch=0&key=AIzaSyClZ5EgZDmkVdNMCkIaYNdEtWGLWPySBQY';
    if (street.length && city.length) {
        let img = document.createElement('img');
        img.id = 'bgimg';
        //img.src = streetviewUrl;
        document.body.appendChild(img);
        document.getElementById('bti').style.display = 'block';
    }
    event.preventDefault();
    loadMapView(city, street);
    if (flag === true) {
        loadArticles(city);
        //loadfrWiki(city);
    }
    return false;
}

//document.getElementById('form-container').submit(loadData); /* this line must be only after function loadData() */
//document.getElementById('form-container').on('submit', loadData);
document.getElementById('submit-btn').addEventListener('click', loadData);
//$('#submit-btn').on('click', loadData);

function processSVData(data, status) {
    if (status === google.maps.StreetViewStatus.OK) {
      console.log('ok');
      $('#pano').show();
      panorama.setPano(data.location.pano);
      panorama.setPov({
          heading: 270,
          pitch: 0
      });
      panorama.setVisible(true);
    } else {
      console.error('Street View data not found for this location.');
      $('#pano').hide();
    }
}
function loadMapView(city, st) {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(45.522894,-122.989827);
    var myOptions = {
        zoom: 15,
        center: latlng,
        mapTypeControl: true,
        mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
        navigationControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map-canv'), myOptions);
    var adrs = city + ', ' + st;
    if (geocoder) {
        geocoder.geocode({'address': adrs}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
                    //var sv = new google.maps.StreetViewService();
                    //panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'));
                    //sv.getPanorama({location: {lat:results[0].geometry.location.lat(), lng:results[0].geometry.location.lng()}, radius: 50}, processSVData);
                    //console.log(panorama);
                    map.setCenter(results[0].geometry.location);
                    var infowindow = new google.maps.InfoWindow(
                        {content: '<b>'+ st +'</b>',size: new google.maps.Size(10, 5)}
                    );
                    var marker = new google.maps.Marker({
                        position: results[0].geometry.location,
                        map: map, 
                        title: st
                    });
                    google.maps.event.addListener(marker, 'click', function() {
                        infowindow.open(map, marker);
                    });
                    
                    let cords = results[0].geometry.location;
                    document.getElementById('show-view-btn').style.display = 'inline';
                    document.getElementById('bgimg').src = 'https://maps.googleapis.com/maps/api/streetview?size=400x400&location='+cords.lat()+','+cords.lng()+'&fov=80&heading=70&pitch=0&key=AIzaSyClZ5EgZDmkVdNMCkIaYNdEtWGLWPySBQY';
                } else {
                    langPage == 'en' ? alert('No results found.') : alert('Результатів не знайдено.');
                    document.getElementById('show-view-btn').style.display = 'none';
                }
            } else {
                langPage == 'en' ? alert('Geocode was not successful for the following reason: ' + status) : alert('Запит Geocode не був успішний з наступної причини: ' + status);
                document.getElementById('show-view-btn').style.display = 'none';
            }
        });
    }
}
function loadArticles(city) {
    var nytimesUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q="+city+'&fq=news&api-key=N3Sy2240HEKAjb5wujwE6cvBU8Ea23LT'
    // $.getJSON(nytimesUrl, function(data) {
    //     title.innerText = 'NewYorkTimes Articles about' + city;
    //     articles = data.response.docs;
    //     for (var i = 0; i < articles.length; i++) {
    //         var htmlObject = document.createElement('div'); //title
    //         htmlObject.innerHTML = '<li class="article">' + '<a href="' + articles[i].web_url + '">' + articles[i].headline.main + '</a>' + '<p>' + articles[i].snippet + '</p>' + '</li>';
    //         //article.html();
    //         console.log(htmlObject);

    //         //.append('<li class="article">' + '<a href="' + articles[i].web_url + '">' + articles[i].headline.main + '</a>' + '<p>' + articles[i].snippet + '</p>' + '</li>');
    //         //.append('<li class="article">' + '<a href="' + artile.web_url + '">' + artile.headline.main + '<a>' + '<p>' + artile.snippet + '</p>' + '</li>');
    //     };
    // });

    // var url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
    // url += '?' + Object.keys(obj).map(function(key) {
    //     return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
    // }).join('&');

    // ajax('http://domain/script.php', function(data){

    // });

    // var xhr = new XMLHttpRequest();
    // xhr.open('GET', 'http://www.google.com');
    // xhr.onreadystatechange = function() {
    //     if (r.readyState != 4 || r.status != 200) return; 
    //     console.log(r.responseText);
    // };
    // xhr.send();

    $.ajax({
        url: nytimesUrl,
        method: 'GET',
    }).done(function(result) {
        //document.getElementById("nytimes-article").innerHTML = result.response.docs["0"].headline.main;
        //var nytElem = document.getElementById("nytimes-articles");
        //var createElem();
        //nytHeaderElem.text('NewYorkTimes Articles about' + city);
        //document.getElementById('nytimes-header').querySelector('span').innerText = article.headline.main;
        result.response.docs.forEach(article => {
            var li = document.createElement('li');
            li.setAttribute('class', 'articles');
            li.innerHTML = `<a href="${article.web_url}">${article.headline.main}</a><p>${article.snippet}</p><p style="text-align: right"><i>${article.pub_date.substring(0, 10)}</i></p></li>`;
            document.getElementById('nytimes-articles').appendChild(li)
        });
        // for (var i = 0; i < articles.length; i++) {
        //     var li = document.createElement('li');
        //     li.setAttribute('class', 'articles');
        //     li.innerHTML = `<a href="${article.web_url}">${article.headline.main}</a><p>${article.snippet}</p></li>`;
        //     console.log(li);
        // }

        //articles = result.response.docs;
        // for (var i = 0; i < articles.length; i++) {
        //     document.getElementById('nytimes-articles').append('<li class="article">' + '<a href="' + articles[i].web_url + '">' + articles[i].headline.main + '</a>' + '<p>' + articles[i].snippet + '</p>' + '</li>');
        //     //console.log(result);
        // }
    }).fail(function(err) {
        if (langPage == 'en')
            document.getElementById('nytimes-articles').text('There are no articles yet for this location.');
        if (langPage == 'uk')
            document.getElementById('nytimes-articles').text('Поки що немає статей для даної місцевості.');
        throw err;
    });
}
function correctLoc(value) {
	var bs = new RegExp('[ ]{1,}','g');
	return value.replace(bs, '_');
}	
function loadfrWiki(city) {
	//var nameL = $('#switch').val();
	var d = /^\d+$/;
	if ((city == "") || (city.match(d))) {
		alert("Please, check your input.");
		return;
    }
    var xmlHttp = new XMLHttpRequest(),
        method = 'GET',
        url = 'http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=' + correctLoc(city) + '&callback=?',
        contentType = 'application/json; charset=utf-8',
        async = false,
        dataType = 'json';
        
    xmlHttp.onreadystatechange = function() {  
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            alert(xmlHttp.responseText);
            var markup = xmlHttp.data.parse.text['*']; // !!!check if xmlHttp.data is defined
			var i = $('<div></div>').html(markup); // ! jQuery
            i.querySelector('table').remove();// remove table, if it exists
			i.querySelector('a').each(function() {
                $(this).replaceWith($(this).html());//remove links as they will not work
            });
            i.querySelector('img').remove();// remove any images
			i.querySelector('sup').remove();// remove any references
			i.querySelector('.mw-ext-cite-error').remove();// remove cite error
			$('#wikipedia-links').html($(i)); // ! jQuery
        }
        else {
            if (langPage == 'en')
                document.getElementById('nytimes-articles').innerText = 'Wikipedia articles could not be found at this time. Try entering the address in different way.';
            if (lanPage == 'uk')
                document.getElementById('nytimes-articles').innerText = 'Наразі не вдалося знайти статті Вікіпедії. Спробуйте ввести адресу інакше.';
        }
        // xmlHttp.open("get", "server.php");
        // xmlHttp.send(formData);
    }
    
	// $.ajax({
	// 	type: 'GET',
	// 	url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=" + correctLoc(city) + "&callback=?",
	// 	contentType: "application/json; charset=utf-8",
	// 	async: false,
	// 	dataType: "json",
	// 	success: function (data, textStatus, jqXHR) {
	// 		var markup = data.parse.text['*'];
	// 		var i = $('<div></div>').html(markup);
    //         i.find('table').remove();// remove table, if it exists
	// 		i.find('a').each(function() {
    //             $(this).replaceWith($(this).html());//remove links as they will not work
    //         });
    //         i.find('img').remove();// remove any images
	// 		i.find('sup').remove();// remove any references
	// 		i.find('.mw-ext-cite-error').remove();// remove cite error
	// 		$('#wikipedia-links').html($(i));
	// 	},
	// 	error: function (errorMessage) {
    //         if (langPage == "en")
    //             $('#nytimes-articles').text("Wikipedia articles could not be found at this time. Try entering the address in different way.");
    //         if (lanPage == "uk")
    //             $('#nytimes-articles').text("Наразі не вдалося знайти статті Вікіпедії. Спробуйте ввести адресу інакше.");
    //     }
	// });
}

/*  Menu and clicking on outer area */
//$(document).ready(function() {
//$("body").mouseup(function(e) {//problem - always call jQuery function $(document).ready and checking when click, both if html container displays or not on the page
function outAreaM(e) {
    var co1 = document.querySelector('cssmenu ul');
    if (e.target.id != co1 && !co1.has(e.target).length) {//co1.attr('id')
        if (co1.hasClass('open')) {
            co1.removeClass('open');
            co1.removeClass('p_anim');
            if ($('form').length) {
                $('form label').css('z-index', '1');
                $("[type=checkbox]").css('z-index', '1');
                $("[type=checkbox] svg").css('z-index', '1');
            }
        }
        if (document.body.removeEventListener)
            document.body.removeEventListener("mouseup", outAreaM);
        if (document.body.detachEvent)
            document.body.detachEvent("mouseup", outAreaM); // if IEv.8
        f_m = true;
    }
}
/*function noOutAreaM() {
    if (document.body.removeEventListener)
        document.body.removeEventListener("mouseup", outAreaM);
    if (document.body.detachEvent)
        document.body.detachEvent("mouseup", outAreaM);//if IEv.8
}*/
function outAreaP(e) {
    var co1 = document.getElementById('prompts');
    if (e.target.id != co1.attr('id') && !co1.has(e.target).length) { //co1.attr('id')
        co1.css('display', 'none');
        if (document.body.removeEventListener)
        document.body.removeEventListener('mouseup', outAreaP);
    if (document.body.detachEvent)
        document.body.detachEvent('mouseup', outAreaP); // if IEv.8
    }
}
document.getElementById('menu-btn').addEventListener('click', function() {
    var menu = this.parentElement.querySelector('ul'), form = document.getElementById('form-container');
    if (menu.hasClass('open')) {
        menu.removeClass('open');
        menu.removeClass('p_anim');
        if (form.length) {
            form.querySelector('label').css('z-index', '1');
            form.querySelector('[type=checkbox]').css('z-index', '1');
        }
    }
    else {
        if (f_m == true) {
            f_m = false;
            return;
        }
        if (form.length) {
            form.querySelector('label').style.zIndex = '-2';
            form.querySelector('[type=checkbox]').style.zIndex = '-2';
        }
        menu.addClass('p_anim');
        menu.addClass('open');
        if (document.body.addEventListener)
            document.body.addEventListener('mouseup', outAreaM);
        else if (document.body.attachEvent)
            document.body.attachEvent('mouseup', outAreaM);
    }
});
/* Anim if exist */
/*function myAnim() {
    //var g = $(this).attr('src');//var g = this.src;
    var g = $('.illustration:first-child').attr('src');
    console.log(g);
    setTimeout(function() {
        $('.illustration:first-child').attr("src", "../img/first_full.png");
    }, 16000);//--> clearInterval
}*/

/* Open and close containers */
document.getElementById('switch').addEventListener('change', function() {
    var articles = document.querySelector('.articles');
    if (this.checked) {
        flag = true;
        articles.style.display = 'block';
    }
    else {
        flag = false;
        articles.style.display = 'none';
    }
});

// Full image view
document.querySelector('#close-p img').addEventListener('click', function() {
    document.getElementById('prompts').style.display = 'none';
});
document.getElementById('show-view-btn').addEventListener('click', function(e) {
    document.getElementById('bgimg').style.zIndex = '11';
    document.getElementById('fullimg').style.display = 'block';
	e.preventDefault();
});
document.getElementById('view-close').addEventListener('click', function() {
    document.getElementById('fullimg').style.display = 'none';
    document.getElementById('bgimg').style.zIndex = '-1';
});
document.getElementById('view-download').addEventListener('click', function() {
    var src = document.getElementById('bgimg').getAttribute('src');
    this.setAttribute('href', src);
    this.setAttribute('download', src);
    document.getElementById('alert-b').style.display = 'block';
});

function onPrompts() {
    prompts = document.getElementById('prompts');
    if (prompts.style.display == 'none') {
        prompts.style.display == 'none';
        noOutAreaP();
    }
    else {
        prompts.style.display == 'block';
        if (document.body.addEventListener)
            document.body.addEventListener('mouseup', outAreaP);
        else if (document.body.attachEvent)
            document.body.attachEvent('mouseup', outAreaP);
    }
}

/* Footer */
// $(window).scroll(function() {
//     if (document.documentElement.scrollHeight > document.documentElement.clientHeight) {
//         if ($("body").innerWidth() > 1024) {
//             if ($(window).scrollTop() > 1) {
//                 $('#cssmenu').fadeOut(500);//$('#cssmenu').css('padding-top', '0');//$("#cssmenu").animate({'padding-top': '0'});
//             }
//             if ($(window).scrollTop() == 0) {
//                 $('#cssmenu').fadeIn(500);
//             }
//         }
//         if (($(window).scrollTop() + $(window).height()) >= $(document).height()-70)//($(window).scrollTop() + $(window).height() == $(document).height()) {
//             $('footer').fadeIn(500);//console.log("Block " + parseInt($(window).height() + $(window).scrollTop()) + " " +  $(document).height());
//         else
//             $('footer').fadeOut(500);
//     }
// });

/* Checking */
//document.getElementById('email').bind('focusout', validE);
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
function validName(evt) { //Good function to check name, but user can input it in different language.
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
// document.getElementById('submit-bt').addEventListener('click', function() {
//     var date = document.getElementById('birth').val(), txtarea = document.querySelector('textarea').val(), name = document.querySelector('.form-container').find('input:first-child').val();
//     if (validBs(date) === false) console.log('Date is\'nt correct (mis.: 1186)'); 
//     if ((validName(name) === false) || (validE() === false) || (txtarea == "")) {//(validBs(date) === false)
//         if (langPage == "en")
//             alert("Please, check if all the input fields filled right and try again.")//e.preventDefault();
//         if (langPage == "uk")
//             alert("Перевірте, будь ласка, чи усі поля заповнено вірно і повторіть спробу.")
//     }
// });
/*function animateRotate(angle) {
    // caching the object for performance reasons
    var $elem = $('#menu-btn
    // we use a pseudo object for the animation
    // (starts from `0` to `angle`), you can name it as you want
    $({deg: 0}).animate({deg: angle}, {
        duration: 800,
        step: function(now) {
            // In the step-callback (that is fired each step of the animation. We also can use the `now` paramter which contains the current animation-position (`0` up to `angle`)
            $elem.css({
                transform: 'rotate(' + now + 'deg)'
            });}});}*/
