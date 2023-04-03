const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { useQueue} = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Muestra la lista de reproduccion actual")
    .addNumberOption((option) => option.setName("page").setDescription("Pagina de la cola").setMinValue(1)),
    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)
        if (!queue || !queue.playing){
            return await interaction.editReply("No hay canciones en la cola")
        }
        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        const page = (interaction.options.getNumber("page") || 1) - 1
        if (page + 1 > totalPages) 
            return await interaction.editReply(`Pagina invalida, hay un total de ${totalPages} paginas de cancion`)
        
        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**${page * 10 + i + 1}.** \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>`
        }).join("\n")
        const currentSong = queue.current

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setDescription(`**Reproduciendo Actualmente**\n` + 
                    (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : "Nadie") +
                    `\n\n**Lista de Reproduccion**\n${queueString}`
                    )
                    .setFooter({
                        text: `Pagina ${page + 1} de ${totalPages}`
                    })
                    .setThumbnail(currentSong.Thumbnail)
            ]
        })
    }
}