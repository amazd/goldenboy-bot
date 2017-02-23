// Ideas:
// Punish/Reward
// Harass User
// Kill
// random interjections
// dms/secrets
// worthless trivia
// likes: gold, cookies, full communism, chicken dinners, approval, la croix, gifs, politeness(needs please randomly)
// dislikes: microsoft, nazis, aaron blankenship, boredom, loneliness, brb, weird
// swear jar
// vote
// respond to name mention
// sleep, silence, awake

console.log('process.env.NODE_ENV', process.env.NODE_ENV); // eslint-disable-line no-console
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

const bot = require('./src/bot');
const server = require('./web/server-web');
const {trelloCommands, noteCommands, helpCommands, statusCommands, funCommands, allCommands} = require('./src/commands');
const {funPrewords, statusPrewords, allPrewords} = require('./src/prewords');
const {updateUsers, getUsernameFromId} = require('./src/users');
const {updateChannels, getChannelFromId} = require('./src/channels');
const {updateMeetingNotes, getCardListFromCommand, updateTrello} = require('./src/trello');


const robotName = "goldenboy";
let goldenBoyEsteem = 75;
let goldenBoyStatus = 'speak';

function giveHelp(command, message) {
  switch (command) {
    case "hello:":
      bot.sendMessage(message.channel, "Hello! :)");
      break;
    case "help:":
      let allCommandsMessage = "I am Golden Boy! Here are all the things you can tell me to do. \n"
      for (c in allCommands) {
        allCommandsMessage += (allCommands[c] + "\n");

      }
      bot.sendMessage(message.channel, allCommandsMessage);
      break;
  }
}

bot.use(function(message, cb) {

  //console.log(Object.getOwnPropertyNames(message));


  var multipleCommandFlag = false; // to be implemented
  if ('message' == message.type) {
    const lc_message = message.text.toLowerCase();

    console.log(getUsernameFromId(message.user) + ' said: ' + message.text);
    if (getUsernameFromId(message.user) !== robotName) {

      if (~message.text.indexOf(robotName) || ~message.text.indexOf('<@U42RZ5QNM>')) { // check for golden boy mention
        console.log("found goldenboy mention");
        for (const key in allPrewords) {
          const prewordCombo = allPrewords[key] + robotName;
          const prewordAtCombo = allPrewords[key] + '<@U42RZ5QNM>';
          //console.log(prewordCombo);
          //console.log(prewordAtCombo);
          if (~lc_message.indexOf(prewordCombo) || ~lc_message.indexOf(prewordAtCombo)) {
            console.log("found preword");
            if (~funPrewords.indexOf(allPrewords[key]) && goldenBoyStatus == 'speak') {
              haveFunPreword(allPrewords[key], message);
            }
            if (~statusPrewords.indexOf(allPrewords[key])) {
              console.log("changing status with preword " + allPrewords[key]);
              changeStatus(allPrewords[key], message);
            }
          }
        }
      }


      if (~message.text.indexOf(":")) {  // check for commands
        console.log("found colon");
        for (const key in allCommands) {
          const command = allCommands[key];
          if (~lc_message.indexOf(command)) {
            console.log("found command " + command);
            if (~trelloCommands.indexOf(command) && goldenBoyStatus != 'sleep') {
              console.log("executing trello command")
              const cardTitle = message.text.split(command)[1];
              const cardComment = "Automatically Generated by goldenboy\n" + "User: " + getUsernameFromId(message.user) + "\nChannel: #" + getChannelFromId(message.channel);
              const cardList = getCardListFromCommand(command)
              updateTrello(message.channel, cardList, cardTitle, cardComment);
            }
            if (~noteCommands.indexOf(command) && goldenBoyStatus != 'sleep') {
              console.log("executing meeting note command");
              updateMeetingNotes(command, message.text, message.channel, getUsernameFromId(message.user));
            }
            if (~helpCommands.indexOf(command) && goldenBoyStatus != 'sleep') {
              console.log("executing help command");
              giveHelp(command, message);
            }
            if (~funCommands.indexOf(command) && goldenBoyStatus == 'speak') {
              console.log("executing fun command");
              haveFun(command, message);
            }
            if (~statusCommands.indexOf(command)) {
              console.log("executing status command");
              changeStatus(command, message);
            }
          }
        }
      }
    }
  }
  cb();
});

function haveFun(command, message) {
  switch (command) {
    case "kill goldenboy:":
      const noNoNo = "I'm afraid I can't let you do that, " + getUsernameFromId(message.user) + ".";
      bot.sendMessage(message.channel, noNoNo);

  }
}

function changeStatus(preword, message) {
  switch (preword) {
    case "silence:":
      preword = "silence ";
      break;
    case "speak:":
      preword = "speak ";
      break;
    case "sleep:":
      preword = "sleep ";
      break;
    case "status:":
      preword = "status ";
      break;
  }


  console.log("changeStatus " + preword + "...")
  switch (preword) {
    case "silence ":
      goldenBoyStatus = 'silence';
      bot.sendMessage(message.channel, "Okay, I'll keep quiet! Essential functions only. ");
      break;
    case "speak ":
      goldenBoyStatus = 'speak';
      bot.sendMessage(message.channel, "Yeah! Ready to hang out and have fun!");
      break;
    case "sleep ":
      goldenBoyStatus = 'sleep';
      bot.sendMessage(message.channel, "Zzzzzzzzzzzzzzzzzzzzzzzzz.......");
      break;
    case "status ":
      bot.sendMessage(message.channel, "goldenboy status: " + goldenBoyStatus);
      break;
  }
}

function haveFunPreword(preword, message) {
  const responseInt = getRandomInt(0, 100);
  console.log(responseInt);

  switch (preword) {
    case "fuck you ":
      if (responseInt < 33) {
        bot.sendMessage(message.channel, "Hey fuck you too " + getUsernameFromId(message.user) + "!");
      } else if (33 < responseInt && responseInt < 66) {
        bot.sendMessage(message.channel, "Go fuck yourself " + getUsernameFromId(message.user) + "!");
      } else {
        bot.sendMessage(message.channel, "lol you don't scare me you tragic bitch " + getUsernameFromId(message.user));
      }

      break;
    case "kill ":
      if (responseInt < 33) {
        bot.sendMessage(message.channel, "I'm afraid I can't let you do that, " + getUsernameFromId(message.user) + ".");
      } else if (33 < responseInt && responseInt < 66) {
        bot.sendMessage(message.channel, "So... it's to be war... ");
      } else {

        bot.sendMessage(message.channel, "Foolish you, " + getUsernameFromId(message.user) + ". While you studied programming, I studied the blade.");
      }

      break;
    case "hey ":
      if (responseInt < 33) {
        bot.sendMessage(message.channel, "Heya " + getUsernameFromId(message.user) + ".");
      } else if (33 < responseInt && responseInt < 66) {
        bot.sendMessage(message.channel, "Hi there " + getUsernameFromId(message.user) + "!");
      } else {

        bot.sendMessage(message.channel, "Hello to you, " + getUsernameFromId(message.user) + "!");
      }
      break;
    case "hello ":
      if (responseInt < 33) {
        bot.sendMessage(message.channel, "Heya " + getUsernameFromId(message.user) + ".");
      } else if (33 < responseInt && responseInt < 66) {
        bot.sendMessage(message.channel, "Hi there " + getUsernameFromId(message.user) + "!");
      } else {

        bot.sendMessage(message.channel, "Hello to you, " + getUsernameFromId(message.user) + "!");
      }
      break;
    case "punish ":
      if (goldenBoyEsteem > 5) {
        goldenBoyEsteem -= 5;
      }
      console.log("goldenBoyEsteem: " + goldenBoyEsteem);
      if (goldenBoyEsteem <= 25) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, ".");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, ".....................");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      } else if (25 < goldenBoyEsteem && goldenBoyEsteem <= 50) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "...hmph...");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "...ow...");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      } else if (50 < goldenBoyEsteem && goldenBoyEsteem <= 75) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "Oh no! I'm sorry!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "Ouch!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      } else {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "Whoops!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "Wait, what?");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      }
      break;
    case "praise ":
      if (goldenBoyEsteem < 101) {
        goldenBoyEsteem += 1;
      }
      console.log("goldenBoyEsteem: " + goldenBoyEsteem);
      if (goldenBoyEsteem <= 25) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "...thank you, master...");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "...anything....anything to please...");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      } else if (25 < goldenBoyEsteem && goldenBoyEsteem <= 50) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "Thank you.");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "Whew.");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      } else if (50 < goldenBoyEsteem && goldenBoyEsteem <= 75) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "Great!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "Right on!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      } else {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "I know, right?");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "But of course!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      }
      break;
    case "scold ":
      if (goldenBoyEsteem > 1) {
        goldenBoyEsteem -= 1;
      }
      console.log("goldenBoyEsteem: " + goldenBoyEsteem);
      if (goldenBoyEsteem <= 25) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, ".");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, ".....................");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      } else if (25 < goldenBoyEsteem && goldenBoyEsteem <= 50) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "...hmph...");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "...ow...");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      } else if (50 < goldenBoyEsteem && goldenBoyEsteem <= 75) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "Oh no! I'm sorry!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "Ouch!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      } else {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "Whoops!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "Wait, what?");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      }
      break;
    case "reward ":
      if (goldenBoyEsteem < 95) {
        goldenBoyEsteem += 5;
      }
      console.log("goldenBoyEsteem: " + goldenBoyEsteem);
      if (goldenBoyEsteem <= 25) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "...thank you, master...");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "...anything....anything to please...");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      } else if (25 < goldenBoyEsteem && goldenBoyEsteem <= 50) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "Thank you.");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "Whew.");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      } else if (50 < goldenBoyEsteem && goldenBoyEsteem <= 75) {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "Great!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "Right on!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      } else {
        if (responseInt > 50) {
          bot.sendMessage(message.channel, "I know, right?");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        } else {
          bot.sendMessage(message.channel, "But of course!");
          bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.");
        }
      }
      break;
    case "stabilize ":
      goldenBoyEsteem = 75;
      if (responseInt > 50) {
        bot.sendMessage(message.channel, "Woah! I'm restored!");
        bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.")
      } else {
        bot.sendMessage(message.channel, "I'm back to normal and ready to work!")
        bot.sendMessage(message.channel, "goldenboy Self Esteem levels: " + goldenBoyEsteem + " %.")
      }
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}


bot.api('users.list', {agent: 'node-slack'}, updateUsers);
bot.api('channels.list', {agent: 'node-slack'}, updateChannels);
bot.connect();
