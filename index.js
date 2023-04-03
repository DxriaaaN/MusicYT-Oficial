const Discord = require("discord.js");
const dotenv = require("dotenv");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require('node:fs');
const { Player, Queue } = require("discord-player");
const { Client, GatewayIntentBits,} = require('discord.js');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { DisTube } = require("distube");
const { YtDlpPlugin } = require("@distube/yt-dlp");

dotenv.config()
const TOKEN = process.env.TOKEN

const LOAD_SLASH = process.argv[2] == "load"

const CLIENT_ID = "1061536138285809674"

const client = new Discord.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages
    ]
})

client.slashcommands = new Discord.Collection()
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
        queue: true
     }
})


client.player.on("connectionCreate", (queue) => {
    queue.connection.voiceConnection.on("stateChange", (oldState, newState) => {
      const oldNetworking = Reflect.get(oldState, "networking");
      const newNetworking = Reflect.get(newState, "networking");
  
      const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
        const newUdp = Reflect.get(newNetworkState, "udp");
        clearInterval(newUdp?.keepAliveInterval);
      };
  
      oldNetworking?.off("stateChange", networkStateChangeHandler);
      newNetworking?.on("stateChange", networkStateChangeHandler);
    });
  });

let commands = []
const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"))
for (const file of slashFiles){
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    commands.push(slashcmd.data.toJSON())}

    client.on("ready", () => {
        console.log(`Entrando como ${client.user.tag}`)
    })

    client.on("interactionCreate", (interaction) => {
        async function handleCommand() {
            if (!interaction.isCommand()) return
            const slashcmd = client.slashcommands.get(interaction.commandName)
            if (!slashcmd) interaction.reply("No es un comando valido")
            await interaction.deferReply()
            await slashcmd.run({ client, interaction })
        }
        handleCommand()
    })

    client.on("ready", () => {
        // Consigue las id de todos los servidores
        const guild_ids = client.guilds.cache.map(guild => guild.id);
    
    
    
    
        const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
        for (const guildId of guild_ids) {
            rest.put(Routes.applicationGuildCommands(CLIENT_ID, guildId),
                { body: commands })
                .then(() => console.log('Comandos preparados para el servidor ' + guildId))
                .catch(console.error);
        }

        client.user.setPresence({ activities: [{ name: 'Reproducir'}], status: "online"});

    });
client.login(TOKEN)
