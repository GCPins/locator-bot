const Discord = require('discord.js');
const client = new Discord.Client();
const token = require("./config/token.json");
const pc = require("./config/prefix.json");
const fs = require('fs');

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("Looking for those pesky Imposters.", { type: "PLAYING"})
});

client.on('message', msg => {

    let prefix = pc.prefix
    if (!msg.content.startsWith(prefix) || msg.author.bot || msg.channel.type === 'dm') return;
    //command handler setup cont.
    const args = msg.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (msg.content.startsWith(prefix + "where") && msg.member.hasPermission("MANAGE_MESSAGES")) {
        console.log(args[0])
        if (args[0] === undefined) {
            return msg.channel.send("No user specified.")
        }
        let TUID = args[0].replace(/\D/g, '');  
        let TU = msg.guild.members.cache.get(TUID);
        if (TU === undefined || args[1]) {
            return msg.channel.send("Invalid arguements.")
        }
        let VCID = TU.voice.channelID
        if (VCID === null) {
            return msg.channel.send(`User isn't in a VC.`);
        }
        let VCN = TU.voice.channel.name
        console.log(`${TU.displayName} (${TUID}) is connected to ${VCN}.`)
        msg.channel.send(`**${TU.displayName}** is connected to \`${VCN}\`.`)
        let VCI = msg.guild.channels.cache.get(VCID);
        if (!(VCI === undefined)) {
            VCI.createInvite().then(invite =>
                msg.channel.send(invite.url)
            );
        }
    }else
    if (msg.content === (prefix + "ping")) {
        let ap = Math.round(client.ws.ping)
        const pingm = new Discord.MessageEmbed()
            .setTitle('🏓 Pong! 🏓')
          .setDescription(`API latency is ${ap}ms`)
        msg.channel.send(pingm);
    } 
});

client.login(token.token);