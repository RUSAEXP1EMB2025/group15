function alarmController() {
  //初期化
  PropertiesService.getScriptProperties().deleteProperty('stopSending');
  Logger.log('送信停止フラグをリセットしました。'); 

  sendLineMessage();
}
