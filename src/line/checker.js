
function sendAlarmMail() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("シート1");
  if (!sheet) {
    SpreadsheetApp.getUi().alert("シート名が違います。'シート1'という名前のシートを用意してください。");
    return;
  }
  var data = sheet.getDataRange().getValues();
  var now = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyMMddHHmm");
  var alarmPattern = /^\d{10}$/;
  var count = 0;
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var alarmTime = String(row[2]); // 数値でも文字列化して判定
    var notified = row[3];
    if (alarmPattern.test(alarmTime) && alarmTime == now && !notified) {
      sheet.getRange(i + 1, 4).setValue("mailed at " + now);
      Logger.log("通知済み: row " + (i + 1) + " at " + now);
      count++;
    }
  }
  SpreadsheetApp.getUi().alert("完了！" + count + "件の行に通知済みを記録しました。");
}

function sendWeeklyAlarmMail() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("weekly");
  if (!sheet) {
    SpreadsheetApp.getUi().alert("シート名が違います。'weekly'という名前のシートを用意してください。");
    return;
  }
  var data = sheet.getDataRange().getValues();
  var now = new Date();
  var nowWeekDay = now.getDay(); // 日:0, 月:1, ..., 土:6
  var hour = Utilities.formatDate(now, "Asia/Tokyo", "HH");
  var min = Utilities.formatDate(now, "Asia/Tokyo", "mm");
  var nowTimeStr = hour + min; // 例: "0800"

  var count = 0;
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var weekDayNum = Number(row[1]);
    var timeStr = String(row[2]);
    if (typeof timeStr === "string" && timeStr.charAt(0) === "'") timeStr = timeStr.slice(1);
    var notified = row[3];

    // 曜日・時刻一致かつ未通知
    if (weekDayNum === nowWeekDay && timeStr === nowTimeStr && !notified) {
      var mailAddress = YOUR_EMAIL_ADRESS;
      MailApp.sendEmail(mailAddress, "おはようございます", "おはようございます");
      sheet.getRange(i + 1, 4).setValue("mailed at " + nowTimeStr);
      Logger.log("通知済み: row " + (i + 1) + " at " + nowTimeStr);
      count++;
    }
  }
  //SpreadsheetApp.getUi().alert("完了！" + count + "件の行に通知済みを記録・メール送信しました。");
}