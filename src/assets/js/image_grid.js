$(document).ready(function() {
	var folder = "assets/img/cinemas/";

	$.ajax({
	    url : folder,
	    success: function (data) {
	        $(data).find("a").attr("href", function (i, val) {
	            if( val.match(/\.(jpe?g|png|gif)$/) ) {
	                $(".grid").append( "<div class='grid-item' style='background: url("+ folder + val +") center center no-repeat; background-size: cover; background-color: #444; background-blend-mode: multiply;' class='img-responsive'></div>" );
	            }
	        });
	    }
	});

	$('.grid').isotope({
		layoutMode: 'packery',
		packery: {
		  columnWidth: '.grid-sizer'
		},
		itemSelector: '.grid-item',
		percentPosition: true
	});
});
