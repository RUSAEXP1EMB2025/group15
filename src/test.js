// テスト用のサンプル関数
function testModularStructure() {
  // 各クラスのインスタンスが正しく作成されるかテスト
  try {
    Logger.log("=== モジュラー構造テスト開始 ===");
    
    // クラスの存在確認
    Logger.log("Config クラス存在: " + (typeof Config !== 'undefined'));
    Logger.log("NatureRemoController クラス存在: " + (typeof NatureRemoController !== 'undefined'));
    Logger.log("WeatherController クラス存在: " + (typeof WeatherController !== 'undefined'));
    Logger.log("SpreadsheetController クラス存在: " + (typeof SpreadsheetController !== 'undefined'));
    Logger.log("LineController クラス存在: " + (typeof LineController !== 'undefined'));
    Logger.log("AlarmController クラス存在: " + (typeof AlarmController !== 'undefined'));
    Logger.log("LineReceiver クラス存在: " + (typeof LineReceiver !== 'undefined'));
    Logger.log("Snoozer クラス存在: " + (typeof Snoozer !== 'undefined'));
    Logger.log("MainApp クラス存在: " + (typeof MainApp !== 'undefined'));
    
    // グローバルインスタンスの存在確認
    Logger.log("configInstance存在: " + (typeof configInstance !== 'undefined'));
    Logger.log("natureRemoControllerInstance存在: " + (typeof natureRemoControllerInstance !== 'undefined'));
    Logger.log("weatherControllerInstance存在: " + (typeof weatherControllerInstance !== 'undefined'));
    Logger.log("lineControllerInstance存在: " + (typeof lineControllerInstance !== 'undefined'));
    Logger.log("spreadsheetControllerInstance存在: " + (typeof spreadsheetControllerInstance !== 'undefined'));
    Logger.log("alarmControllerInstance存在: " + (typeof alarmControllerInstance !== 'undefined'));
    Logger.log("lineReceiverInstance存在: " + (typeof lineReceiverInstance !== 'undefined'));
    Logger.log("snoozerInstance存在: " + (typeof snoozerInstance !== 'undefined'));
    Logger.log("mainAppInstance存在: " + (typeof mainAppInstance !== 'undefined'));
    
    // Config テスト
    if (typeof Config !== 'undefined') {
      const config = new Config();
      Logger.log("Config作成成功: " + config.key());
    } else {
      Logger.log("Config クラスが利用できません");
    }
    
    // MainApp テスト
    if (typeof MainApp !== 'undefined') {
      const mainApp = new MainApp();
      Logger.log("MainApp作成成功");
      Logger.log("MainApp.config: " + (mainApp.config ? "OK" : "NG"));
    } else {
      Logger.log("MainApp クラスが利用できません");
    }
    
    // 従来の関数が動作するかテスト
    Logger.log("従来の関数テスト:");
    if (typeof key !== 'undefined') {
      Logger.log("key(): " + key());
    } else {
      Logger.log("key() 関数が利用できません");
    }
    
    if (typeof alarmKey !== 'undefined') {
      Logger.log("alarmKey(): " + alarmKey());
    } else {
      Logger.log("alarmKey() 関数が利用できません");
    }
    
    Logger.log("=== モジュラー構造テスト完了 ===");
    return "テスト成功";
    
  } catch (error) {
    Logger.log("エラー: " + error.toString());
    return "テスト失敗: " + error.toString();
  }
}

// グローバル関数として公開
function testModule() {
  return testModularStructure();
}
