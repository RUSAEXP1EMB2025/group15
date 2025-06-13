# group15

This is repositry to make a industry. 

## How to use reciever.js and checker.js

To use this src, please make 'key.js' on your local and write code as below.

```
var CHANNEL_ACCESS_TOKEN = "YOUR_CHANNEL_ACCESS_TOKEN";
```

Please write your channel access token which you generated instead of YOUR_CHANNEL_ACCESS_TOKEN.

## GAS settings

Go to trigger page and set trigeer as below.

```
Choose which function to run: sendAlarmMail
Choose which deployment should run: Head
Select event source: Time-Driven
Select type of time based trigger: Minutes Timer
Select minute interval: Every minutes
```

## About git

To update your code and upload to your remote branch, use below code.

```
git add .
git commit -m 'YOUR_UPDATE_MESSAGE'
git push
```

To pull chenges from remote branch.
```
git pull
```

When you merge your branch to origin/main go to github.com and choose pull request.   
Push 'New pull request'.  
Change compare branch to yours.  
Choose trowde to Reviewers.
Push Create Pull Request.