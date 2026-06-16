import dotenv from 'dotenv';
import pg from 'pg';
import { Client, Events, GatewayIntentBits } from 'discord.js';

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.PSQL
});

pool.connect().then(() => {
    console.log('Connected to PostgreSQL database');
})
.catch(err => {
    console.error('Error connecting to PostgreSQL database:', err);
});

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

    const channelId = '1427535623861833750'; // Generel
    const channel = client.channels.cache.get(channelId);
    pool.query("INSERT INTO test (name) VALUES ($1)", ['John Doe']);

    if (channel) {
        // channel.send('Bot is now active!');
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