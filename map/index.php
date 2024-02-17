<html>
    <head>
        <link href='http://fonts.googleapis.com/css?family=Lato&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" href="/assets/style/index.css" type="text/css">
        <link rel="stylesheet" href="index.css" type="text/css">
		
		<?php
			$itemId = $_GET['id'];
			if (!isset($itemId) || !file_exists("../assets/img/map/$itemId")){
				header('Location: ..');
				die();
			}

			$name;
			$rank;
			if (file_exists("../data/pieces/$itemId.json")){
				$data = json_decode(file_get_contents("../data/pieces/$itemId.json")) -> data;
				$name = $data -> name;
				$rank = $data -> rank;
			}
			if (file_exists("../data/materials/$itemId.json")){
				$data = json_decode(file_get_contents("../data/materials/$itemId.json")) -> data;
				$name = $data -> name;
				$rank = $data -> rank;
			}
			if (isset($name)) echo "<title>$name</title><meta content=\"$name\" property=\"og:title\">";
			if (isset($rank)){ 
				switch($rank){
					case '5':
						echo '<meta name="theme-color" content="#E2B17E">';
						break;
					case '4':
						echo '<meta name="theme-color" content="#8267AD">';
						break;
					case '3':
						echo '<meta name="theme-color" content="#677FAD">';
						break;
					case '2':
						echo '<meta name="theme-color" content="#719770">';
						break;
					case '1':
						echo '<meta name="theme-color" content="#666666">';
						break;
				}
			}

			echo "<meta content=\"http://giteapot.unaux.com/map/image.php?id=$itemId\" property=\"og:image\">";
			echo "<meta content=\"http://giteapot.unaux.com/map/image.php?id=$itemId\" name=\"twitter:image:src\">";
		?>
		<meta property="og:image:type" content="image/png">
		<meta property="og:image:width" content="3000">
		<meta property="og:image:height" content="1080">
		<meta name="twitter:card" content="summary_large_image">
		<meta name="twitter:site" content="Furnishing Set Tracker">
		<meta name="twitter:title" content="Furnishing Map">
    </head>
    <body>
        <noscript>This page relies on JavaScript to run. Please enable JavaScript before using this.</noscript>
        <a href=".."><img id="home" src="/assets/img/home.png"></a>
		<?php
			if (isset($name)) echo "<h2>$name</h2>";
			
			echo "<div id=\"maps\">";
			
			$maps = scandir("../assets/img/map/$itemId");
			foreach ($maps as $map){
				if ($map === '.' || $map === '..') continue;
				echo "<img class=\"map\" src=\"/assets/img/map/$itemId/$map\">";
			}
			
			echo "</div>";
		?>
    </body>
</html>