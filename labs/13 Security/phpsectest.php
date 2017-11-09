<?php
$string = "I'll \"walk\" the <b>dog</b> now";  // notice \-sign before double quotes!

$a = htmlentities($string);
$b = html_entity_decode($string);
$c = htmlspecialchars($string);
$d = strip_tags($string, '<b>');

echo $a.", ".$b.", ".$c.", ".$d;

$test = "I'll \"walk\" the <b id='testi' onmouseover='test()'>dog</b> now";

$e = strip_tags($test, '<b>');

echo $e;
?>

<script type="text/javascript">
    function test() {
        var x = document.getElementById("testi");
        x.innerHTML = "cat";
    }
</script>