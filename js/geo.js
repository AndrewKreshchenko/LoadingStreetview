/* Author: Andrew Kreshchenko
 * Code is under development
 * 
 * For developers:
 * @see - notice that is worth to understand or to learn
 * @note / NOTE - recommend to consider something or do something in future
 * 
 * 
 * Classes and methods that provide interaction with interface, particular to search results by Geolocation
 * Used APIs of Google, New York Times and Wikipedia
 * 
 * ! NOTE: Allowed to use APIs only in the LIMITED mode provided by this application.
 * ! Please, use this application in real-time to search results only when it is necessary for You 
 * ! and not for any kind of testing
 * ! This app is aimed to be supported for some time (at least 1 year).
*/


// ---^---^---^---^---

// Geosearch classes
class Geosearch {
  constructor(city, street, elem) {
    this._city = city;
    this._street = street;

    this.elem = elem;
  }

  get city() {
    return this._city
  }

  get street() {
    return this._street
  }

  showInfo() {
    if (this._city && this._street && this.elem) {
      console.info('Search results are predicted to be successful. ⭐');
      return true;
    }
    console.info('Search results might be not successful.\n\n%cRecommendations\n%cCheck if all necessary data is entered.\nCheck if previous functions are called in appropriate way and typed in relevant order.',
      'font-family:monospace;color:red;', ''
    );
    return false;
  }

  get api_key() {
    return
  }

  reset() {
    // reset form values
    document.getElementById('product-form').reset();
  }
}

class GoogleMapSearch extends Geosearch {
  constructor(city, street, elem) {
    super(city, street, elem);

    this.map = new google.maps.Map(
      this.elem, {
        center: new google.maps.LatLng(45.522894,-122.989827),
        //zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
    );
    this._cords = {};
    
    this.loadMap();
  }

  get map() {
    return this._map
  }
  set map(newMap) {
    this._map = newMap
  }

  get geoServiceGoogleMap() {
    return this.loadMap(this._geoServices.googlemap)
  }
  set geoServiceGoogleMap(newValue) {
    this._geoServices.googlemap.status = true;

    return this.loadMap(this._geoServices.googlemap)
  }

  get cords() {
    console.log('get cords');
    return this._cords
  }
  set cords(newCords) {
    console.log('new cords');
    this._cords = newCords
  }

  loadMap() {
    var geocoder = new google.maps.Geocoder(),
      bounds = new google.maps.LatLngBounds(),
      map = this.map,
      el = this.elem;
  
    var findCords = (address, geocoder) => {
      // 4. 
      return new Promise(function(resolve, reject) {
        
        geocoder.geocode({
          'address': address
        }, function(results, status) {
          if (status === 'OK') {
            // 6. 
            resolve([results[0].geometry.location.lat(), results[0].geometry.location.lng()]);
          } else {
            reject(new Error('Couldnt\'t find the location ' + address));
            this.elem.parentElement.classList.add('hidden');
          }
        })
  
      }).then(function(cords) {
        // 5. 
        var marker = new google.maps.Marker({
          position: {
            lat: cords[0],
            lng: cords[1]
          },
          map: map,
        });
        bounds.extend(marker.getPosition());
        map.fitBounds(bounds);
        map.setZoom(15);
        el.parentElement.classList.remove('hidden');
  
      })
    }
    
    findCords(`${this.city}, ${this.street}`, geocoder, this.map);
  }

  loadLocationView(newId, related_elems) {
    // Load image
    let img = document.createElement('img');
    img.id = newId;
    
    document.body.appendChild(img);
    related_elems.forEach(elem => {
      document.getElementById(elem.id).style.display = elem.style;
    })
    document.getElementById(newId).src = 'https://maps.googleapis.com/maps/api/streetview?size=400x400&location='
      + cords.lat() + ',' + cords.lng() +
      '&fov=80&heading=70&pitch=0&key=AIzaSyClZ5EgZDmkVdNMCkIaYNdEtWGLWPySBQY';
  }
}

class NYTimesSearch extends Geosearch {
  constructor(city, street, elem, options) {
    super(city, street, elem);
    this.options = options;
    
    this.beginURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
    
    this.loadNYTimesArticles();
  }

  get api_key() {
    return;
  }

  loadNYTimesArticles() {
    var collectURLOpts = (url, opts) => {
      if (url) {
        opts.timefrom.length ?
        url += '&begin_date=' + opts.timefrom.replace(/\./g, ''):
        url += '&begin_date=20190101'
      }
      return url
    }

    var makeURL = (begin_url, city, opts) => {
      var url = `${begin_url}?q=${city}&fq=news`;

      var keys_obj = Object.keys(opts);
      for (var i = 0; i < keys_obj.length; i++) {
        if (keys_obj[i].includes('ny')) {
          opts = opts[keys_obj];
          break;
        }
      }
      
      url = collectURLOpts(url, opts);
      
      url += '&api-key=N3Sy2240HEKAjb5wujwE6cvBU8Ea23LT';
      return url;
    }

    // Make URL to fetch data
    var url = makeURL(this.beginURL, this.city, this.options),
      bl = this.elem;
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = () => {
      if (xhr.status != 200) { // xhr.readyState != 4 ||
        return
      }
      // Convert data string to an object
      var data = JSON.parse(xhr.responseText);
      //console.log(data.response.docs, bl, this);
      
      // Loop through each article
      data.response.docs.forEach(article => {
        var li = document.createElement('li');
        li.setAttribute('class', 'articles');
        li.innerHTML = `<a href="${article.web_url}">${article.headline.main}</a><p>${article.snippet}</p><p style="text-align: right"><i>${article.pub_date.substring(0, 10)}</i></p></li>`;
        bl.appendChild(li);
      })

      if (!data.response.docs.length)
        bl.innerText = 'За даною адресою та часовим діапозоном не знайдено новин.'
    }
    xhr.send();
  }
}

class WikipediaSearch extends Geosearch {
  constructor(city, street, elem, options) {
    super(city, street, elem);
    this._options = options;
    
    this.loadWikipediaArticles();
  }

  loadWikipediaArticles(city) {
    if ((city == '') || (city.match(/^\d+$/))) {
      alert('Please, check your input.')
      return
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
    }
  }
}


// ---^---^---^---^---

// DOM Events
document.addEventListener('DOMContentLoaded', () => {
  // Create a new object Geosearch 
  const form = new Form(document.getElementById('form-geosearch')),
    container = form.form;
  //geosearch.attachListeners();

  container.querySelectorAll('[type="checkbox"]').forEach(elem => {
      
    elem.addEventListener('change', function() {
      var name = this.getAttribute('name'),
        articles = document.querySelector(`[data-news="${name}"]`),
        options = document.querySelector(`[data-options="${name}"]`);
      
      if (this.checked) {
        articles.classList.remove('hidden')
        options.classList.remove('hidden')
      }
      else {
        articles.classList.add('hidden')
        options.classList.add('hidden')
      }
    })

  })

  container.addEventListener('submit', e => {
    e.preventDefault();

    // Get entered data
    const formData = form.getFormData();

    // If was clicked on submit button and no data was found
    if (!formData.length) return;

    // Retrieve data from checkboxes
    var checkb_data = [];
    container.querySelectorAll('[type="checkbox"]').forEach(elem => {
      checkb_data.push(elem.getAttribute('name'));
    })

    // Get info about checked includings
    const city = form.findFormValue(formData, 'city'),
      street = form.findFormValue(formData, 'street'),
      includings = form.includeItems(formData, checkb_data, 0);

    // Clear out old data before new request
    //container.querySelector('#wikipedia-links').innerText = '';
    
    // If form was filled successfuly, seach for results
    if (new Geosearch(city, street, document.getElementById('map-canv')).showInfo()) {
      var geosearch = new GoogleMapSearch(city, street, document.getElementById('map-canv'));

      form.lang == 'en' ?
        container.querySelector('#greeting').innerText = `Search by address: ${geosearch.street}, ${geosearch.city}`:
        container.querySelector('#greeting').innerText = `Пошук за адресою: ${geosearch.street}, ${geosearch.city}`;
      
      //name="nytimes-news" // timerange-nytimes-news //data-options="nytimes-news"
      if (!includings) return; // if includings == 'undefined'

      // Load articles of Service user checked
      var opts = {};

      if (includings) {
        if (includings.length) {
          includings.forEach(elem => {
            // Set object key by variable and correct it to avoid error in future
            opts[elem.replace('-', '_')] = form.collectDataGroup(container.querySelector(`[data-options="${elem}"]`), 'name', /-.*/);
          })

          var nytimesSearch = new NYTimesSearch(city, street, document.getElementById('nytimes-articles'), opts);
        }
      }
    }
  })
})
