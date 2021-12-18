/* eslint-disable require-jsdoc */

wsmodule = require('ws');
const WebSocket = wsmodule.WebSocket;

function connect() {
  global.ws = new WebSocket('ws://127.0.0.1:8080');
  console.log('plasmidTest:');

  ws.on('open', function open() {
    console.log('->connection established');
  });

  ws.on('message', function incoming(message) {
    console.log('->received');
    console.log(JSON.parse(message));
    global.message = message;
  });

  ws.onclose = function(e) {
    console.log('Socket is closed. Reconnect will be attempted in 1 second.',
        e.reason);
    setTimeout(function() {
      connect();
    }, 1000);
  };

  ws.onerror = function(err) {
    console.error('Socket encountered error: ', err.message, 'Closing socket');
    ws.close();
  };
}
connect();
global.sendData = function(object) {
  global.ws.send(JSON.stringify(object));
};

