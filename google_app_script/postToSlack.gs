// this script is here
// -> https://github.com/yukimura1227/mameshiba-slack-bot/edit/master/google_app_script/postToSlack.gs
var POST_URL  = 'xxxxxxxxxx';
var USER_NAME = 'post-to-slack-bot';  // 通知時に表示されるユーザー名
var DATA_START_ROW = 2;

var CHANNEL_COLUMN_INDEX        = 2;
var PROBABILITY_COLUMN_INDEX    = 3;
var TARGET_WEEKDAY_COLUMN_INDEX = 4;
var WORDS_COLUMN_START_INDEX    = 5;
var WORDS_COLUMN_END_INDEX      = WORDS_COLUMN_START_INDEX + 5;
var WEEKDAY_ARRAY = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.' ,'Sat.'] // NOTE: Date#getDay() -> 0: Sun. 1: Mon ...

function postToSlack() {
  console.info('start postToSlack()');
  createTrigger();
  var jsonData = {};
  jsonData.username   = USER_NAME;

  var options = {};
  options.method = "post";
  options.contentType = "application/json";

  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = sheet.getLastRow();
  var currentWeekdayStr = WEEKDAY_ARRAY[new Date().getDay()];
  for(var i = DATA_START_ROW; i <= lastRow; i++) {
    console.info(i);
    var channel = sheet.getRange(i, CHANNEL_COLUMN_INDEX).getValue();
    var targetWeekDay = sheet.getRange(i, TARGET_WEEKDAY_COLUMN_INDEX).getValue();

    if(channel && targetWeekDay == currentWeekdayStr){
      // console.info(i);
      var probability = sheet.getRange(i, PROBABILITY_COLUMN_INDEX).getValue();
      var message = 'mameshiba ' + '#' + channel + ' ' + probability;
      for(var j = WORDS_COLUMN_START_INDEX; j <= WORDS_COLUMN_END_INDEX; j++ ) {
        if(sheet.getRange(i, j).getValue()) {
          message += ' ' + sheet.getRange(i, j).getValue().replace(/[\r\n]+/g, '');
        }
      }
      jsonData.text = message;
      options.payload = JSON.stringify(jsonData);
      console.info(message);

      UrlFetchApp.fetch(POST_URL, options);
    }
  }
  console.info('end postToSlack()');
}

function createTrigger() {
  if(ScriptApp.getProjectTriggers().length == 0) {
    ScriptApp.newTrigger('postToSlack')
      .timeBased()
      .everyDays(1)
      .atHour(10)
      .nearMinute(20)
      .create();
  }
}
