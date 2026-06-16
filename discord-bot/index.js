import dotenv from 'dotenv';
import pg from 'pg';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import Weather from './weather.js';

dotenv.config();



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

    if (channel) {
        // channel.send('Bot is now active!');
    } else {
        console.log('Channel not found!');
    }
});

const weather = new Weather(process.env.DMI_API_KEY);

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    const channel = client.channels.cache.get(message.channelId);
    if (!channel) return;

   
    if (message.content.startsWith("!weather")) {
        const args = message.content.split(" ");
        const city = args[1];

        if (!city) {
            await channel.send(" Use: !weather aarhus / kbh");
            return;
        }

        try {
            const data = await weather.getWeather(city);

            const { EmbedBuilder } = await import("discord.js");

            const embed = new EmbedBuilder()
                .setTitle(` Weather - ${data.city}`)
                .addFields(
                    { name: " Temperature", value: `${data.temperature}°C`, inline: true },
                    { name: " Measured at", value: data.time }
                )
                .setColor(0x00AEFF);

            await channel.send({ embeds: [embed] });

        } catch (err) {
            await channel.send(` ${err.message}`);
        }

        return;
    }

  
    if (message.mentions.has(client.user)) {
        await channel.send(`You mentioned me, <@${message.author.id}>! How can I help?`);
        return;
    }
});

client.login(process.env.DISCORD_TOKEN);