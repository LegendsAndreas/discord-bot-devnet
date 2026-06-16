import Event from "../structures/event.js";

export default new Event(async (client, interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return interaction.editReply("Error!");

	command.run({ client, interaction, options: interaction.options });
});
