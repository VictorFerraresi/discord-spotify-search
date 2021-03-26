import { config } from "./common/config";
import logger from './common/logger';
import { TextChannel } from "discord.js";
import { Client, MessageEmbed, ClientEvents } from "discord.js";

export class DiscordBot {
  private client: Client;

  constructor() {
    this.client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
  }

  async login() {
    await this.client.login(config.bot.token);

    this.client.on('ready', () => {
      logger.info(`Logged in as ${this.client.user?.tag}!`);

      process.on('unhandledRejection', (reason, p) => {
        logger.error(`Unhandled Rejection at: ${p}, reason: ${reason}`);
      });

      process.on('uncaughtException', err => {
        logger.error(`Uncaught Exception at: ${err.name}, message: ${err.message} => ${err.stack}`);
      });
    });
  }

  sendMessage(ch: string, message: MessageEmbed | string) {
    const channel: TextChannel = this.client.channels.cache.get(ch) as TextChannel;
    channel.send(message);
  }

  addEvent<K extends keyof ClientEvents>(event: K, callback: (...args: ClientEvents[K]) => void) {
    this.client.on(event, callback);
  }
}
