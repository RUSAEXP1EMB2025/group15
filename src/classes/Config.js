// 本設定値でのConfig定義
const configInstance = {
  CHANNEL_ACCESS_TOKEN: "hcre+X+7tc46fUoPuGgBopw/QccQtgRkhODt0y1ZX0W2e4ddE+3/Ua7E3sJEIcsfN7SMprAofrKzsm7HNG4URLgY7T66N+kbsZExQtvviZqJn4Cxadam/TkJH3ddgLLKiGpmTRraPNyyv/AxfGWo9gdB04t89/1O/w1cDnyilFU=",
  YOUR_EMAIL_ADRESS: "yuto721831@gmail.com",
  REMO_TOKEN: "ory_at_-k01LALh-Ca5yJKhiG8kYJs12OHZlScpRSAUqxp14YE.ddBxAUY8u8916Gx66rtu9paZryKp5CUOJEYAs5b2KgI",
  
  // 従来の関数名を維持
  key: function() {
    return this.REMO_TOKEN;
  },
  
  alarmKey: function() {
    return this.CHANNEL_ACCESS_TOKEN;
  },
  
  alarmID: function() {
    return "U5b1391f394868ed64c15cd6fb5034ae9"; // 実際のユーザーID
  }
};

// 従来の関数として公開
function key() {
  return configInstance.key();
}

function alarmKey() {
  return configInstance.alarmKey();
}

function alarmID() {
  return configInstance.alarmID();
}

// クラス定義も復活（互換性のため）
class Config {
  constructor() {
    this.CHANNEL_ACCESS_TOKEN = configInstance.CHANNEL_ACCESS_TOKEN;
    this.YOUR_EMAIL_ADRESS = configInstance.YOUR_EMAIL_ADRESS;
    this.REMO_TOKEN = configInstance.REMO_TOKEN;
  }

  key() {
    return this.REMO_TOKEN;
  }

  alarmKey() {
    return this.CHANNEL_ACCESS_TOKEN;
  }

  alarmID() {
    return configInstance.alarmID();
  }
}
