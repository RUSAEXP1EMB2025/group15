
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