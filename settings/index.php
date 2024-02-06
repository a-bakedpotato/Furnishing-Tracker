<html>
    <head>
        <link href='http://fonts.googleapis.com/css?family=Lato&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" href="/assets/style/index.css" type="text/css">
        <link rel="stylesheet" href="index.css" type="text/css">

        <script src="index.js"></script>

        <title>Furnishing Set Tracker Settings</title>
    </head>
    <body>
        <noscript>This page relies on JavaScript to run. Please enable JavaScript before using this.</noscript>
        <a href=".."><img id="home" src="/assets/img/home.png"></a>
        <h2>General</h2>
        <input type="checkbox" name="hideChars" id="hideChars" onclick="toggleSetting('hideChars')"><label for="hideChars"></label> Hide unobtained characters<br>
        <div id="chars" class="hidden">
            <?php
                $chars = json_decode(file_get_contents('https://api.ambr.top/v2/en/avatar'));
                $data = $chars -> data -> items;

                foreach ($data as $id => $char){
                    if (preg_match('/^1000000[57]/', $id)) continue;

                    $name = $char -> name;
                    $charIcon = $char -> icon;
                    $rank = $char -> rank;
                    $charIconRoute = "https://api.ambr.top/assets/UI/$charIcon.png";

                    echo "<div onclick=\"toggleChar('$id')\" data-rank=\"$rank\" data-charId=\"$id\" id=\"char$id\" class=\"char$id char\">
                        <img src=\"$charIconRoute\" alt=\"$id\">
                    </div>";
                }

                echo "<script defer>window.updateChars()</script>";
            ?>
        </div>
        <input type="checkbox" name="hideDone" id="hideDone" onclick="toggleSetting('hideDone')"><label for="hideDone"></label> Hide completed sets<br>
        <input type="checkbox" name="hideNonGift" id="hideNonGift" onclick="toggleSetting('hideNonGift')"><label for="hideNonGift"></label> Hide non-gift sets

        <h2>Profile</h2>
        Name <input type="text" id="profileName" placeholder="Profile Name" onchange="updateName()"><br>
        Profile <select id="profileSelect">
            <option hidden disabled selected value>-</option>
            <option value="new">Create New Profile</option>
        </select>
        <!-- TODO: add delete profile btn + confirmation -->
		
		<h2>Credits</h2>
		<p>
			Developer: a.bakedpotato<br>
			<!-- Contributors: ... -->
			Beta Testers: daydreamlai, drxgonfly, pekicaa, tomfront, tylertm<br>
			Checkmark Image: daydreamlai<br>
			Genshin Data + Assets: <a href="https://ambr.top">ambr.top</a><br>
			Design Inspiration: <a href="https://genshin-center.com">Genshin Center</a>, <a href="https://paimon.moe">paimon.moe</a>
		</p>
    </body>
</html>