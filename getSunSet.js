function getDailySunset() {
  const LAT = 34.8163;
  const LNG = 135.5685;
  const url = `https://api.sunrise-sunset.org/json?lat=${LAT}&lng=${LNG}&formatted=0`;

  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText());
  
  //  日の入りを取得
  const sunsetUTC = new Date(data.results.sunset);
  const sunsetJST = new Date(sunsetUTC.getTime());


  const sunSetTime = formatDate(sunsetJST);
  Logger.log(sunSetTime);
  return sunSetTime;
}

 //日の出プログラムにある
function formatDate(date) {
  return Utilities.formatDate(date, 'Asia/Tokyo', 'yyMMddHHmm');
}




