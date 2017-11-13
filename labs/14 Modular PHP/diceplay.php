<?php

include("diceclasses.inc.php");

$faces = $_GET["faces"];
$throws = $_GET["throws"];
$material = $_GET["material"];
$bias = $_GET["bias"];

$results = array();

// make dice
if ($material) {
    $dice = new PhysicalDice($faces, $bias, $material);
} else {
    $dice = new Dice($faces, $bias);
}
for ($i = 1; $i<=$throws; $i++) {
    $res = $dice->cast();
    $results[] = array('id' => strval($i), 'res' => strval($res));
}
$freqs = array();
for ($i = 1; $i<=$faces; $i++) {
    $freqs[] = array ('eyes' => strval($i), 'frequency' => strval($dice->getFreq($i)));
}
$aveg = $dice->getAvgEyes($results);
echo json_encode(array('faces'=>$faces,'results'=>$results,'frequencies'=>$freqs,'average'=>$aveg,'material'=>$material));



?>