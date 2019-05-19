var POST_URL  = 'xxxxxxxxxx';
var USER_NAME = 'post-to-slack-bot';  // 通知時に表示されるユーザー名
var ICON      = ':dog2:';  // 通知時に表示されるアイコン
var DATA_START_ROW = 2;

var CHANNEL_COLUMN_INDEX     = 2;
var PROBABILITY_COLUMN_INDEX = 3;
var WORDS_COLUMN_START_INDEX = 4;
var WORDS_COLUMN_END_INDEX   = WORDS_COLUMN_START_INDEX + 5;

function postToSlack() {
  createTrigger();
  var jsonData = {};
  jsonData.username   = USER_NAME;
  jsonData.icon_emoji = ICON;

  var options = {};
  options.method = "post";
  options.contentType = "application/json";

  var sheet = SpreadsheetApp.getActiveSheet(); 
  var lastRow = sheet.getLastRow();
  for(var i = DATA_START_ROW; i <= lastRow; i++) {
    var channel = sheet.getRange(i, CHANNEL_COLUMN_INDEX).getValue();
    if(channel){
      var probability = sheet.getRange(i, PROBABILITY_COLUMN_INDEX).getValue();
      var message = 'mameshiba ' + '#' + channel + ' ' + probability;
      for(var j = WORDS_COLUMN_START_INDEX; j <= WORDS_COLUMN_END_INDEX; j++ ) {
        if(sheet.getRange(i, j).getValue()) {
          message += ' ' + sheet.getRange(i, j).getValue();
        }
      }
      jsonData.text = message;
      options.payload = JSON.stringify(jsonData);

      UrlFetchApp.fetch(POST_URL, options);
    }
  }
}

function createTrigger() {
  if(ScriptApp.getProjectTriggers().length == 0) {
    ScriptApp.newTrigger('postToSlack')
      .timeBased()
      .onWeekDay(ScriptApp.WeekDay.MONDAY)
      .atHour(10)
      .create();
  }
}
