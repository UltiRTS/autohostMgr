const {downloadMap} = require('../lib/network');


mapInfo = {
  prefix: 'http://prod.promethesys.uk/dNTPDl/tmpMap/',
  map: {
    id: 1,
    map_name: 'mapname',
    map_filename: 'mapname.sdz',
    minimap_filename: 'mapname.png',
    map_hash: '245a7dfc88297197a7fcf7f389ddc115',
  },
};

const main = async () => {
  const status = await downloadMap(mapInfo, './maps');
  if (status === true) console.log('map downloaded');
  else console.log('download failed');
};

main();
