//Date & Time Module for Powershell Prompt
var today = new Date();
var date = today.getDay() + ", "+today.getMonth() + " "+today.getFullYear();
var time = (today()).format("hh:mm:ss A");
var dateTime = date + ' ' + time;
document.getElementById("dateTime").innerHTML = dateTime;