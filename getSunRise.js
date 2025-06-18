function getDailySunrise() {
  const LAT = 34.8163; // 茨木市の緯度
  const LNG = 135.5685; // 茨木市の経度
  const url = `https://api.sunrise-sunset.org/json?lat=${LAT}&lng=${LNG}&formatted=0`;

  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText());


  const sunriseUTC = new Date(data.results.sunrise);
  const sunriseJST = new Date(sunriseUTC.getTime());

  const sunRiseTime = formatDate(sunriseJST);
  Logger.log(sunRiseTime);
  return sunRiseTime;
}

function formatDate(date) {
  return Utilities.formatDate(date, 'Asia/Tokyo', 'yyMMddHHmm');
}
