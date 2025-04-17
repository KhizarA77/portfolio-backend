import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, EmbedBuilder, GatewayIntentBits } from 'discord.js';
import { ContactDto } from './app.controller';

@Injectable()
export class AppService implements OnModuleInit {

  private readonly client: Client;
  private readonly UserID: string;
  private isReady: boolean = false;
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly configService: ConfigService) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages
      ]
    });
    this.UserID = this.configService.get<string>('USER_ID')!;

    this.client.on('ready', () => {
      this.isReady = true;
      this.logger.log(`Bot is ready`);
    });
  }

  async onModuleInit() {
    this.logger.log('Initializing Discord bot...');
    try {
      await this.client.login(this.configService.get<string>('DISCORD_BOT_TOKEN')!);
      this.logger.log('Logged in successfully');
      
      // Wait for the bot to be ready
      if (!this.isReady) {
        await new Promise<void>((resolve) => {
          const interval = setInterval(() => {
            if (this.isReady) {
              clearInterval(interval);
              resolve();
            }
          }, 100);
        });
      }
      
      this.logger.log('Bot is fully initialized and ready');
    } catch (err) {
      this.logger.error('Failed to login', err);
      throw err; // Prevent application from starting if bot fails to initialize
    }
  }

  async sendMessage(contactDto: ContactDto): Promise<boolean> {
    if (!this.isReady) {
      this.logger.warn('Bot is not ready yet');
      return false;
    }

    const user = await this.client.users.fetch(this.UserID);
    if (!user) {
      this.logger.error('User not found');
      return false;
    }
    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTimestamp()
      .setTitle(contactDto.name)
      .addFields(
        { name: 'Email', value: contactDto.email, inline: true },
      )
      .setDescription(contactDto.message);

    try {
      await user.send({ embeds: [embed] });
      this.logger.log('Message sent successfully');
      return true;
    }
    catch (err) {
      this.logger.error('Failed to send message', err);
      return false;
    }
  }
}
