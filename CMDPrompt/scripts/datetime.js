//Date & Time Module for CMD Prompt
var dt = new Date();
document.getElementById("time").innerHTML = dt.toLocaleTimeString();
document.getElementById("date").innerHTML = dt.toLocaleDateString();
