## How to Handle authentication in websockets

```javascript
// HANDLE AUTHENTICATION 
async handleConnection(client: Socket) {
  const payload = this.authService.verify(
    client.handshake.headers.authorization,
  );
  const user = await this.usersService.findOne(payload.userId);
  
  !user && client.disconnect();
}



@UseGuards(WsGuard)
@SubscribeMessage('yourRoute')
async saveUser(socket: Socket, data: any) {
    let auth_token = socket.handshake.headers.authorization;
    // get the token itself without "Bearer"
    auth_token = auth_token.split(' ')[1];
}

// On the client side
this.socketOptions = {
    transportOptions: {
        polling: {
            extraHeaders: {
                Authorization: 'your token', // 'Bearer h93t4293t49jt34j9rferek...'
            }
        }
    }
};
// ...
this.socket = io.connect('http://localhost:4200/', this.socketOptions);
// ...

```