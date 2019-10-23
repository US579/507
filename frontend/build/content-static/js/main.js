// author: Wanze liu, z5137189
// help function
function createElement(tag, data, options = {}) {
  const ele = document.createElement(tag);
  ele.textContent = data;
  return Object.entries(options).reduce((element, [field, value]) => {
    element.setAttribute(field, value);
    return element;
  }, ele);
}

// inital chat page
function initPage(){
    const app = createElement("div", null, { class: "container", id: "maaaaan", style:"display:none"});
    let talk_con = createElement("div", null, { class: "talk_con"})
    const bt = createElement("button",null, { id:"btt", alt: "" })
    bt.onclick = function () {
        app.style.display = "none";
        sessionStorage.setItem("mentor",0)
    }
    talk_con.append(bt)
    let talk_show = createElement("div",null, { class: "talk_show",id:"words"})
    let Atalk = createElement("div",null,{class:"atalk"})
    // alert(localStorage.getItem("status"));
    let Btalk = createElement("div", null, { class: "btalk" })
    Atalk.appendChild(createElement("span","any problems for open source ?",{id:"asay"}))
    talk_show.appendChild(Atalk);
    if (sessionStorage.length){
        for (var i = 0; i < sessionStorage.length; i++) {
            if (i%2==0){
                let Atalk = createElement("div", null, { class: "btalk" })
                Atalk.appendChild(createElement("span", sessionStorage.getItem(i), { id: "asay" }))
                talk_show.appendChild(Atalk);
            }else{
                let Btalk = createElement("div", null, { class: "atalk" });
                Btalk.appendChild(createElement("span", sessionStorage.getItem(i), { id: "bsay" }))
                talk_show.appendChild(Btalk);
            }
        }
    }
    let talk_input = createElement("div",null,{class:"talk_input"})
    talk_input.appendChild(createElement("input",null,{type:"text",class:"talk_word",id:"talkwords"}))
    talk_input.appendChild(createElement("input", null, { type: "button", value:"send",class: "talk_sub", id: "talksub" }))
    talk_con.appendChild(talk_show)
    talk_con.appendChild(talk_input)
    app.appendChild(talk_con)
    document.body.appendChild(app);
}

// call initial page
initPage(); 

document.οnkeydοwn = function (e) {    
    var keyNum = window.event ? e.keyCode : e.which;       
    alert(window.event)
    alert("hahah")
    if (keyNum == 108) {
        alert('enter');
    }
}
//
function clearLocalStorage() {
    chrome.storage.local.clear(function () {
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
    })
}



window.onload = function() {
    var Words = document.getElementById("words");
    var TalkWords = document.getElementById("talkwords");
    var TalkSub = document.getElementById("talksub");
    var Mentor_coming =
      '<div style="text-align: center; padding:5px 10px;color: red;">' +
      "Hi I am mentor US579 🧐🧐🧐" +
      "</div>";
    var socket = new WebSocket("ws://localhost:8080/ws");
    // var socket = new WebSocket("ws://192.169.1.2:8080/ws");
    if (!window.WebSocket) {
        window.WebSocket = window.MozWebSocket;
    }
    if (window.WebSocket) {
        socket.onmessage = function (event) {
            var Words = document.getElementById("words");

            console.log(event.data)
            if (!sessionStorage.getItem("port")){
                sessionStorage.setItem("port",event.data)
            }
            let data = event.data
            console.log(data.slice(0,5))
            console.log(sessionStorage.getItem("port"))
            let str3 =
                '<div class="atalk"><span>' +
                event.data+
                "</span></div>";
            Words.innerHTML = Words.innerHTML + str3;
            Words.scrollTop = words.scrollHeight;
        }
    } else {
        alert("you safari not support WebSocket！");
    }
    
    function send(message) {
        if (!window.WebSocket) {
            return;
        }
        if (socket.readyState == WebSocket.OPEN) {
            socket.send(message);
        } else {
            alert("connect is not open");
        }
    }
    TalkSub.onclick = function() {

        // check whether user login or not 
        chrome.storage.sync.get(['key'], function (result) {
            var key = result.key;
            if (!key) {
                let warning = document.getElementById("words");
                let warn =
                  '<div style="text-align: center; padding:5px 10px;">' +
                  "Oops! you haven't login yet" +
                  "</div>";
                TalkWords.value = "";
                warning.innerHTML = Words.innerHTML + warn;
                Words.scrollTop = Words.scrollHeight;
                return 
            }else{

                if (sessionStorage.getItem("mentor") == 1) {

                    send(TalkWords.value)
                   
                    var Words = document.getElementById("words");
                    let str4 =
                        '<div class="btalk"><span>' + TalkWords.value + "</span></div>";
                    sessionStorage.setItem(
                      sessionStorage.length,
                      TalkWords.value
                    );
                    Words.innerHTML = Words.innerHTML + str4;
                    TalkWords.value = "";
                    Words.scrollTop = words.scrollHeight;
                    return
                }
                // check input
                var str = "";
                if (TalkWords.value == "") {
                    alert("Input can not be empty");
                    return;
                }

                str = '<div class="btalk"><span>' + TalkWords.value+ "</span></div>";
                // send(TalkWords.value)
                sessionStorage.setItem(sessionStorage.length, TalkWords.value);
                if (sessionStorage.getItem("mentor")!=1){
                chrome.runtime.sendMessage(
                    { contentScriptQuery: TalkWords.value },
                    function (res) {
                        var Words = document.getElementById("words");
                        Words.innerHTML = Words.innerHTML + str;
                        if (res.messge == "Sorry I don't understand.") {
                            var mentor =
                              '<div style="text-align: center; padding:5px 10px;">' +
                              "Oops, Maybe you need a mentor ! <a id='mentor';lstyle='cursor:pointer;'>click me</a>" +
                              "</div>";
                        }

                        var str2 =
                            '<div class="atalk"><span>' + res.messge  + "</span></div>";
                        sessionStorage.setItem(sessionStorage.length, res.messge);
                        TalkWords.value = "";
                        // clickMentor.addEventListener("click", toMentor())
                        Words.innerHTML = Words.innerHTML + str2;
                        if (mentor){
                            Words.innerHTML = Words.innerHTML + mentor;
                            document.getElementById("mentor").onclick = function toMentor() {
                                sessionStorage.setItem("mentor", 1)
                                alert("change to mentor")
                                Words.innerHTML = Words.innerHTML + Mentor_coming;
                                // initBk();
                                words.scrollTop = words.scrollHeight;
                            }
                        }
                     
                        Words.scrollTop = Words.scrollHeight;
                    }
                )};
                TalkWords.value = ""
                // Words.innerHTML = Words.innerHTML + str;
                words.scrollTop = words.scrollHeight;
            }
        });
      

    }
}

// add listener to reopen the chatbox
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    let maaaan = document.getElementById("maaaaan");
    maaaan.style.display = "block";
    sendResponse({farewell:"ok"})
});

