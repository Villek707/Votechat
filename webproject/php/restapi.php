<?php

# URI parser helper functions

    function getResource() {
        # returns numerically indexed array of URI parts
        $resource_string = $_SERVER['REQUEST_URI'];
        if (strstr($resource_string, '?')) {
            $resource_string = substr($resource_string, 0, strpos($resource_string, '?'));
        }
        $resource = array();
        $resource = explode('/', $resource_string);
        array_shift($resource);   
        return $resource;
    }

    function getParameters() {
        # returns an associative array containing the parameters
        $resource = $_SERVER['REQUEST_URI'];
        $param_string = "";
        $param_array = array();
        if (strstr($resource, '?')) {
            # URI has parameters
            $param_string = substr($resource, strpos($resource, '?')+1);
            $parameters = explode('&', $param_string);                      
            foreach ($parameters as $single_parameter) {
                $param_name = substr($single_parameter, 0, strpos($single_parameter, '='));
                $param_value = substr($single_parameter, strpos($single_parameter, '=')+1);
                $param_array[$param_name] = $param_value;
            }
        }
        return $param_array;
    }

    function getMethod() {
        # returns a string containing the HTTP method
        $method = $_SERVER['REQUEST_METHOD'];
        return $method;
    }
 
# Handlers for REST communication
	function postMessage($parameters) {
		#  POST /votechatapi/message/id=13&name="HandlerBing"&message="hey every1"
		$name=urldecode($parameters["name"]);
		$message=urldecode($parameters["message"]);
		echo "Posted ".$parameters["id"]." ".$name." ".$message;
	}

	function getMessages() {
		#  GET /votechatapi/messages
		echo "Getting list of persons";
	}

	function getPerson($id) {
		# implements GET method for person 
		# Example: GET /staffapi/person/13
		echo "Getting person: ".$id;
	}

	function deletePerson($id) {
		# implements DELETE method for person 
		# Example: DELETE /staffapi/person/13
		echo "Deleting person: ".$id;
	}

# Main
# ----

	$resource = getResource();
    $request_method = getMethod();
    $parameters = getParameters();

    # Redirect to appropriate handlers.
	if ($resource[0]=="votechatapi") {
    	if ($request_method=="POST" && $resource[1]=="message") {
        	postMessage($parameters);
    	}
		else if ($request_method=="GET" && $resource[1]=="messages") {
			getMessages();
		} 
		else if ($request_method=="GET" && $resource[1]=="person") {
			getPerson($resource[2]);
		}
		else if ($request_method=="DELETE" && $resource[1]=="person") {
			deletePerson($resource[2]);
		}
		else {
			http_response_code(405); # Method not allowed
		}
	}
	else {
		http_response_code(405); # Method not allowed
	}
	
	//=========================================== MySQL funktioita ===========================================
	
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
/*    
    $query = "SELECT * FROM test";
    $result = mysqli_query($db, $query);

    while ($row = mysqli_fetch_assoc($result)) {
        echo "The number is: " . $row['testinumero'];
    }
    */
?>

