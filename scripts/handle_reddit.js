// after successful OAuth reddit brings us here
// Redirecting back to tempView.html
let x = window.location.href;
console.log(x);
let y = x.split("?")[1];
let stateAndCode = y.split("=");
let state = stateAndCode[1].split("&")[0];
let code = stateAndCode[2];

// We no longer need confirmation string.
// It will be created again if users reattempts OAuth

if(state === localStorage.confirmationString) {
    delete localStorage.confirmationString;
    console.log(state, code);
    window.location.href = "http://localhost:4000/views/tempView.html";
}