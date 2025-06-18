function myFunction() {

  const latitude = 34.816; // 緯度（例: 茨木市）
  const longitude = 135.568; // 経度（例: 茨木市）

  async function getSunriseTime(lat, lon) {
    const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === "OK") {
        const sunriseUTC = new Date(data.results.sunrise);
        const localSunrise = sunriseUTC.toLocaleTimeString("ja-JP", { timeZone: "Asia/Tokyo" });
      console.log(`日出時刻: ${localSunrise}`);
      } else {
        console.error("APIエラー:", data.status);
      }
    } catch (error) {
      console.error("通信エラー:", error);
    }
  }

getSunriseTime(latitude, longitude);
}