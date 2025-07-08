// MainApp.js - 各クラスのインスタンスを統合する軽量なラッパー

class MainApp {
  constructor() {
    // 依存関係は遅延初期化で解決
    this._config = null;
    this._natureRemoController = null;
    this._weatherController = null;
    this._lineController = null;
    this._spreadsheetController = null;
    this._alarmController = null;
    this._lineReceiver = null;
    this._snoozer = null;
  }

  get config() {
    if (!this._config) {
      if (typeof configInstance !== 'undefined') {
        this._config = configInstance;
      } else {
        // フォールバック: 本設定値
        this._config = {
          CHANNEL_ACCESS_TOKEN: "hcre+X+7tc46fUoPuGgBopw/QccQtgRkhODt0y1ZX0W2e4ddE+3/Ua7E3sJEIcsfN7SMprAofrKzsm7HNG4URLgY7T66N+kbsZExQtvviZqJn4Cxadam/TkJH3ddgLLKiGpmTRraPNyyv/AxfGWo9gdB04t89/1O/w1cDnyilFU=",
          YOUR_EMAIL_ADRESS: "yuto721831@gmail.com",
          REMO_TOKEN: "ory_at_-k01LALh-Ca5yJKhiG8kYJs12OHZlScpRSAUqxp14YE.ddBxAUY8u8916Gx66rtu9paZryKp5CUOJEYAs5b2KgI",
          key: function() { return this.REMO_TOKEN; },
          alarmKey: function() { return this.CHANNEL_ACCESS_TOKEN; },
          alarmID: function() { return "U5b1391f394868ed64c15cd6fb5034ae9"; }
        };
      }
    }
    return this._config;
  }

  get natureRemoController() {
    if (!this._natureRemoController) {
      if (typeof natureRemoControllerInstance !== 'undefined') {
        this._natureRemoController = natureRemoControllerInstance;
      } else if (typeof NatureRemoController !== 'undefined') {
        this._natureRemoController = new NatureRemoController();
      } else {
        Logger.log("Warning: NatureRemoController not available");
        this._natureRemoController = null;
      }
    }
    return this._natureRemoController;
  }

  get weatherController() {
    if (!this._weatherController) {
      if (typeof weatherControllerInstance !== 'undefined') {
        this._weatherController = weatherControllerInstance;
      } else if (typeof WeatherController !== 'undefined') {
        this._weatherController = new WeatherController();
      } else {
        Logger.log("Warning: WeatherController not available");
        this._weatherController = null;
      }
    }
    return this._weatherController;
  }

  get lineController() {
    if (!this._lineController) {
      if (typeof lineControllerInstance !== 'undefined') {
        this._lineController = lineControllerInstance;
      } else if (typeof LineController !== 'undefined') {
        this._lineController = new LineController();
      } else {
        Logger.log("Warning: LineController not available");
        this._lineController = null;
      }
    }
    return this._lineController;
  }

  get spreadsheetController() {
    if (!this._spreadsheetController) {
      if (typeof spreadsheetControllerInstance !== 'undefined') {
        this._spreadsheetController = spreadsheetControllerInstance;
      } else if (typeof SpreadsheetController !== 'undefined') {
        this._spreadsheetController = new SpreadsheetController();
      } else {
        Logger.log("Warning: SpreadsheetController not available");
        this._spreadsheetController = null;
      }
    }
    return this._spreadsheetController;
  }

  get alarmController() {
    if (!this._alarmController) {
      if (typeof alarmControllerInstance !== 'undefined') {
        this._alarmController = alarmControllerInstance;
      } else if (typeof AlarmController !== 'undefined') {
        this._alarmController = new AlarmController();
      } else {
        Logger.log("Warning: AlarmController not available");
        this._alarmController = null;
      }
    }
    return this._alarmController;
  }

  get lineReceiver() {
    if (!this._lineReceiver) {
      if (typeof lineReceiverInstance !== 'undefined') {
        this._lineReceiver = lineReceiverInstance;
      } else if (typeof LineReceiver !== 'undefined') {
        this._lineReceiver = new LineReceiver();
      } else {
        Logger.log("Warning: LineReceiver not available");
        this._lineReceiver = null;
      }
    }
    return this._lineReceiver;
  }

  get snoozer() {
    if (!this._snoozer) {
      if (typeof snoozerInstance !== 'undefined') {
        this._snoozer = snoozerInstance;
      } else if (typeof Snoozer !== 'undefined') {
        this._snoozer = new Snoozer();
      } else {
        Logger.log("Warning: Snoozer not available");
        this._snoozer = null;
      }
    }
    return this._snoozer;
  }

  // 主要な関数のみ提供（詳細な実装は各クラスに委譲）
  doPost(e) {
    return this.lineReceiver.doPost(e);
  }

  sendAlarmMail() {
    return this.alarmController.sendAlarmMail();
  }

  sendWeeklyAlarmMail() {
    return this.alarmController.sendWeeklyAlarmMail();
  }

  lightController() {
    return this.alarmController.lightController();
  }

  alarmController() {
    return this.alarmController.alarmController();
  }

  // ===== 照明制御関数 =====
  on() {
    return this.natureRemoController.on();
  }

  off() {
    return this.natureRemoController.off();
  }

  change_cool() {
    return this.natureRemoController.change_cool();
  }

  change_warm() {
    return this.natureRemoController.change_warm();
  }

  turnOnLight() {
    return this.natureRemoController.turnOnLight();
  }

  setLightColor(weather) {
    return this.natureRemoController.setLightColor(weather);
  }

  listRemoSignals() {
    return this.natureRemoController.listRemoSignals();
  }

  listAvailableSignals() {
    return this.natureRemoController.listAvailableSignals();
  }

  // ===== 天気・日時関連関数 =====
  getOsakaWeather() {
    return this.weatherController.getOsakaWeather();
  }

  getDailySunrise() {
    return this.weatherController.getDailySunrise();
  }

  getDailySunset() {
    return this.weatherController.getDailySunset();
  }

  decideLightColor(weather) {
    return this.weatherController.decideLightColor(weather);
  }

  formatDate(date) {
    return this.weatherController.formatDate(date);
  }

  getWeather() {
    return this.weatherController.getWeather();
  }

  logResult(weather, signalId, statusCode) {
    return this.weatherController.logResult(weather, signalId, statusCode);
  }

  main() {
    return this.weatherController.main();
  }

  // ===== LINE関連関数 =====
  sendLineMessage(userId = null, messageText = null) {
    return this.lineController.sendLineMessage(userId, messageText);
  }

  // ===== スプレッドシート関連関数 =====
  clearDColumnWeekly() {
    return this.spreadsheetController.clearDColumnWeekly();
  }

  formatAlarmTime(str) {
    return this.spreadsheetController.formatAlarmTime(str);
  }

  parseAlarmTime(str) {
    return this.spreadsheetController.parseAlarmTime(str);
  }

  // ===== 設定関連関数 =====
  key() {
    return this.config.key();
  }

  alarmKey() {
    return this.config.alarmKey();
  }

  alarmID() {
    return this.config.alarmID();
  }

  // ===== Snoozer関連関数 =====
  sendAlarms() {
    return this.snoozer.checkAndSendAlarms();
  }

  checkSunTimes() {
    return this.snoozer.checkSunriseSunset();
  }

  saveWeeklyAlarm(userId, weekDay, timeStr) {
    return this.snoozer.saveWeeklyAlarm(userId, weekDay, timeStr);
  }

  getWeeklyAlarms(userId) {
    return this.snoozer.getWeeklyAlarms(userId);
  }

  deleteWeeklyAlarm(userId, weekDay, timeStr) {
    return this.snoozer.deleteWeeklyAlarm(userId, weekDay, timeStr);
  }
}

// グローバルインスタンス
const mainApp = new MainApp();

// ===== 従来の関数として公開 =====

// エントリーポイント
function doPost(e) {
  return mainApp.doPost(e);
}

function sendAlarmMail() {
  return mainApp.sendAlarmMail();
}

function sendWeeklyAlarmMail() {
  return mainApp.sendWeeklyAlarmMail();
}

function lightController() {
  return mainApp.lightController();
}

function alarmController() {
  return mainApp.alarmController();
}

// 照明制御
function on() {
  return mainApp.on();
}

function off() {
  return mainApp.off();
}

function change_cool() {
  return mainApp.change_cool();
}

function change_warm() {
  return mainApp.change_warm();
}

function turnOnLight() {
  return mainApp.turnOnLight();
}

function setLightColor(weather) {
  return mainApp.setLightColor(weather);
}

function listRemoSignals() {
  return mainApp.listRemoSignals();
}

// 天気・日時
function getOsakaWeather() {
  return mainApp.getOsakaWeather();
}

function getDailySunrise() {
  return mainApp.getDailySunrise();
}

function getDailySunset() {
  return mainApp.getDailySunset();
}

function decideLightColor(weather) {
  return mainApp.decideLightColor(weather);
}

function formatDate(date) {
  return mainApp.formatDate(date);
}

function getWeather() {
  return mainApp.getWeather();
}

function logResult(weather, signalId, statusCode) {
  return mainApp.logResult(weather, signalId, statusCode);
}

function main() {
  return mainApp.main();
}

// LINE
function sendLineMessage(userId = null, messageText = null) {
  return mainApp.sendLineMessage(userId, messageText);
}

// スプレッドシート
function clearDColumnWeekly() {
  return mainApp.clearDColumnWeekly();
}

function formatAlarmTime(str) {
  return mainApp.formatAlarmTime(str);
}

function parseAlarmTime(str) {
  return mainApp.parseAlarmTime(str);
}

// 設定
function key() {
  return mainApp.key();
}

function alarmKey() {
  return mainApp.alarmKey();
}

function alarmID() {
  return mainApp.alarmID();
}

// Snoozer
function sendAlarms() {
  return mainApp.sendAlarms();
}

function checkSunTimes() {
  return mainApp.checkSunTimes();
}

function saveWeeklyAlarm(userId, weekDay, timeStr) {
  return mainApp.saveWeeklyAlarm(userId, weekDay, timeStr);
}

function getWeeklyAlarms(userId) {
  return mainApp.getWeeklyAlarms(userId);
}

function deleteWeeklyAlarm(userId, weekDay, timeStr) {
  return mainApp.deleteWeeklyAlarm(userId, weekDay, timeStr);
}

// 注意: 定数をグローバルに公開するとclasp pushで重複エラーが発生するため
// 必要な場合は以下の関数を使用してください:
// - key() または configInstance.REMO_TOKEN
// - alarmKey() または configInstance.CHANNEL_ACCESS_TOKEN
// - configInstance.YOUR_EMAIL_ADRESS

// グローバルインスタンス
const mainAppInstance = new MainApp();
