const { SlashCommandBuilder } = require("@discordjs/builders")
const {queue} = require ("./queue")

module.exports = {
	data: new SlashCommandBuilder().setName("shuffle").setDescription("Mezcla la lista"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("No hay canciones en la lista")

		queue.shuffle()
        await interaction.editReply(`La lista de reproduccion fue mezclada!`)
	}
}
