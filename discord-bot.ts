import { config } from "./common/config";
import logger from "./common/logger";
const Discord = require("discord-user-bots");

export class DiscordBot {
  private client;

  constructor() {
    this.client = new Discord.Client(config.bot.token);
  }

  login() {
    this.client.on.ready = () => {
      logger.info(`Logged in!`);

      process.on("unhandledRejection", (reason, p) => {
        logger.error(`Unhandled Rejection at: ${p}, reason: ${reason}`);
      });

      process.on("uncaughtException", (err) => {
        logger.error(
          `Uncaught Exception at: ${err.name}, message: ${err.message} => ${err.stack}`
        );
      });
    };
  }

  sendMessage(ch: string, message: string) {
    console.log("Sending message");
    this.client
      .send(message, ch)
      .then((a) => console.log("s " + JSON.stringify(a)));
  }

  onMessageReceived(callback: (...args: any) => void) {
    this.client.on.message_create = callback;
  }

  fetchMessages(amount: number, channel: string) {
    return this.client.fetchmessages(amount, channel);
  }

  startTyping(ch: string) {
    this.client.type(ch);
  }

  stopTyping() {
    this.client.stopType();
  }
}
