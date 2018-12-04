// // Source: https://ponyfoo.com/articles/backgroundsync

// function isOnline() {
//     // An event listener on the window object to listen for connectivity changes
//     var connectionStatus = document.getElementById('connectionStatus');

//     // Update the page with a notification message depending on the result
//     if (navigator.onLine) {
//         connectionStatus.innerHTML = 'You are currently online!';
//         connectionStatus.style = "color:green";
//     } else {
//         connectionStatus.innerHTML = 'You are currently offline. Any requests made will be queued and synced as soon as you are connected again.';
//         connectionStatus.style = "color:red";
//     }
// }

// window.addEventListener('online', isOnline);
// window.addEventListener('offline', isOnline);
// isOnline();

/**
 * Courtesy of https://ponyfoo.com/articles/backgroundsync
 */
function isOnline() {
    var connectionStatus = document.getElementById('connectionStatus');
    if (navigator.onLine) {
        connectionStatus.innerHTML = 'Online';
        connectionStatus.style = "color:green; font-weight:bolder;";
    } else {
        connectionStatus.innerHTML = 'Offline';
        connectionStatus.style = "color:red; font-weight:bolder;";
    }
}
window.addEventListener('online', isOnline);
window.addEventListener('offline', isOnline);
isOnline();