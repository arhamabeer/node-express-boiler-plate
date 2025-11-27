const {
  Client,
  Events,
  GatewayIntentBits,
  EmbedBuilder,
} = require("discord.js");

const {
  createShortUrlDiscord,
  getAllUrlsDiscord,
  getUrlAnalyticsDiscord,
  getRedirectUrlDiscord,
  getShortUrlDiscord,
} = require("./functions");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});
client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;
  msg.reply(`<<< Welcome >>>
    << Please use following commands to work with URL Shortener Bot >>
        < hello ->              Greet with hello >
        < create-url ->         Create short URL >
        < get-all-urls ->       Get all short urls >
        < get-url-analytics ->  Get url analytics >
        < get-url ->             Get single url >
    `);
});

client.on("interactionCreate", async (msg) => {
  // if (msg.author.bot) return;
  //   console.log(`Command received:`, msg);
  const user = msg.user;
  const commandName = msg.commandName;

  switch (commandName) {
    case "hello":
      msg.reply(`Hi there! 👋. Use commands to get your own URL 😃.`);
      break;

    case "create-url":
      let url = msg?.options?.getString("url");

      const _createRes = await createShortUrlDiscord(user, url);
      console.log("_createRes: ", _createRes);
      switch (_createRes.status) {
        case 201:
          msg.reply(
            `Short URL created successfully: http://localhost:5000/api/url/getUrl/${_createRes.data.data}`
          );
          break;
        case 400:
          msg.reply(`Short URL creation failed: ${_createRes.data.message}`);
          break;
        default:
          msg.reply(`Error: ${_createRes.data.message}`);
          break;
      }
      break;

    case "get-all-urls":
      const getAllRes = await getAllUrlsDiscord();
      console.log("Response Bot Data:", getAllRes);

      switch (getAllRes.status) {
        case 200:
          const embed = new EmbedBuilder()
            .setTitle("All URLs fetched")
            .setDescription(
              getAllRes.data.data
                .map((u) => `${u.shortUrl} → ${u.redirectUrl}`)
                .join("\n")
                .slice(0, 4096)
            );

          await msg.reply({ embeds: [embed] });

          break;
        default:
          msg.reply(`Error: ${getAllRes.message}`);
          break;
      }
      break;

    case "get-url-analytics":
      let _url = msg?.options?.getString("url");

      const getAnalyticsRes = await getUrlAnalyticsDiscord(_url);
      switch (getAnalyticsRes.status) {
        case 200:
          msg.reply(
            `URL analytics fetched successfully: ${JSON.stringify(
              getAnalyticsRes.data.data
            )}`
          );
          break;
        case 400:
          msg.reply(`Invalid request: ${getAnalyticsRes.data.message}`);
          break;
        case 404:
          msg.reply(`URL not found: ${getAnalyticsRes.data.message}`);
          break;

        default:
          msg.reply(`Error: ${getAnalyticsRes.data.message}`);
          break;
      }
      break;

    case "get-redirect-url":
      let shortUrl = msg?.options?.getString("url");
      const getRedirectRes = await getRedirectUrlDiscord(shortUrl);
      switch (getRedirectRes.status) {
        case 200:
          msg.reply(
            `Redirect URL for: ${shortUrl} has been fetched successfully: ${JSON.stringify(
              getRedirectRes.data.data.redirectUrl
            )}`
          );
          break;
        case 400:
          msg.reply(`Invalid request: ${getRedirectRes.data.message}`);
          break;
        case 404:
          msg.reply(`URL not found: ${getRedirectRes.data.message}`);
          break;
        default:
          msg.reply(`Error: ${getRedirectRes.data.message}`);
          break;
      }
      break;

    case "get-short-url":
      let redirectUrl = msg?.options?.getString("url");
      const getShortRes = await getShortUrlDiscord(redirectUrl);
      switch (getShortRes.status) {
        case 200:
          msg.reply(
            `Redirect URL for: ${redirectUrl} has been fetched successfully: http://localhost:5000/api/url/getUrl/${JSON.stringify(
              getShortRes.data.data.shortUrl
            )}`
          );
          break;
        case 400:
          msg.reply(`Invalid request: ${getShortRes.data.message}`);
          break;
        case 404:
          msg.reply(`URL not found: ${getShortRes.data.message}`);
          break;
        default:
          msg.reply(`Error: ${getShortRes.data.message}`);
          break;
      }
      break;

    default:
      msg.reply("Unknown command! 😞 ");
      break;
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);

module.exports = client;
