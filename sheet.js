function getSheet(name) {
  const SPREADSHEET_ID = '1bGAYS2hjsVIXWmlh3Zy5OcnzLyBsGbiVpNRCM32xC8Y'
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(name);

  if (!sheet) {
    throw new Error('シートが見つかりません');
  }

  return sheet;
}

function getLastData(name) {
  return getSheet(name).getDataRange().getValues().length;
}
