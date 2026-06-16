import { userMention } from "@discordjs/builders";
import Event from "../structures/Event.js";

export default new Event(async (client, message) => {
	if (message.author.bot) return;

	if (client.user && message.mentions.has(client.user.id)) return message.reply(`You mentioned me, ${userMention(message.author.id)}! How can I help?`);
});
