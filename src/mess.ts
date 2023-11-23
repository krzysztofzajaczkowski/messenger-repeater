#!/usr/bin/env node
import fs from "fs";
//@ts-ignore
import login from "facebook-chat-api";
import { config } from "./config";
import Bot from "./bot";

class Mess {
    api: any;
    bot?: Bot;
    lastUsername?: string;
    fbCookiesStored: boolean = false;
    supportedMessageTypesForProxy: string[] = [
        'message',
        'message_reply'
    ];

    private getOptions() {
        return {
            listenEvents: true,
            selfListen: true,
          };
    }

    private getCredentials() {
        return {
            appState: JSON.parse(fs.readFileSync(config.COOKIES_FILE_PATH, 'utf8')),
          };
    }

    constructor() {
        // @ts-ignore
        login(this.getCredentials(), 
            this.getOptions(), 
            this.matchCallback(api => {
                this.api = api;

                this.onListen(this.matchCallback(message => {
                    this.storeCookiesIfRequired();

                    const isNotSentByMe = message.senderID !== config.USER_ID;
                    const isSentInCorrectConversation = message.threadID === config.THREAD_ID;
                    const isMessageOrReply = this.supportedMessageTypesForProxy.includes(message.type);

                    if(isNotSentByMe && isSentInCorrectConversation && isMessageOrReply && this.bot) {
                        this.sendDiscordBotMessage(message);              
                    }
                }));
            })
        );
    }

    private matchCallback(onSuccess: (payload: any) => void) {
        return (err: any, payload: any) => {
            if(err) {
                this.logError(err)
                return;
            }

            onSuccess(payload);
        };
    }

    private onListen(callback: (err: any, messge: any) => void) {
        // @ts-ignore
        this.api.listenMqtt(callback);
    }

    private storeCookiesIfRequired() {
        if (!this.fbCookiesStored) {
            fs.writeFileSync(config.COOKIES_FILE_PATH, JSON.stringify(this.api.getAppState()));
            this.fbCookiesStored = true;
        }
    }

    private getPhotoUrls(attachments: any[]) {
        return attachments.filter((a : any) => a.type === "photo").map((a : any) => a.largePreviewUrl);
    }

    private logError(error: any) {
        console.log(`[ERROR] ${error}`);
    }

    private sendDiscordBotMessage(message: any) {
        // @ts-ignore
        this.api.getThreadInfo(message.threadID, 
            this.matchCallback(threadInfo => {
                const senderName = threadInfo.nicknames[message.senderID];
                // @ts-ignore
                this.api.getUserInfo(message.senderID, 
                    this.matchCallback(userInfo => {
                        const images = this.getPhotoUrls(message.attachments);
                        const userProfileThumbnail = userInfo[message.senderID].thumbSrc;
                        this.bot?.sendMeskaSrodaMessage(senderName, message.body, images, userProfileThumbnail);
                    })
                );
            })
        );
    }

    sendMessage(text: string) {
        this.api.sendMessage(
            text,
            config.THREAD_ID
        )        
    }
    
}

export default Mess;