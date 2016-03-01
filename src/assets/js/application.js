var map;
var geocoder = null;
var closest = [];
var geo_markers = [];
var latLng;

function google_map() {
	function initialize() {
		geocoder = new google.maps.Geocoder();

		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 7,
			mapTypeId: google.maps.MapTypeId.TERRAIN,
			LatLngBounds: (
			new google.maps.LatLng(49.383639452689664, -17.39866406249996),
			new google.maps.LatLng(59.53530451232491, 8.968523437500039)),
			center: new google.maps.LatLng(54.559322,-4.174804)
		});

		var input = document.getElementById('address');
		var options = {
		   types: ['(cities)'],
		   componentRestrictions: {country: 'uk'}//Turkey only
		};
		var autocomplete = new google.maps.places.Autocomplete(input, options);

		var script = document.createElement('script');
		script.src = 'assets/data/cinemas.geojsonp';
		document.getElementsByTagName('head')[0].appendChild(script);
	}


	// Loop through the results array and place a marker for each
	// set of coordinates.
	window.cinemalist_callback = function (results) {
		for (var i = 0; i < results.cinemas.length; i++) {
			var icon = results.cinemas[i].properties.icon;
			geocoder.geocode({
		        'address': results.cinemas[i].properties.postcode
		    }, function (results, status) {
		        if (status == google.maps.GeocoderStatus.OK) {
					latLng = results[0].geometry.location;

					var marker = new google.maps.Marker({
						position: latLng,
						icon: icon,
						map: map
					});
		        } else {
		            alert("Geocode was not successful for the following reason:"+ status);
		        }
		   	});
		}
	   	sessionStorage.setItem('geo_markers', JSON.stringify(geo_markers));
	}
	google.maps.event.addDomListener(window, 'load', initialize)
}

function convertAddress() {
	$('.map-form').fadeOut(400);

    var address = document.getElementById('address').value;
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
        	var pt = results[0].geometry.location;
            map.setCenter(pt);
            map.setZoom(12);

			if (typeof customerMarker != 'undefined') { customerMarker.setMap(null); }

            customerMarker = new google.maps.Marker({
                map: map,
                position: pt
            });

            findClosestN(pt, 2);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function findClosestN(pt, numberOfResults) {
    var closest = [];
    window.cinemalist_callback = function(results) {
	    for (var i = 0; i < results.cinemas.length; i++) {
	        results.cinemas[i].distance = google.maps.geometry.spherical.computeDistanceBetween(pt, results.cinemas[i].getPosition());
	        results.cinemas[i].setMap(null);
	        closest.push(results.cinemas[i]);
	    }
    }
    closest.sort(sortByDist);
    return closest.splice(0,numberOfResults);
}

function sortByDist(a, b) {
    return (a.distance - b.distance)
}

$(document).ready(function() {
	google_map();

	$('#address').keypress(function (e) {
	  if (e.which == 13) {
	    convertAddress();
	    return false
	  }
	});
});