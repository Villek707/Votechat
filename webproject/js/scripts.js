
var messageLog = "";
var voteOptionsLog = "";
var voteOptionsArray = [];
var votes = [];
var userName;
var currentRoomID;
var interval;

window.onload = function() {
    document.cookie = "username=anonymous; path=/;";
    loginCheck();
    toMainpage();
    var chatLog = document.getElementById("chatLog");
    document.getElementById("sendButton").addEventListener("click", send);
    document.getElementById("addVoteOptionButton").addEventListener("click", addVoteOption);
    document.getElementById("createVoteButton").addEventListener("click", createNewVote);
    document.getElementById("mainpage").addEventListener("click", toMainpage);
    setInterval(update, 500);
};
//Puhdistaa viestit html-tageista
function sanitizeText(text) {
    var c;
    for (var i = 0; i < text.length; i++) {
        c = text.charAt(i); 
        if (c == '<' || c == '>') {
          text = text.slice(0, i) + text.slice(i+1);
        } 
    } 
    return text;
}


//=========================================== Sivunvaihtelu funktiot ===========================================

//Tuo esiin pääsivun ja piilottaa äänestyssivun
function toMainpage() {
    xmlhttpLoadVoteRooms("votes");
    document.getElementById('votePage').style.display = 'none';
	document.getElementById('mainPage').style.display = 'block';
	clearInterval(interval);
    currentRoomID = -1;
}

//Tuo esiin äänestyssivun ja piilottaa pääsivun
function toVotepage(voteid) {
	document.getElementById('mainPage').style.display = 'none';
	document.getElementById('votePage').style.display = 'block';
	getVoteDetails(voteid);
	loadChat(voteid);
}


//Päivittää äänestyksen ja keskustelun (Kutsutaan puolen sekunnin välein)
function update() {
    if (currentRoomID == -1) {
         xmlhttpLoadVoteRooms("votes");
    } else {
        toVotepage(currentRoomID);
        
    }
}


//=========================================== XMLHttpRequest Apufunktioita ===========================================

//Lataa chatin hakemalla sen palvelinpuolelta MySQL tietokannasta xmlhttprequestilla
function xmlhttpLoadChat(id, urlparameter, voteid) { // id of the element, restapiurl, huoneen äänestysid
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log(xmlhttp.responseText);
            var jsonobj = JSON.parse(xmlhttp.responseText);
            var txt = "";
            for (var x in jsonobj) {
                
                if (jsonobj[x].UserName === "anonymous") {
                txt += '<p class="anon">' + jsonobj[x].Comment + "<p>";
                } else {
                    if (jsonobj[x].UserName === userName) {
                    txt += '<p class="myMessage">' + jsonobj[x].Comment + "<p>";
                    } else {
                    txt += '<p class="theirMessage">' + "<span>" + jsonobj[x].UserName + "</span>" + ': ' + jsonobj[x].Comment + "<p>";
                    }
                }
            }
            document.getElementById(id).innerHTML = txt;
            
            var elem = document.getElementById(id);
            elem.scrollTop = elem.scrollHeight;
            currentRoomID = voteid;
        }
    };
    xmlhttp.open("GET", "https://gittutorial-villek.c9users.io/votechatapi/"+urlparameter+"?voteid="+voteid, true);
    xmlhttp.send();
}

//Lataa pääsivulla äänestykset eli hakee tietokannasta xmlhttprequestilla restapin kautta kaikki äänestykset
function xmlhttpLoadVoteRooms(urlparameter) { // url
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log(xmlhttp.responseText);
            var jsonobj = JSON.parse(xmlhttp.responseText);
            
            var vote = document.getElementById("voteRooms");
            vote.innerHTML ="";
            var voteRooms = document.createElement("TABLE");
            voteRooms.setAttribute("align", "center");
            var dataInRow = 3;
            var i = 5;
            for (var x in jsonobj) {
                if (dataInRow <= i) {
                    var voteRoomsRow = document.createElement("TR");
                    i = 0;
                }
                    var voteRoom = document.createElement("TD");
                    var voteRoomName = document.createTextNode(jsonobj[x].VoteName);
                    voteRoom.setAttribute("id", ("voteRoom" + x));
                    var y=parseInt(x)+1;
                    voteRoom.setAttribute("onclick", "toVotepage(" + y + ")");
                    voteRoom.setAttribute("class", "voteRoom");
                    voteRoom.appendChild(voteRoomName);
                    voteRoomsRow.appendChild(voteRoom);
                    voteRooms.appendChild(voteRoomsRow);
                    i++;
                }
                
                vote.appendChild(voteRooms);
                
            }
        };
        xmlhttp.open("GET", "https://gittutorial-villek.c9users.io/votechatapi/"+urlparameter, true);
        xmlhttp.send();
    }

// Apufunktio xmlhttpVoterille tekee POST pyynnön REST apille xmlhttprequestilla joka sitten päivittää tietyn äänestyksen valintavaihtoehdon äänimäärän lisäämällä yhden
function updateVote(urlparameter, para, voteid) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log(xmlhttp.responseText);
            document.cookie = "votestatus"+voteid+"=voted; path=/;";
            toVotepage(voteid);
        }
    };
    xmlhttp.open("POST", "https://gittutorial-villek.c9users.io/votechatapi/"+urlparameter+para, true);
    xmlhttp.send();
}

//Luo äänestyshuoneeseen näkyville äänestyksen vaihtoehdot ja äänestysnapin hakemalla ne xmlhttprequestilla REST API:n kautta tietokannasta.
function xmlhttpVoter(id, urlparameter, para, voteid) { // id of the element, url, para for parameter, huoneen äänestys id
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log(xmlhttp.responseText);
            var jsonobj = JSON.parse(xmlhttp.responseText);
            document.getElementById(id).innerHTML="";
            for (var x in jsonobj) {
                var optionName = document.createElement("p");
                optionName.setAttribute("id", "option");
                optionName.innerHTML = jsonobj[x].VoteOption+": "+jsonobj[x].Votes+"    ";
                document.getElementById(id).appendChild(optionName);
                var voter = document.createElement("button");
                voter.innerHTML = "Vote!";
                voter.setAttribute("id", jsonobj[x].VoteOptionID);
                voter.setAttribute("class", "voteoptionbutton");
                if (!(getCookie("votestatus"+voteid)=="voted")) {
                    optionName.appendChild(voter);
                    document.getElementById(jsonobj[x].VoteOptionID).onclick=function() {updateVote("updatevoteoption", "?voteoption="+this.id+"&voteid="+voteid, voteid)};
                }
            }
        }
    };
    xmlhttp.open("GET", "https://gittutorial-villek.c9users.io/votechatapi/"+urlparameter+para, true);
    xmlhttp.send();
}

//Yleinen hakufunktio joka xmlhttprequestilla REST apin kautta hakee parametrina annetun asian
function xmlhttpGetHelper(id, urlparameter, para) { // id of the element, url, para for parameter
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log(xmlhttp.responseText);
            var jsonobj = JSON.parse(xmlhttp.responseText);
            var txt = jsonobj[0].Votename;
            document.getElementById(id).innerHTML = txt;
        }
    };
    xmlhttp.open("GET", "https://gittutorial-villek.c9users.io/votechatapi/"+urlparameter+para, true);
    xmlhttp.send();
}

//Yleinen POST funktio, jolla lähetetään jsoneita parametrina eli postaa REST apin kautta tietokantaan esimerkiksi viestejä
function xmlhttpPostHelper(urlparameter, postparam) {  // url, postparam = jsonstring
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log(xmlhttp.responseText);
            loadChat(currentRoomID);
        }
    };
    xmlhttp.open("POST", "https://gittutorial-villek.c9users.io/votechatapi/"+urlparameter+"?json="+postparam, true);
    xmlhttp.send();
}


//=========================================== login funktiot alkaa tästä ==========================================

//Palauttaa cookien arvon
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


//Tarkastaa käyttäjän
function loginCheck() {
    userName = getCookie("username");
    var loginDiv = document.getElementById("login");
    if (userName != "anonymous") {
        loginDiv.innerHTML = "";
        var usernode = document.createTextNode(userName);
        var textnode = document.createTextNode("logged as ");
        var textnode2 = document.createTextNode(" ");
    	var buttonText = document.createTextNode("Logout");    
    	var logoutButton = document.createElement("BUTTON");
    	logoutButton.setAttribute("onclick", "logout()");
    	logoutButton.appendChild(buttonText);
    	loginDiv.appendChild(textnode);
    	loginDiv.appendChild(usernode);
    	loginDiv.appendChild(textnode2);
    	loginDiv.appendChild(logoutButton);
    } else {
        loginDiv.innerHTML = "";
        var LbuttonText = document.createTextNode("Login"); 
        var loginButton = document.createElement("BUTTON");
        var loginText = document.createElement("INPUT");
        loginButton.setAttribute("onclick", "login()");
        loginButton.appendChild(LbuttonText);
        loginText.id = "loginInput";
        loginText.type = "text";
        loginText.name = "login";
        loginText.placeholder = "Type login...";
        loginDiv.appendChild(loginText);
        loginDiv.appendChild(loginButton);
    }
}

//Kirjautuu sisään eli luo cookien
function login(){
    var loginID = document.getElementById("loginInput").value;
    loginID = sanitizeText(loginID);
    document.cookie = "username="+loginID+"; path=/;";
    loginCheck();
}

//Kirjautuu ulos, resettaa cookien anonymoukseksi
function logout(){
    document.cookie = "username=anonymous; path=/;";
    loginCheck();
}


//=========================================== Chat alkaa tästä ===========================================


function send() { //Viestin lähetys chattiin
    var messageInput = document.getElementById("messageInput");
    var message = messageInput.value;
    message = sanitizeText(message);
    if (message.length > 255) { //Leikataan viesti 255 merkkiseksi jos alkuperäinen viesti ylittää sen 
        message = message.slice(0, 255);
    } 
    var messagejson = { "UserName":getCookie("username"), "Comment":message, "VoteID":currentRoomID }; //Tässä on template kommenteille, tohon usernamen tilalle laitetaan sitte cookiest haettu nimi ja voteid:hen laitetaan tiettyyn äänestykseen liittyvän äänestyksen id
    var messagejsonstring = JSON.stringify(messagejson);
    xmlhttpPostHelper("message", (messagejsonstring));
    if (!(message == "")) { //Viestin lähetys logiikka. 
        var chatLog = document.getElementById("chatLog");
        //Kosmeettisia muutoksia 
        messageInput.value = "";
        messageInput.placeholder = "";
        chatLog.scrollTop = chatLog.scrollHeight; //Scrollaa chattia alas viestien kertyessä.
        }
}

//kutsuu xmlhttpLoadChatin
function loadChat(voteid) {
    xmlhttpLoadChat("chatLog", "messages", voteid);
}


//=========================================== Äänestyksen funktiot alkaa tästä ===========================================

//Hakee äänestyssivulle titlen sekä äänestysvaihtoehdot kutsumalla funktioita
function getVoteDetails(voteid) {
    xmlhttpGetHelper("voteName", "vote", "?voteid="+voteid);
    xmlhttpVoter("votesAndOptions", "voteoptiontable", "?voteid="+voteid, voteid);
}

//Luo uuden äänestyksen lähettämällä annetut tiedot jsonina xmlhttprequestilla REST apin kautta tietokantaan ja päivittää mainsivun
function createNewVote() {
    var voteTitleInput = document.getElementById("voteTitleInput");
    
    if (!(voteTitleInput.value == "")) {
        var voteTitle = voteTitleInput.value;
        voteTitle = sanitizeText(voteTitle);
        
        var messagejson = { "VoteName":voteTitle, "VoteOption":voteOptionsArray }; //Tässä on äänestyksen luonti json
        var messagejsonstring = JSON.stringify(messagejson);
        xmlhttpPostHelper("createvote", (messagejsonstring));
        
        document.getElementById("voteOptions").innerHTML = "";
        voteTitleInput.value = "";
        voteOptionsArray = [];
        xmlhttpLoadVoteRooms("votes");
    }
}

//Funktio äänestyksen luonnissa lisättävien äänestys vaihtoehtojen kirjaamiseksi
function addVoteOption() {
    var voteOptionInput = document.getElementById("voteOptionInput");
    
    if (!(voteOptionInput.value == "")) {
        var voteOptionVal = voteOptionInput.value;
        voteOptionVal = sanitizeText(voteOptionVal);
        var voteOption = {voteTitle: voteOptionVal, votes: 0};
        voteOptionsArray.push(voteOption);
        voteOptionsLog += "<p>" + voteOption.voteTitle + "<p>";
        var voteOptions = document.getElementById("voteOptions");
        voteOptions.innerHTML = voteOptionsLog; 
        
        voteOptionInput.value = "";
        voteOptionInput.placeholder = "";
    }
}
