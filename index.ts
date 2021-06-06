import { config } from "./common/config";
import logger from "./common/logger";
import { DiscordBot } from "./discord-bot";
import axios, { AxiosRequestConfig } from "axios";
import * as qs from "querystring";
import { SearchResults } from "./model/search-results.interface";

logger.info(`Nodejs version is ${process.version}`);
logger.info("Loading /spotify helper/ script. Howdy (´・ω・`)");

const bot: DiscordBot = new DiscordBot();
let access_token: "";

bot.login();

bot.onMessageReceived(async (msg) => {
  if (msg.channel_id !== config.bot.musicChannel) return; // Only music channel

  if (msg.author.bot) return; // Avoid botception

  const lastMessages = await bot.fetchMessages(1, config.bot.musicChannel);
  const lastMessage = lastMessages[0];

  if (!lastMessage || lastMessage.author.id !== msg.author.id) {
    logger.error("No messages fetched or last message author is different!");
    return;
  }

  if (lastMessage.content.indexOf(config.bot.prefix) !== 0) return; // Prefix

  if (lastMessage.content.length < 4) return; // Not enough characters to be a valid command ";p a" = 4 chars.

  if (lastMessage.content.indexOf(";p ") !== -1) {
    // Play command
    const song = lastMessage.content.trim().replace(";p ", "");
    bot.startTyping(config.bot.musicChannel);
    searchForSong(song)
      .then((trackUrl) => {
        bot.sendMessage(config.bot.musicChannel, `-p ${trackUrl}`);
      })
      .finally(() => bot.stopTyping());
  }
});

async function searchForSong(song: string, tryCount = 0) {
  const query = song.replace(/ /g, "%20");
  const url = config.spotify.search_url.replace("#QUERY#", query);

  try {
    const reqConf = {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };

    const response = await axios.get<SearchResults>(url, reqConf);

    if (response.data.tracks.items.length == 0) return "";
    console.log(response.data.tracks.items[0].external_urls.spotify);
    return response.data.tracks.items[0].external_urls.spotify;
  } catch (e) {
    if (
      !!e &&
      !!e.response &&
      !!e.response.status &&
      e.response.status == 401
    ) {
      if (tryCount == 3) {
        return;
      }
      //Do login and retry
      await spotifyLogin();
      return searchForSong(song, tryCount + 1);
    }
  }
}

async function spotifyLogin() {
  const token = Buffer.from(
    `${config.spotify.client_id}:${config.spotify.client_secret}`
  ).toString("base64");

  const reqConf: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${token}`,
    },
  };

  const body = {
    grant_type: "client_credentials",
  };

  const response = await axios.post(
    config.spotify.login_url,
    qs.stringify(body),
    reqConf
  );
  access_token = response.data.access_token;
}
