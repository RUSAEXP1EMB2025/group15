const SIGNAL_IDS2 = {
  "白色": "a4da61d0-cf5f-45c4-8448-f9261f0a8a78",       // 照明(通常)
  "黄色": "6bc5c685-4603-4d20-9373-7277c83fb7b4",       // 照明(明るく)
  "白と黄色の中間色": "efb7537e-e0a1-4038-9304-8e0fa93b753d" // 照明(暗く)
};

function getWeather() {
  const response = UrlFetchApp.fetch('https://www.jma.go.jp/bosai/forecast/data/forecast/270000.json');
  const weatherData = JSON.parse(response.getContentText());
  const todayWeather = weatherData[0].timeSeries[0].areas[0].weathers[0];
  return todayWeather;
}

function setLightColor(weather) {
  let signalId;
  if (weather.includes('晴')) {
    signalId = SIGNAL_IDS2["白色"];
  } else if (weather.includes('雨')) {
    signalId = SIGNAL_IDS2["黄色"];
  } else if (weather.includes('曇')) {
    signalId = SIGNAL_IDS2["白と黄色の中間色"];
  } else {
    Logger.log('Unknown weather condition: ' + weather);
    return { signalId: null, statusCode: null };
  }

  const options = {
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + 'ory_at_BLRBmrPYbJYQ12nS8HNDXXOXh8jT3Ib269NyK0lmQeY.D9NNkRcpL0jhjfURYx2tmGiL-CtS0I0O7_sGm7fLIBQ'
    }
  };
  const url = 'https://api.nature.global/1/signals/' + signalId + '/send';
  const response = UrlFetchApp.fetch(url, options);
  Logger.log('Response code: ' + response.getResponseCode());

  return { signalId, statusCode: response.getResponseCode() };
}

function logResult(weather, signalId, statusCode) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const now = new Date();
  sheet.appendRow([now, weather, signalId, statusCode]);
}

function main() {
  const weather = getWeather();
  const result = setLightColor(weather);
  logResult(weather, result.signalId, result.statusCode);
}

function listRemoSignals() {
  const options = {
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + 'ory_at_BLRBmrPYbJYQ12nS8HNDXXOXh8jT3Ib269NyK0lmQeY.D9NNkRcpL0jhjfURYx2tmGiL-CtS0I0O7_sGm7fLIBQ'
    }
  };
  const url = 'https://api.nature.global/1/appliances';
  const response = UrlFetchApp.fetch(url, options);
  const appliances = JSON.parse(response.getContentText());
  appliances.forEach(appliance => {
    Logger.log('Appliance: ' + appliance.nickname);
    appliance.signals.forEach(signal => {
      Logger.log('  Signal: ' + signal.name + ' (ID: ' + signal.id + ')');
    });
  });
}
