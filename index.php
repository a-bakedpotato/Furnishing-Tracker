<html>
    <head>
        <link rel="stylesheet" href="assets/style/index.css" type="text/css">
        <script src="assets/scripts/index.js"></script>
        <script src="assets/scripts/settings.js" defer></script>
    </head>
    <body>
        <noscript>This page relies on JavaScript to run. Please enable JavaScript before using this.</noscript>
        <h2>Furnishing Sets</h2>

        <a href="settings"><img id="settings" src="/assets/img/cog.png"></a>
        <div id="sets">
            <?php
                $sets = json_decode(file_get_contents('https://api.ambr.top/v2/en/furnitureSuite'));
                $furniture = json_decode(file_get_contents('https://api.ambr.top/v2/en/furniture'));

                function camelCase($str){
                    $words = explode(' ', $str);
                    $lower = array_map('ucfirst', $words);
                    return lcfirst(implode('', $lower));
                }

                function camelCaseArr($arr){
                    return array_map('camelCase', $arr);
                }

                foreach ($sets -> data -> items as $id => $partial){
                    $set = $partial;

                    if (!file_exists("data/sets/$id.json")){
                        $data = file_get_contents("https://api.ambr.top/v2/en/furnitureSuite/$id");
                        $file = fopen("data/sets/$id.json", "w");

                        fwrite($file, $data);
                    }

                    if (file_exists("data/sets/$id.json")){
                        $data = json_decode(file_get_contents("data/sets/$id.json"));
                        $set = $data -> data;
                    }

                    $types = camelCaseArr($set -> types ?: array());
                    $categories = camelCaseArr($set -> categories ?: array("hiddenSet"));
                    $name = $set -> name ?: $id;

                    $icon = $set -> icon ?: '';
                    $route = "https://api.ambr.top/assets/UI/furnitureSuite/$icon.png";

                    echo '<div class="furnishingSet ' . implode(' ', array_merge($types, $categories)) . ' set' . $id . '" data-setid="' . $id . '">';

                    echo "<img class=\"icon\" src=\"$route\" alt=\"$name\"><br>";
                    echo "<h2>$name</h2>";

                    echo '<div class="pieces">';

                    $pieces = $set -> suiteItemList ?: array();
                    foreach ($pieces as $pieceId => $pieceDataPartial){
                        $pieceData = $pieceDataPartial;

                        if (!file_exists("data/pieces/$pieceId.json")){
                            $data = file_get_contents("https://api.ambr.top/v2/en/furniture/$pieceId");
                            $file = fopen("data/pieces/$pieceId.json", "w");

                            fwrite($file, $data);
                        }

                        if (file_exists("data/pieces/$pieceId.json")){
                            $data = json_decode(file_get_contents("data/pieces/$pieceId.json"));
                            $pieceData = $data -> data;
                            echo "<script>window.recipes[$pieceId] = " . json_encode($pieceData -> recipe) . "</script>";
                        } else echo $pieceId;
                        
                        $name = isset($pieceData -> name) ? $pieceData -> name : $pieceId;
                        $pieceIcon = isset($pieceData -> icon) ? $pieceData -> icon : '';
                        $pieceIconRoute = "https://api.ambr.top/assets/UI/furniture/$pieceIcon.png";
                        $quantity = 5;

                        echo "<div title=\"" . str_replace('"', '&quot;', $name) . "\" oncontextmenu=\"copy('" . str_replace("'", "\\'", str_replace('"', '&quot;', $name)) . "'); return false;\" class=\"piece pieceSet$id furnishing$pieceId\" onclick=\"updatePrompt('$pieceId', '$pieceIconRoute', '" . str_replace("'", "\\'", str_replace('"', '&quot;', $name)) . "')\" 
                            data-pieceid=\"$pieceId\" data-quantity=\"$quantity\" data-icon=\"$pieceIconRoute\" data-piecename=\"" . str_replace('"', '&quot;', $name) . "\">
                            <img class=\"checkmark\" src=\"/assets/img/check.png\">
                            <img src=\"$pieceIconRoute\" alt=\"$pieceId\">
                            <p class=\"quantity\">$quantity</p>
                        </div>";
                    }

                    echo '</div>';

                    if (in_array('giftSet', $types)){
                        echo '<br><br><div class="chars">';

                        $chars = $set -> favoriteNpcList ?: array();
                        foreach ($chars as $charId => $charIconObj){
                            $charIcon = $charIconObj -> icon;
                            $charIconRoute = "https://api.ambr.top/assets/UI/$charIcon.png";
                            echo "<div onclick=\"toggleChar('$id', '$charId')\" data-charId=\"$charId\" class=\"char$charId char charSet$id\">
                                <img class=\"checkmark\" src=\"/assets/img/check.png\">
                                <img src=\"$charIconRoute\" alt=\"$id\">
                            </div>";
                        }
                        echo "<script defer>window.updateSet('$id')</script></div>";
                    }

                    echo '</div>';
                }
            ?>
        </div>

        <h2>Furnishings</h2>
        <div id="furnishings"></div>

        <h2>Materials</h2>
        <div id="materials"></div>

        <h6 id="credit">This website is powered by the <a href="https://ambr.top/">ambr.top</a> API. This project is open-source on <a href="https://github.com/a-bakedpotato/furnishing-tracker">GitHub</a>.</h6>
    </body>
</html>