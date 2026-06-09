import dotenv from 'dotenv';
dotenv.config();

import { Client, Events, GatewayIntentBits } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent // Required to read message content
    ]
});

client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const channelId = '1427535623861833750';
    const channel = client.channels.cache.get(channelId);

    if (channel) {
        channel.send('Bot is now active!');
    } else {
        console.log('Channel not found!');
    }
});

client.on(Events.MessageCreate, async (message) => {
    if (!message.author.bot) {
        const channel = client.channels.cache.get(message.channelId);
        if (!channel) {
            console.log('Channel not found!');
            return;
        }
        
        // Check if the bot is mentioned
        if (message.mentions.has(client.user)) {
            // Bot was mentioned with @
            await channel.send(`You mentioned me, <@${message.author.id}>! How can I help?`);
            return;
        }
        
        const name = message.author.id;
        await channel.send(`Shut up <@${name}>`);
    }
});

client.login(process.env.DISCORD_TOKEN);