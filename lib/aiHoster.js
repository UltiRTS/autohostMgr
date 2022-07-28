const fs = require('fs');
const {spawn} = require('child_process');

/**
 * @class AIHoster
 */
class AIHoster {
  /**
     *
     * @param {String} hostIP
     * @param {Number} hostPort
     * @param {String} playerName
     * @param {String} engineToken
     */
  constructor(hostIP, hostPort, playerName, engineToken) {
    this.hostPort = hostPort;
    this.aiHoster = null;
    this.script = `[GAME]{

        HostIP=${hostIP};
        HostPort=${hostPort};
        MyPlayerName=${playerName};
        MyPasswd=${engineToken};
        IsHost=0;
    }`;
  }

  /**
   */
  scripGenNStart() {
    const scriptPath = `/tmp/aiHoster${this.hostPort}.txt`;
    fs.writeFileSync(scriptPath, this.script);

    this.aiHoster = spawn('engine/spring-headless', [scriptPath]);

    this.aiHoster.stdout.on('data', (data) => {
      console.log(`aiHoster stdout: ${data}`);
    });
    this.aiHoster.stderr.on('data', (data) => {
      console.log(`aiHoster stdout: ${data}`);
    });
    this.aiHoster.on('error', (error) => {
      console.log(`aiHoster error: ${error}`);
    });
    this.aiHoster.on('close', (code) => {
      console.log(`aiHoster close: ${code}`);
    });
  }
}


module.exports = {
  AIHoster,
};
