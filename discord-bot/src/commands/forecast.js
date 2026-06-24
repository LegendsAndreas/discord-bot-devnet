import { ApplicationCommandOptionType, time, TimestampStyles } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";
import Command from "../structures/command.js";
import Weather from "../weather.js";

export default new Command({
	name: "forecast",
	description: "Get the weather forecast for a specific city",
	options: [
		{
			name: "city",
			description: "The city to get the weather forecast for",
			type: ApplicationCommandOptionType.String,
			autocomplete: true,
			required: true,
		},
	],
	run: async ({ client, interaction }) => {
		const [latitude, longitude] = interaction.options.get("city").value.split(",").map(Number);

		if (latitude === 0 && longitude === 0) return interaction.reply({ content: "Please select a city from the autocomplete options.", ephemeral: true });

		const data = await Weather.getForecast(latitude, longitude);

		if (!data) return interaction.reply({ content: "Could not find that city.", ephemeral: true });

		const hourlyText = data.hourly
			.slice(0, 12)
			.map((h) => {
				if (h.isSunset) return `🌇 Solnedgang ${time(data.current.sunset, TimestampStyles.ShortTime)}`;

				if (h.isSunrise) return `🌅 Solopgang ${time(data.current.sunrise, TimestampStyles.ShortTime)}`;

				return `${h.condition} ${time(h.time, TimestampStyles.ShortTime)} ${h.temp}° 💧${h.precipitationChance}%`;
			})
			.join("\n");

		const dailyText = data.daily
			.sort((a, b) => a.time - b.time)
			.slice(0, 10)
			.map((d) => `${d.condition} ${d.date} • ${d.minTemp}° / ${d.maxTemp}°${d.precipitation ? ` 🌧 ${d.precipitation}mm` : ""}`)
			.join("\n");

		const embed = new EmbedBuilder()
			.setColor(0x4da6ff)
			.setTitle(`🌤 Vejret for ${data.city} (${data.municipality}, ${data.region})`)
			.setDescription(`${data.current.condition} ${data.current.temperature}°C\n\n`)
			.addFields(
				{
					name: "🌅 Sol",
					value: `Solopgang: ${time(data.current.sunrise, TimestampStyles.ShortTime)}\n` + `Solnedgang: ${time(data.current.sunset, TimestampStyles.ShortTime)}`,
					inline: true,
				},
				{
					name: "💨 Vind",
					value: `${data.current.wind.speed} m/s\n` + `${data.current.wind.direction}`,
					inline: true,
				},
				{
					name: "💧 Fugtighed",
					value: `${data.current.humidity}%`,
					inline: true,
				},
				{
					name: "⏰ Næste 12 Timer",
					value: hourlyText,
					inline: true,
				},
				{
					name: "📅 10-Dags Prognose",
					value: dailyText,
					inline: true,
				},
			);

		await interaction.reply({ embeds: [embed] });
	},
});
