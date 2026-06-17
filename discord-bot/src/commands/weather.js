import { ApplicationCommandOptionType } from "discord.js";
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
		const stationId = interaction.options.get("city");

		const data = await Weather.getForecast(stationId.value);

		if (!data) return interaction.reply({ content: "Could not find that city.", ephemeral: true });

		// const embed = new EmbedBuilder()
		// 	.setTitle("Forecast")
		// 	.addFields({ name: "Temperature", value: `${data.features[0].properties.value}°C`, inline: true }, { name: "Measured at", value: data.features[0].properties.created })
		// 	.setColor(0x00aeff);

		await interaction.reply({ content: `Here is the forecast for that city.\n\`\`\`\`${JSON.stringify(data, null, 4)}\`\`\``, ephemeral: true });
	},
});
