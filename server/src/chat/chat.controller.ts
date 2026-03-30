import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/user.entity';

interface RequestWithUser extends Request {
  user: User;
}

@Controller()
export class ChatController {
  constructor(private chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post('chat')
  async chat(
    @Body() createChatDto: CreateChatDto,
    @Req() req: RequestWithUser,
  ) {
    return this.chatService.generateResponse(
      req.user,
      createChatDto.message,
      createChatDto.contextId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('chat/contexts')
  async getContexts(@Req() req: RequestWithUser) {
    return this.chatService.getChatContexts(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('chat/refine')
  async refine(@Body('text') text: string) {
    return { refinedText: await this.chatService.refinePrompt(text) };
  }

  @UseGuards(JwtAuthGuard)
  @Get('chat/context/:id/messages')
  async getMessagesInContext(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    return this.chatService.getMessagesInContext(req.user, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('conversations')
  async getConversations(@Req() req: RequestWithUser) {
    return this.chatService.getConversations(req.user);
  }
}
