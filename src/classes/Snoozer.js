// snoozer.js - 曜日別アラーム機能を含むアラーム処理クラス

class Snoozer {
  constructor() {
    // 依存関係は遅延初期化で解決
    this._alarmController = null;
    this._spreadsheetController = null;
    this._weatherController = null;
    this._natureRemoController = null;
    this._lineController = null;
    
    // 通常アラーム用スプレッドシート
    this.normalAlarmSheetId = "1t6Wl8y2K7Fo0QPPCvyUh461nSdGWC709wm_JSv_eddg"; // 実際のIDに置き換え
    // 毎週アラーム用スプレッドシート
    this.weeklyAlarmSheetId = "1t6Wl8y2K7Fo0QPPCvyUh461nSdGWC709wm_JSv_eddg"; // 実際のIDに置き換え
  }

  get alarmController() {
    if (!this._alarmController) {
      this._alarmController = typeof alarmControllerInstance !== 'undefined' ? alarmControllerInstance : new AlarmController();
    }
    return this._alarmController;
  }

  get spreadsheetController() {
    if (!this._spreadsheetController) {
      this._spreadsheetController = typeof spreadsheetControllerInstance !== 'undefined' ? spreadsheetControllerInstance : new SpreadsheetController();
    }
    return this._spreadsheetController;
  }

  get weatherController() {
    if (!this._weatherController) {
      this._weatherController = typeof weatherControllerInstance !== 'undefined' ? weatherControllerInstance : new WeatherController();
    }
    return this._weatherController;
  }

  get natureRemoController() {
    if (!this._natureRemoController) {
      this._natureRemoController = typeof natureRemoControllerInstance !== 'undefined' ? natureRemoControllerInstance : new NatureRemoController();
    }
    return this._natureRemoController;
  }

  get lineController() {
    if (!this._lineController) {
      this._lineController = typeof lineControllerInstance !== 'undefined' ? lineControllerInstance : new LineController();
    }
    return this._lineController;
  }

  // 通常アラーム・毎週アラーム両方をチェック
  checkAndSendAlarms() {
    this.checkNormalAlarms();
    this.checkWeeklyAlarms();
  }

  // 通常アラーム（1回きり）をチェック
  checkNormalAlarms() {
    const normalSS = SpreadsheetApp.openById(this.normalAlarmSheetId);
    const normalSheet = normalSS.getSheetByName("シート1");
    const normalData = normalSheet.getDataRange().getValues();
    
    const now = new Date();
    const nowStr = Utilities.formatDate(now, "Asia/Tokyo", "yyyyMMddHHmm");

    for (let i = 1; i < normalData.length; i++) {
      const alarmTime = String(normalData[i][2]);
      if (/^\d{10}$/.test(alarmTime)) {
        const alarmDate = this.parseAlarmTime(alarmTime);
        if (alarmDate && Math.abs(alarmDate.getTime() - now.getTime()) < 60000) { // 1分以内
          const userId = normalData[i][1];
          this.triggerAlarm(userId, "アラーム時刻になりました: " + this.formatAlarmTime(alarmTime));
          // 1回きりなので削除
          normalSheet.deleteRow(i + 1);
          i--;
        }
      }
    }
  }

  // 毎週アラーム（定期）をチェック
  checkWeeklyAlarms() {
    const weeklySS = SpreadsheetApp.openById(this.weeklyAlarmSheetId);
    const weeklySheet = weeklySS.getSheetByName("シート1");
    const weeklyData = weeklySheet.getDataRange().getValues();
    
    const now = new Date();
    const nowWeekday = now.getDay(); // 0:日, 1:月, ..., 6:土
    const nowTime = Utilities.formatDate(now, "Asia/Tokyo", "HHmm");

    for (let j = 1; j < weeklyData.length; j++) {
      const userId = weeklyData[j][0];
      const weekNum = Number(weeklyData[j][1]);
      const timeStr = weeklyData[j][2];
      
      if (weekNum === nowWeekday && timeStr === nowTime) {
        const weekdayName = this.getJpWeekday(weekNum);
        const message = `毎週アラーム時刻になりました: ${weekdayName}曜${timeStr.slice(0,2)}時${timeStr.slice(2)}分`;
        this.triggerAlarm(userId, message);
      }
    }
  }

  // アラーム発火処理
  triggerAlarm(userId, message) {
    // 照明をオン
    this.natureRemoController.on();
    
    // 天気に応じて照明色を変更
    const weather = this.weatherController.getOsakaWeather();
    const lightColor = this.weatherController.decideLightColor(weather);
    
    if (lightColor === "白色") {
      this.natureRemoController.change_cool();
    } else if (lightColor === "黄色") {
      this.natureRemoController.change_warm();
    }
    
    // LINE通知
    this.sendLineNotify(userId, message);
    
    // アラームコントローラーを呼び出し
    this.alarmController.alarmController();
  }

  // LINE通知
  sendLineNotify(userId, text) {
    const url = "https://api.line.me/v2/bot/message/push";
    const headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + ((typeof configInstance !== 'undefined') ? configInstance.CHANNEL_ACCESS_TOKEN : "hcre+X+7tc46fUoPuGgBopw/QccQtgRkhODt0y1ZX0W2e4ddE+3/Ua7E3sJEIcsfN7SMprAofrKzsm7HNG4URLgY7T66N+kbsZExQtvviZqJn4Cxadam/TkJH3ddgLLKiGpmTRraPNyyv/AxfGWo9gdB04t89/1O/w1cDnyilFU=")
    };
    const postData = {
      "to": userId,
      "messages": [{ "type": "text", "text": text }]
    };
    const options = {
      "method": "post",
      "headers": headers,
      "payload": JSON.stringify(postData)
    };
    UrlFetchApp.fetch(url, options);
  }

  // 日時文字列→Date
  parseAlarmTime(str) {
    if (!/^\d{10}$/.test(str)) return null;
    const year = 2000 + parseInt(str.slice(0,2),10);
    const month = parseInt(str.slice(2,4),10) - 1;
    const day = parseInt(str.slice(4,6),10);
    const hour = parseInt(str.slice(6,8),10);
    const min = parseInt(str.slice(8,10),10);
    return new Date(year, month, day, hour, min);
  }

  // 日時フォーマット
  formatAlarmTime(str) {
    if (!/^\d{10}$/.test(str)) return str;
    const y = "20" + str.slice(0,2);
    const m = str.slice(2,4);
    const d = str.slice(4,6);
    const h = str.slice(6,8);
    const min = str.slice(8,10);
    return y + "年" + m + "月" + d + "日" + h + "時" + min + "分";
  }

  // 曜日番号→日本語
  getJpWeekday(num) {
    const map = ["日", "月", "火", "水", "木", "金", "土"];
    return map[num];
  }

  // 日の出・日の入り時刻での自動照明制御
  checkSunriseSunset() {
    const now = new Date();
    const nowTime = this.weatherController.formatDate(now);
    const sunrise = this.weatherController.getDailySunrise();
    const sunset = this.weatherController.getDailySunset();
    
    if (nowTime === sunrise || nowTime === sunset) {
      Logger.log(`日の出/日の入り時刻: ${nowTime}`);
      this.triggerAlarm("system", "日の出/日の入り時刻になりました");
    }
  }

  // 毎週アラームをrecieverから継承した処理でスプレッドシートに保存
  saveWeeklyAlarm(userId, weekDay, timeStr) {
    const weeklySS = SpreadsheetApp.openById(this.weeklyAlarmSheetId);
    const weeklySheet = weeklySS.getSheetByName("シート1");
    
    // ヘッダーがない場合は追加
    if (weeklySheet.getLastRow() === 0) {
      weeklySheet.appendRow(["userId", "weekDayNum", "timeStr"]);
    }
    
    // 既存の同じユーザー・同じ曜日を削除
    const data = weeklySheet.getDataRange().getValues();
    for (let i = data.length - 1; i > 0; i--) {
      if (String(data[i][0]) === String(userId) && Number(data[i][1]) === weekDay) {
        weeklySheet.deleteRow(i + 1);
      }
    }
    
    // 新しいアラームを追加
    weeklySheet.appendRow([userId, weekDay, timeStr]);
  }

  // 毎週アラーム一覧取得
  getWeeklyAlarms(userId) {
    const weeklySS = SpreadsheetApp.openById(this.weeklyAlarmSheetId);
    const weeklySheet = weeklySS.getSheetByName("シート1");
    const data = weeklySheet.getDataRange().getValues();
    const alarms = [];
    
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(userId)) {
        const weekDay = Number(data[i][1]);
        const timeStr = data[i][2];
        alarms.push({
          weekDay: weekDay,
          timeStr: timeStr,
          text: `${this.getJpWeekday(weekDay)}曜 ${timeStr.slice(0,2)}:${timeStr.slice(2)}`
        });
      }
    }
    
    return alarms;
  }

  // 毎週アラーム削除
  deleteWeeklyAlarm(userId, weekDay, timeStr) {
    const weeklySS = SpreadsheetApp.openById(this.weeklyAlarmSheetId);
    const weeklySheet = weeklySS.getSheetByName("シート1");
    const data = weeklySheet.getDataRange().getValues();
    
    for (let i = data.length - 1; i > 0; i--) {
      if (String(data[i][0]) === String(userId) && 
          Number(data[i][1]) === weekDay && 
          data[i][2] === timeStr) {
        weeklySheet.deleteRow(i + 1);
        return true;
      }
    }
    return false;
  }
}

// グローバルインスタンス
const snoozerInstance = new Snoozer();

// GAS時間主導型トリガー用の関数
function sendAlarms() {
  return snoozerInstance.checkAndSendAlarms();
}

// 日の出・日の入りチェック用関数
function checkSunTimes() {
  return snoozerInstance.checkSunriseSunset();
}

// 毎週アラーム管理用関数
function saveWeeklyAlarm(userId, weekDay, timeStr) {
  return snoozerInstance.saveWeeklyAlarm(userId, weekDay, timeStr);
}

function getWeeklyAlarms(userId) {
  return snoozerInstance.getWeeklyAlarms(userId);
}

function deleteWeeklyAlarm(userId, weekDay, timeStr) {
  return snoozerInstance.deleteWeeklyAlarm(userId, weekDay, timeStr);
}
