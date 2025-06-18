function listRemoSignals() {
  const REMO_TOKEN = 'ory_at_I8oGWUUjCPNw6yNxv-aptDtezSBK_C1_5cZ1qfHS1nY.6Zm2cA1rclxnNQNTTqzYEEPmzywi9qVrjMPWeYRs3iU';
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

