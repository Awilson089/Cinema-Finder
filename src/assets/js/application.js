var map;
var geocoder = null;
var closest = [];

function google_map() {

	function initialize() {
		geocoder = new google.maps.Geocoder();

		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 7,
			center: new google.maps.LatLng(54.559322,-4.174804),
			mapTypeId: google.maps.MapTypeId.TERRAIN
		});

		var script = document.createElement('script');
		script.src = 'assets/data/cinemas.geojsonp';
		document.getElementsByTagName('head')[0].appendChild(script);
	}
	// Loop through the results array and place a marker for each
	// set of coordinates.
	window.cinemalist_callback = function(results) {
		for (var i = 0; i < results.cinemas.length; i++) {
			var coords = results.cinemas[i].geometry.coordinates;
			var icon = results.cinemas[i].properties.icon;

			geocoder.geocode({
		        'address': results.cinemas[i].properties.postcode
		    }, function (results, status) {
		        if (status == google.maps.GeocoderStatus.OK) {
					var latLng = results[0].geometry.location;

					var marker = new google.maps.Marker({
						position: latLng,
						icon: icon,
						map: map
					});
		        } else {
		            alert('Geocode was not successful for the following reason: ' + status);
		        }
		   	});
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
            map.setCenter(results[0].geometry.location);
            map.setZoom(12);

			if (typeof customerMarker != 'undefined') { customerMarker.setMap(null); }

            customerMarker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
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
});