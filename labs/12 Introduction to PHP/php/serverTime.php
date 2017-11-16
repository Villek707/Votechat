<?php
$q = $_REQUEST["q"];
if ($q==1) {
    echo rand(); 
} else {
    echo date("H:i:s");
}
?>
