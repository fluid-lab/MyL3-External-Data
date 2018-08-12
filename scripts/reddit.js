// this file implemetns reddit OAuth and after redirection.
$(document).ready(() => {
    $('#redditAuthButton').on('click', () => {
        let CLIENT_ID;
        if(window.myL3.apiKeys.redditToken) {
            CLIENT_ID = window.myL3.apiKeys.redditToken;
        } else {
            const token = prompt('Enter reddit API key');
            token !== '' ? CLIENT_ID = token : alert('invalid token');
        }

        // creating a 32-bit confirmation string for reddit OAuth
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
        let confirmationString = "";
        for(let i=0; i<32; i++) {
            confirmationString += possible[Math.floor(Math.random() * possible.length)];
        }
        localStorage.confirmationString = confirmationString;

        const TYPE = "code";
        const STATE = confirmationString;
        let URI = encodeURI("http://localhost:4000/views/reddit_auth.html");
        const DURATION = 'temporary';
        const SCOPE_STRING = "identity history";
        const url = `https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=${TYPE}&state=${STATE}&redirect_uri=${URI}&duration=${DURATION}&scope=${SCOPE_STRING}`;

        window.location.href = url;
    });
});
