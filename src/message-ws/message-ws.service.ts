import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnectedClients {
    [id: string]: {
        socket: Socket,
        user: User
    }
}

@Injectable()
export class MessageWsService {

    private connectedClients: ConnectedClients = {}

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    async registerClient(client: Socket, userId: string) {
        const user = await this.userRepository.findOneBy({id: userId});

        if (!user) throw new Error('User not exists'); 
        if (!user.isActive) throw new Error('User not active');

        console.info({user});
        this.checkUserConnection(user);

        this.connectedClients[client.id] = {
            socket: client,
            user
        }
        //this.connectedClients[client.id] = client;
    }

    removeClient(clientId: string) {
        this.connectedClients[clientId]
    }

    getConnectedClients(): string[] {
        // console.info(this.connectedClients);
        return Object.keys(this.connectedClients);
    }

    getUserFullName(socketId: string) {
        return this.connectedClients[socketId].user.fullName;
    }

    private checkUserConnection(user: User) {
        for (const clientId of Object.keys(this.connectedClients)) {
            const connectedClient = this.connectedClients[clientId];
            // console.info({connectedClient});
            if (connectedClient.user.id === user.id) {
                connectedClient.socket.disconnect();
                break;
            }
        }
    }
}
