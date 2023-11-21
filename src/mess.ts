#!/usr/bin/env node
import fs from "fs";
//@ts-ignore
import login from "facebook-chat-api";
import { config } from "./config";
import { Mutex } from "async-mutex";
import Bot from "./bot";

console.log(`my user id: ${config.USER_ID}`);
console.log(`thread id: ${config.THREAD_ID}`);

const options = {
  listenEvents: true,
  selfListen: true,
};

const credentials = {
  appState: JSON.parse(fs.readFileSync(config.COOKIES_FILE_PATH, 'utf8')),
};

let fbCookiesStored = false;
process.on('SIGINT', () => process.exit());
process.on('SIGTERM', () => process.exit());

class Mess {
    api: any;
    bot?: Bot;
    constructor() {
        
        // @ts-ignore
        login(credentials, options, (err, api) => {
            this.api = api;
            // @ts-ignore
            this.api.listenMqtt((err, message) => {
                if (err) {
                console.log('Error is in API LISTEN');
                console.log(err);
                } else {
                if (!fbCookiesStored) {
                    fs.writeFileSync(config.COOKIES_FILE_PATH, JSON.stringify(this.api.getAppState()));
                    fbCookiesStored = true;
                }

                const isNotSentByMe = message.senderID !== config.USER_ID;
                const isSentInCorrectConversation = message.threadID === config.THREAD_ID;
                const isMessageOrReply = message.type === 'message' || message.type === 'message_reply';

                if(isNotSentByMe && isSentInCorrectConversation && isMessageOrReply && this.bot) {
                    // @ts-ignore
                    this.api.getThreadInfo(message.threadID, (err, threadInfo) => { 
                        const senderName = threadInfo.nicknames[message.senderID];
                        const images = message.attachments.filter((a : any) => a.type === "photo").map((a : any) => a.largePreviewUrl);
                        this.bot?.sendMeskaSrodaMessage(senderName, message.body, images);
                    })
                }
                }
            });
        });

        
    }

    sendMessage(text: string) {
        this.api.sendMessage(
            text,
            config.THREAD_ID
        )
    }
}

export default Mess;

// mutex.runExclusive(() => {
//     ++messagesCounter;

//     if (messagesCounter == repeatEveryMessagesCountThreshold) {
//       messagesCounter = 0;

//       api.sendMessage(
//         repeaterMessage,
//         message.threadID,
//         (err, messageInfo) => {
//           if (err) {
//             return console.error(err);
//           }
//         }
//       );
//     }
//   });