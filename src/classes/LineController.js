class LineController {
  constructor() {
    this.channelAccessToken = (typeof configInstance !== 'undefined') ? configInstance.CHANNEL_ACCESS_TOKEN : "hcre+X+7tc46fUoPuGgBopw/QccQtgRkhODt0y1ZX0W2e4ddE+3/Ua7E3sJEIcsfN7SMprAofrKzsm7HNG4URLgY7T66N+kbsZExQtvviZqJn4Cxadam/TkJH3ddgLLKiGpmTRraPNyyv/AxfGWo9gdB04t89/1O/w1cDnyilFU=";
    this.emailAddress = (typeof configInstance !== 'undefined') ? configInstance.YOUR_EMAIL_ADRESS : "yuto721831@gmail.com";
    this.messagesArray = [
      '⏰ アラームです！時間になりました！起きてください！',
      '⏰ アラームです！時間になりました！起きてください！',
      '⏰ アラームです！時間になりました！起きてください！',
      '📢 起きる時間ですよ！',
      '🚨 アラーム発動！そろそろ起きる時間です！',
      '🕒 時間ですよ！今日も頑張りましょう！',
      '🎶 Good morning!', 
      '🌞 Bonjour!'
    ];
  }

  sendLineMessage(userId = null, messageText = null) {
    const props = PropertiesService.getScriptProperties();
    const stopSending = props.getProperty('stopSending');

    if (stopSending === 'true') {
      Logger.log('送信停止フラグが立っているため、メッセージ送信を中止します。');
      return;
    }

    const targetUserId = userId || ((typeof configInstance !== 'undefined') ? configInstance.alarmID() : 'your_user_id_here');
    const targetMessage = messageText || this.getRandomMessage();

    const message = {
      to: targetUserId,
      messages: [
        {
          type: 'text',
          text: targetMessage
        }
      ]
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + this.channelAccessToken
      },
      payload: JSON.stringify(message)
    };

    UrlFetchApp.fetch('https://api.line.me/v2/bot/message/push', options);
  }

  getRandomMessage() {
    const randomIndex = Math.floor(Math.random() * this.messagesArray.length);
    return this.messagesArray[randomIndex];
  }

  sendReplyMessage(replyToken, messageText) {
    const replyUrl = "https://api.line.me/v2/bot/message/reply";
    const headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.channelAccessToken
    };

    const postData = {
      "replyToken": replyToken,
      "messages": [{ "type": "text", "text": messageText }]
    };

    const options = {
      "method": "post",
      "headers": headers,
      "payload": JSON.stringify(postData)
    };

    UrlFetchApp.fetch(replyUrl, options);
  }

  sendEmail(subject, body) {
    MailApp.sendEmail(this.emailAddress, subject, body);
  }
}

// グローバルインスタンス
const lineControllerInstance = new LineController();

// 従来の関数として公開
function sendLineMessage(userId = null, messageText = null) {
  return lineControllerInstance.sendLineMessage(userId, messageText);
}
