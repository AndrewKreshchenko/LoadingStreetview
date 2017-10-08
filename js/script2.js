function loadData() {
    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;
    $greeting.text('So, the address is ' + address + '.');

    // load streetview
    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');
    
    $('#form-container').submit(loadData);
    var nytimesUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    nytimesUrl += '?' + $.param({
        'q': cityStr,
        'sort': "newest",
        'api-key': "e237bcbf9ed947349af0aac5fdb8525b"
    });
    //replacing $.getJSON(nyTimesUrl, function(data) { }) which Instructor codes with below.
    $.ajax({url: nytimesUrl,method:'GET', //from NYT we 'get' JSON data. 
    }).done(function(data) {//when NYT API request succeed, then it works.
        $nytHeaderElem.text('New York Times articles about ' + cityStr);
        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('&lt;li class = "article"&gt;' + '&lt;a href = "'+article.web_url+'"&gt;' + article.headline.main + '&lt;/a&gt;' + 
            '&lt;p&gt;' + article.snippet + '&lt;/p&gt;' + '&lt;/li&gt;');
        }
    });
    return false;
}