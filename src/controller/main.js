// 全てのクラスを読み込むメインファイル
// このファイルがすべてのクラスを統合し、従来の関数を提供します

// クラス定義を含むファイルの読み込み（実際のGASでは別ファイルとして作成）
// 各クラスファイルはここで読み込まれると仮定

// 注意: mainAppInstanceはMainApp.jsで定義されているため、ここでは宣言しない

// ヘルパー関数: mainAppInstanceを安全に取得
function getMainApp() {
  return (typeof mainAppInstance !== 'undefined') ? mainAppInstance : new MainApp();
}

// エントリーポイント関数（GASトリガー用）
function doPost(e) {
  return getMainApp().doPost(e);
}

function sendAlarmMail() {
  return getMainApp().sendAlarmMail();
}

function sendWeeklyAlarmMail() {
  return getMainApp().sendWeeklyAlarmMail();
}

function lightController() {
  return getMainApp().lightController();
}

function alarmController() {
  return getMainApp().alarmController();
}

// 照明制御関数
function on() {
  return getMainApp().on();
}

function off() {
  return getMainApp().off();
}

function change_cool() {
  return getMainApp().change_cool();
}

function change_warm() {
  return getMainApp().change_warm();
}

function turnOnLight() {
  return getMainApp().turnOnLight();
}

// 天気・日時関連関数
function getOsakaWeather() {
  return getMainApp().getOsakaWeather();
}

function getDailySunrise() {
  return getMainApp().getDailySunrise();
}

function getDailySunset() {
  return getMainApp().getDailySunset();
}

function decideLightColor(weather) {
  return getMainApp().decideLightColor(weather);
}

function formatDate(date) {
  return getMainApp().formatDate(date);
}

function getWeather() {
  return getMainApp().getWeather();
}

function setLightColor(weather) {
  return getMainApp().setLightColor(weather);
}

function listRemoSignals() {
  return getMainApp().listRemoSignals();
}

function logResult(weather, signalId, statusCode) {
  return getMainApp().logResult(weather, signalId, statusCode);
}

function main() {
  return getMainApp().main();
}

// LINE関連関数
function sendLineMessage(userId = null, messageText = null) {
  return getMainApp().sendLineMessage(userId, messageText);
}

// スプレッドシート関連関数
function clearDColumnWeekly() {
  return getMainApp().clearDColumnWeekly();
}

function formatAlarmTime(str) {
  return getMainApp().formatAlarmTime(str);
}

function parseAlarmTime(str) {
  return getMainApp().parseAlarmTime(str);
}

// 設定関連関数
function key() {
  return getMainApp().key();
}

function alarmKey() {
  return getMainApp().alarmKey();
}

function alarmID() {
  return getMainApp().alarmID();
}

// 注意: 定数をグローバルに公開するとclasp pushで重複エラーが発生するため
// 必要な場合は関数経由でアクセスしてください:
// - key() または getMainApp().key()
// - alarmKey() または getMainApp().alarmKey()
// - getMainApp().config.YOUR_EMAIL_ADRESS
