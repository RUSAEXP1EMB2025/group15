class LineReceiver {
  constructor() {
    // 依存関係は遅延初期化で解決
    this._spreadsheetController = null;
    this._lineController = null;
    this._natureRemoController = null;
    this._alarmController = null;
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

  get alarmController() {
    if (!this._alarmController) {
      this._alarmController = typeof alarmControllerInstance !== 'undefined' ? alarmControllerInstance : new AlarmController();
    }
    return this._alarmController;
  }

  doPost(e) {
    const json = JSON.parse(e.postData.contents);
    const sheet = this.spreadsheetController.getSheet("シート1");
    const alarmSheet = this.spreadsheetController.getSheet("シート1");

    // 毎週アラーム用のシート
    const weeklySheet = this.spreadsheetController.getSheet("weekly");
    if (weeklySheet.getLastRow() === 0) {
      weeklySheet.appendRow(["userId", "weekDayNum", "timeStr"]);
    }

    if (json.events && json.events[0] && json.events[0].type === "message") {
      const userId = json.events[0].source.userId;
      const message = json.events[0].message.text;
      const date = new Date();
      const replyToken = json.events[0].replyToken;

      const stateSheet = this.spreadsheetController.getSheet("state");
      if (stateSheet.getLastRow() === 0) {
        stateSheet.appendRow(["userId", "status", "alarmIndexes"]);
      }

      const states = stateSheet.getDataRange().getValues();
      const userRow = states.findIndex(row => String(row[0]) === String(userId));
      const userStatus = userRow >= 0 ? states[userRow][1] : "";
      let replyText = "";
      const alarmTimePattern = /^\d{10}$/;

      // ---------------------- 毎週アラーム ----------------------
      if (message === "毎週アラーム設定") {
        replyText = "毎週何曜日の何時にアラームを設定しますか？\n例: 火曜 07:00";
        if (userRow >= 0) {
          stateSheet.getRange(userRow + 1, 2).setValue("wait_weekly_alarm");
        } else {
          stateSheet.appendRow([userId, "wait_weekly_alarm", ""]);
        }
      }
      else if (userStatus === "wait_weekly_alarm") {
        const weekDayMatch = message.match(/(日|月|火|水|木|金|土)曜?\s*([0-2]?\d)(?::|時)?([0-5]?\d)?/);
        if (weekDayMatch) {
          const weekDayStr = weekDayMatch[1];
          const hour = String(weekDayMatch[2]).padStart(2, '0');
          const min = weekDayMatch[3] ? String(weekDayMatch[3]).padStart(2, '0') : '00';
          const weekDayNum = ["日", "月", "火", "水", "木", "金", "土"].indexOf(weekDayStr);
          if (weekDayNum >= 0) {
            const timeStr = hour + min;
            const weeklyData = weeklySheet.getDataRange().getValues();
            // 既存の同じユーザー・同じ曜日を削除
            for (let i = weeklyData.length - 1; i > 0; i--) {
              if (String(weeklyData[i][0]) === String(userId) && Number(weeklyData[i][1]) === weekDayNum) {
                weeklySheet.deleteRow(i + 1);
              }
            }
            weeklySheet.appendRow([userId, weekDayNum, "'" + timeStr]);
            replyText = "毎週" + "日月火水木金土".charAt(weekDayNum) + "曜 " + hour + ":" + min + " にアラームを設定しました。";
            stateSheet.getRange(userRow + 1, 2).setValue("");
          } else {
            replyText = "曜日が認識できません。もう一度「火曜 07:00」などの形式で入力してください。";
          }
        } else {
          replyText = "形式が正しくありません。「火曜 07:00」などの形式で入力してください。";
        }
      }
      // ★ 毎週アラーム一覧（いちらん）
      else if (message === "いちらん") {
        replyText = this.getWeeklyAlarmList(userId);
      }
      // ★ 毎週アラーム解除（かいじょ）
      else if (message === "かいじょ") {
        replyText = this.showWeeklyAlarmDeletion(userId, userRow, stateSheet);
      }
      else if (userStatus === "wait_delete_weekly_alarm" && /^\d+$/.test(message)) {
        replyText = this.deleteWeeklyAlarm(userId, message, userRow, states, stateSheet);
      }
      // ------------------- 単発アラーム -------------------
      else if (message === "アラーム一覧") {
        replyText = this.getAlarmList(userId, alarmSheet);
        sheet.appendRow([date, userId, message]);
      }
      else if (message === "アラーム解除") {
        replyText = this.showAlarmDeletion(userId, alarmSheet, userRow, stateSheet);
        sheet.appendRow([date, userId, message]);
      }
      else if (userStatus === "wait_delete_alarm" && /^\d+$/.test(message)) {
        replyText = this.deleteAlarm(userId, message, userRow, states, stateSheet, alarmSheet);
        sheet.appendRow([date, userId, "アラーム削除リクエスト:" + message]);
      }
      // ------------------- 目覚まし設定（単発） -------------------
      else if (message === "目覚まし設定") {
        replyText = "起床時間をYYMMDDhhmm形式で入力してください";
        if (userRow >= 0) {
          stateSheet.getRange(userRow + 1, 2).setValue("wait_alarm_time");
        } else {
          stateSheet.appendRow([userId, "wait_alarm_time", ""]);
        }
        sheet.appendRow([date, userId, message]);
      }
      else if (userStatus === "wait_alarm_time" && alarmTimePattern.test(message)) {
        alarmSheet.appendRow([date, userId, message]);
        replyText = "登録されました";
        stateSheet.getRange(userRow + 1, 2).setValue("");
        sheet.appendRow([date, userId, message]);
      }
      else if (userStatus === "wait_alarm_time") {
        replyText = "起床時間をYYMMDDhhmm形式で入力してください";
      }
      // ------------------- 照明制御 -------------------
      else if (message == "オン") {
        this.natureRemoController.on();
        replyText = "照明をオンにしました";
      }
      else if (message == "オフ") {
        this.natureRemoController.off();
        replyText = "照明をオフにしました";
      }
      else {
        const props = PropertiesService.getScriptProperties();
        props.setProperty('stopSending', 'true'); // フラグを立てる
        Logger.log('ユーザーからメッセージを受信。送信停止フラグを設定しました。');
        return ContentService.createTextOutput(JSON.stringify({ status: 'ok' })).setMimeType(ContentService.MimeType.JSON);
      }

      // 返信送信
      if (replyText !== undefined && replyText !== null && replyText !== "") {
        this.lineController.sendReplyMessage(replyToken, replyText);
      }
    }
    return ContentService.createTextOutput("OK");
  }

  getWeeklyAlarmList(userId) {
    const weeklySheet = this.spreadsheetController.getSheet("weekly");
    const weeklyData = weeklySheet.getDataRange().getValues();
    const alarms = [];
    
    for (let i = 0; i < weeklyData.length; i++) {
      const uid = typeof weeklyData[i][0] === "string" ? weeklyData[i][0].trim() : String(weeklyData[i][0]);
      if (uid === userId) {
        const weekDayNum = Number(weeklyData[i][1]);
        let t = weeklyData[i][2];
        if (typeof t === "string" && t.charAt(0) === "'") t = t.slice(1);
        alarms.push({
          weekDayNum: weekDayNum,
          timeStr: t,
          text: "・" + "日月火水木金土".charAt(weekDayNum) + "曜 " + t.slice(0, 2) + ":" + t.slice(2, 4)
        });
      }
    }
    
    // 曜日→時間で昇順ソート
    alarms.sort((a, b) => {
      if (a.weekDayNum !== b.weekDayNum) return a.weekDayNum - b.weekDayNum;
      return a.timeStr.localeCompare(b.timeStr);
    });
    
    if (alarms.length === 0) {
      return "毎週アラームは登録されていません。";
    } else {
      return "登録されている毎週アラーム：\n" + alarms.map(a => a.text).join("\n");
    }
  }

  showWeeklyAlarmDeletion(userId, userRow, stateSheet) {
    const weeklySheet = this.spreadsheetController.getSheet("weekly");
    const weeklyData = weeklySheet.getDataRange().getValues();
    const alarms = [];
    const alarmIndexes = [];
    
    for (let i = 0; i < weeklyData.length; i++) {
      const uid = typeof weeklyData[i][0] === "string" ? weeklyData[i][0].trim() : String(weeklyData[i][0]);
      if (uid === userId) {
        const weekDayNum = Number(weeklyData[i][1]);
        let t = weeklyData[i][2];
        if (typeof t === "string" && t.charAt(0) === "'") t = t.slice(1);
        alarms.push({
          weekDayNum: weekDayNum,
          timeStr: t,
          row: i + 1,
          text: null
        });
        alarmIndexes.push(i + 1);
      }
    }
    
    // 曜日→時間で昇順ソート
    alarms.sort((a, b) => {
      if (a.weekDayNum !== b.weekDayNum) return a.weekDayNum - b.weekDayNum;
      return a.timeStr.localeCompare(b.timeStr);
    });
    
    // 番号振り直し
    for (let j = 0; j < alarms.length; j++) {
      alarms[j].text = (j + 1) + ": " + "日月火水木金土".charAt(alarms[j].weekDayNum) + "曜 " + alarms[j].timeStr.slice(0, 2) + ":" + alarms[j].timeStr.slice(2, 4);
      alarmIndexes[j] = alarms[j].row;
    }
    
    if (alarms.length === 0) {
      return "毎週アラームは登録されていません。";
    } else {
      const replyText = "登録されている毎週アラーム：\n" + alarms.map(a => a.text).join("\n") + "\n削除したいアラームの番号を送信してください。";
      if (userRow >= 0) {
        stateSheet.getRange(userRow + 1, 2).setValue("wait_delete_weekly_alarm");
        stateSheet.getRange(userRow + 1, 3).setValue(alarmIndexes.join(","));
      } else {
        stateSheet.appendRow([userId, "wait_delete_weekly_alarm", alarmIndexes.join(",")]);
      }
      return replyText;
    }
  }

  deleteWeeklyAlarm(userId, message, userRow, states, stateSheet) {
    const weeklySheet = this.spreadsheetController.getSheet("weekly");
    const alarmIndexesStr = states[userRow][2];
    
    if (alarmIndexesStr) {
      const alarmIndexes = alarmIndexesStr.split(",").map(Number);
      const idx = parseInt(message, 10) - 1;
      const delRow = alarmIndexes[idx];
      
      if (idx >= 0 && idx < alarmIndexes.length && delRow > 1 && delRow <= weeklySheet.getLastRow()) {
        weeklySheet.deleteRow(delRow);
        stateSheet.getRange(userRow + 1, 2, 1, 2).setValues([["", ""]]);
        return "毎週アラームを削除しました。";
      } else {
        return "正しい番号を送信してください。";
      }
    } else {
      return "もう一度「かいじょ」と送信してください。";
    }
  }

  getAlarmList(userId, alarmSheet) {
    const alarmData = alarmSheet.getDataRange().getValues();
    const userAlarms = [];
    const now = new Date();
    const alarmTimePattern = /^\d{10}$/;
    
    for (let i = 1; i < alarmData.length; i++) {
      const alarmTime = String(alarmData[i][2]);
      if (alarmData[i][1] === userId && alarmTimePattern.test(alarmTime)) {
        const alarmDate = this.spreadsheetController.parseAlarmTime(alarmTime);
        if (alarmDate && alarmDate >= now) {
          userAlarms.push({
            dateObj: alarmDate,
            text: this.spreadsheetController.formatAlarmTime(alarmTime)
          });
        }
      }
    }
    
    userAlarms.sort((a, b) => a.dateObj - b.dateObj);
    
    if (userAlarms.length === 0) {
      return "登録されているアラームはありません。";
    } else {
      let replyText = "登録アラーム一覧：\n";
      for (let j = 0; j < userAlarms.length; j++) {
        replyText += (j + 1) + ": " + userAlarms[j].text + "\n";
      }
      return replyText;
    }
  }

  showAlarmDeletion(userId, alarmSheet, userRow, stateSheet) {
    const alarmData = alarmSheet.getDataRange().getValues();
    const userAlarms = [];
    const alarmIndexes = [];
    const now = new Date();
    const alarmTimePattern = /^\d{10}$/;
    
    for (let i = 1; i < alarmData.length; i++) {
      const alarmTime = String(alarmData[i][2]);
      if (alarmData[i][1] === userId && alarmTimePattern.test(alarmTime)) {
        const alarmDate = this.spreadsheetController.parseAlarmTime(alarmTime);
        if (alarmDate && alarmDate >= now) {
          userAlarms.push({
            dateObj: alarmDate,
            text: this.spreadsheetController.formatAlarmTime(alarmTime),
            row: i + 1
          });
        }
      }
    }
    
    userAlarms.sort((a, b) => a.dateObj - b.dateObj);
    
    if (userAlarms.length === 0) {
      return "登録されているアラームはありません。";
    } else {
      let replyText = "登録アラーム一覧：\n";
      for (let j = 0; j < userAlarms.length; j++) {
        replyText += (j + 1) + ": " + userAlarms[j].text + "\n";
        alarmIndexes.push(userAlarms[j].row);
      }
      replyText += "削除したいアラームの番号を送信してください。";
      
      if (userRow >= 0) {
        stateSheet.getRange(userRow + 1, 2).setValue("wait_delete_alarm");
        stateSheet.getRange(userRow + 1, 3).setValue(alarmIndexes.join(","));
      } else {
        stateSheet.appendRow([userId, "wait_delete_alarm", alarmIndexes.join(",")]);
      }
      return replyText;
    }
  }

  deleteAlarm(userId, message, userRow, states, stateSheet, alarmSheet) {
    const alarmIndexesStr = states[userRow][2];
    
    if (alarmIndexesStr) {
      const alarmIndexes = alarmIndexesStr.split(",").map(Number);
      const idx = parseInt(message, 10) - 1;
      const delRow = alarmIndexes[idx];
      
      if (idx >= 0 && idx < alarmIndexes.length && delRow > 1 && delRow <= alarmSheet.getLastRow()) {
        alarmSheet.deleteRow(delRow);
        stateSheet.getRange(userRow + 1, 2, 1, 2).setValues([["", ""]]);
        return "アラームを削除しました。";
      } else {
        return "正しい番号を送信してください。";
      }
    } else {
      return "もう一度「アラーム解除」と送信してください。";
    }
  }
}

// グローバルインスタンス
const lineReceiverInstance = new LineReceiver();

// 従来の関数として公開
function doPost(e) {
  return lineReceiverInstance.doPost(e);
}
