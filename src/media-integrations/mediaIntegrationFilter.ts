export class MediaIntegrationFilter {
    
    public get discordChannelId(): string {
        return this._discordChannelId;
    }

    public get messengerThreadId(): string {
        return this._messengerThreadId;
    }

    constructor(
        private _messengerThreadId: string, 
        private _discordChannelId: string) {
    }

    matchesMessengerThreadId(threadIdCandidate: string): boolean {
        return this.messengerThreadId === threadIdCandidate;
    }

    matchesDiscordChannelId(channelIdCandidate: string): boolean {
        return this.discordChannelId === channelIdCandidate;
    }
}