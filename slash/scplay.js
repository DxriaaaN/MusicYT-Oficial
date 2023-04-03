const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")
const { SpotifyPlaylist, SpotifyTrack } = require("play-dl")
const {queue} = require ("./queue")



module.exports = {
	data: new SlashCommandBuilder()
		.setName("scplay")
		.setDescription("Reproduce canciones desde Soundcloud")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("cancion")
				.setDescription("Ingresa el link de la cancion para reproducirla")
				.addStringOption((option) => option.setName("url").setDescription("Enlace SoundCloud").setRequired(true))
		),
	run: async ({ client, interaction }) => {
		if (!interaction.member.voice.channel) return interaction.editReply("Necesitas estar en un chat de voz para usar este comando")
		const queue = await client.player.createQueue(interaction.guild)
		if (!queue.connection) await queue.connect(interaction.member.voice.channel)

		let embed = new EmbedBuilder()

		if (interaction.options.getSubcommand() === "cancion") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SOUNDCLOUD_TRACK
            })
            if (result.tracks.length === 0)
                return interaction.editReply("Sin resultados")
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** Fue añadido a la cola`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})
		}
        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })
	},
}