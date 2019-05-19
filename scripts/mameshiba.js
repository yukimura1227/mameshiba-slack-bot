/*
Description:
  redirect to channel

Dependencies:
  None

Configuration:
  None

Commands:
  sample_hubot mameshiba #[channel] [probability] [word 1] [word 2] [word n].... - execute word posting with that probability to specific channel

Notes:
  None

Author:
  yukimura1227
*/

function sleep(msec) {
  return new Promise(resolve => setTimeout(resolve, msec));
}

module.exports = function(robot) {
  // ex) mameshiba #general 50 明日は きっと 晴れ
  robot.hear(/^mameshiba\s+#(.*)\s+(\d+)\s+(.*)/i, async (res) => {
    var channel     = res.match[1];
    var probability = res.match[2];
    var words       = res.match[3].split(' ');
    for(let word of words) {
      robot.send({ room: channel }, word);
      await sleep(3000);
    }
  });
};

