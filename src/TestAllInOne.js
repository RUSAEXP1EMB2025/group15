// ===========================================
// AllInOne.js テスト用プログラム
// ===========================================

// AllInOne.jsの内容をテストするための関数群

// ===========================================
// 1. 基本機能テスト
// ===========================================
function testBasicFunctionality() {
  Logger.log("=== 基本機能テスト開始 ===");
  
  try {
    // デバッグ: クラスの存在確認
    Logger.log("MainApp クラス存在: " + (typeof MainApp !== 'undefined'));
    Logger.log("Config クラス存在: " + (typeof Config !== 'undefined'));
    Logger.log("configInstance存在: " + (typeof configInstance !== 'undefined'));
    
    // MainAppインスタンスの作成テスト
    const app = new MainApp();
    Logger.log("✓ MainAppインスタンス作成成功");
    
    // デバッグ: app.configの確認
    Logger.log("app.config存在: " + (app.config ? "OK" : "NG"));
    
    if (app.config) {
      // 設定情報テスト
      const channelToken = app.config.CHANNEL_ACCESS_TOKEN;
      const email = app.config.YOUR_EMAIL_ADRESS;
      const remoToken = app.config.REMO_TOKEN;
      
      Logger.log("Channel Access Token:", channelToken ? channelToken.substring(0, 20) + "..." : "未設定");
      Logger.log("Email Address:", email || "未設定");
      Logger.log("Remo Token:", remoToken ? remoToken.substring(0, 20) + "..." : "未設定");
      
      // 関数経由でのテスト
      Logger.log("関数経由のテスト:");
      Logger.log("- key():", key() ? key().substring(0, 20) + "..." : "未設定");
      Logger.log("- alarmKey():", alarmKey() ? alarmKey().substring(0, 20) + "..." : "未設定");
      Logger.log("- alarmID():", alarmID());
      
      Logger.log("✓ 設定情報読み込み成功");
    } else {
      Logger.log("✗ app.configが利用できません");
    }
    
    return true;
  } catch (error) {
    Logger.log("✗ 基本機能テストエラー:", error.message);
    Logger.log("✗ スタックトレース:", error.stack);
    return false;
  }
}

// ===========================================
// 2. 天気・日時機能テスト
// ===========================================
function testWeatherAndTime() {
  Logger.log("=== 天気・日時機能テスト開始 ===");
  
  try {
    const app = new MainApp();
    
    // 天気取得テスト
    const weather = app.weatherController.getOsakaWeather();
    Logger.log("✓ 大阪天気取得成功:", weather);
    
    // 日の出時刻テスト
    const sunrise = app.weatherController.getDailySunrise();
    Logger.log("✓ 日の出時刻取得成功:", sunrise);
    
    // 日の入時刻テスト
    const sunset = app.weatherController.getDailySunset();
    Logger.log("✓ 日の入時刻取得成功:", sunset);
    
    // 照明色決定テスト
    const lightColor = app.weatherController.decideLightColor(weather);
    Logger.log("✓ 照明色決定成功:", lightColor);
    
    // 日付フォーマットテスト
    const now = new Date();
    const formattedDate = app.weatherController.formatDate(now);
    Logger.log("✓ 日付フォーマット成功:", formattedDate);
    
    return true;
  } catch (error) {
    Logger.log("✗ 天気・日時機能テストエラー:", error.message);
    return false;
  }
}

// ===========================================
// 3. スプレッドシート機能テスト
// ===========================================
function testSpreadsheetFunctions() {
  Logger.log("=== スプレッドシート機能テスト開始 ===");
  
  try {
    const app = new MainApp();
    
    // テストシート作成
    const testSheetName = "test_sheet_" + Date.now();
    const sheet = app.spreadsheetController.getSheet(testSheetName);
    Logger.log("✓ テストシート作成成功:", testSheetName);
    
    // データ追加テスト
    const testData = ["test_user", "test_message", new Date()];
    app.spreadsheetController.appendRow(testSheetName, testData);
    Logger.log("✓ データ追加成功");
    
    // データ読み取りテスト
    const data = app.spreadsheetController.getSheetData(testSheetName);
    Logger.log("✓ データ読み取り成功:", data.length, "行");
    
    // アラーム時刻フォーマットテスト
    const testAlarmTime = "2507081200"; // 2025年7月8日12時00分
    const formattedTime = app.spreadsheetController.formatAlarmTime(testAlarmTime);
    Logger.log("✓ アラーム時刻フォーマット成功:", formattedTime);
    
    // アラーム時刻パーステスト
    const parsedTime = app.spreadsheetController.parseAlarmTime(testAlarmTime);
    Logger.log("✓ アラーム時刻パース成功:", parsedTime);
    
    // テストシート削除
    SpreadsheetApp.getActiveSpreadsheet().deleteSheet(sheet);
    Logger.log("✓ テストシート削除成功");
    
    return true;
  } catch (error) {
    Logger.log("✗ スプレッドシート機能テストエラー:", error.message);
    return false;
  }
}

// ===========================================
// 4. 従来関数の互換性テスト
// ===========================================
function testBackwardCompatibility() {
  Logger.log("=== 従来関数互換性テスト開始 ===");
  
  try {
    // 天気関数テスト
    const weather = getOsakaWeather();
    Logger.log("✓ getOsakaWeather()動作確認:", weather);
    
    // 日時関数テスト
    const sunrise = getDailySunrise();
    Logger.log("✓ getDailySunrise()動作確認:", sunrise);
    
    const sunset = getDailySunset();
    Logger.log("✓ getDailySunset()動作確認:", sunset);
    
    // 照明色関数テスト
    const lightColor = decideLightColor(weather);
    Logger.log("✓ decideLightColor()動作確認:", lightColor);
    
    // 日付フォーマット関数テスト
    const now = new Date();
    const formatted = formatDate(now);
    Logger.log("✓ formatDate()動作確認:", formatted);
    
    // 設定関数テスト
    const accessToken = key();
    Logger.log("✓ key()動作確認:", accessToken.substring(0, 20) + "...");
    
    const alarmToken = alarmKey();
    Logger.log("✓ alarmKey()動作確認:", alarmToken.substring(0, 20) + "...");
    
    // アラーム時刻フォーマット関数テスト
    const testTime = "2507081200";
    const formattedAlarm = formatAlarmTime(testTime);
    Logger.log("✓ formatAlarmTime()動作確認:", formattedAlarm);
    
    const parsedAlarm = parseAlarmTime(testTime);
    Logger.log("✓ parseAlarmTime()動作確認:", parsedAlarm);
    
    return true;
  } catch (error) {
    Logger.log("✗ 従来関数互換性テストエラー:", error.message);
    return false;
  }
}

// ===========================================
// 5. LINE機能テスト（モック）
// ===========================================
function testLineFunctions() {
  Logger.log("=== LINE機能テスト開始 ===");
  
  try {
    const app = new MainApp();
    
    // LINE Controller初期化テスト
    Logger.log("✓ LineController初期化成功");
    Logger.log("メッセージ配列数:", app.lineController.messagesArray.length);
    
    // ランダムメッセージ取得テスト
    const randomMessage = app.lineController.getRandomMessage();
    Logger.log("✓ ランダムメッセージ取得成功:", randomMessage);
    
    // 注意: 実際のLINE送信はテストしない（課金が発生する可能性があるため）
    Logger.log("✓ LINE機能構造確認完了");
    
    return true;
  } catch (error) {
    Logger.log("✗ LINE機能テストエラー:", error.message);
    return false;
  }
}

// ===========================================
// 6. アラーム機能テスト
// ===========================================
function testAlarmFunctions() {
  Logger.log("=== アラーム機能テスト開始 ===");
  
  try {
    const app = new MainApp();
    
    // アラーム時刻チェック機能テスト
    const now = new Date();
    const currentTime = Utilities.formatDate(now, "Asia/Tokyo", "yyMMddHHmm");
    Logger.log("✓ 現在時刻取得成功:", currentTime);
    
    // 天気に応じた照明色決定テスト
    const weather = app.weatherController.getOsakaWeather();
    const lightColor = app.weatherController.decideLightColor(weather);
    Logger.log("✓ 天気に応じた照明色決定成功:", weather, "→", lightColor);
    
    // 日の出・日の入り時刻比較テスト
    const sunrise = app.weatherController.getDailySunrise();
    const sunset = app.weatherController.getDailySunset();
    Logger.log("✓ 日の出・日の入り時刻比較準備完了");
    Logger.log("現在:", currentTime, "日の出:", sunrise, "日の入:", sunset);
    
    return true;
  } catch (error) {
    Logger.log("✗ アラーム機能テストエラー:", error.message);
    return false;
  }
}

// ===========================================
// 7. エラーハンドリングテスト
// ===========================================
function testErrorHandling() {
  Logger.log("=== エラーハンドリングテスト開始 ===");
  
  try {
    const app = new MainApp();
    
    // 無効なアラーム時刻テスト
    const invalidTime = "invalid_time";
    const parsed = app.spreadsheetController.parseAlarmTime(invalidTime);
    Logger.log("✓ 無効時刻処理確認:", parsed === null ? "正常" : "エラー");
    
    // 空文字テスト
    const emptyFormatted = app.spreadsheetController.formatAlarmTime("");
    Logger.log("✓ 空文字処理確認:", emptyFormatted);
    
    // 存在しないシートテスト
    const nonExistentSheet = "non_existent_sheet_" + Date.now();
    const sheet = app.spreadsheetController.getSheet(nonExistentSheet);
    Logger.log("✓ 存在しないシート処理確認:", sheet ? "シート作成成功" : "エラー");
    
    // 作成されたテストシートを削除
    if (sheet) {
      SpreadsheetApp.getActiveSpreadsheet().deleteSheet(sheet);
      Logger.log("✓ テストシート削除完了");
    }
    
    return true;
  } catch (error) {
    Logger.log("✗ エラーハンドリングテストエラー:", error.message);
    return false;
  }
}

// ===========================================
// 8. 包括的テスト実行
// ===========================================
function runAllTests() {
  Logger.log("===========================================");
  Logger.log("AllInOne.js 包括的テスト実行開始");
  Logger.log("===========================================");
  
  const testResults = [];
  
  // 各テストを実行
  testResults.push({name: "基本機能", result: testBasicFunctionality()});
  testResults.push({name: "天気・日時", result: testWeatherAndTime()});
  testResults.push({name: "スプレッドシート", result: testSpreadsheetFunctions()});
  testResults.push({name: "従来関数互換性", result: testBackwardCompatibility()});
  testResults.push({name: "LINE機能", result: testLineFunctions()});
  testResults.push({name: "アラーム機能", result: testAlarmFunctions()});
  testResults.push({name: "エラーハンドリング", result: testErrorHandling()});
  
  // 結果まとめ
  Logger.log("===========================================");
  Logger.log("テスト結果サマリー");
  Logger.log("===========================================");
  
  let passCount = 0;
  let failCount = 0;
  
  testResults.forEach(test => {
    const status = test.result ? "✓ PASS" : "✗ FAIL";
    Logger.log(`${status} - ${test.name}`);
    if (test.result) {
      passCount++;
    } else {
      failCount++;
    }
  });
  
  Logger.log("===========================================");
  Logger.log(`総合結果: ${passCount}/${testResults.length} テスト通過`);
  Logger.log(`成功: ${passCount}, 失敗: ${failCount}`);
  
  if (failCount === 0) {
    Logger.log("🎉 すべてのテストが通過しました！");
    Logger.log("AllInOne.jsは本番環境で使用する準備ができています。");
  } else {
    Logger.log("⚠️  一部のテストが失敗しました。");
    Logger.log("問題を修正してから本番環境に移行してください。");
  }
  
  Logger.log("===========================================");
  
  return failCount === 0;
}

// ===========================================
// 9. 個別テスト実行用関数
// ===========================================

// 基本機能のみテスト
function testBasicOnly() {
  return testBasicFunctionality();
}

// 天気機能のみテスト
function testWeatherOnly() {
  return testWeatherAndTime();
}

// スプレッドシート機能のみテスト
function testSpreadsheetOnly() {
  return testSpreadsheetFunctions();
}

// 従来関数互換性のみテスト
function testCompatibilityOnly() {
  return testBackwardCompatibility();
}

// ===========================================
// 10. 本番移行前チェック
// ===========================================
function preProductionCheck() {
  Logger.log("=== 本番移行前チェック開始 ===");
  
  const checks = [];
  
  // 設定確認
  const app = new MainApp();
  checks.push({
    name: "Channel Access Token設定",
    check: app.config.CHANNEL_ACCESS_TOKEN !== "YOUR_CHANNEL_ACCESS_TOKEN",
    current: app.config.CHANNEL_ACCESS_TOKEN.substring(0, 20) + "..."
  });
  
  checks.push({
    name: "Email Address設定",
    check: app.config.YOUR_EMAIL_ADRESS !== "your_email@example.com",
    current: app.config.YOUR_EMAIL_ADRESS
  });
  
  checks.push({
    name: "Remo Token設定",
    check: app.config.REMO_TOKEN !== "YOUR_REMO_TOKEN",
    current: app.config.REMO_TOKEN.substring(0, 20) + "..."
  });
  
  checks.push({
    name: "Alarm ID設定",
    check: app.config.alarmID() !== "your_user_id_here",
    current: app.config.alarmID()
  });
  
  Logger.log("=== 設定確認結果 ===");
  let allConfigured = true;
  
  checks.forEach(check => {
    const status = check.check ? "✓ 設定済み" : "✗ 未設定";
    Logger.log(`${status} - ${check.name}: ${check.current}`);
    if (!check.check) {
      allConfigured = false;
    }
  });
  
  if (allConfigured) {
    Logger.log("🎉 すべての設定が完了しています！");
  } else {
    Logger.log("⚠️  設定が不完全です。本番移行前に設定を完了してください。");
  }
  
  return allConfigured;
}
