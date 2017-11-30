<?php
    // Päädyin MySQLihin
    $servername = getenv('IP');
    $username = getenv('C9_USER');
    $password = "";
    $database = "votechat";
    $dbport = 3306;

    // Create connection
    $db = new mysqli($servername, $username, $password, $database, $dbport);

    // Check connection
    if ($db->connect_error) {
        die("Connection failed: " . $db->connect_error);
    } 
    echo "Connected successfully (".$db->host_info.")";
    
    $query = "SELECT * FROM test";
    $result = mysqli_query($db, $query);

    while ($row = mysqli_fetch_assoc($result)) {
        echo "The number is: " . $row['testinumero'];
    }
?>