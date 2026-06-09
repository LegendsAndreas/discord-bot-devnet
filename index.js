import dotenv from 'dotenv';
dotenv.config();

import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ]
});

client.once('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    const channelId = '1427535623861833750';
    const channel = client.channels.cache.get(channelId);

    if (channel) {
        channel.send('Bot is now active!');
    } else {
        console.log('Channel not found!');
    }
});

client.login(process.env.DISCORD_TOKEN);

client.on('messageCreate', async (message) => {
    if (!message.author.bot) {
        const channel = client.channels.cache.get(message.channelId);
        if (!channel) {
            console.log('Channel not found!');
            return;
        }
        const name = message.author.id;
        await channel.send(`Shut up @${name}`);
    }
});