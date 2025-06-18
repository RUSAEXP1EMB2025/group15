function getDailySunrise() {

  //立命館大学OIC
  const LAT = 34.7776; // 緯度
  const LNG = 135.6154; // 経度
  const url = `https://api.sunrise-sunset.org/json?lat=${LAT}&lng=${LNG}&formatted=0`;

  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText());

  //日の出時刻取得
  const sunriseUTC = new Date(data.results.sunrise);
  const sunriseJST = new Date(sunriseUTC.getTime());

  //YYMMDDhhmmに変換
  const sunRiseTime = formatDate(sunriseJST);
  Logger.log(sunRiseTime);
  return sunRiseTime;
}

function formatDate(date) {
  return Utilities.formatDate(date, 'Asia/Tokyo', 'yyMMddHHmm');
}
