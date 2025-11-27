import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const commands = [
  {
    name: "hello",
    description: "Greet with hello!",
  },
  {
    name: "create-url",
    description: "Create short URL!",
    options: [
      {
        name: "url",
        description: "long url",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: "get-all-urls",
    description: "Get all short urls!",
  },
  {
    name: "get-url-analytics",
    description: "Get url analytics!",
    options: [
      {
        name: "url",
        description: "short url",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: "get-redirect-url",
    description: "Get Redirect of short url!",
    options: [
      {
        name: "url",
        description: "short url",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: "get-short-url",
    description: "Get short of redirect url!",
    options: [
      {
        name: "url",
        description: "redirect url",
        type: 3,
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: "10" }).setToken(
  process.env.DISCORD_BOT_TOKEN
);

try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(
    Routes.applicationCommands(process.env.DISCORD_BOT_CLIENT_ID),
    {
      body: commands,
    }
  );

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}
