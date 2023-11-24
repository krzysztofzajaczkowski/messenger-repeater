#!/usr/bin/env node
import fs from "fs";
//@ts-ignore
import login from "facebook-chat-api";
import { config } from "./config/config";
import Bot from "./bot";
import { MediaIntegrationFilter } from "./media-integrations/mediaIntegrationFilter";

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
            logLevel: "silly"
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

                    const mediaIntegrationFilter = config.MEDIA_INTEGRATION_FILTERS.find(f => f.matchesMessengerThreadId(message.threadID));
                    const isNotSentByMe = message.senderID !== config.USER_ID;
                    const isMessageOrReply = this.supportedMessageTypesForProxy.includes(message.type);

                    if(isNotSentByMe && mediaIntegrationFilter && isMessageOrReply && this.bot) {
                        console.log(`[INFO][Mess] Sending to ${mediaIntegrationFilter.name} Discord`);
                        this.sendDiscordBotMessage(message, mediaIntegrationFilter);              
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

    private sendDiscordBotMessage(message: any, mediaIntegrationFilter: MediaIntegrationFilter) {
        // @ts-ignore
        this.api.getThreadInfo(message.threadID, 
            this.matchCallback(threadInfo => {
                const senderName = threadInfo.nicknames[message.senderID];
                // @ts-ignore
                this.api.getUserInfo(message.senderID, 
                    this.matchCallback(userInfo => {
                        const images = this.getPhotoUrls(message.attachments);
                        const userProfileThumbnail = userInfo[message.senderID].thumbSrc;
                        this.bot?.sendMeskaSrodaMessage(mediaIntegrationFilter, senderName, message.body, images, userProfileThumbnail);
                    })
                );
            })
        );
    }

    sendMessage(text: string, threadId: string) {
        this.api.sendMessage(
            text,
            threadId
        )        
    }
    
}

export default Mess;