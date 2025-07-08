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

// Nature Remo信号テスト関数
function testNatureRemoSignals() {
  Logger.log("=== Nature Remo信号テスト開始 ===");
  
  try {
    // 利用可能な信号をリスト
    Logger.log("利用可能な信号をリスト中...");
    const signals = listAvailableSignals();
    
    if (!signals) {
      Logger.log("信号リストの取得に失敗しました");
      return "信号リスト取得失敗";
    }
    
    // 現在の信号IDをテスト
    Logger.log("現在の信号IDをテスト中...");
    const mainApp = getMainApp();
    const natureRemo = mainApp.natureRemoController;
    
    if (natureRemo) {
      Logger.log("現在設定されている信号ID:");
      Logger.log("  on: " + natureRemo.signalIds.on);
      Logger.log("  off: " + natureRemo.signalIds.off);
      Logger.log("  cool: " + natureRemo.signalIds.cool);
      Logger.log("  warm: " + natureRemo.signalIds.warm);
      
      // off信号のテスト（エラーが発生するかもしれない）
      Logger.log("off信号をテスト中...");
      const result = natureRemo.sendSignal(natureRemo.signalIds.off);
      Logger.log("off信号テスト結果: " + JSON.stringify(result));
    }
    
    Logger.log("=== Nature Remo信号テスト完了 ===");
    return "テスト完了";
    
  } catch (error) {
    Logger.log("テストエラー: " + error.toString());
    return "テスト失敗: " + error.toString();
  }
}

// 信号ID更新用のヘルパー関数
function updateSignalIds(newSignalIds) {
  Logger.log("信号IDを更新中...");
  try {
    const mainApp = getMainApp();
    const natureRemo = mainApp.natureRemoController;
    
    if (natureRemo && newSignalIds) {
      // 新しい信号IDを設定
      Object.assign(natureRemo.signalIds, newSignalIds);
      Logger.log("信号IDが更新されました:");
      Logger.log(JSON.stringify(natureRemo.signalIds, null, 2));
      return "更新成功";
    }
    
    return "更新失敗: natureRemoControllerが利用できません";
  } catch (error) {
    Logger.log("更新エラー: " + error.toString());
    return "更新失敗: " + error.toString();
  }
}

// エアコン制御テスト関数
function testACControl() {
  Logger.log("=== エアコン制御テスト開始 ===");
  
  try {
    const mainApp = getMainApp();
    const natureRemo = mainApp.natureRemoController;
    
    // エアコンの詳細情報を取得
    Logger.log("エアコン情報を取得中...");
    const signals = natureRemo.listAvailableSignals();
    
    // エアコンのOFFテスト
    Logger.log("エアコンOFFテスト中...");
    const offResult = natureRemo.off();
    Logger.log("OFF結果: " + JSON.stringify(offResult));
    
    // 少し待つ
    Utilities.sleep(3000);
    
    // エアコンのONテスト
    Logger.log("エアコンONテスト中...");
    const onResult = natureRemo.on();
    Logger.log("ON結果: " + JSON.stringify(onResult));
    
    Logger.log("=== エアコン制御テスト完了 ===");
    return "テスト完了";
    
  } catch (error) {
    Logger.log("テストエラー: " + error.toString());
    return "テスト失敗: " + error.toString();
  }
}

// 直接エアコン制御テスト
function testDirectACControl() {
  Logger.log("=== 直接エアコン制御テスト開始 ===");
  
  try {
    const mainApp = getMainApp();
    const natureRemo = mainApp.natureRemoController;
    
    // エアコンOFF
    Logger.log("エアコンを直接OFF中...");
    const offResult = natureRemo.controlAC('off');
    Logger.log("直接OFF結果: " + JSON.stringify(offResult));
    
    // 少し待つ
    Utilities.sleep(3000);
    
    // エアコンON（冷房20度）
    Logger.log("エアコンを直接ON中（冷房20度）...");
    const onResult = natureRemo.controlAC('on', 20, 'cool');
    Logger.log("直接ON結果: " + JSON.stringify(onResult));
    
    Logger.log("=== 直接エアコン制御テスト完了 ===");
    return "テスト完了";
    
  } catch (error) {
    Logger.log("テストエラー: " + error.toString());
    return "テスト失敗: " + error.toString();
  }
}
