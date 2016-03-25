var map;
var geocoder = null;
var closest = [];
var test = [];
var geo_markers = [];

var infowindow = new google.maps.InfoWindow({});

function google_map() {
	function initialize() {
		geocoder = new google.maps.Geocoder();

		//https://snazzymaps.com/style/83/muted-blue
		var styles = [{"featureType":"all","stylers":[{"saturation":0},{"hue":"#e7ecf0"}]},{"featureType":"road","stylers":[{"saturation":-70}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"visibility":"simplified"},{"saturation":-60}]}];
	  	var styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});

		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 7,
			mapTypeId: google.maps.MapTypeId.TERRAIN,
			LatLngBounds: (
			new google.maps.LatLng(49.383639452689664, -17.39866406249996),
			new google.maps.LatLng(59.53530451232491, 8.968523437500039)),
			center: new google.maps.LatLng(54.559322,-4.174804)
		});

		var input = document.getElementById('address');
		var nav_input = document.getElementById('nav-address');
		var options = {
		   types: ['(cities)'],
		   componentRestrictions: {country: 'uk'} //UK only
		};
		var autocomplete = new google.maps.places.Autocomplete(input, options);
		var nav_autocomplete = new google.maps.places.Autocomplete(nav_input, options);
 		var infowindow = new google.maps.InfoWindow();
    	var marker, i;

		var script = document.createElement('script');
		script.src = 'assets/data/cinemas.geojsonp';

		map.mapTypes.set('map_style', styledMap);
  		map.setMapTypeId('map_style');

		document.getElementsByTagName('head')[0].appendChild(script);
	}


	// Loop through the results array and place a marker for each
	// set of coordinates.
	window.cinemalist_callback = function(results) {
		var all_cinemas = [];

		for (var i = 0; i < results.cinemas.length; i++) {
			var icon = results.cinemas[i].properties.icon;
			var latLng = results.cinemas[i].geometry.location;

            var url = results.cinemas[i].properties.url;
            var id  = results.cinemas[i].id;

            var stripped_url = url.replace('http://','','/');
            var stripped_url = stripped_url.replace('/','');

			var marker = new google.maps.Marker({
				position: latLng,
				icon: icon,
				map: map,
				clickable: true
			});
			geo_markers.push(marker);
			all_cinemas.push(results.cinemas[i]);

			marker.info = new google.maps.InfoWindow({
			  	content:    '<div class="info-window"><h4><strong>'+results.cinemas[i].properties.name+'</strong></h4>'
        			  		+'<p>'+results.cinemas[i].properties.address+'</p>'
                            +'<p><a href="'+url+'" target="_blank">'+stripped_url+'</a></p>'
                            +'<div class="row">'+
				        		'<div class="col-lg-4">'+
				        			'<a href="#" onclick="cinema_history('+id+');  return false;" class="btn btn-primary mt1">View Info</a>'+
				        		'</div>'
			});

			google.maps.event.addListener(marker, 'click', function() {
    			this.info.open(map, this);
			});
		}
		sessionStorage.setItem('all_cinemas', JSON.stringify(all_cinemas));
	}
	google.maps.event.addDomListener(window, 'load', initialize)
}

function save_nearest_cinemas(pt) {
	$('.image-grid').hide();

    map.setCenter(pt);
    map.setZoom(12);

    if (typeof customerMarker != 'undefined') { customerMarker.setMap(null); }

    customerMarker = new google.maps.Marker({
        map: map,
        position: pt
    });

    closest = find_closest_n(pt, 3);
    var near_cinemas = [];

    for (var i = 0; i < closest.length; i++) {
        var distance = '<span class="glyphicon glyphicon-map-marker mr1" aria-hidden="true"></span>' + Math.ceil(closest[i].distance * 0.000621371192) + ' miles away';

        near_cinemas.push(closest[i].info.content +
			'<div class="col-lg-8">'+
				'<p class="distance mt2 mb0">' + distance + '<p>'+
			'</div>'+
		'</div>');
    }

	sessionStorage.setItem('near_cinemas', JSON.stringify(near_cinemas));
    show_nearest_cinemas();
}

function convert_address(address) {
	$('.map-form').fadeOut(400);

    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
        	var pt = results[0].geometry.location;

            save_nearest_cinemas(pt);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function use_location() {
	$('.map-form').fadeOut(400);

    navigator.geolocation.getCurrentPosition(success);

    function success(position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        var pt  = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        save_nearest_cinemas(pt);
    }
}

function find_closest_n(pt, number_of_results) {
    var closest = [];
    for (var i = 0; i < geo_markers.length; i++) {
        geo_markers[i].distance = google.maps.geometry.spherical.computeDistanceBetween(pt, geo_markers[i].getPosition());
        closest.push(geo_markers[i]);
    }
    closest.sort(sort_by_dist);
    return closest.splice(0,number_of_results);

    // var near_cinemas = [];
    // var near_cinema = [];
    // near_cinemas = closest.splice(0,number_of_results);

    // for (var i = 0; i < near_cinemas.length; i++) {
    //     near_cinema.push(near_cinemas[i].getPosition());
    // }
    // sessionStorage.setItem('near_cinemas', JSON.stringify(near_cinema));

	//for (var i = 0; i < sessionStorage.all_cinemas.length; i++) {
	// 	for (var j = 0; j < sessionStorage.near_cinema.length; j++) {
	// 		console.log(sessionStorage.all_cinemas[i]);
	// 		console.log(sessionStorage.near_cinema[j]);

	// 		if(results.cinemas[i].geometry.location != sessionStorage.near_cinema[j]){
	// 			console.log('success');
	// 		}
	// 	}
	// }
}

function sort_by_dist(a, b) {
    return (a.distance - b.distance)
}

function show_nearest_cinemas() {
    $('.nearest-cinema').fadeIn(400);
    var nearest_cinema_html = [];

    nearest_cinema_html = sessionStorage.getItem('near_cinemas');
    nearest_cinema_parsed = JSON.parse(nearest_cinema_html);

    $('.data').empty();
    for (var i = 0; i < nearest_cinema_parsed.length; i++) {
	    $('<div class="col-sm-4 col-md-3"><div class="cinema">'+nearest_cinema_parsed[i]+'</div></div>').appendTo(".data");
    }
}

function cinema_history(id) {
	var all_cinemas = [];

    all_cinemas = sessionStorage.getItem('all_cinemas');
	var all_cinemas_parsed = JSON.parse(all_cinemas);

	// Loop through the results array and place a marker for each
	// set of coordinates.
	for (var i = 0; i < all_cinemas_parsed.length; i++) {
		if(all_cinemas_parsed[i].id == id){
			var img_url = all_cinemas_parsed[i].properties.name;
			var img_url = img_url.replace(' ','_');
			var img_url = img_url.replace(' ','_');
			var img_url = img_url.toLowerCase();

			$(".cinema-modal").append("<div class='modal fade' id='cinema_modal' tabindex='-1' role='dialog' aria-labelledby='cinema-modal-label'>"+
				  "<div class='modal-dialog' role='document'>"+
				    "<div class='modal-content'>"+
				      "<div class='modal-header'>"+
				        "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+
				        "<h4 class='modal-title' id='cinema-modal-label'>"+all_cinemas_parsed[i].properties.name+"</h4>"+
				      "</div>"+
				      "<div class='modal-body'>"+
				      		"<div class='row'>"+
					      		"<div class='col-sm-6'>"+
					      			"<img src='assets/img/cinemas/"+img_url+".jpg' class='img-responsive'>"+
					      		"</div>"+
					      		"<div class='col-sm-6'>"+
						   			"<p>"+all_cinemas_parsed[i].properties.address+"</p>"+
						   			"<p>"+all_cinemas_parsed[i].properties.city+"</p>"+
						   			"<p>"+all_cinemas_parsed[i].properties.postcode+"</p>"+
						   			"<p><a href='"+all_cinemas_parsed[i].properties.url+"' target='_blank'>"+all_cinemas_parsed[i].properties.url+"</a></p>"+
						   			"<p>Status: "+all_cinemas_parsed[i].properties.status+"</p>"+
						   			"<p>Open Since: "+all_cinemas_parsed[i].properties.opened+"</p>"+
					      		"</div>"+
							"</div>"+
						"</div>"+
						"<div class='modal-footer'>"+
						"	<button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>"+
						"</div>"+
				    "</div>"+
				  "</div>"+
				"</div>");

			$('#cinema_modal').modal('show');

			$('#cinema_modal').on('hidden.bs.modal', function () {
			  $('#cinema_modal').remove();
			});
		}
	}

	return false;
}

$(document).ready(function() {
	google_map();

	$('.toggler').click(function () {
		$('.nearest-cinema').toggleClass("down");
		$(this).find('i').toggleClass('fa-chevron-down fa-chevron-up');
	});

	$('#location-form').submit(function () {
		var address = document.getElementById('address').value;
		convert_address(address);
		return false;
	});

	$('#address').keypress(function (e) {
		if (e.which == 13) {
			$(this).parent().submit();
			return false
		}
	});

	$('#nav-location-form').submit(function () {
		var address = document.getElementById('nav-address').value;
		convert_address(address);
		return false;
	});

	$('#nav-address').keypress(function (e) {
		if (e.which == 13) {
			$(this).parent().submit();
			return false
		}
	});

	$('#locate').click(function () {
		use_location();
	});
});
