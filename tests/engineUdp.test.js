const {AutohostIfNetwork} = require('../lib/autohostInterfaceNetwork');
const {EventEmitter} = require('events');

const eventEmitter = new EventEmitter();

const autohostIfNetwork = new AutohostIfNetwork(3000, eventEmitter);

