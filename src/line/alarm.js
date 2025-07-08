function sendLineMessage() {
  const props = PropertiesService.getScriptProperties();
  const stopSending = props.getProperty('stopSending');

  if (stopSending === 'true') {
    Logger.log('送信停止フラグが立っているため、メッセージ送信を中止します。');
    return;
  }

  const userId = USER_ID;
  const accessToken = CHANNEL_ACCESS_TOKEN;

  // メッセージのバリエーション
  const messagesArray = [
    '⏰ アラームです！時間になりました！起きてください！',
    '⏰ アラームです！時間になりました！起きてください！',
    '⏰ アラームです！時間になりました！起きてください！',
    '📢 起きる時間ですよ！',
    '🚨 アラーム発動！そろそろ起きる時間です！',
    '🕒 時間ですよ！今日も頑張りましょう！',
    '🎶 Good morning!', 
    '🌞 Bonjour!'
  ];

  // ランダムにメッセージを選択
  const randomIndex = Math.floor(Math.random() * messagesArray.length);
  const selectedMessage = messagesArray[randomIndex];

  const message = {
    to: userId,
    messages: [
      {
        type: 'text',
        text: selectedMessage
      }
    ]
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + accessToken
    },
    payload: JSON.stringify(message)
  };

  UrlFetchApp.fetch('https://api.line.me/v2/bot/message/push', options);
}
