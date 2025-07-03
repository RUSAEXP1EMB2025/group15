function doPost(e) {
  const json = JSON.parse(e.postData.contents);

  // メッセージイベントか確認
  if (json.events && json.events[0].type === 'message') {
    const props = PropertiesService.getScriptProperties();
    props.setProperty('stopSending', 'true'); // フラグを立てる
    Logger.log('ユーザーからメッセージを受信。送信停止フラグを設定しました。');
  }

  return ContentService.createTextOutput(JSON.stringify({ status: 'ok' })).setMimeType(ContentService.MimeType.JSON);
}

