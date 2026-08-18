import { Logger } from "@nestjs/common";
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";

import { Server, Socket } from "socket.io";

interface AuthenticatedSocket extends Socket {
  handshake: Socket["handshake"] & { __user: any };
}

@WebSocketGateway(3005, { cors: { origin: "*" } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer() io: Server;

  afterInit(server: Server) {
    server.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const token = socket.handshake.headers.authorization?.split(" ")[1];

        console.log("This is the token in socket packet: ", token);

        next();
      } catch (err) {
        socket.disconnect();
        next(err);
      }
    });
    this.logger.log("Chat Gateway Initialized");
  }

  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    // this.logger.debug(`Number of connected clients: ${sockets.size}`);
    client.broadcast.emit("user-joined", {
      message: `User joined the chat: ${client.id}`,
      clientId: client.id,
    });
  }

  handleDisconnect(client: any) {
    // const roomsMap: Map<string, Set<string>> = this.io.adapter?.["rooms"];
    // console.log("Rooms: ", roomsMap);

    this.logger.log(`Cliend id:${client.id} disconnected`);
    this.io.emit("user-left", {
      message: `User left the chat: ${client.id}`,
      clientId: client.id,
    });
  }

  @SubscribeMessage("newMessage")
  handleMessage(@MessageBody() message: any, client: any): void {
    // this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${message?.id}`);
    this.io.emit("message", message);
  }

  // @SubscribeMessage("newMessage")
  // handleMessage(@MessageBody("id") id: number, client: any): void {
  //   // this.logger.log(`Message received from client id: ${client.id}`);
  //   this.logger.debug(`Payload: ${id}`);
  //   this.io.emit("message", id);
  // }
}
