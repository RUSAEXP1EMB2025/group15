class SpreadsheetController {
  constructor() {
    this.spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  }

  getSheet(sheetName) {
    let sheet = this.spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = this.spreadsheet.insertSheet(sheetName);
    }
    return sheet;
  }

  getSheetData(sheetName) {
    const sheet = this.getSheet(sheetName);
    return sheet.getDataRange().getValues();
  }

  appendRow(sheetName, data) {
    const sheet = this.getSheet(sheetName);
    sheet.appendRow(data);
  }

  updateCell(sheetName, row, col, value) {
    const sheet = this.getSheet(sheetName);
    sheet.getRange(row, col).setValue(value);
  }

  deleteRow(sheetName, row) {
    const sheet = this.getSheet(sheetName);
    sheet.deleteRow(row);
  }

  clearColumn(sheetName, column, startRow = 1) {
    const sheet = this.getSheet(sheetName);
    const lastRow = sheet.getLastRow();
    if (lastRow < startRow) return;
    sheet.getRange(startRow, column, lastRow - startRow + 1, 1).clearContent();
  }

  findUserRow(sheetName, userId) {
    const data = this.getSheetData(sheetName);
    return data.findIndex(row => String(row[0]) === String(userId));
  }

  clearDColumnWeekly() {
    const sheet = this.getSheet("weekly");
    const lastRow = sheet.getLastRow();
    if (lastRow < 1) return;
    sheet.getRange(1, 4, lastRow, 1).clearContent();
  }

  formatAlarmTime(str) {
    if (!/^\d{10}$/.test(str)) return str;
    const y = "20" + str.slice(0, 2);
    const m = str.slice(2, 4);
    const d = str.slice(4, 6);
    const h = str.slice(6, 8);
    const min = str.slice(8, 10);
    return y + "年" + m + "月" + d + "日" + h + "時" + min + "分";
  }

  parseAlarmTime(str) {
    if (!/^\d{10}$/.test(str)) return null;
    const year = 2000 + parseInt(str.slice(0, 2), 10);
    const month = parseInt(str.slice(2, 4), 10) - 1;
    const day = parseInt(str.slice(4, 6), 10);
    const hour = parseInt(str.slice(6, 8), 10);
    const min = parseInt(str.slice(8, 10), 10);
    return new Date(year, month, day, hour, min);
  }
}

// グローバルインスタンス
const spreadsheetControllerInstance = new SpreadsheetController();

// 従来の関数として公開
function clearDColumnWeekly() {
  return spreadsheetControllerInstance.clearDColumnWeekly();
}

function formatAlarmTime(str) {
  return spreadsheetControllerInstance.formatAlarmTime(str);
}

function parseAlarmTime(str) {
  return spreadsheetControllerInstance.parseAlarmTime(str);
}
