export class AttachmentHandler {
    
    public get urlSelector(): (attachment: any) => string {
        return this._urlSelector;
    }
    
    public get type(): string {
        return this._type;
    }
    constructor(
        private _type: string,
        private _urlSelector: (attachment: any) => string) {}
}