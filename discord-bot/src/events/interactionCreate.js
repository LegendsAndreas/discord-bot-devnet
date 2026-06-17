import Event from "../structures/event.js";
import Weather from "../weather.js";

export default new Event(async (client, interaction) => {
	if (interaction.isAutocomplete() && interaction.commandName === "weather") {
		const stations = await Weather.getStations();

		return interaction.respond(
			stations.map((station) => ({
				name: station.name,
				value: station.id,
			})),
		);
	}

	if (interaction.isChatInputCommand()) {
		const command = client.commands.get(interaction.commandName);

		if (!command) return interaction.editReply("Error!");

		command.run({ client, interaction, options: interaction.options });
	}
});
