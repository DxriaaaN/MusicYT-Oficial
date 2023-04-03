const {SlashCommandBuilder} = require("@discordjs/builders")
const {EmbedBuilder} = require("discord.js")
const {queue} = require ("./queue")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quit")
        .setDescription("Detiene el bot y limpia la cola"),
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) return await interaction.editReply("No hay canciones en la cola")

        queue.destroy()
        await interaction.editReply("Nos vemos!")
    },
}