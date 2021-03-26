/**
 * Configuration properties
 */
export const config = {
  name: "BOT",
  env: process.env.NODE_ENV || "development",
  logger: {
    level: "info",
    colorize: true,
    timestamp: true,
    path: "./logs",
  },
  bot: {
    token: "CHANGEME",
    prefix: ";",
  },
  spotify: {
    client_id: "CHANGEME",
    client_secret: "CHANGEME",
    search_url:
      "https://api.spotify.com/v1/search?q=#QUERY#&type=track&limit=1",
    login_url: "https://accounts.spotify.com/api/token",
  },
};
