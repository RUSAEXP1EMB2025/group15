# group15

This is repository to make a industry. 

## Architecture

The project has been refactored to use class-based architecture while maintaining backward compatibility with all existing function names.

### Class Structure

- `Config.js`: Configuration management class
- `NatureRemoController.js`: Nature Remo API control class  
- `WeatherController.js`: Weather API and sunrise/sunset management class
- `LineController.js`: LINE Bot API management class
- `SpreadsheetController.js`: Google Sheets data management class
- `AlarmController.js`: Alarm logic and trigger management class
- `LineReceiver.js`: LINE message processing class
- `Snoozer.js`: Weekly alarm and snooze functionality class
- `MainApp.js`: Main application class that integrates all components

### Key Features

1. **Regular Alarms**: One-time alarms with YYMMDDhhmm format
2. **Weekly Alarms**: Recurring alarms for specific days of the week
3. **Automatic Light Control**: Based on weather conditions and sunrise/sunset
4. **LINE Bot Integration**: Interactive alarm management via LINE
5. **Separate Spreadsheet Management**: Normal and weekly alarms use different spreadsheets

## How to use the refactored system

The system maintains all original function names for backward compatibility.

### Setup Config

Update the configuration in `Config.js`:

```javascript
class Config {
  constructor() {
    this.CHANNEL_ACCESS_TOKEN = "YOUR_CHANNEL_ACCESS_TOKEN";
    this.YOUR_EMAIL_ADRESS = "your_email@example.com";
    this.REMO_TOKEN = "YOUR_REMO_TOKEN";
  }
}
```

## GAS settings

Go to trigger page and set triggers as below.

### For Regular Alarms:
```
Choose which function to run       : sendAlarmMail
Choose which deployment should run : Head
Select event source                : Time-Driven
Select type of time based trigger  : Minutes Timer
Select minute interval             : Every minutes
```

### For Weekly Alarms:
```
Choose which function to run       : sendWeeklyAlarmMail  
Choose which deployment should run : Head
Select event source                : Time-Driven
Select type of time based trigger  : Minutes Timer
Select minute interval             : Every minutes
```

### For Light Control:
```
Choose which function to run       : lightController
Choose which deployment should run : Head
Select event source                : Time-Driven
Select type of time based trigger  : Minutes Timer
Select minute interval             : Every minutes
```

### For Snoozer (Alternative):
```
Choose which function to run       : sendAlarms
Choose which deployment should run : Head
Select event source                : Time-Driven
Select type of time based trigger  : Minutes Timer
Select minute interval             : Every minutes
```

## Spreadsheet Configuration

You need to create two separate spreadsheets:

1. **Normal Alarms Spreadsheet**: For one-time alarms
2. **Weekly Alarms Spreadsheet**: For recurring weekly alarms

Update the spreadsheet IDs in `Snoozer.js`:

```javascript
// Update these with your actual spreadsheet IDs
this.normalAlarmSheetId = "YOUR_NORMAL_ALARM_SPREADSHEET_ID";
this.weeklyAlarmSheetId = "YOUR_WEEKLY_ALARM_SPREADSHEET_ID";
```

## LINE Bot Commands

### Normal Alarms:
- `目覚まし設定`: Set one-time alarm
- `アラーム一覧`: List all alarms  
- `アラーム解除`: Delete alarms

### Weekly Alarms:
- `毎週アラーム設定`: Set weekly recurring alarm
- `いちらん`: List weekly alarms
- `かいじょ`: Delete weekly alarms

### Light Control:
- `オン`: Turn lights on
- `オフ`: Turn lights off

## LINE Bot Usage

### Basic Light Control Commands
Send these messages to your LINE Bot:

```
オン     → Turn on the light
オフ     → Turn off the light
```

### Alarm Setup Commands
```
アラーム設定        → Set one-time alarm (YYMMDDhhmm format)
毎週アラーム設定    → Set weekly recurring alarm
アラーム一覧        → List all set alarms
アラーム解除        → Delete alarm
いちらん            → List weekly alarms
```

### Alarm Setup Flow

**One-time Alarm:**
1. Send "アラーム設定"
2. Enter date/time in YYMMDDhhmm format (e.g., "2501081430" for Jan 8, 2025 14:30)

**Weekly Alarm:**
1. Send "毎週アラーム設定"
2. Enter day and time (e.g., "火曜 07:00" for Tuesday 7:00 AM)

### LINE Bot Setup
1. Go to LINE Developers Console
2. Set Webhook URL: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`
3. Enable Webhook usage
4. Grant message send/receive permissions

### Weather-Based Light Control
The system automatically adjusts light color based on weather:
- **Sunny** → White (cool color)
- **Rainy** → Yellow (warm color)  
- **Cloudy** → Intermediate color

## Troubleshooting

### Test Functions
Run these functions in GAS Script Editor to debug:

```javascript
// Test modular structure
testModularStructure()

// Test all components
testAllComponents()

// Test specific functions
testModule()
```

### Common Issues
1. **LINE messages not working**: Check Webhook URL and permissions
2. **Alarms not triggering**: Verify time-based triggers are set correctly
3. **Light not responding**: Check Nature Remo token and signal IDs

## GAS settings
