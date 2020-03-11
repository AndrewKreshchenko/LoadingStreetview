/* Load data by request */
var flag = false, f_m = false, langPage = document.getElementsByTagName('html')[0].lang;
var geocoder;
var map;

function loadData(event) {
    var wikiElem = document.getElementById('wikipedia-links');
    var nytHeaderElem = document.getElementById('nytimes-header');
    var nytElem = document.getElementById('nytimes-articles');
    var greeting = document.getElementById('greeting');
    // clear out old data before new request
    wikiElem.innerText = '';
    nytElem.innerText = '';
    // load streetview
    var street = document.getElementById('street').value;
    var city = document.getElementById('city').value;
    if (langPage == 'en')
        greeting.innerText = 'So, the address is ' + street + ', ' + city + '.';
    if (langPage == 'uk')
        greeting.innerText = 'Отже, адреса: ' + street + ', ' + city + '.';
    if (street.length && city.length) {
        var img = document.createElement('img');
        img.id = 'bgimg';
        //img.src = streetviewUrl;
        document.body.appendChild(img);
        document.getElementById('bti').style.display = 'block';
    }
    console.log(event);
    event.preventDefault();
    loadMapView(city, street);
    if (flag === true) {
        loadArticles(city);
        loadfrWiki(city);
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
                    
                    var cords = results[0].geometry.location;
                    document.getElementById('bgimg').src = 'https://maps.googleapis.com/maps/api/streetview?size=400x400&location='+cords.lat()+','+cords.lng()+'&fov=80&heading=70&pitch=0&key=AIzaSyClZ5EgZDmkVdNMCkIaYNdEtWGLWPySBQY';
                } else {
                    alert('No results found');
                }
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
}

function correctLoc(value) {
	var bs = new RegExp('[ ]{1,}','g');
	return value.replace(bs, '_');
}