function doPost(e) {
  var json = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var alarmSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("シート1");

  if (json.events && json.events[0] && json.events[0].type === "message") {
    var userId = json.events[0].source.userId;
    var message = json.events[0].message.text;
    var date = new Date();
    var replyToken = json.events[0].replyToken;

    var CHANNEL_ACCESS_TOKEN = "hcre+X+7tc46fUoPuGgBopw/QccQtgRkhODt0y1ZX0W2e4ddE+3/Ua7E3sJEIcsfN7SMprAofrKzsm7HNG4URLgY7T66N+kbsZExQtvviZqJn4Cxadam/TkJH3ddgLLKiGpmTRraPNyyv/AxfGWo9gdB04t89/1O/w1cDnyilFU=";
    var replyUrl = "https://api.line.me/v2/bot/message/reply";
    var headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN
    };

    // 状態管理用の「state」シート
    var stateSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("state");
    if (!stateSheet) {
      stateSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("state");
      stateSheet.appendRow(["userId", "status", "alarmIndexes"]);
    }
    var states = stateSheet.getDataRange().getValues();
    var userRow = states.findIndex(row => row[0] === userId);
    var userStatus = userRow >= 0 ? states[userRow][1] : "";

    var replyText = "";
    var alarmTimePattern = /^\d{10}$/;

    // アラーム一覧またはアラーム解除
    // アラーム一覧またはアラーム解除
  if (message === "アラーム一覧" || message === "アラーム解除") {
    var alarmData = alarmSheet.getDataRange().getValues();
    var userAlarms = [];
    var alarmIndexes = [];
    var now = new Date();
    for (var i = 1; i < alarmData.length; i++) {
      var alarmTime = String(alarmData[i][2]);
      if (alarmData[i][1] === userId && alarmTimePattern.test(alarmTime)) {
        var alarmDate = parseAlarmTime(alarmTime);
        if (alarmDate && alarmDate >= now) {
          userAlarms.push({
            dateObj: alarmDate,
            text: formatAlarmTime(alarmTime),
            row: i+1
          });
        }
      }
    }
    // 日付昇順で並べ替え
    userAlarms.sort(function(a, b) {
      return a.dateObj - b.dateObj;
    });
    sheet.appendRow([date, userId, message]);
    if (userAlarms.length === 0) {
      replyText = "登録されているアラームはありません。";
    } else {
      replyText = "登録アラーム一覧：\n";
      for (var j = 0; j < userAlarms.length; j++) {
        replyText += (j+1) + ": " + userAlarms[j].text + "\n";
        alarmIndexes.push(userAlarms[j].row);
      }
      replyText += "削除したいアラームの番号を送信してください。";
      if (userRow >= 0) {
        stateSheet.getRange(userRow + 1, 2).setValue("wait_delete_alarm");
        stateSheet.getRange(userRow + 1, 3).setValue(alarmIndexes.join(","));
      } else {
        stateSheet.appendRow([userId, "wait_delete_alarm", alarmIndexes.join(",")]);
      }
    }
  }
    // アラーム削除番号受信
    else if (userStatus === "wait_delete_alarm" && /^\d+$/.test(message)) {
      sheet.appendRow([date, userId, "アラーム削除リクエスト:" + message]); // ここで記録
      var alarmIndexesStr = states[userRow][2];
      if (alarmIndexesStr) {
        var alarmIndexes = alarmIndexesStr.split(",").map(Number);
        var idx = parseInt(message, 10) - 1;
        if (idx >= 0 && idx < alarmIndexes.length) {
          alarmSheet.deleteRow(alarmIndexes[idx]);
          sheet.appendRow([date, userId, "アラーム削除実行:" + message]); // 実際に削除した場合の記録
          replyText = "アラームを削除しました。";
        } else {
          replyText = "正しい番号を送信してください。";
        }
        stateSheet.getRange(userRow + 1, 2, 1, 2).setValues([["", ""]]);
      } else {
        replyText = "もう一度「アラーム一覧」と送信してください。";
      }
    }
    // 目覚まし設定機能（既存）
    else if (message === "目覚まし設定") {
      replyText = "起床時間をYYMMDDhhmm形式で入力してください";
      if (userRow >= 0) {
        stateSheet.getRange(userRow + 1, 2).setValue("wait_alarm_time");
      } else {
        stateSheet.appendRow([userId, "wait_alarm_time", ""]);
      }
      sheet.appendRow([date, userId, message]);
    }
    // 入力待ちで時刻受信
    else if (userStatus === "wait_alarm_time" && alarmTimePattern.test(message)) {
      replyText = "登録されました";
      stateSheet.getRange(userRow + 1, 2).setValue("");
      sheet.appendRow([date, userId, message]);
    }
    // 入力待ちで形式ミス
    else if (userStatus === "wait_alarm_time") {
      replyText = "起床時間をYYMMDDhhmm形式で入力してください";
    }

    if (replyText) {
      var postData = {
        "replyToken": replyToken,
        "messages": [{ "type": "text", "text": replyText }]
      };
      var options = {
        "method": "post",
        "headers": headers,
        "payload": JSON.stringify(postData)
      };
      UrlFetchApp.fetch(replyUrl, options);
    }
  }
  return ContentService.createTextOutput("OK");
}

function formatAlarmTime(str) {
  if (!/^\d{10}$/.test(str)) return str;
  var y = "20" + str.slice(0,2);
  var m = str.slice(2,4);
  var d = str.slice(4,6);
  var h = str.slice(6,8);
  var min = str.slice(8,10);
  return y + "年" + m + "月" + d + "日" + h + "時" + min + "分";
}

function parseAlarmTime(str) {
  // "YYMMDDhhmm" → Date オブジェクト
  if (!/^\d{10}$/.test(str)) return null;
  var year = 2000 + parseInt(str.slice(0,2),10);
  var month = parseInt(str.slice(2,4),10) - 1; // 0始まり
  var day = parseInt(str.slice(4,6),10);
  var hour = parseInt(str.slice(6,8),10);
  var min = parseInt(str.slice(8,10),10);
  return new Date(year, month, day, hour, min);
}
