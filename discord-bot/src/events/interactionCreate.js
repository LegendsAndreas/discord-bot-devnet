import Event from "../structures/event.js";
import Weather from "../weather.js";

export default new Event(async (client, interaction) => {
	const stations = await Weather.getStations();

	if (interaction.isAutocomplete() && interaction.commandName === "weather") {
		const focusedOption = interaction.options.getFocused(true)?.value;

		return interaction.respond(
			stations
				.filter((station) => focusedOption.length === 0 || station.name.toLowerCase().includes(focusedOption.toLowerCase()))
				.map((station) => ({
					name: station.name,
					value: station.id,
				}))
				.slice(0, 25),
		);
	}

	if (interaction.isChatInputCommand()) {
		const command = client.commands.get(interaction.commandName);

		if (!command) return interaction.editReply("Error!");

		command.run({ client, interaction, options: interaction.options });
	}
});
