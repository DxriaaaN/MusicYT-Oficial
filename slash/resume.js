const { SlashCommandBuilder } = require("@discordjs/builders")
const {queue} = require ("./queue")

module.exports = {
	data: new SlashCommandBuilder().setName("resume").setDescription("Reanuda la reproduccion de musica"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("There are no songs in the queue")

		queue.setPaused(false)
        await interaction.editReply("La musica se reproducira nuevamente")
	},
}