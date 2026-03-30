import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, FindOptionsWhere } from 'typeorm';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { createHash } from 'crypto';
import { Conversation } from '../conversation/conversation.entity';
import { ChatContext } from './entities/chat-context.entity';
import { User } from '../users/user.entity';

interface Part {
  text: string;
}

interface Content {
  role: 'user' | 'model';
  parts: Part[];
}

interface Candidate {
  content: Content;
}

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private client: GoogleGenAI;

  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(ChatContext)
    private chatContextRepository: Repository<ChatContext>,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey || apiKey === 'your_actual_gemini_api_key_here') {
      this.logger.warn(
        'GEMINI_API_KEY is not set or is using the placeholder. AI features will fail.',
      );
    }
    this.client = new GoogleGenAI({ apiKey: apiKey || '' });
  }

  private generateCacheKey(prefix: string, payload: any): string {
    const data =
      typeof payload === 'string' ? payload : JSON.stringify(payload);
    const hash = createHash('sha256').update(data).digest('hex');
    return `${prefix}:${hash}`;
  }

  private async buildContents(
    user: User,
    prompt: string,
    contextId?: number,
  ): Promise<Content[]> {
    const where: FindOptionsWhere<Conversation> = { user: { id: user.id } };
    if (contextId) {
      where.chatContext = { id: contextId };
    } else {
      where.chatContext = IsNull();
    }

    const history = await this.conversationRepository.find({
      where,
      order: { createdAt: 'ASC' },
      take: 10,
    });

    const contents: Content[] = history.flatMap((item) => [
      { role: 'user', parts: [{ text: item.message }] },
      { role: 'model', parts: [{ text: item.response }] },
    ]);

    contents.push({ role: 'user', parts: [{ text: prompt }] });

    return contents;
  }

  private extractText(response: unknown): string {
    if (!response || typeof response !== 'object') return '';

    const res = response as {
      text?: string | (() => string);
      candidates?: Candidate[];
    };

    if (typeof res.text === 'string') return res.text;
    if (typeof res.text === 'function') {
      return res.text();
    }

    const candidates = res.candidates;
    if (Array.isArray(candidates) && candidates.length > 0) {
      const firstCandidate = candidates[0];
      const firstPart = firstCandidate?.content?.parts?.[0];
      if (firstPart && 'text' in firstPart) {
        return firstPart.text;
      }
    }

    return '';
  }

  private async generateSummary(messages: string[]): Promise<string> {
    const cacheKey = this.generateCacheKey('summary', messages);
    const cached = await this.cacheManager.get<string>(cacheKey);
    if (cached) {
      this.logger.log('Returning cached summary');
      return cached;
    }

    try {
      const modelName =
        this.configService.get<string>('GEMINI_MODEL') ||
        'gemini-3-flash-preview';
      const combinedText = messages.join('\n\n');
      const prompt = `Generate a very short, 3-5 word summary for the following conversation to be used as a chat thread title. Keep it professional and descriptive. Conversation:\n"${combinedText}"`;

      const result = await this.client.models.generateContent({
        model: modelName,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      let summary = this.extractText(result).trim();
      summary = summary.replace(/^["']|["']$/g, '');
      const finalSummary = summary || 'New Conversation';

      await this.cacheManager.set(cacheKey, finalSummary);
      return finalSummary;
    } catch (error) {
      console.log(error);
      return 'New Conversation';
    }
  }

  private async analyzeSentiment(text: string): Promise<string> {
    const cacheKey = this.generateCacheKey('sentiment', text);
    const cached = await this.cacheManager.get<string>(cacheKey);
    if (cached) return cached;

    try {
      const modelName =
        this.configService.get<string>('GEMINI_MODEL') ||
        'gemini-3-flash-preview';

      const prompt = `Task: Analyze the sentiment of the provided text.
Categorize the sentiment EXACTLY as one of these three lowercase words: "positive", "neutral", or "negative".

Guidelines:
- "positive": Expresses joy, gratitude, helpfulness, empathy, or excitement.
- "negative": Expresses frustration, anger, sadness, technical failure, or apologies for mistakes.
- "neutral": Factual information, time, greetings, or bridge statements with no clear emotion.

Text to analyze: "${text}"

Output ONLY the category word:`;

      const result = await this.client.models.generateContent({
        model: modelName,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const rawSentiment = this.extractText(result).trim().toLowerCase();
      this.logger.log(
        `Raw sentiment from AI for "${text.substring(0, 50)}...": ${rawSentiment}`,
      );

      const sentiment = rawSentiment.includes('positive')
        ? 'positive'
        : rawSentiment.includes('negative')
          ? 'negative'
          : 'neutral';

      await this.cacheManager.set(cacheKey, sentiment);
      return sentiment;
    } catch (error) {
      this.logger.error('Sentiment Analysis Error:', error);
      return 'neutral';
    }
  }

  async refinePrompt(text: string): Promise<string> {
    const cacheKey = this.generateCacheKey('refine', text);
    const cached = await this.cacheManager.get<string>(cacheKey);
    if (cached) {
      this.logger.log(
        `Returning cached refinement for: ${text.substring(0, 30)}...`,
      );
      return cached;
    }

    try {
      const modelName =
        this.configService.get<string>('GEMINI_MODEL') ||
        'gemini-3-flash-preview';

      const prompt = `Refine the following user prompt to be more clear, concise, and professional, while maintaining the original intent. The output should ONLY contain the refined prompt text, no explanations or additional content:\n\n"${text}"`;

      const result = await this.client.models.generateContent({
        model: modelName,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      let refinedText = this.extractText(result).trim();
      refinedText = refinedText.replace(/^["']|["']$/g, '');
      const finalRefined = refinedText || text;

      await this.cacheManager.set(cacheKey, finalRefined);
      return finalRefined;
    } catch (error) {
      this.logger.error(
        `Refinement Error: ${error instanceof Error ? error.message : String(error)}`,
      );
      return text;
    }
  }

  async generateResponse(
    user: User,
    message: string,
    contextId?: number,
  ): Promise<Conversation> {
    try {
      const modelName =
        this.configService.get<string>('GEMINI_MODEL') ||
        'gemini-3-flash-preview';

      let chatContext: ChatContext | null = null;
      if (contextId) {
        chatContext = await this.chatContextRepository.findOne({
          where: { id: contextId, user: { id: user.id } },
        });
      }

      if (!chatContext) {
        chatContext = this.chatContextRepository.create({
          user,
          summary: 'New Conversation',
        });
        chatContext = await this.chatContextRepository.save(chatContext);
      }

      const contents = await this.buildContents(user, message, chatContext.id);

      const cacheKey = this.generateCacheKey('response', contents);
      const cachedText = await this.cacheManager.get<string>(cacheKey);

      let text: string;
      if (cachedText) {
        this.logger.log('Returning cached AI response');
        text = cachedText;
      } else {
        const result = await this.client.models.generateContent({
          model: modelName,
          contents: contents,
        });

        text = this.extractText(result);

        if (!text) {
          throw new Error('AI returned an empty response');
        }

        await this.cacheManager.set(cacheKey, text);
      }

      const sentiment = await this.analyzeSentiment(text);

      const conversation = this.conversationRepository.create({
        message,
        response: text,
        user,
        chatContext,
        sentiment,
      });

      const savedConversation =
        await this.conversationRepository.save(conversation);

      const messageCount = await this.conversationRepository.count({
        where: { chatContext: { id: chatContext.id } },
      });
      if (messageCount === 1) {
        const summary = await this.generateSummary([message, text]);
        chatContext.summary = summary;
        await this.chatContextRepository.save(chatContext);
      }

      return savedConversation;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Gemini API Error: ${errorMessage}`);

      if (errorMessage.includes('API key not valid')) {
        throw new InternalServerErrorException(
          'Invalid AI API Key. Please check your .env file.',
        );
      }

      throw new InternalServerErrorException('Failed to get response from AI');
    }
  }

  async getChatContexts(user: User): Promise<ChatContext[]> {
    return this.chatContextRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
    });
  }

  async getMessagesInContext(
    user: User,
    contextId: number,
  ): Promise<Conversation[]> {
    return this.conversationRepository.find({
      where: {
        user: { id: user.id },
        chatContext: { id: contextId },
      },
      order: { createdAt: 'ASC' },
    });
  }

  async getConversations(user: User): Promise<Conversation[]> {
    return this.conversationRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
      relations: ['chatContext'],
    });
  }
}
