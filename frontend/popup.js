// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// author: Wanze liu, z5137189

'use strict';

 
let chatbox = document.getElementById('chatbox');
chatbox.onclick = function (element) {
  // var bg = chrome.extension.getBackgroundPage();
  // bg.test();
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: "close" }, function (response) {
    });//end  sendMessage   
  }); //end query
};


chrome.storage.sync.get(['key'], function (result) {
  var key = result.key;
  if (!key){
    document.getElementById("logout").style.display="none";
  }else{
    document.getElementById("login").style.display = "none";
    document.getElementById("signup").style.display = "none";
    document.getElementById("logout").style.display = "block";
  }
})

// for login
let onBut1 = document.getElementById("login");
const dc1 = document.getElementById("login-popup");
let onBut2 = document.getElementById("signup");
const dc2 = document.getElementById("signup-popup");
onBut1.onclick = () => {
  if (dc2.style.display == "block") {
    return
  }
  if (dc1.style.display == "none") {
    dc1.style.display = "block";
  } else {
    dc1.style.display = "none";
  }
};

//for signup
onBut2.onclick = () => {
  if (dc1.style.display == "block"){
    return
  }
    if (dc2.style.display == "none") {
      dc2.style.display = "block";
    } else {
      dc2.style.display = "none";
    }
};

// login 
const login_submit = document.getElementById("login-submit");
login_submit.onclick = () =>{
  let username_login = document.getElementById("inputusername").value;
  let password_login = document.getElementById("inputpassword").value;
  let url ="http://127.0.0.1:5000/ChatService/user/login?email="+username_login+"&password="+password_login;
  console.log(url)
  fetch(url, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })
  .then(res=>res.json())
  .then(function(res){
    if (res.token){
      let login = document.getElementById("login")
      let signup = document.getElementById("signup")
      let dc2 = document.getElementById("login-popup");
      let logout = document.getElementById("logout");
      login.style.display = "none";
      signup.style.display = "none";
      dc2.style.display = "none";
      logout.style.display = "block";
    }
    chrome.storage.sync.set({'key': res.token }, function () {
      console.log(res.token)
    });

  })
}

let logout = document.getElementById("logout");
logout.onclick=()=>{
  let login = document.getElementById("login");
  let signup = document.getElementById("signup");
  login.style.display = "block";
  signup.style.display = "block";
  let logout = document.getElementById("logout");
  logout.style.display="none";
  chrome.storage.sync.clear(function () {
    var error = chrome.runtime.lastError;
    if (error) {
      console.error(error);
    }
  });
}

const signup_submit = document.getElementById("signup-submit");
signup_submit.onclick = () => {
  let url = "http://127.0.0.1:5000/ChatService/user/register";
  var username_signup = document.getElementById("signup-username").value;
  var email_signup = document.getElementById("signup-role").value;
  var password_signup = document.getElementById("signup-password").value;
  console.log(url)
  fetch(url, {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "email": username_signup,
      "password": password_signup,
      "role":email_signup
    })
  })
    .then(res => res.json())
    .then(function (res) {
      console.log(res)
      document.getElementById("signup-username").value = '';
      document.getElementById("signup-role").value=''
      document.getElementById("signup-password").value='';
      if (res.message =="Register successful"){
        alert("Register successful");
        var btn = document.getElementById('login');
        btn.click();
      }else{
        alert("Register unsuccessful");
      }
    })
}