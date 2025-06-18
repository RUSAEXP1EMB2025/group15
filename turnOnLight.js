const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN'; // Nature Remoのアクセストークン

function turnOnLight() {
  
  const url = 'https://api.nature.global/1/appliances';
  const headers = {
    'Authorization': 'Bearer ' + ACCESS_TOKEN,
  };
  const options = {
    'method': 'get',
    'headers': headers,
  };
  const response = UrlFetchApp.fetch(url, options);
  const appliances = JSON.parse(response.getContentText());

  // 照明のnicknameを指定
  const lightNickname = '照明';

  for (let i = 0; i < appliances.length; i++) {
    if (appliances[i].nickname === lightNickname && appliances[i].type === 'LIGHT') {
      const signals = appliances[i].signals;
      for (let j = 0; j < signals.length; j++) {
        if (signals[j].name === 'オン') { // "オン"という名前の信号を探す
          const signalId = signals[j].id;
          const signalUrl = `https://api.nature.global/1/signals/${signalId}/send`;
          const signalOptions = {
            'method': 'post',
            'headers': headers,
          };
          UrlFetchApp.fetch(signalUrl, signalOptions);
          return;
        }
      }
    }
  }
}



