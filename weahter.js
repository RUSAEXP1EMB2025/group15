// ★ Nature Remo のアクセストークンを設定
const REMO_TOKEN = 'ory_at_BLRBmrPYbJYQ12nS8HNDXXOXh8jT3Ib269NyK0lmQeY.D9NNkRcpL0jhjfURYx2tmGiL-CtS0I0O7_sGm7fLIBQ';

// ★ 各天気に対応する Signal ID（アプリで確認して設定）
const SIGNAL_IDS = {
  "白色": "シグナルIDを入力", //SIGNAL_ID_WHITE
  "黄色": "シグナルIDを入力", //SIGNAL_ID_YELLOW
  "白と黄色の中間色": "シグナルIDを入力", //SIGNAL_ID_MIDDLE
};

// 気象庁APIから大阪府の天気を取得
function getOsakaWeather() {
  const url = "https://www.jma.go.jp/bosai/forecast/data/forecast/270000.json";
  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText());
  const weatherToday = data[0]["timeSeries"][0]["areas"][0]["weathers"][0];
  return weatherToday;
}

// 天気に応じて照明色を決定
function decideLightColor(weather) {
  if (weather.includes("晴")) {
    return "白色";
  } else if (weather.includes("雨")) {
    return "黄色";
  } else if (weather.includes("曇")) {
    return "白と黄色の中間色";
  } else {
    return "白色"; // デフォルト
  }
}

// Nature Remo APIでシグナルを送信
function sendRemoSignal(signalId) {
  const options = {
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + REMO_TOKEN
    },
    muteHttpExceptions: true
  };
  const url = 'https://api.nature.global/1/signals/' + signalId + '/send';
  const response = UrlFetchApp.fetch(url, options);
  return response.getResponseCode();
}

// メイン関数：天気をチェックして照明を変更
function controlLightBasedOnWeather() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const now = new Date();

  const weather = getOsakaWeather();
  const color = decideLightColor(weather);
  const signalId = SIGNAL_IDS[color];
  const statusCode = sendRemoSignal(signalId);

  // 結果をシートにログ
  sheet.appendRow([
    Utilities.formatDate(now, "Asia/Tokyo", "yyyy/MM/dd HH:mm:ss"),
    weather,
    color,
    signalId,
    statusCode
  ]);
}

function listRemoSignals() {
  const REMO_TOKEN = 'ory_at_BLRBmrPYbJYQ12nS8HNDXXOXh8jT3Ib269NyK0lmQeY.D9NNkRcpL0jhjfURYx2tmGiL-CtS0I0O7_sGm7fLIBQ';
  const url = 'https://api.nature.global/1/signals';
  const options = {
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + REMO_TOKEN
    }
  };

  const response = UrlFetchApp.fetch(url, options);
  const signals = JSON.parse(response.getContentText());

  signals.forEach(signal => {
    Logger.log(`名前: ${signal.name}, ID: ${signal.id}`);
  });
}
