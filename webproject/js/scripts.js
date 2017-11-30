/*
TODO 
    Nää pitää varmaa jossai vaiheessa vielä refactoroida MVC-mallin mukaiseksi... 
    Viestien puhdistus
    Lisää TODO artikkeleita
*/


var messageLog = "";
var voteOptionsLog = "";
var voteOptionsArray = [];

//document.cookie = "username=John Doe";

window.onload = function() {
    loadChat();
    var chatLog = document.getElementById("chatLog");
    document.getElementById("sendButton").addEventListener("click", send);
    document.getElementById("addVoteOptionButton").addEventListener("click", addVoteOption);
    document.getElementById("createVoteButton").addEventListener("click", createNewVote);
};

//=========================================== Apufunktioita ===========================================

function xmlhttpGetHelper(id, urlparameter) { //id = element id 
    var text = document.getElementById(id);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log(xmlhttp.responseText);
//            var jsonobj = JSON.parse(xmlhttp.responseText);
//            text.innerHTML = JSON.stringify(jsonobj);
            text.innerHTML = xmlhttp.responseText;
        }
    };
    xmlhttp.open("GET", "https://gittutorial-villek.c9users.io/votechatapi/"+urlparameter, true);
    xmlhttp.send();
}

function xmlhttpPostHelper(id, urlparameter, postparam) { //id = element id 
    var text = document.getElementById(id);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log(xmlhttp.responseText);
//          var jsonobj = JSON.parse(xmlhttp.responseText);
 //           text.innerHTML = JSON.stringify(jsonobj);
        }
    };
    xmlhttp.open("POST", "https://gittutorial-villek.c9users.io/votechatapi/"+urlparameter+"?"+postparam, true);
    xmlhttp.send();
}


//=========================================== Chat alkaa tästä ===========================================



function send() { //Viestin lähetys chattiin
    var messageInput = document.getElementById("messageInput");
    var message = messageInput.value;
    if (message.length > 255) { //Leikataan viesti 255 merkkiseksi jos alkuperäinen viesti ylittää sen 
        message = message.slice(0, 255);
    } 
    
    xmlhttpPostHelper("", "message", ("message=" + message));
    
    if (!(message == "")) { //Viestin lähetys logiikka. !!Turvallisuus syistä vertailuun vois laittaa kans jotai millä kattoo ettei viesti sisällä < > merkkejä. 
        messageLog += '<p class="message myMessage">' + message + "</p><br>"; //Onkohan tää paras tapa tehdä tää uusi viesti :thinking:
        var chatLog = document.getElementById("chatLog");
        chatLog.innerHTML = messageLog; 
        
        //Kosmeettisia muutoksia 
        messageInput.value = "";
        messageInput.placeholder = "";
        chatLog.scrollTop = chatLog.scrollHeight; //Scrollaa chattia alas viestien kertyessä. !!Lisää " - chatLog.clientHeight;" koodiin jos lakkaa toimimasta jostain syystä
    }
};

function loadChat() {
    xmlhttpGetHelper("chatLog", "messages");
}



//=========================================== Vote alkaa tästä ===========================================



function createNewVote() {
    var voteDiv = document.getElementById("vote");
    voteDiv.innerHTML = "";
    var form = document.createElement("FORM");
    var id;
     for (var i = 0; i < voteOptionsArray.length; i++) {
         
        var label = document.createElement("LABEL");
        var input = document.createElement("INPUT");
        var br = document.createElement("BR");
        var text = document.createTextNode(voteOptionsArray[i].voteTitle 
        + " " + voteOptionsArray[i].votes);
       
        input.setAttribute("id", i);
        input.setAttribute("type", "radio");
        label.appendChild(input);
        label.appendChild(text);
        label.appendChild(br);
        form.appendChild(label);
        id = i;
        
    }
    var buttonText = document.createTextNode("Vote");
    var voteButton = document.createElement("BUTTON");
    voteButton.setAttribute("onclick", "vote(" + id + ")");
    voteButton.appendChild(buttonText);
    voteDiv.appendChild(form);
    voteDiv.appendChild(voteButton);
}



function addVoteOption() {
    var voteOptionInput = document.getElementById("voteOptionInput");
    
    if (!(voteOptionInput.value == "")) {
        var voteOption = {voteTitle: voteOptionInput.value, votes: 0};
        voteOptionsArray.push(voteOption);
        voteOptionsLog += "<p>" + voteOption.voteTitle + "<p>";
        var voteOptions = document.getElementById("voteOptions");
        voteOptions.innerHTML = voteOptionsLog; 
        
        voteOptionInput.value = "";
        voteOptionInput.placeholder = "";
    }
}

function vote(id) {
    voteOptionsArray[id].votes
    //xmlhttpPostHelper("chatLog", id);
    
    //document.getElementById("chatLog").innerHTML = voteOptionsArray[id].voteTitle + " " + voteOptionsArray[id].votes;//Ei tärkeä, debugausta varten
}

/* 
function createNewVote() { 
    voteOptionsLog ="";
     for (var i = 0; i < voteOptionsArray.length; i++) {
        voteOptionsLog += '<div id="' + i + '" class="voteOption">' + voteOptionsArray[i].voteTitle 
        + " " + voteOptionsArray[i].votes + '<div>'; 
    }
    
    document.getElementById("vote").innerHTML = voteOptionsLog;
    var voteClasses = document.getElementsByClassName("voteOption");
    for (var i = 0; i < voteClasses.length; i++) {
        voteClasses[i].addEventListener("click", function() {
            vote(i);
        })
    } 
}
*/
