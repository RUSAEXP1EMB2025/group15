class WeatherController {
  constructor() {
    this.LAT = 34.7776; // 立命館大学OIC緯度
    this.LNG = 135.6154; // 立命館大学OIC経度
  }

  formatDate(date) {
    return Utilities.formatDate(date, 'Asia/Tokyo', 'yyMMddHHmm');
  }

  getDailySunrise() {
    const url = `https://api.sunrise-sunset.org/json?lat=${this.LAT}&lng=${this.LNG}&formatted=0`;
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());

    const sunriseUTC = new Date(data.results.sunrise);
    const sunriseJST = new Date(sunriseUTC.getTime());

    const sunRiseTime = this.formatDate(sunriseJST);
    Logger.log(sunRiseTime);
    return sunRiseTime;
  }

  getDailySunset() {
    const url = `https://api.sunrise-sunset.org/json?lat=${this.LAT}&lng=${this.LNG}&formatted=0`;
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());

    const sunsetUTC = new Date(data.results.sunset);
    const sunsetJST = new Date(sunsetUTC.getTime());

    const sunSetTime = this.formatDate(sunsetJST);
    Logger.log(sunSetTime);
    return sunSetTime;
  }

  getWeather() {
    const response = UrlFetchApp.fetch('https://www.jma.go.jp/bosai/forecast/data/forecast/270000.json');
    const weatherData = JSON.parse(response.getContentText());
    const todayWeather = weatherData[0].timeSeries[0].areas[0].weathers[0];
    return todayWeather;
  }

  getOsakaWeather() {
    const url = "https://www.jma.go.jp/bosai/forecast/data/forecast/270000.json";
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());
    const weatherToday = data[0]["timeSeries"][0]["areas"][0]["weathers"][0];
    return weatherToday;
  }

  decideLightColor(weather) {
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

  logResult(weather, signalId, statusCode) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const now = new Date();
    sheet.appendRow([now, weather, signalId, statusCode]);
  }

  main() {
    const weather = this.getWeather();
    // NatureRemoControllerのインスタンスを安全に取得
    const natureRemo = (typeof natureRemoControllerInstance !== 'undefined') ? natureRemoControllerInstance : new NatureRemoController();
    const result = natureRemo.setLightColor(weather);
    this.logResult(weather, result.signalId, result.statusCode);
  }
}

// グローバルインスタンス
const weatherControllerInstance = new WeatherController();

// 従来の関数として公開
function formatDate(date) {
  return weatherControllerInstance.formatDate(date);
}

function getDailySunrise() {
  return weatherControllerInstance.getDailySunrise();
}

function getDailySunset() {
  return weatherControllerInstance.getDailySunset();
}

function getWeather() {
  return weatherControllerInstance.getWeather();
}

function getOsakaWeather() {
  return weatherControllerInstance.getOsakaWeather();
}

function decideLightColor(weather) {
  return weatherControllerInstance.decideLightColor(weather);
}

function logResult(weather, signalId, statusCode) {
  return weatherControllerInstance.logResult(weather, signalId, statusCode);
}

function main() {
  return weatherControllerInstance.main();
}
