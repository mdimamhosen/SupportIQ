import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../.env', '.env'],
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 3600,
      max: 100,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASS', 'postgres'),
        database: configService.get<string>('DB_NAME', 'chat_app'),
        entities: [User, Conversation, ChatContext],
        synchronize: true,
      }),
      inject: [ConfigService],
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
