<?php
	$itemId = $_GET['id'];
	if (!isset($itemId) || !file_exists("../assets/img/map/$itemId")){
		header('Location: ..');
		die();
	}

	$name;
	if (file_exists("../data/pieces/$itemId.json")) $name = json_decode(file_get_contents("../data/pieces/$itemId.json")) -> data -> name;
	if (file_exists("../data/materials/$itemId.json")) $name = json_decode(file_get_contents("../data/materials/$itemId.json")) -> data -> name;
			
	$maps = scandir("../assets/img/map/$itemId");

	$map = imagecreatefrompng("../assets/img/map/$itemId/" . (file_exists("../assets/img/map/$itemId/01.png") ? "0" : "") . "1.png");
	$pic = imagecreatefrompng("../assets/img/map/$itemId/" . end($maps));

	$dest = imagecreatetruecolor(1920 + 1080, 1080);

	imagecopyresized($dest, $map, 0, 0, 0, 0, 1080, 1080, imagesx($map), imagesy($map));
	imagecopymerge($dest, $pic, 1080, 0, 0, 0, imagesx($pic), imagesy($pic), 100);

	header('Content-Type: image/png');
	imagepng($dest);

	#$imgData = base64_encode(imagepng($dest));
	#echo "<meta content=\"data:image/png;base64,$imgData\" property=\"og:image\">";

	imagedestroy($dest);
	imagedestroy($map);
	imagedestroy($pic);
?>