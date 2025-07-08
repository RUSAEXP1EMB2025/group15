class NatureRemoController {
  constructor() {
    this.accessToken = (typeof configInstance !== 'undefined') ? configInstance.REMO_TOKEN : "ory_at_-k01LALh-Ca5yJKhiG8kYJs12OHZlScpRSAUqxp14YE.ddBxAUY8u8916Gx66rtu9paZryKp5CUOJEYAs5b2KgI";
    this.signalIds = {
      cool: "9d6fd539-96c2-459a-992d-f829d1acbcf4",
      warm: "e0173dac-3876-4b3d-92d7-3a3ef9b6f3b9",
      off: "8a02fa60-e218-4c4d-b31d-a5ea34769021",
      on: "31b48473-af6a-4ad8-8ce2-a064ed79bc46"
    };
    this.lightSignals = {
      "白色": "a4da61d0-cf5f-45c4-8448-f9261f0a8a78",
      "黄色": "6bc5c685-4603-4d20-9373-7277c83fb7b4",
      "白と黄色の中間色": "efb7537e-e0a1-4038-9304-8e0fa93b753d"
    };
  }

  sendSignal(signalId, retryCount = 1) {
    const url = `https://api.nature.global/1/signals/${signalId}/send`;
    const options = {
      method: "post",
      headers: {
        "Authorization": `Bearer ${this.accessToken}`
      }
    };

    let i = 0;
    do {
      const reply = UrlFetchApp.fetch(url, options);
      i++;
    } while (i < retryCount);
  }

  change_cool() {
    this.sendSignal(this.signalIds.cool, 10);
  }

  change_warm() {
    this.sendSignal(this.signalIds.warm, 10);
  }

  off() {
    this.sendSignal(this.signalIds.off);
  }

  on() {
    this.sendSignal(this.signalIds.on);
  }

  turnOnLight() {
    const ACCESS_TOKEN = this.accessToken;
    const url = 'https://api.nature.global/1/appliances';
    const headers = {
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
    };
    const options = {
      'method': 'get',
      'headers': headers,
    };

    try {
      const response = UrlFetchApp.fetch(url, options);
      const appliances = JSON.parse(response.getContentText());

      const lightNickname = '照明';

      for (let i = 0; i < appliances.length; i++) {
        const appliance = appliances[i];
        if (appliance.nickname === lightNickname && appliance.type === 'LIGHT') {
          const applianceId = appliance.id;
          const controlUrl = `https://api.nature.global/1/appliances/${applianceId}/light`;
          const controlOptions = {
            'method': 'post',
            'headers': {
              'Authorization': 'Bearer ' + ACCESS_TOKEN,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            'payload': 'button=on',
          };
          UrlFetchApp.fetch(controlUrl, controlOptions);
          Logger.log('Light turned on!');
          return;
        }
      }
      Logger.log('Light not found.');
    } catch (e) {
      Logger.log('Error: ' + e.message);
    }
  }

  setLightColor(weather) {
    let signalId;
    if (weather.includes('晴')) {
      signalId = this.lightSignals["白色"];
    } else if (weather.includes('雨')) {
      signalId = this.lightSignals["黄色"];
    } else if (weather.includes('曇')) {
      signalId = this.lightSignals["白と黄色の中間色"];
    } else {
      Logger.log('Unknown weather condition: ' + weather);
      return { signalId: null, statusCode: null };
    }

    const options = {
      method: 'post',
      headers: {
        'Authorization': 'Bearer ' + this.accessToken
      }
    };
    const url = 'https://api.nature.global/1/signals/' + signalId + '/send';
    const response = UrlFetchApp.fetch(url, options);
    Logger.log('Response code: ' + response.getResponseCode());

    return { signalId, statusCode: response.getResponseCode() };
  }

  listRemoSignals() {
    const options = {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + this.accessToken
      }
    };
    const url = 'https://api.nature.global/1/appliances';
    const response = UrlFetchApp.fetch(url, options);
    const appliances = JSON.parse(response.getContentText());
    appliances.forEach(appliance => {
      Logger.log('Appliance: ' + appliance.nickname);
      appliance.signals.forEach(signal => {
        Logger.log('  Signal: ' + signal.name + ' (ID: ' + signal.id + ')');
      });
    });
  }
}

// グローバルインスタンス
const natureRemoControllerInstance = new NatureRemoController();

// 後方互換性のためのグローバル関数
function change_cool() {
  return natureRemoControllerInstance.change_cool();
}

function change_warm() {
  return natureRemoControllerInstance.change_warm();
}

function off() {
  return natureRemoControllerInstance.off();
}

function on() {
  return natureRemoControllerInstance.on();
}

function turnOnLight() {
  return natureRemoControllerInstance.turnOnLight();
}

function setLightColor(weather) {
  return natureRemoControllerInstance.setLightColor(weather);
}

function listRemoSignals() {
  return natureRemoControllerInstance.listRemoSignals();
}
