class NatureRemoController {
  constructor() {
    this.accessToken = (typeof configInstance !== 'undefined') ? configInstance.REMO_TOKEN : "ory_at_VXpeuuSNUAC0381bEDo2RZcjKekoh9LI6NtB0tMRDRg.Mp78KMyOtmX8c3nn-bORMu1EQHab9x5GFUIqnJtT9lk";
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
      },
      muteHttpExceptions: true // エラーレスポンスを詳細に取得
    };

    let i = 0;
    do {
      try {
        const reply = UrlFetchApp.fetch(url, options);
        if (reply.getResponseCode() !== 200) {
          Logger.log(`Error sending signal ${signalId}: ${reply.getResponseCode()} - ${reply.getContentText()}`);
          return { success: false, error: reply.getContentText() };
        }
        Logger.log(`Signal ${signalId} sent successfully`);
        return { success: true };
      } catch (error) {
        Logger.log(`Error sending signal ${signalId}: ${error.toString()}`);
        return { success: false, error: error.toString() };
      }
      i++;
    } while (i < retryCount);
  }

  // 利用可能な信号IDを取得する関数
  listAvailableSignals() {
    const url = 'https://api.nature.global/1/appliances';
    const options = {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      },
      muteHttpExceptions: true
    };

    try {
      const response = UrlFetchApp.fetch(url, options);
      if (response.getResponseCode() !== 200) {
        Logger.log(`Error getting appliances: ${response.getResponseCode()} - ${response.getContentText()}`);
        return null;
      }
      
      const appliances = JSON.parse(response.getContentText());
      Logger.log("Available appliances and signals:");
      
      appliances.forEach(appliance => {
        Logger.log(`Appliance: ${appliance.nickname} (${appliance.type})`);
        Logger.log(`  ID: ${appliance.id}`);
        
        if (appliance.signals && appliance.signals.length > 0) {
          appliance.signals.forEach(signal => {
            Logger.log(`  Signal: ${signal.name} - ID: ${signal.id}`);
          });
        } else {
          Logger.log("  No signals found for this appliance");
        }
        
        // エアコンの場合は、個別の信号情報を確認
        if (appliance.type === 'AC') {
          Logger.log("  This is an AC appliance - checking for direct control options");
          if (appliance.settings) {
            Logger.log("  Settings available: " + JSON.stringify(appliance.settings));
          }
        }
        
        Logger.log("  Full appliance data: " + JSON.stringify(appliance, null, 2));
      });
      
      return appliances;
    } catch (error) {
      Logger.log(`Error listing signals: ${error.toString()}`);
      return null;
    }
  }

  change_cool() {
    // エアコンの直接制御を試す
    const acResult = this.controlAC('on', 20, 'cool');
    if (acResult.success) {
      return acResult;
    }
    
    // フォールバック: 古い信号送信方式
    Logger.log("エアコン直接制御失敗、信号送信を試行");
    return this.sendSignal(this.signalIds.cool, 10);
  }

  change_warm() {
    // エアコンの直接制御を試す
    const acResult = this.controlAC('on', 25, 'warm');
    if (acResult.success) {
      return acResult;
    }
    
    // フォールバック: 古い信号送信方式
    Logger.log("エアコン直接制御失敗、信号送信を試行");
    return this.sendSignal(this.signalIds.warm, 10);
  }

  off() {
    // エアコンの直接制御を試す
    const acResult = this.controlAC('off');
    if (acResult.success) {
      return acResult;
    }
    
    // フォールバック: 古い信号送信方式
    Logger.log("エアコン直接制御失敗、信号送信を試行");
    return this.sendSignal(this.signalIds.off, 1);
  }

  on() {
    // エアコンの直接制御を試す
    const acResult = this.controlAC('on');
    if (acResult.success) {
      return acResult;
    }
    
    // フォールバック: 古い信号送信方式
    Logger.log("エアコン直接制御失敗、信号送信を試行");
    return this.sendSignal(this.signalIds.on);
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

  // エアコンの直接制御（新しいアプローチ）
  controlAC(power, temperature = null, mode = null) {
    const url = 'https://api.nature.global/1/appliances';
    const options = {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      },
      muteHttpExceptions: true
    };

    try {
      const response = UrlFetchApp.fetch(url, options);
      if (response.getResponseCode() !== 200) {
        Logger.log(`Error getting appliances: ${response.getResponseCode()} - ${response.getContentText()}`);
        return { success: false, error: response.getContentText() };
      }
      
      const appliances = JSON.parse(response.getContentText());
      const ac = appliances.find(app => app.type === 'AC');
      
      if (!ac) {
        Logger.log("エアコンが見つかりません");
        return { success: false, error: "エアコンが見つかりません" };
      }
      
      // エアコンの制御URL
      const controlUrl = `https://api.nature.global/1/appliances/${ac.id}/aircon_settings`;
      
      // パラメータを構築
      let payload = `button=${power}`;
      if (temperature !== null) {
        payload += `&temperature=${temperature}`;
      }
      if (mode !== null) {
        payload += `&operation_mode=${mode}`;
      }
      
      const controlOptions = {
        method: 'post',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        payload: payload,
        muteHttpExceptions: true
      };
      
      Logger.log(`エアコン制御: ${payload}`);
      const controlResponse = UrlFetchApp.fetch(controlUrl, controlOptions);
      
      if (controlResponse.getResponseCode() !== 200) {
        Logger.log(`エアコン制御エラー: ${controlResponse.getResponseCode()} - ${controlResponse.getContentText()}`);
        return { success: false, error: controlResponse.getContentText() };
      }
      
      Logger.log(`エアコン制御成功: ${power}`);
      return { success: true };
      
    } catch (error) {
      Logger.log(`エラー: ${error.toString()}`);
      return { success: false, error: error.toString() };
    }
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
