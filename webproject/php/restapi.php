<?php
    //=========================================== RESTAPI funktioita ===========================================
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
		#  POST /votechatapi/message?json=jsonstring
		$jsonstring=urldecode($parameters["json"]);
		$json = json_decode($jsonstring);
		dbAccess("INSERT INTO Comment (UserName, Comment, VoteID)
        VALUES ('".$json->UserName."', '".$json->Comment."', '".$json->VoteID."')");
	}
    
    
	function postVote($parameters) {
		#  POST /votechatapi/vote?json=jsonstring
		$jsonstring=urldecode($parameters["json"]);
		$json = json_decode($jsonstring);
		dbAccess("INSERT INTO Vote (VoteName)
        VALUES ('".$json->VoteName."')");
	}
	
	
	function postVoteOptionTable($parameters) {
		#  POST /votechatapi/voteoptiontable?json=jsonstring
		$jsonstring=urldecode($parameters["json"]);
		$json = json_decode($jsonstring);
		dbAccess("INSERT INTO VoteOptionTable (VoteOption, VoteID)
        VALUES ('".$json->VoteOption."', '".$json->VoteID."')");
	}
    
	function postCreateVote($parameters) {
		#  POST /votechatapi/voteoptiontable?json=jsonstring
		$jsonstring=urldecode($parameters["json"]);
		$json = json_decode($jsonstring);
		dbAccess("INSERT INTO Vote (VoteName)
        VALUES ('".$json->VoteName."')");
        $voteid = dbAccess("SELECT VoteID FROM Vote WHERE VoteName='".$json->VoteName."'");
        print_r($json->VoteOption);
        for ($i=0; $i < sizeof($json->VoteOption); $i++) { 
			dbAccess("INSERT INTO VoteOptionTable (VoteOption, VoteID)
        	VALUES ('".$json->VoteOption[$i]->voteTitle."', '".$voteid[0][VoteID]."')");
        }
       	
    }
    
	function getMessages($parameters) {
		#  GET /votechatapi/messages
		dbAccess("SELECT * FROM Comment WHERE VoteID='".$parameters["voteid"]."'"); 
	}
	
	function getVotes() {
		#  GET /votechatapi/vote
		dbAccess("SELECT * FROM Vote"); 
	}
	
	function getVoteOptionTable($parameters) {
		#  GET /votechatapi/messages
		dbAccess("SELECT * FROM VoteOptionTable WHERE VoteID='".$parameters["voteid"]."'"); 
	}
	
	function getVote($parameters) {
		#  GET /votechatapi/vote
		dbAccess("SELECT Votename FROM Vote WHERE VoteID='".$parameters["voteid"]."'"); 
	}
	
	function updateVoteOption($parameters) {
		dbAccess("UPDATE VoteOptionTable SET Votes = Votes + 1 WHERE VoteOptionID='".$parameters["voteoption"]."' AND VoteID='".$parameters["voteid"]."'");
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
    	else if ($request_method=="POST" && $resource[1]=="vote") {
			postVote($parameters);
		}
		else if ($request_method=="POST" && $resource[1]=="voteoptiontable") {
			postVoteOptionTable($parameters);
		}
		else if ($request_method=="POST" && $resource[1]=="createvote") {
			postCreateVote($parameters);
		}
		else if ($request_method=="GET" && $resource[1]=="messages") {
			getMessages($parameters);
			//getFromDB("SELECT * FROM Comment WHERE CommentID=1");
		}
		
		else if ($request_method=="GET" && $resource[1]=="vote") {
			getVote($parameters);
		}
		
		else if ($request_method=="GET" && $resource[1]=="votes") {
			getVotes();
		}
		
		else if ($request_method=="GET" && $resource[1]=="voteoptiontable") {
			getVoteOptionTable($parameters);
		}
		
		else if ($request_method=="POST" && $resource[1]=="updatevoteoption") {
			updateVoteOption($parameters);
		}
		
		else {
			http_response_code(405); # Method not allowed
		}
	}
	else {
		http_response_code(405); # Method not allowed
	}
	
	//=========================================== MySQL funktioita ===========================================
    //Selvisi sittenki, että kaikki tietokantakyselyt voidaan tehä yhel funktiol
	
	function dbAccess($sqlquery) { 
	    //MySQL connection
    	// Defining variables for connection
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
//        echo "Connected successfully (".$db->host_info.")";

    	$result = mysqli_query($db, $sqlquery);
    	if ($result===true) {
    	    echo "Query successful";
    	} else if ($result===false) {
    		echo "Query failed";	
    	} else {
        	while ($row = mysqli_fetch_assoc($result)) {
        	    $jsonArray[] = $row;
            }
            echo json_encode($jsonArray);
            return $jsonArray;
    	}
        $db->close();
	}
    //esim: getFromDB("SELECT * FROM Comment WHERE CommentID=1");
?>

