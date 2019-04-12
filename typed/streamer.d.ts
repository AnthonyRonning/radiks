import EventEmitter from 'wolfy87-eventemitter';
export default class Streamer {
    static initialized: boolean;
    static socket: WebSocket;
    static emitter: EventEmitter;
    static invoiceInitialized: boolean;
    static invoiceSocket: WebSocket;
    static invoiceEmitter: EventEmitter;
    static init(): WebSocket;
    static addListener(callback: (args: any[]) => void): void;
    static removeListener(callback: Function): void;
    static invoiceInit(id: any): WebSocket;
    static addInvoiceListener(id: any, callback: (args: any[]) => void): void;
    static removeInvoiceListener(id: any, callback: Function): void;
}
