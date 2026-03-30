import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { Conversation } from '../../conversation/conversation.entity';

@Entity()
export class ChatContext {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  summary: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @OneToMany(() => Conversation, (conversation) => conversation.chatContext)
  messages: Conversation[];
}
