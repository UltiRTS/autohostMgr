const {AutohostIfNetwork} = require('../lib/autohostInterfaceNetwork');
const {EventEmitter} = require('events');

const eventEmitter = new EventEmitter();

eventEmitter.on('engineMsg', (msg) => {
  console.log(msg);
});

const autohostIfNetwork = new AutohostIfNetwork(13000, eventEmitter);

