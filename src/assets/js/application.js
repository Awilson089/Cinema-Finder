var map;
var geocoder = null;
var closest = [];
var geo_markers = [];
var all_cinemas = [];

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
		   componentRestrictions: {country: 'uk'}//UK only
		};
		var autocomplete = new google.maps.places.Autocomplete(input, options);

		var script = document.createElement('script');
		script.src = 'assets/data/cinemas.geojsonp';
		document.getElementsByTagName('head')[0].appendChild(script);
	}


	// Loop through the results array and place a marker for each
	// set of coordinates.
	window.cinemalist_callback = function(results) {
		all_cinemas = results;
		for (var i = 0; i < results.cinemas.length; i++) {
			var icon = results.cinemas[i].properties.icon;
			var latLng = results.cinemas[i].geometry.location;
			console.log(latLng);

			var marker = new google.maps.Marker({
				position: latLng,
				icon: icon,
				map: map
			});
			geo_markers.push(marker);
		}
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

            findClosestN(pt, 3);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function findClosestN(pt, numberOfResults) {
    var closest = [];
    console.log(geo_markers);
    for (var i = 0; i < geo_markers.length; i++) {
        geo_markers[i].distance = google.maps.geometry.spherical.computeDistanceBetween(pt, geo_markers[i].getPosition());
        closest.push(geo_markers[i]);
    }
    closest.sort(sortByDist);
    var near_cinemas = [];
    var near_cinema = [];
    near_cinemas = closest.splice(0,numberOfResults);

    for (var i = 0; i < near_cinemas.length; i++) {
        near_cinema.push(near_cinemas[i].getPosition());
    }
    sessionStorage.setItem('near_cinemas', near_cinema);

 	window.cinemalist_callback = function(results) {
	 	all_cinemas = results;
		for (var i = 0; i < results.cinemas.length; i++) {
			for (var i = 0; i < sessionStorage.near_cinema.length; i++) {
				if(results.cinemas[i].geometry.location == sessionStorage.near_cinema[i]){
					console.log('success')
				}
			}
		}
	}
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

	$('#location-form').submit(function () {
		return false;
	});
});
