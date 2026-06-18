import Event from "../structures/event.js";
import Weather from "../weather.js";

export default new Event(async (client, interaction) => {
	if (interaction.isAutocomplete() && interaction.commandName === "forecast") {
		const query = interaction.options.getFocused(true)?.value;

		if (!query || query.length < 1)
			return interaction.respond([
				{
					name: "Start typing to search for a city",
					value: "0,0",
				},
			]);

		const locations = await Weather.search(query);

		return interaction.respond(
			locations
				.map((location) => ({
					name: location.city + " (" + location.municipality + ", " + location.region + ")",
					value: location.latitude + "," + location.longitude,
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
