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
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;
    $greeting.text('So, the address is ' + address + '.');
    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');
    /*var req = XMLHttpRequest();
    req.open('GET', "https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=e237bcbf9ed947349af0aac5fdb8525b", false).send(null);
    var headers = req.getAllResponseHeaders().toLowerCase();
    alert(headers); 
    console.log(headers);*/
    //NY Times AJAX request goes here
    var nytimesUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q="+cityStr+'&sort=news&api-key=e237bcbf9ed947349af0aac5fdb8525b'
    $.getJSON(nytimesUrl, function(data) {
        $nytHeaderElem.text('NewYorkTimes Articles about' + cityStr);
        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var artile = article[i];
            $nytElem.append('<li class="article">' + '<a href="' + artile.web_url + '">' + artile.headline.main + '<a>' + '<p>' + artile.snippet + '</p>' + '</li>');
        };
    });
    return false;
}
$('#form-container').submit(loadData);