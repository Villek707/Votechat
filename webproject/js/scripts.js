/*
TODO 
    Dynaaminen äänestys-artikkelien luonti 
    Nää pitää varmaa jossai vaiheessa vielä refactoroida MVC-mallin mukaiseksi... 
    Viestien puhdistus
    Lisää TODO artikkeleita
*/

var messageLog = "";

window.onload = function() {
    var chatLog = document.getElementById("chatLog");
    document.getElementById("sendButton").addEventListener("click", send);
};


function send() { //Viestin lähetys chattiin
    var messageInput = document.getElementById("messageInput");
    var message = messageInput.value;
    
        if (!(message == "")) { //Viestin lähetys logiikka. !!Turvallisuus syistä vertailuun vois laittaa kans jotai millä kattoo ettei viesti sisällä < > merkkejä. 
            messageLog += '<p class="message myMessage">' + message + "</p><br>"; 
            var chatLog = document.getElementById("chatLog");
            chatLog.innerHTML = messageLog; 
            
            //Kosmeettisia muutoksia 
            messageInput.value = "";
            messageInput.placeholder = "";
            chatLog.scrollTop = chatLog.scrollHeight; //Scrollaa chattia alas viestien kertyessä. !!Lisää " - chatLog.clientHeight;" koodiin jos lakkaa toimimasta jostain syystä
        }
};

function createNewVote() {
    //
};