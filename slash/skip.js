const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const {queue} = require ("discord-player")


module.exports = {
	data: new SlashCommandBuilder().setName("skip")
    .setDescription("Salta a la proxima cancion"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)
		if (!queue) return await interaction.editReply("No hay canciones en la cola")
        const currentSong = queue.current
        queue.skip()
        await interaction.editReply({
            embeds: [
                new EmbedBuilder().setDescription(`${currentSong.title} La cancion fue skipeada!`)
                .setThumbnail(currentSong.thumbnail)
            ]
        })
	},
}

setTimeout

