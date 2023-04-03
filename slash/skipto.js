const { SlashCommandBuilder } = require("@discordjs/builders")
const {queue} = require ("./queue")

module.exports = {
	data: new SlashCommandBuilder().setName("skipto").setDescription("Salta a una cancion especifica #")
    .addNumberOption((option) => 
        option.setName("tracknumber").setDescription("Salta a una cancion especifica").setMinValue(1).setRequired(true)),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("There are no songs in the queue")

        const trackNum = interaction.options.getNumber("tracknumber")
        if (trackNum > queue.tracks.length)
            return await interaction.editReply("Numero de cancion invalida")
		queue.skipTo(trackNum -1)

        await interaction.editReply(`Cancion saltada hasta ${trackNum}`)
	},
}
