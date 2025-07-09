function doPost(e) {
  var json = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var alarmSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("シート1");

  // 毎週アラーム用のシート
  var weeklySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("weekly");
  if (!weeklySheet) {
    weeklySheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("weekly");
    weeklySheet.appendRow(["userId", "weekDayNum", "timeStr"]);
  }

  if (json.events && json.events[0] && json.events[0].type === "message") {
    var userId = json.events[0].source.userId;
    var message = json.events[0].message.text;
    var date = new Date();
    var replyToken = json.events[0].replyToken;

    var replyUrl = "https://api.line.me/v2/bot/message/reply";
    var headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN
    };

    var stateSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("state");
    if (!stateSheet) {
      stateSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("state");
      stateSheet.appendRow(["userId", "status", "alarmIndexes"]);
    }
    var states = stateSheet.getDataRange().getValues();
    var userRow = states.findIndex(row => String(row[0]) === String(userId));
    var userStatus = userRow >= 0 ? states[userRow][1] : "";
    var replyText = "";
    var alarmTimePattern = /^\d{10}$/;

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
      var weekDayMatch = message.match(/(日|月|火|水|木|金|土)曜?\s*([0-2]?\d)(?::|時)?([0-5]?\d)?/);
      if (weekDayMatch) {
        var weekDayStr = weekDayMatch[1];
        var hour = String(weekDayMatch[2]).padStart(2, '0');
        var min = weekDayMatch[3] ? String(weekDayMatch[3]).padStart(2, '0') : '00';
        var weekDayNum = ["日", "月", "火", "水", "木", "金", "土"].indexOf(weekDayStr);
        if (weekDayNum >= 0) {
          var timeStr = hour + min;
          var weeklyData = weeklySheet.getDataRange().getValues();
          // 既存の同じユーザー・同じ曜日を削除
          for (var i = weeklyData.length - 1; i >= 0; i--) {
            if (
              String(weeklyData[i][0]) === String(userId) &&
              Number(weeklyData[i][1]) === weekDayNum
            ) {
              weeklySheet.deleteRow(i + 1);
            }
          }
          // 文字列として保存するため先頭にシングルクォート
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
      var weeklyData = weeklySheet.getDataRange().getValues();
      var alarms = [];
      for (var i = 0; i < weeklyData.length; i++) {
        var uid = typeof weeklyData[i][0] === "string" ? weeklyData[i][0].trim() : String(weeklyData[i][0]);
        if (uid === userId) {
          var weekDayNum = Number(weeklyData[i][1]);
          var t = weeklyData[i][2];
          if (typeof t === "string" && t.charAt(0) === "'") t = t.slice(1);
          alarms.push({
            weekDayNum: weekDayNum,
            timeStr: t,
            text: "・" + "日月火水木金土".charAt(weekDayNum) + "曜 " + t.slice(0,2) + ":" + t.slice(2,4)
          });
        }
      }
      // 曜日→時間で昇順ソート
      alarms.sort(function(a, b) {
        if (a.weekDayNum !== b.weekDayNum) return a.weekDayNum - b.weekDayNum;
        return a.timeStr.localeCompare(b.timeStr);
      });
      if(alarms.length === 0){
        replyText = "毎週アラームは登録されていません。";
      }else{
        replyText = "登録されている毎週アラーム：\n" + alarms.map(a => a.text).join("\n");
      }
    }
    // ★ 毎週アラーム解除（かいじょ）
    else if (message === "かいじょ") {
      var weeklyData = weeklySheet.getDataRange().getValues();
      var alarms = [];
      for (var i = 0; i < weeklyData.length; i++) {
        var uid = typeof weeklyData[i][0] === "string" ? weeklyData[i][0].trim() : String(weeklyData[i][0]);
        if (uid === userId) {
          var weekDayNum = Number(weeklyData[i][1]);
          var t = weeklyData[i][2];
          if (typeof t === "string" && t.charAt(0) === "'") t = t.slice(1);
          alarms.push({
            weekDayNum: weekDayNum,
            timeStr: t,
            row: i + 1,
            text: null
          });
        }
      }
      // 曜日→時間で昇順ソート
      alarms.sort(function(a, b) {
        if (a.weekDayNum !== b.weekDayNum) return a.weekDayNum - b.weekDayNum;
        return a.timeStr.localeCompare(b.timeStr);
      });
      // 番号振り直し
      var alarmIndexes = [];
      for (var j = 0; j < alarms.length; j++) {
        alarms[j].text = (j + 1) + ": " + "日月火水木金土".charAt(alarms[j].weekDayNum) + "曜 " + alarms[j].timeStr.slice(0,2) + ":" + alarms[j].timeStr.slice(2,4);
        alarmIndexes.push(alarms[j].row);
      }
      if (alarms.length === 0) {
        replyText = "毎週アラームは登録されていません。";
      } else {
        replyText = "登録されている毎週アラーム：\n" + alarms.map(a => a.text).join("\n") + "\n削除したいアラームの番号を送信してください。";
        if (userRow >= 0) {
          stateSheet.getRange(userRow + 1, 2).setValue("wait_delete_weekly_alarm");
          stateSheet.getRange(userRow + 1, 3).setValue(alarmIndexes.join(","));
        } else {
          stateSheet.appendRow([userId, "wait_delete_weekly_alarm", alarmIndexes.join(",")]);
        }
      }
    }
    else if (userStatus === "wait_delete_weekly_alarm" && /^\d+$/.test(message)) {
      var alarmIndexesStr = String(states[userRow][2]);
      if (alarmIndexesStr) {
        var alarmIndexes = alarmIndexesStr.split(",").map(Number);
        var idx = parseInt(message, 10) - 1;
        var delRow = alarmIndexes[idx];
        if (idx >= 0 && idx < alarmIndexes.length && delRow >= 1 && delRow <= weeklySheet.getLastRow()) {
          weeklySheet.deleteRow(delRow);
          replyText = "毎週アラームを削除しました。";
        } else {
          replyText = "正しい番号を送信してください。";
        }
        stateSheet.getRange(userRow + 1, 2, 1, 2).setValues([["", ""]]);
      } else {
        replyText = "もう一度「かいじょ」と送信してください。";
      }
    }

    // ------------------- 単発アラーム一覧（削除プロンプトなし） -------------------
    else if (message === "アラーム一覧") {
      var alarmData = alarmSheet.getDataRange().getValues();
      var userAlarms = [];
      var now = new Date();
      for (var i = 0; i < alarmData.length; i++) { // 0から開始（1行目からデータ）
        var alarmTime = String(alarmData[i][2]);
        if (alarmData[i][1] === userId && alarmTimePattern.test(alarmTime)) {
          var alarmDate = parseAlarmTime(alarmTime);
          if (alarmDate && alarmDate >= now) {
            userAlarms.push({
              dateObj: alarmDate,
              text: formatAlarmTime(alarmTime)
            });
          }
        }
      }
      userAlarms.sort(function(a, b) {
        return a.dateObj - b.dateObj;
      });
      sheet.appendRow([date, userId, message]);
      if (userAlarms.length === 0) {
        replyText = "登録されているアラームはありません。";
      } else {
        replyText = "登録アラーム一覧：\n";
        for (var j = 0; j < userAlarms.length; j++) {
          replyText += (j + 1) + ": " + userAlarms[j].text + "\n";
        }
      }
    }

    // ------------------- 単発アラーム解除（削除プロンプトあり） -------------------
    else if (message === "アラーム解除") {
      var alarmData = alarmSheet.getDataRange().getValues();
      var userAlarms = [];
      var now = new Date();
      for (var i = 0; i < alarmData.length; i++) {
        var alarmTime = String(alarmData[i][2]);
        if (alarmData[i][1] === userId && alarmTimePattern.test(alarmTime)) {
          var alarmDate = parseAlarmTime(alarmTime);
          if (alarmDate && alarmDate >= now) {
            userAlarms.push({
              dateObj: alarmDate,
              text: formatAlarmTime(alarmTime),
              row: i + 1, // シート上の実際の行番号
              alarmTime: alarmTime // 元の時間文字列も保存
            });
          }
        }
      }
      userAlarms.sort(function(a, b) {
        return a.dateObj - b.dateObj;
      });
      sheet.appendRow([date, userId, message]);
      if (userAlarms.length === 0) {
        replyText = "登録されているアラームはありません。";
      } else {
        replyText = "登録アラーム一覧：\n";
        var alarmData = []; // 行番号の代わりに、アラーム時間を保存
        for (var j = 0; j < userAlarms.length; j++) {
          replyText += (j + 1) + ": " + userAlarms[j].text + "\n";
          alarmData.push(userAlarms[j].alarmTime);
        }
        replyText += "削除したいアラームの番号を送信してください。";
        if (userRow >= 0) {
          stateSheet.getRange(userRow + 1, 2).setValue("wait_delete_alarm");
          stateSheet.getRange(userRow + 1, 3).setValue(alarmData.join(","));
        } else {
          stateSheet.appendRow([userId, "wait_delete_alarm", alarmData.join(",")]);
        }
      }
    }
    else if (userStatus === "wait_delete_alarm" && /^\d+$/.test(message)) {
      try {
        sheet.appendRow([date, userId, "アラーム削除リクエスト:" + message]);
        var alarmDataStr = String(states[userRow][2]); // 文字列化を徹底
        
        // デバッグ情報を追加
        sheet.appendRow([date, userId, "デバッグ - alarmDataStr:" + alarmDataStr]);
        
        if (alarmDataStr && alarmDataStr.trim() !== "" && alarmDataStr !== "undefined") {
          var alarmTimes = alarmDataStr.split(","); // アラーム時間の配列
          var idx = parseInt(message, 10) - 1; // 入力番号は1始まり
          
          // デバッグ情報を追加
          sheet.appendRow([date, userId, "デバッグ - idx:" + idx + ", alarmTimes.length:" + alarmTimes.length + ", alarmTimes:" + alarmTimes.join(",")]);
          
          if (idx >= 0 && idx < alarmTimes.length) {
            var targetAlarmTime = alarmTimes[idx];
            
            // 現在のアラームデータを再取得して削除対象を探す
            var currentAlarmData = alarmSheet.getDataRange().getValues();
            var found = false;
            
            for (var i = 0; i < currentAlarmData.length; i++) {
              var rowAlarmTime = String(currentAlarmData[i][2]);
              var rowUserId = String(currentAlarmData[i][1]);
              
              if (rowUserId === userId && rowAlarmTime === targetAlarmTime) {
                // 該当のアラームを削除
                alarmSheet.deleteRow(i + 1);
                sheet.appendRow([date, userId, "アラーム削除実行:" + message + " (時間:" + targetAlarmTime + ")"]);
                replyText = "アラームを削除しました。";
                found = true;
                break;
              }
            }
            
            if (!found) {
              replyText = "削除対象のアラームが見つかりません。もう一度「アラーム解除」から実行してください。";
            }
          } else {
            replyText = "正しい番号を送信してください。（1から" + alarmTimes.length + "の範囲で入力してください）";
          }
          stateSheet.getRange(userRow + 1, 2, 1, 2).setValues([["", ""]]);
        } else {
          replyText = "もう一度「アラーム解除」と送信してください。";
        }
      } catch (e) {
        replyText = "エラーが発生しました: " + e.toString();
        sheet.appendRow([date, userId, "エラー詳細:" + e.toString()]);
      }
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
      replyText = "登録されました";
      stateSheet.getRange(userRow + 1, 2).setValue("");
      sheet.appendRow([date, userId, message]);
    }
    else if (userStatus === "wait_alarm_time") {
      replyText = "起床時間をYYMMDDhhmm形式で入力してください";
    }

    // 必ず返信する
    if (replyText !== undefined && replyText !== null && replyText !== "") {
      var postData = {
        "replyToken": replyToken,
        "messages": [{ "type": "text", "text": replyText }]
      };
      var options = {
        "method": "post",
        "headers": headers,
        "payload": JSON.stringify(postData)
      };
      try {
        UrlFetchApp.fetch(replyUrl, options);
      } catch (e) {
        Logger.log("返信送信エラー: " + e.toString());
      }
    }
    else if (message == "オン"){
      on();
    }
    else if(message == "オフ"){
      off();
    }
    else{
      const props = PropertiesService.getScriptProperties();
      props.setProperty('stopSending', 'true'); // フラグを立てる
      Logger.log('ユーザーからメッセージを受信。送信停止フラグを設定しました。');
      return ContentService.createTextOutput(JSON.stringify({ status: 'ok' })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  return ContentService.createTextOutput("OK");
}

function formatAlarmTime(str) {
  if (!/^\d{10}$/.test(str)) return str;
  var y = "20" + str.slice(0, 2);
  var m = str.slice(2, 4);
  var d = str.slice(4, 6);
  var h = str.slice(6, 8);
  var min = str.slice(8, 10);
  return y + "年" + m + "月" + d + "日" + h + "時" + min + "分";
}

function parseAlarmTime(str) {
  if (!/^\d{10}$/.test(str)) return null;
  var year = 2000 + parseInt(str.slice(0, 2), 10);
  var month = parseInt(str.slice(2, 4), 10) - 1;
  var day = parseInt(str.slice(4, 6), 10);
  var hour = parseInt(str.slice(6, 8), 10);
  var min = parseInt(str.slice(8, 10), 10);
  return new Date(year, month, day, hour, min);
}