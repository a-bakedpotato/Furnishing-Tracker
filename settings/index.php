<html>
    <head>
        <link rel="stylesheet" href="/assets/style/index.css" type="text/css">
        <link rel="stylesheet" href="index.css" type="text/css">
        <script src="index.js"></script>
    </head>
    <body>
        <noscript>This page relies on JavaScript to run. Please enable JavaScript before using this.</noscript>
        <input type="checkbox" name="hideChars" id="hideChars" onclick="toggleSetting('hideChars')"><label for="hideChars"></label> Hide unobtained characters<br>
        <div id="chars" class="hidden">
            <?php
                $chars = json_decode(file_get_contents('https://api.ambr.top/v2/en/avatar'));
                $data = $chars -> data -> items;

                foreach ($data as $id => $char){
                    if (preg_match('/^1000000[57]/', $id)) continue;

                    $name = $char -> name;
                    $charIcon = $char -> icon;
                    $charIconRoute = "https://api.ambr.top/assets/UI/$charIcon.png";

                    echo "<div onclick=\"toggleChar('$id')\" data-charId=\"$id\" id=\"char$id\" class=\"char$id char\">
                        <img src=\"$charIconRoute\" alt=\"$id\">
                    </div>";
                }

                echo "<script defer>window.updateChars()</script>";
            ?>
        </div>
        <input type="checkbox" name="hideDone" id="hideDone" onclick="toggleSetting('hideDone')"><label for="hideDone"></label> Hide completed sets<br>
        <input type="checkbox" name="hideNonGift" id="hideNonGift" onclick="toggleSetting('hideNonGift')"><label for="hideNonGift"></label> Hide non-gift sets
    </body>
</html>