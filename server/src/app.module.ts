import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConversationModule } from './conversation/conversation.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { User } from './users/user.entity';
import { Conversation } from './conversation/conversation.entity';
import { ChatContext } from './chat/entities/chat-context.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
      ttl: 3600,
      max: 100,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'chat_app',
      entities: [User, Conversation, ChatContext],
      synchronize: true,
    }),
    UsersModule,
    ConversationModule,
    AuthModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
