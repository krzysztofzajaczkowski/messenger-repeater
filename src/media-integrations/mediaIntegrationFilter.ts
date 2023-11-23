export class MediaIntegrationFilter {
    
    public get discordChannelId(): string {
        return this._discordChannelId;
    }

    public get messengerThreadId(): string {
        return this._messengerThreadId;
    }

    public get discordWebhookToken(): string {
        return this._discordWebhookToken;
    }

    constructor(
        private _messengerThreadId: string, 
        private _discordChannelId: string,
        private _discordWebhookToken: string) {
    }

    matchesMessengerThreadId(threadIdCandidate: string): boolean {
        return this.messengerThreadId === threadIdCandidate;
    }

    matchesDiscordChannelId(channelIdCandidate: string): boolean {
        return this.discordChannelId === channelIdCandidate;
    }
}