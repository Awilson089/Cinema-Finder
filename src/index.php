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
			<label for="location">Enter Your Location: </label>
	   		<input type="text" id="address" name="location" value="Leeds"></input>
			<input type="button" value="Search" onclick="convertAddress();"></input>
		</div>
	</div>

	<?php include('includes/footer.php') ?>
</body>
</html>

