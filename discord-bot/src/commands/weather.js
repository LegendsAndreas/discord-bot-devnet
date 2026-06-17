import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import Command from "../structures/command.js";
import Weather from "../weather.js";

export default new Command({
	name: "weather",
	description: "Get the weather for a specific city",
	options: [
		{
			name: "city",
			description: "The city to get the weather for",
			type: ApplicationCommandOptionType.String,
			autocomplete: true,
			required: true,
		},
	],
	run: async ({ client, interaction }) => {
		const stationId = interaction.options.get("city")?.value;

		const data = await Weather.getWeather(stationId);

		const embed = new EmbedBuilder()
			.setTitle(` Weather - ${data.city}`)
			.addFields({ name: " Temperature", value: `${data.temperature}°C`, inline: true }, { name: " Measured at", value: data.time })
			.setColor(0x00aeff);

		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
});
