#!/usr/bin/env node
const fs = require('fs');
const login = require('facebook-chat-api');
var Mutex = require('async-mutex').Mutex;

const repeatEveryMessagesCountThreshold = process.env.REPEAT_EVERY_X_MESSAGES;
const repeaterMessage = process.env.REPEATER_MESSAGE;
const myUserId = process.env.USER_ID;
const threadId = process.env.THREAD_ID;
const cookiesFilePath = process.env.COOKIES_FILE_PATH;

console.log(`repeat every ${repeatEveryMessagesCountThreshold}`);
console.log(`message: "${repeaterMessage}"`);
console.log(`my user id ${myUserId}`);
console.log(`thread id ${threadId}`);

const options = {
  listenEvents: true,
  selfListen: true,
};

const credentials = {
  appState: JSON.parse(fs.readFileSync(cookiesFilePath, 'utf8')),
};

let fbCookiesStored = false;

const mutex = new Mutex();
let messagesCounter = repeatEveryMessagesCountThreshold - 1;

process.on('SIGINT', () => process.exit());
process.on('SIGTERM', () => process.exit());
process.on('SIGUSR2', () => process.exit());

login(credentials, options, (err, api) => {
  if (err) {
    return console.error(err);
  }

  api.listenMqtt((err, message) => {
    if (err) {
      console.log('SOHAIB: Error is in API LISTEN');
      console.log(err);
    } else {
      if (!fbCookiesStored) {
        fs.writeFileSync(cookiesFilePath, JSON.stringify(api.getAppState()));
        fbCookiesStored = true;
      }

      const isNotSentByMyself = message.senderID !== myUserId;
      const isSentInCorrectConversation = message.threadID === threadId;
      if (message.type === 'message' && isNotSentByMyself && isSentInCorrectConversation) {
        console.log('New message received');
        console.log(message);

        console.log('Mutex is ' + mutex.isLocked());

        mutex.runExclusive(() => {
          ++messagesCounter;
          console.log('increasing counter to ' + messagesCounter);

          if (messagesCounter == repeatEveryMessagesCountThreshold) {
            console.log('sending message');
            messagesCounter = 0;

            api.sendMessage(
              repeaterMessage,
              message.threadID,
              (err, messageInfo) => {
                if (err) {
                  return console.error(err);
                }
                console.log(messageInfo);
              }
            );
          }
        });

      } else if (message.type === 'event') {
        console.log('Event received');
        console.log(message);
      }
    }
  });
});
