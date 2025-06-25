function clearDColumnWeekly() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("weekly"); // シート名は必要に応じて変更
  if (!sheet) {
    SpreadsheetApp.getUi().alert("シート名が違います。'weekly'という名前のシートを用意してください。");
    return;
  }
  var lastRow = sheet.getLastRow();
  if (lastRow < 1) return; // データがなければ何もしない
  sheet.getRange(1, 4, lastRow, 1).clearContent(); // 1行目からD列をクリア
}