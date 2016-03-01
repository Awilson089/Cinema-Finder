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
			<form class="form-inline">
				<div class="form-group">
					<label for="location">Enter Your Location: </label>
		   			<input type="text" id="address" name="location" value="Leeds" class="form-control">
				</div>
				<input type="submit" value="Search" onclick="convertAddress();" class="btn btn-primary">
			</div>
		</form>
	</div>

	<?php include('includes/footer.php') ?>
</body>
</html>

