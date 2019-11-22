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
function initPage() {
  const app = createElement("div", null, {
    class: "container",
    id: "maaaaan",
    style: "display:none"
  });
  let talk_con = createElement("div", null, { class: "talk_con" });
  const bt = createElement("button", null, { id: "btt", alt: "" });
  //Set up listening mode.
  const modebt = createElement("button", null, { id: "mtt", alt: "" });
  bt.onclick = function() {
    app.style.display = "none";
    sessionStorage.setItem("mentor", 0);
  };
  talk_con.append(bt);
  let talk_show = createElement("div", null, {
    class: "talk_show",
    id: "words"
  });
  let Atalk = createElement("div", null, { class: "atalk" });
  let Btalk = createElement("div", null, { class: "btalk" });
  Atalk.appendChild(
    createElement(
      "span",
      "Hi, in here, you could ask questions about python open source project coding.\
      If you want to ask any specific function to python type, please input eg: String type function first then begin search.",
      { id: "asay" }
    )
  );
  talk_show.appendChild(Atalk);
  // store the chat history in the sessionStorage
  if (sessionStorage.length) {
    for (var i = 0; i < sessionStorage.length; i++) {
      if (sessionStorage.getItem(i) == "") {
        continue;
      }
      if (i % 2 == 0) {
        let Atalk = createElement("div", null, { class: "btalk" });
        Atalk.appendChild(
          createElement("span", sessionStorage.getItem(i), { id: "asay" })
        );
        talk_show.appendChild(Atalk);
      } else {
        let Btalk = createElement("div", null, { class: "atalk" });
        Btalk.appendChild(
          createElement("span", sessionStorage.getItem(i), { id: "bsay" })
        );
        talk_show.appendChild(Btalk);
      }
    }
  }
  let talk_input = createElement("div", null, { class: "talk_input" });
  talk_input.appendChild(
    createElement("input", null, {
      type: "text",
      class: "talk_word",
      id: "talkwords"
    })
  );
  talk_input.appendChild(
    createElement("input", null, {
      type: "button",
      value: "Send",
      class: "talk_sub",
      id: "talksub"
    })
  );

  talk_input.appendChild(
    createElement("input", null, {
      type: "button",
      value: "Switch",
      class: "talk_sub",
      id: "Mentor_mode"
    })
  );
  talk_con.appendChild(talk_show);
  talk_con.appendChild(talk_input);
  app.appendChild(talk_con);
  document.body.appendChild(app);
}

// call initial page
initPage();

document.οnkeydοwn = function(e) {
  var keyNum = window.event ? e.keyCode : e.which;
  if (keyNum == 108) {
    alert("enter");
  }
};
// clear the token and chat history
function clearLocalStorage() {
  chrome.storage.local.clear(function() {
    var error = chrome.runtime.lastError;
    if (error) {
      console.error(error);
    }
  });
}

window.onload = function() {
  var Words = document.getElementById("words");
  var TalkWords = document.getElementById("talkwords");
  var mentor_mode = document.getElementById("Mentor_mode");
  var Mode_on = false;
  var TalkSub = document.getElementById("talksub");
  var Mentor_coming =
    '<div style="text-align: center; padding:5px 10px;color: red;">' +
    "Hi Ask them who browse the same page with you 🍻" +
    "</div>";
  var socket = new WebSocket("ws://localhost:8080/ws");
  // var socket = new WebSocket("ws://192.169.1.2:8080/ws");
  if (!window.WebSocket) {
    window.WebSocket = window.MozWebSocket;
  }
  if (window.WebSocket) {
    socket.onmessage = function(event) {
      var Words = document.getElementById("words");

      console.log(event.data);
      if (!sessionStorage.getItem("port")) {
        sessionStorage.setItem("port", event.data);
      }
      let data = event.data;
      console.log(data.slice(0, 5));
      console.log(sessionStorage.getItem("port"));
      let str3 = '<div class="atalk"><span>' + event.data + "</span></div>";
      if (Mode_on) {
        Words.innerHTML = Words.innerHTML + str3;
      }
      Words.scrollTop = words.scrollHeight;
    };
  } else {
    alert("you browser not support WebSocket！");
  }

  // mentor chat part (send the message to the backend)
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
    chrome.storage.sync.get(["key"], function(result) {
      var key = result.key;
      if (!key) {
        var Words = document.getElementById("words");
        let warn =
          '<div style="text-align: center; padding:5px 10px;">' +
          "Oops! you haven't login yet" +
          "</div>";
        TalkWords.value = "";
        Words.innerHTML = Words.innerHTML + warn;
        Words.scrollTop = Words.scrollHeight;
        return;
      } else {
        if (sessionStorage.getItem("mentor") == 1) {
          if (TalkWords.value == "") {
            alert("Input can not be empty");
            return;
          }
          send(TalkWords.value);
          var Words = document.getElementById("words");
          let str4 =
            '<div class="btalk"><span>' + TalkWords.value + "</span></div>";
          sessionStorage.setItem(sessionStorage.length, TalkWords.value);
          Words.innerHTML = Words.innerHTML + str4;
          TalkWords.value = "";
          Words.scrollTop = words.scrollHeight;
          return;
        }
        // check input
        var str = "";
        if (TalkWords.value == "") {
          alert("Input can not be empty");
          return;
        }

        str = '<div class="btalk"><span>' + TalkWords.value + "</span></div>";
        sessionStorage.setItem(sessionStorage.length, TalkWords.value);
        if (sessionStorage.getItem("mentor") != 1) {
          chrome.runtime.sendMessage(
            { contentScriptQuery: TalkWords.value, huaci: "False" },
            function(res) {
              var Words = document.getElementById("words");
              Words.innerHTML = Words.innerHTML + str;
              console.log(res.messge.substring(0, 6));
              //   if (res.messge.substring(0, 5) == "Sorry") {
              //       var mentor =
              //       //   '<div style="text-align: center; padding:5px 10px;">' +
              //       //   "Oops, Wanna to chat with bunch of mentors? <a id='mentor';lstyle='cursor:pointer;'>click me</a>" +
              //       //   "</div>";

              //       '<div style="text-align: center; padding:5px 10px;">' +
              //       "Oops, Wanna to chat with bunch of mentors? Please click the Switch button below!" +
              //       "</div>";
              //   }

              var str2 =
                '<div class="atalk"><span>' + res.messge + "</span></div>";
              sessionStorage.setItem(sessionStorage.length, res.messge);
              TalkWords.value = "";
              Words.innerHTML = Words.innerHTML + str2;
              if (mentor) {
                Words.innerHTML = Words.innerHTML + mentor;
                document.getElementById(
                  "mentor"
                ).onclick = function toMentor() {
                  sessionStorage.setItem("mentor", 1);
                  alert("change to mentor");
                  Words.innerHTML = Words.innerHTML + Mentor_coming;
                  words.scrollTop = words.scrollHeight;
                };
              }
              Words.scrollTop = Words.scrollHeight;
            }
          );
        }
        TalkWords.value = "";
        words.scrollTop = words.scrollHeight;
      }
    });
  };

  mentor_mode.onclick = function() {
    if (Mode_on == true) {
      Mode_on = !Mode_on;
      alert("Mentor mode has been turned off!");
      sessionStorage.setItem("mentor", 0);
    } else {
      Mode_on = !Mode_on;
      alert("Mentor mode has been turned on!");
      sessionStorage.setItem("mentor", 1);
    }
  };
};

// add listener to reopen the chatbox
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  let maaaan = document.getElementById("maaaaan");
  maaaan.style.display = "block";
  sendResponse({ farewell: "ok" });
});

// selected translation

(function() {
  "use strict";
  var trsBlock = createBlock();

  document.body.appendChild(trsBlock);
  window.onmousedown = () => hideElement(trsBlock);
  window.onmouseup = e => translation(getWord(), trsBlock, e);
})();

function createBlock() {
  var block = document.createElement("div");
  block.className =
    "card bg-light mb-3 shadow bg-white rounded max-width:100px";
  block.style.cssText = "position: absolute; z-index: 999999;";
  return block;
}

function hideElement(el) {
  el.style.display = "none";
  el.innerHTML = "";
}
// send the message to the backend.js to request and receive response than display on the webpage
function translation(word, el, e) {
  if (word === null || word === undefined) return null;
  var result = "";
  chrome.storage.sync.get(["key"], function(result) {
    var key = result.key;
    if (key) {
      chrome.storage.sync.get(["onoff"], function(result) {
        if (result.onoff === 0) {
          chrome.runtime.sendMessage(
            { contentScriptQuery: word, huaci: "True" },
            function(res) {
              let result = res.messge;
              el.style.left = "" + e.pageX + "px";
              el.style.top = "" + e.pageY + "px";
              let title = createElement("h4", word, { class: "card-header" });
              let trans = createElement("p", result, { class: "card-text" });
              el.appendChild(title);
              el.appendChild(trans);
              el.style.display = "block";
            }
          );
        }
      });
    }
  });
  return result;
}
//get the word text when user select
function getWord() {
  var word = window.getSelection().toString();
  if (word === "") return;
  return word;
}
// obtain the x , y position
function mouseCoords(ev) {
  if (ev.pageX || ev.pageY) {
    return { x: ev.pageX, y: ev.pageY };
  }
  return {
    x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
    y: ev.clientY + document.body.scrollTop - document.body.clientTop
  };
}
