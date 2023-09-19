import { Socket, createSocket } from 'dgram';
import WIIOTNMessage from './interface';

export interface SocketInterface {
  sendMessage: (message: WIIOTNMessage) => void;
}
export default class WIISocket implements SocketInterface {
  private socket: Socket;
  private ip: string;
  private port: number;

  constructor(ip: string, port: number) {
    //construct socket
    this.socket = createSocket('udp4');
    this.ip = ip;
    this.port = port;
  }

  sendMessage(message: WIIOTNMessage) {
    this.socket.send(JSON.stringify(message), this.port, this.ip, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }

  /**
   * events.EventEmitter
   * 1. close
   * 2. connect
   * 3. error
   * 4. listening
   * 5. message
   */
  addListener(
    event: 'close' | 'connect' | 'error' | 'listening' | 'message',
    listener: (message: any) => void,
  ) {
    this.socket.on(event, listener);
  }
}
