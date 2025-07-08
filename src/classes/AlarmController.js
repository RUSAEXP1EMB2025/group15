class AlarmController {
  constructor() {
    // 依存関係は遅延初期化で解決
    this._spreadsheetController = null;
    this._lineController = null;
    this._natureRemoController = null;
    this._weatherController = null;
  }

  get spreadsheetController() {
    if (!this._spreadsheetController) {
      this._spreadsheetController = typeof spreadsheetControllerInstance !== 'undefined' ? spreadsheetControllerInstance : new SpreadsheetController();
    }
    return this._spreadsheetController;
  }

  get lineController() {
    if (!this._lineController) {
      this._lineController = typeof lineControllerInstance !== 'undefined' ? lineControllerInstance : new LineController();
    }
    return this._lineController;
  }

  get natureRemoController() {
    if (!this._natureRemoController) {
      this._natureRemoController = typeof natureRemoControllerInstance !== 'undefined' ? natureRemoControllerInstance : new NatureRemoController();
    }
    return this._natureRemoController;
  }

  get weatherController() {
    if (!this._weatherController) {
      this._weatherController = typeof weatherControllerInstance !== 'undefined' ? weatherControllerInstance : new WeatherController();
    }
    return this._weatherController;
  }

  alarmController() {
    // 初期化
    PropertiesService.getScriptProperties().deleteProperty('stopSending');
    Logger.log('送信停止フラグをリセットしました。');

    this.lineController.sendLineMessage();
  }

  sendAlarmMail() {
    const sheet = this.spreadsheetController.getSheet("シート1");
    const data = sheet.getDataRange().getValues();
    const now = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyMMddHHmm");
    const alarmPattern = /^\d{10}$/;
    let count = 0;

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const alarmTime = String(row[2]);
      const notified = row[3];
      
      if (alarmPattern.test(alarmTime) && alarmTime == now && !notified) {
        this.triggerAlarm();
        sheet.getRange(i + 1, 4).setValue("mailed at " + now);
        Logger.log("通知済み: row " + (i + 1) + " at " + now);
        count++;
        this.alarmController();
      }
    }

    if (count == 0 && (now == this.weatherController.getDailySunrise() || now == this.weatherController.getDailySunset())) {
      this.triggerAlarm();
      this.alarmController();
    }

    SpreadsheetApp.getUi().alert("完了！" + count + "件の行に通知済みを記録しました。");
  }

  sendWeeklyAlarmMail() {
    const sheet = this.spreadsheetController.getSheet("weekly");
    const data = sheet.getDataRange().getValues();
    const now = new Date();
    const nowWeekDay = now.getDay(); // 日:0, 月:1, ..., 土:6
    const hour = Utilities.formatDate(now, "Asia/Tokyo", "HH");
    const min = Utilities.formatDate(now, "Asia/Tokyo", "mm");
    const nowTimeStr = hour + min; // 例: "0800"

    let count = 0;
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const weekDayNum = Number(row[1]);
      let timeStr = String(row[2]);
      if (typeof timeStr === "string" && timeStr.charAt(0) === "'") {
        timeStr = timeStr.slice(1);
      }
      const notified = row[3];

      // 曜日・時刻一致かつ未通知
      if (weekDayNum === nowWeekDay && timeStr === nowTimeStr && !notified) {
        this.triggerAlarm();
        this.alarmController();
        this.lineController.sendEmail("おはようございます", "おはようございます");
        sheet.getRange(i + 1, 4).setValue("mailed at " + nowTimeStr);
        Logger.log("通知済み: row " + (i + 1) + " at " + nowTimeStr);
        count++;
      }
    }

    if (count == 0 && (Utilities.formatDate(now, "Asia/Tokyo", "yyMMddHHmm") == this.weatherController.getDailySunrise() || 
                     Utilities.formatDate(now, "Asia/Tokyo", "yyMMddHHmm") == this.weatherController.getDailySunset())) {
      this.triggerAlarm();
      this.alarmController();
    }
  }

  triggerAlarm() {
    this.natureRemoController.on();
    const weather = this.weatherController.getOsakaWeather();
    const lightColor = this.weatherController.decideLightColor(weather);
    
    if (lightColor == "白色") {
      this.natureRemoController.change_cool();
    } else if (lightColor == "黄色") {
      this.natureRemoController.change_warm();
    }
  }

  lightController() {
    // 現在の時刻取得  
    const now = new Date();
    // YYMMDDhhmmに変換
    const nowTime = this.weatherController.formatDate(now);
    Logger.log(nowTime);

    // 日の出判定
    if (nowTime == this.weatherController.getDailySunrise()) {
      Logger.log('Sunrise!');
      this.natureRemoController.turnOnLight();
    } else {
      Logger.log('NOT SunRise!');
    }

    // 日の入り判定
    if (nowTime == this.weatherController.getDailySunset()) {
      Logger.log('Sunset!');
      this.natureRemoController.turnOnLight();
    } else {
      Logger.log('NOT Sunset!');
    }
  }
}

// グローバルインスタンス
const alarmControllerInstance = new AlarmController();

// 従来の関数として公開
function alarmController() {
  return alarmControllerInstance.alarmController();
}

function sendAlarmMail() {
  return alarmControllerInstance.sendAlarmMail();
}

function sendWeeklyAlarmMail() {
  return alarmControllerInstance.sendWeeklyAlarmMail();
}

function lightController() {
  return alarmControllerInstance.lightController();
}
