/* eslint-disable require-jsdoc */
const udp = require('dgram');

class Engine {
  constructor(roomID) {

  }

  writeScript() {
    return;
  }
  initAutohServer() {
    this.server = udp.createSocket('udp4');
    // emits when any error occurs
    server.on('error', function(error) {
      console.log('Error: ' + error);
      server.close();
    });

    // emits on new datagram msg
    server.on('message', function(msg, client) {
      console.log('Data received from client : ' + msg.toString());

      // illegal syntax
      this.remoteEngine = client;

      eventEmitter.emit('commandFromEngineInterface',
          {'engine': global.selfID, 'message': msg});
      global.postMessage(msg);
    });

    server.on('listening', function() {
      const address = server.address();
      const port = address.port;
      const family = address.family;
      const ipaddr = address.address;
      console.log('Server is listening at port' + port);
      console.log('Server ip :' + ipaddr);
      console.log('Server is IP4/IP6 : ' + family);
    });

    // emits after the socket is closed using socket.close();
    server.on('close', function() {
      console.log('Socket is closed !');
    });
    server.bind(this.serverPort);
  }

  sayAutohServer(msg) {
    server.send(msg, this.remoteEngine.port,
        this.remoteEngine.address, function(error) {
          if (error) {
            client.close();
          } else {
            console.log('Data sent !!!');
          }
        });
  }

  runEngine() {
    return;
  }
}

onmessage = function(e) {
  global.postMessage= postMessage;

  action = e.data[0];
  parameters = e.data[1];
  switch (action) {
    case 'INIT':
      global.engine = new Engine(parameters); // create a room with this room ID
      global.selfID = roomID;
      break;

    case 'SCRIPT':
      global.engine.writeScript(parameters);
      break;

    case 'RUN':
      global.engine.initAutohServer();
      global.engine.runEngine();
      break;
    case 'KILLURSELF':
      global.engine.exit();
      break;
    case 'SAYROOM':
      global.engine.say(parameters);
      break;
  }
};
