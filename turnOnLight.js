//3,17,30を変更してください
function turnOnLight() {
  const ACCESS_TOKEN = key(); // アクセストークンをここに
  const url = 'https://api.nature.global/1/appliances';
  const headers = {
    'Authorization': 'Bearer ' + ACCESS_TOKEN,
  };
  const options = {
    'method': 'get',
    'headers': headers,
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const appliances = JSON.parse(response.getContentText());

    const lightNickname = '照明';  //照明　変更

    for (let i = 0; i < appliances.length; i++) {
      const appliance = appliances[i];
      if (appliance.nickname === lightNickname && appliance.type === 'LIGHT') {
        const applianceId = appliance.id;
        const controlUrl = `https://api.nature.global/1/appliances/${applianceId}/light`;
        const controlOptions = {
          'method': 'post',
          'headers': {
            'Authorization': 'Bearer ' + ACCESS_TOKEN,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          'payload': 'button=on', //button=on も変更
        };
        UrlFetchApp.fetch(controlUrl, controlOptions);
        Logger.log('Light turned on!');
        return;
      }
    }
    Logger.log('Light not found.');
  } catch (e) {
    Logger.log('Error: ' + e.message);
  }
}

