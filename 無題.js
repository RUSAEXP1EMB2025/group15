function sunRise() {
  //この関数は、日の出時刻を取得する関数である
  const latitude = 34.816; // 緯度（例: 茨木市）
  const longitude = 135.568; // 経度（例: 茨木市）

  const url = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`;

  try {
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());

    if (data.status === "OK") {
      const sunriseUTC = new Date(data.results.sunrise);
      const localSunrise = sunriseUTC.toLocaleTimeString("ja-JP", { timeZone: "Asia/Tokyo" });
      Logger.log(`日出時刻: ${localSunrise}`);
    } else {
      Logger.log("APIエラー: " + data.status);
    }
  } catch (error) {
    Logger.log("通信エラー: " + error);
  }
}