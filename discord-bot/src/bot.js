import "dotenv/config";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import Weather from "./weather.js";
import fs from "fs";

export default class Bot extends Client {
	weather = new Weather();
	commands = new Collection();

	constructor() {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.MessageContent, // Required to read message content
			],
		});
	}

	start() {
		this.login(process.env.DISCORD_TOKEN)
			.then(() => {
				console.log(`Logged in as ${this.user?.tag}!`);

				this.loadEvents();

				this.loadCommands();
			})
			.catch(() => {
				throw new Error("Failed to login to Discord. Please check your token.");
			});
	}

	loadEvents() {
		fs.readdirSync("./src/events").map(async (file) => {
			const event = (await import(`./events/${file}`)).default;

			this.on(file.split(".")[0], (...args) => event.run(this, ...args));

			return event;
		});
	}

	loadCommands() {
		Promise.all(
			fs.readdirSync("./src/commands").map(async (file) => {
				const command = (await import(`./commands/${file}`)).default;

				this.commands.set(command.name, command);

				return command;
			}),
		).then((commands) => this.registerCommands(commands.flat()));
	}

	async registerCommands(commands) {
		await this.guilds.cache.get("1427535623069241417")?.commands.set(commands);
	}
}
