function change_cool() {
  var url = "https://api.nature.global/1/signals/" + "9d6fd539-96c2-459a-992d-f829d1acbcf4" + "/send"
    var options = {
      "method" : "post",
      "headers" : {"Authorization" : "Bearer ory_at_VXpeuuSNUAC0381bEDo2RZcjKekoh9LI6NtB0tMRDRg.Mp78KMyOtmX8c3nn-bORMu1EQHab9x5GFUIqnJtT9lk"}
    };

    var i=0;
  do{
    var reply = UrlFetchApp.fetch(url, options);
    i ++;
  } while(i < 10)
}

function change_warm() {
  var url = "https://api.nature.global/1/signals/" + "e0173dac-3876-4b3d-92d7-3a3ef9b6f3b9" + "/send"
    var options = {
      "method" : "post",
      "headers" : {"Authorization" : "Bearer ory_at_VXpeuuSNUAC0381bEDo2RZcjKekoh9LI6NtB0tMRDRg.Mp78KMyOtmX8c3nn-bORMu1EQHab9x5GFUIqnJtT9lk"}
    };

    var i=0;
  do{
    var reply = UrlFetchApp.fetch(url, options);
    i ++;
  } while(i < 10)
}


function off() {
  var url = "https://api.nature.global/1/signals/" + "8a02fa60-e218-4c4d-b31d-a5ea34769021" + "/send"
    var options = {
      "method" : "post",
      "headers" : {"Authorization" : "Bearer ory_at_VXpeuuSNUAC0381bEDo2RZcjKekoh9LI6NtB0tMRDRg.Mp78KMyOtmX8c3nn-bORMu1EQHab9x5GFUIqnJtT9lk"}
    };
    var reply = UrlFetchApp.fetch(url, options);
}

function on(){
    var url = "https://api.nature.global/1/signals/" + "31b48473-af6a-4ad8-8ce2-a064ed79bc46" + "/send"
    var options = {
      "method" : "post",
      "headers" : {"Authorization" : "Bearer ory_at_VXpeuuSNUAC0381bEDo2RZcjKekoh9LI6NtB0tMRDRg.Mp78KMyOtmX8c3nn-bORMu1EQHab9x5GFUIqnJtT9lk"}
    };
    var reply = UrlFetchApp.fetch(url, options);
}