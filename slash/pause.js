const { SlashCommandBuilder } = require("@discordjs/builders")
const {queue} = require ("./queue")

module.exports = {
    data: new SlashCommandBuilder()
		.setName("pause")
		.setDescription("Detiene la musica"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("There are no songs in the queue")
		queue.setPaused(1)
        await interaction.editReply("La musica fue pausada! Utiliza `/resume` Para volver a reproducir la cancion actual.")
	},
}