<?php
	$pageTitle = "Home";
	$page = "home";
	include('includes/header.php');
?>

<body>
	<?php include('includes/nav.php') ?>
	<div class="map-wrap">
	    <div id="map"></div>

		<div class="map-form">
			<div class="logo">Silver Screen</div>
			<div class="strap">Independent Cinema Finder</div>

			<form id="location-form" class="form-inline">
	   			<input type="text" id="address" name="location" value="Leeds" class="form-control">
                <a href="#" id="locate" class="btn btn-primary location"><span class="glyphicon glyphicon-screenshot" aria-hidden="true"></span></a>
				<button type="submit" id="search" class="btn btn-primary">Search</button>
			</form>
		</div>

		<div class="grid image-grid">
			<div class="grid-sizer"></div>
		</div>

		<div class="nearest-cinema">
			<div class="container-fluid">
				<div class="row">
					<div class="col-sm-12">
						<h3>Nearest Cinemas <span href="#" class="pull-right toggler"><i class="fa fa-chevron-down"></i></span></h3>
					</div>
				</div>
				<div class="row">
					<div class="data"></div>
				</div>
			</div>
		</div>
	</div>

	<div class="cinema-modal"></div>
</body>
</html>

