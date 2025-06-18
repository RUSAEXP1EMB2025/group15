function getNatureRemoData(endpoint) {
  const REMO_ACCESS_TOKEN = 'ory_at_7D7q5_rzLu1VNckDRnE-b4SK6KgEaNy52vEpUzeFU94.2ybsAM-H-MfeiR9HP4NEPxZxvz1uqFNniWFkKhDQ5Cs'
  const headers = {
    "Content-Type" : "application/json;",
    'Authorization': 'Bearer ' + REMO_ACCESS_TOKEN,
  };

  const options = {
    "method" : "get",
    "headers" : headers,
  };

  return JSON.parse(UrlFetchApp.fetch("https://api.nature.global/1/" + endpoint, options));
}
