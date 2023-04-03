const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const {queue} = require ("./queue")

module.exports = {
    data: new SlashCommandBuilder()
		.setName("info")
		.setDescription("Muestra la informacion acerca de la cancion actual"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("No hay canciones en la cola")
		let bar = queue.createProgressBar({
			queue: false,
			length: 19,
		})
        const song = queue.current

		await interaction.editReply({
            embeds: [new EmbedBuilder()
                .setDescription(`Reproduciendo Actualmente [${song.title}](${song.url}${song.artist})\n\n` + bar)
				.setThumbnail(song.thumbnail)
            ],
            })
        },
    }