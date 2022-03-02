const {downloadMap} = require('../lib/network');


mapInfo = {
  prefix: 'http://ulti-repo.eterea.uk/dNTPDl/tmpMap/',
  map: {
    id: 7718,
    map_name: 'Impact🦔Beta',
    map_filename: 'impact_beta.sd7',
    minimap_filename: 'Impact🦔Beta.png',
    map_hash: '7bf227726ffb2d09eb6da7d271aece46',
  },
};

const main = async () => {
  const status = await downloadMap(mapInfo, './maps');
  if (status === true) console.log('map downloaded');
  else console.log('download failed');
};

main();
