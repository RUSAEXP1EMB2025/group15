//時刻制御
function lightController(){
  
//現在の時刻取得  
  const now = new Date();
  //YYMMDDhhmmに変換
  const nowTime = formatDate(now);
  Logger.log(nowTime);

//日の出判定
 if(nowTime==getDailySunrise()){
  Logger.log('Sunrise!');
  turnOnLight();
 }else{
  Logger.log('NOT SunRise!');
 }

//日の入り判定
 if(nowTime==getDailySunset()){
  Logger.log('Sunset!');
  turnOnLight();
 }else{
  Logger.log('NOT Sunset!');
 }

}