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
console.log(`my user id: ${myUserId}`);
console.log(`thread id: ${threadId}`);

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

login(credentials, options, (err, api) => {
  if (err) {
    return console.error(err);
  }

  api.listenMqtt((err, message) => {
    if (err) {
      console.log('Error is in API LISTEN');
      console.log(err);
    } else {
      if (!fbCookiesStored) {
        fs.writeFileSync(cookiesFilePath, JSON.stringify(api.getAppState()));
        fbCookiesStored = true;
      }

      const isNotSentByMe = message.senderID !== myUserId;
      const isSentInCorrectConversation = message.threadID === threadId;
      const isMessageOrReply = message.type === 'message' || message.type === 'message_reply';
      if (isMessageOrReply && isNotSentByMe && isSentInCorrectConversation) {
        mutex.runExclusive(() => {
          ++messagesCounter;

          if (messagesCounter == repeatEveryMessagesCountThreshold) {
            messagesCounter = 0;

            api.sendMessage(
              repeaterMessage,
              message.threadID,
              (err, messageInfo) => {
                if (err) {
                  return console.error(err);
                }
              }
            );
          }
        });

      }
    }
  });
});
