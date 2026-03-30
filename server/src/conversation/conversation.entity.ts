import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { ChatContext } from '../chat/entities/chat-context.entity';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  message: string;

  @Column('text')
  response: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.conversations)
  user: User;

  @Column({ type: 'text', nullable: true })
  sentiment: string;

  @ManyToOne(() => ChatContext, (context) => context.messages, {
    nullable: true,
  })
  chatContext: ChatContext;
}
