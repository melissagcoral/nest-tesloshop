import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces';

@WebSocketGateway({cors: true})
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload:JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.messageWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }
    // console.info({payload});
    // console.info('Cliente conectado', client.id);
    

    // client.join('ventas');

    // this.wss.to('ventas').emit('');

    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients());
    //console.info({conectados: this.messageWsService.getConnectedClients() })
  }

  handleDisconnect(client: Socket) {
    //console.info('Cliente desconectado', client.id);
    this.messageWsService.removeClient(client.id);

    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients());
  }
  
  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {

    //! emite unicamente al cliente
    // client.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no-message'
    // });

    //! emitir a todos menos al cliente inicial
    // client.broadcast.emit('message-from-server', {
    //     fullName: 'Soy yo',
    //     message: payload.message || 'no-message'
    //   });

    //!emitir a todos!
    this.wss.emit('message-from-server', {
      fullName: this.messageWsService.getUserFullName(client.id),
      message: payload.message || 'no-message'
    });
  }
}
