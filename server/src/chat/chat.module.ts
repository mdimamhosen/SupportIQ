import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Conversation } from '../conversation/conversation.entity';
import { ChatContext } from './entities/chat-context.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, ChatContext]), AuthModule],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
