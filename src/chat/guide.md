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


// WsGuard Class Implementation
@Injectable()
export class WsGuard implements CanActivate {

    constructor(private userService: UserService) {
    }

    canActivate(
        context: any,
    ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
        const bearerToken = context.args[0].handshake.headers.authorization.split(' ')[1];
        try {
            const decoded = jwt.verify(bearerToken, jwtConstants.secret) as any;
            return new Promise((resolve, reject) => {
                return this.userService.findByUsername(decoded.username).then(user => {
                    if (user) {
                        resolve(user);
                    } else {
                        reject(false);
                    }
                });

             });
        } catch (ex) {
            console.log(ex);
            return false;
        }
    }
}

```