const {DntpCommunicator} = require('../lib/dntpCommunicator');
const {dntpServerAddr} = require('../config');


const main = async () => {
  const client = new DntpCommunicator(dntpServerAddr, './maps');

  const res = await client.getMapUrlById('1');
  console.log(res);
};


main();
