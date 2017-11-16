<?php

// follow gethint.php
// get the q parameter from URL
//  $q = $_REQUEST["q"];
// change the following

if (!empty($_GET['location'])){
  /**
   * Here we build the url we'll be using to access the google maps api
   */
  $maps_url = 'https://'.
  'maps.googleapis.com/'.
  'maps/api/geocode/json'.
  '?address=' . urlencode($_GET['location']);
  $maps_json = file_get_contents($maps_url);
  $maps_array = json_decode($maps_json, true);
  $lat = $maps_array['results'][0]['geometry']['location']['lat'];
  $lng = $maps_array['results'][0]['geometry']['location']['lng'];
  /**
   * Time to make our Instagram api request. We'll build the url using the
   * coordinate values returned by the google maps api
   */
  $woeid_url = 'https://www.metaweather.com/api/location/search/?lattlong='.$lat.','.$lng;
  $woeid_json = file_get_contents($woeid_url);
  $woeid_array = json_decode($woeid_json, true);
  $woeid = $woeid_array[0]['woeid'];
  $weather_url = 'https://www.metaweather.com/api/location/'.$woeid;
  $weather_json = file_get_contents($weather_url);
  $weather_json = json_encode(json_decode($weather_json, true), JSON_PRETTY_PRINT);
  $q = $_GET["q"];
  if ($q==1) {
    echo "<pre>".$weather_json."</pre>";
  } 
 // give it back to Javascript
  
}

?>