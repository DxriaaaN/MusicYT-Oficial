const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder} = require("discord.js")
const { QueryType, Track } = require("discord-player")
const {queue} = require ("./queue")
const skipto = require("./skipto")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Reproduce canciones desde Youtube y Spotify")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("cancion")
				.setDescription("Ingresa el link de la cancion para reproducirla")
				.addStringOption((option) => option.setName("url").setDescription("Link de cancion Youtube").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("playlist")
				.setDescription("Ingresa el link de la playlist para reproducirla")
				.addStringOption((option) => option.setName("url").setDescription("Link de playlist Youtube").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("busqueda")
				.setDescription("Busca una cancion por su nombre")
				.addStringOption((option) =>
					option.setName("searchterms").setDescription("Nombre de la cancion y artista").setRequired(true)
				)
        ),
	run: async ({ client, interaction }) => {
		if (!interaction.member.voice.channel) return interaction.editReply("Necesitas estar en un chat de voz para usar este comando")
		const queue = await client.player.createQueue(interaction.guild)
		if (!queue.connection) await queue.connect(interaction.member.voice.channel)

		let embed = new EmbedBuilder()

		if (interaction.options.getSubcommand() === "cancion") {
            const url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO, 
            })
            if (result.tracks.length === 0)
            return interaction.editReply("Sin resultados")
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** Fue añadido a la cola`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `Duracion: ${song.duration} Pedido por: ${song.requestedBy.tag}`})

		} else if (interaction.options.getSubcommand() === "playlist") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })
            if (result.tracks.length === 0)
                return interaction.editReply("Sin resultados")
                const playlist = result.playlist
                await queue.addTracks(result.tracks)
                const song = result.tracks[0]
                    await queue.addTrack(song)
                    embed
                    .setDescription(`**[${playlist.title}](${playlist.url})** Se añadio a la cola`)
                    .setThumbnail("https://i.ibb.co/6H7Nhxj/Captura-de-pantalla-2023-04-03-033250.png")
                    .setFooter({text: `Reproduciendo: ${song.title} Duracion: ${song.duration}`})
        }
            else if (interaction.options.getSubcommand() === "busqueda") {
            let url = interaction.options.getString("searchterms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_SEARCH
            })
            if (result.tracks.length === 0)
                return interaction.editReply("Sin resultados")
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** Fue añadido a la cola`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `Duracion: ${song.duration}Pedido por: ${song.requestedBy.tag}`})
    }
    if (!queue.playing) await queue.play()
    await interaction.editReply({
        embeds: [embed]
    })
},
}