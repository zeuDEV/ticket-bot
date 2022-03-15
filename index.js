const Discord = require("discord.js");
const client = new Discord.Client({
  disableMentions: 'everyone'
})
require('discord-reply');
const { Database } = require("quickmongo");
const randomstring = require("randomstring");
const disbut = require('discord-buttons');
require('discord-buttons')(client);
const { MessageMenu, MessageMenuOption } = require('discord-buttons');
const config = require(`./config.json`)
const prefix = config.prefix;
const db = new Database(config.mongourl)

async function channelLog(embed) {
  if (!config.log_channel_id) return;
  let ch = await client.channels.cache.get(config.log_channel_id) || message.guild.channels.cache.find(channel => channel.name.match("log"));
  if (!ch) return console.log(`Pls fill config.json`)
  ch.send(embed)
}

client.on('ready', async () => {
  await console.clear()
  channelLog(`Bot Discord API leri Çalışıor`)
 
});
client.on('ready', () => {
	
    console.log(client.user.tag + " Giriş Yaptı");
 client.user
      .setPresence({
        activity: {
          name: `Destek Taleplerinizi`,
          type: "WATCHING",
        },
        status: "online",
      })

      .catch(console.error);
  
});

// İstatistik
client.on("ready", async () => {
let dc = require("discord.js")
let csc = client.channels.cache.get("bot istatislik için kanal id")
setInterval(() => {
let cse = new dc.MessageEmbed() 
.setTitle("Bot İstatistik")
.setColor("RANDOM")
.setTimestamp()
.addField("Toplam Sunucu", client.guilds.cache.size)
.addField("Toplam Kanal", client.channels.cache.size)
.addField("Toplam Kullanıcı", client.users.cache.size)
.addField("Gecikme", client.ws.ping)
.setThumbnail(client.user.avatarURL())
csc.send(cse)
}, 300000)
})
// İstatistik
// Eklendim Atıldım

     client.on("guildCreate", guild => {
  let dcs_kanal = client.channels.cache.get("hangi sunuculara eklendi vs ")
guild.channels
    .cache.filter(mr => mr.type === "text")
    .random()
    .createInvite()
    .then(async invite => {
      const dcs = new Discord.MessageEmbed()
        .setTitle("SUNUCUYA EKLENDİM")
        .setColor("GREEN")
        .addField("▪ Sunucu İsmi", `\`${guild.name}\``)
        .addField("▪ Üye Sayısı", `\`${guild.members.cache.size}\``)
        .addField("▪ Kurucu", `\`${guild.owner.user.tag}\``)
        .addField("Davet", `https://discord.gg/${invite.code}`);
      dcs_kanal.send(dcs);
    });
});


client.on("guildDelete", guild => {
  let dcs_kanal = client.channels.cache.get("hangi sunuculardan atıldı vs")

 const dcs = new Discord.MessageEmbed()
.setTitle("SUNUCUDAN AYRILDIM")
.setColor("RED")
.addField('▪ Sunucu İsmi', `\`${guild.name}\``)
.addField('▪ Üye Sayısı', `\`${guild.members.cache.size}\``)
.addField('▪ Kurucu', `\`${guild.owner.user.tag}\``)
dcs_kanal.send(dcs)
});  
// Eklendim Atıldım
 
client.on("message", async(message) =>{
 
  if (message.author.bot || !message.guild) return;
  let args = message.content.toLowerCase().split(" ");
  let command = args.shift()
if(message.member.hasPermission('MANAGE_ROLES')){
  if (command == prefix + `yardım`) {
    let embed = new Discord.MessageEmbed()
      .setTitle(`Esi'nin Komutları`)
      .setDescription(`> \`${prefix}gönder\` - Destek Talebi Yazısını Gönderir
> \`${prefix}ekle\` - Üyeyi destek talebine ekler
> \`${prefix}çıkar\` - Üyeyi destek talebinden çıkarır
> \`${prefix}sil\` - Destek talebini siler
> \`${prefix}kapat\` - Destek talebini kapatır
> \`${prefix}ac\` - Destek talebini açar
> \`${prefix}isimdegistir\` - Destek talebinin ismini değiştirir
> \`${prefix}kanalayarla\` - Destek talebi geçmişinin atılacağı ve destek talebinin oluşturulacağı kategoriyi ayarlar
> \`${prefix}personelayarla\` - Destek talebindeki personel rollerini ayarlar`)
      //.setTimestamp() Sohbetin Sonuna Saat Şeyini Ekliyor. Boş İŞ
      .setColor(`#33cd15`)
      .setFooter(``)
    message.lineReply({ embed: embed })
  }
  }else{

        message.channel.send(`${user.tag}` + "Bu komutu kullanma izniniz yok")

  }
  if (command == prefix + `ekle`) {
    if (!message.member.hasPermission('MANAGE_ROLES')) return message.lineReply(`:x: Bu komut \`MANAGE_ROLES\` izni gerektirir.`);
    let args = message.content.split(' ').slice(1).join(' ');
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = await db.get(`Staff_${message.guild.id}`)
    if (!sfats) return message.lineReply({ embed: { description: `bu sunucunun önce personel rollerini ayarlaması gerekiyor! \`{prefix}personelayarla\``, color: `#33cd15` } })
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      let member = message.mentions.members.first() || message.guild.members.cache.get(args || message.guild.members.cache.find(x => x.user.username === args || x.user.username === args));
      if (!member) return message.lineReply(`Kimliğinin bir üyesinden bahsedin`);
      try {
        channel.updateOverwrite(member.user, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: true,
          ATTACH_FILES: true,
          READ_MESSAGE_HISTORY: true,
        }).then(() => {
          message.lineReply({ embed: { description: `${member} Kullanıcısı ${channel} Kanalına Eklendi`, color: `#33cd15` } });
          let log_embed = new Discord.MessageEmbed()
            .setTitle(`Destek Talebi Bir Kişi Eklendi`)
            .addField(`Destek Talebi`, `<#${channel.id}>`)
            .addField(`Eklenen Kişi`, member.user)
            .addField(`Eylem`, `<@!${message.author.id}>`)
            .setTimestamp()
            .setColor(`GREEN`)
            .setFooter(message.guild.name, message.guild.iconURL())
          channelLog(log_embed)
        });
      }
      catch (e) {
        return message.channel.send(`Bir hata oluştu. Lütfen tekrar deneyin!`);
      }
    }
  }
  if (command == prefix + `çıkar`) {
    if (!message.member.hasPermission('MANAGE_ROLES')) return message.lineReply(`:x: Bu komut için \`MANAGA_ROLES\` izni gerekir.`);
    let args = message.content.split(' ').slice(1).join(' ');
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = await db.get(`Staff_${message.guild.id}`)
    if (!sfats) return message.lineReply({ embed: { description: `Bu sunucunun önce personel rollerini ayarlaması gerekiyor! \`{prefix}personelayarla\``, color: `#33cd15` } })
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      let member = message.mentions.members.first() || message.guild.members.cache.get(args || message.guild.members.cache.find(x => x.user.username === args || x.user.username === args));
      if (!member) return message.lineReply(`Mention a member of its ID`);
      try {
        channel.updateOverwrite(member.user, {
          VIEW_CHANNEL: false,
        }).then(() => {
           let log_embed = new Discord.MessageEmbed()
            .setTitle(`Destek Talebinden Bir Kişi Çıkartıldı`)
            .addField(`Destek Talebi`, `<#${channel.id}>`)
            .addField(`Eklenen Kişi`, member.user)
            .addField(`Eylem`, `<@!${message.author.id}>`)
            .setTimestamp()
            .setColor(`RED`)
            .setFooter(message.guild.name, message.guild.iconURL()) ////////////////
          channelLog(log_embed)
          message.lineReply({ embed: { description: `${member} Kullanıcısı ${channel} Kanalından Çıkartıldı`, color: `#33cd15` } });
        });
      }
      catch (e) {
        return message.channel.send(`Bir hata oluştu. Lütfen tekrar deneyin!`);
      }
    }
  }
  if (command == prefix + 'sil') {
    if (!message.member.hasPermission('MANAGE_ROLES')) return message.lineReply(`:x: Bu komut için \`MANAGA_ROLES\` izni gerekir.`);
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = await db.get(`Staff_${message.guild.id}`)
    if (!sfats) return message.lineReply({ embed: { description: `Bu sunucunun önce personel rollerini ayarlaması gerekiyor! \`{prefix}personelayarla\``, color: `#33cd15` } })
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      message.lineReply({ embed: { description: `Destek Talebi 5 saniye sonra silinecektir.`, color: `#33cd15` } })
      setTimeout(async () => {
        let log_embed = new Discord.MessageEmbed()
            .setTitle(`Destek Talebi Silindi`)
            .addField(`Destek Numarası`, `${await db.get(`ticket_${channel.id}_${message.guild.id}`).count}`)
            .addField(`Destek`,`<@!${await db.get(`ticket_${channel.id}_${message.guild.id}`).ticket_by}>`)
            .addField(`Eylem`, `<@!${message.author.id}>`)
            .setTimestamp()
            .setColor(`RED`)
            .setFooter(message.guild.name, message.guild.iconURL())
          channelLog(log_embed)
          channel.delete()
      }, 5000)
    }
  }
  if (command == prefix + 'kapat') {
    if (!message.member.hasPermission('MANAGE_ROLES')) return message.lineReply(`:x: Bu komut için \`MANAGA_ROLES\` izni gerekir.`);
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = await db.get(`Staff_${message.guild.id}`)
    if (!sfats) return message.lineReply({ embed: { description: `Bu sunucunun önce personel rollerini ayarlaması gerekiyor! \`{prefix}personelayarla\``, color: `#33cd15` } })
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      let msg = await message.lineReply({ embed: { description: `Destek Talebi 5 saniye sonra kapatılacaktır.`, color: `#33cd15` } })
      setTimeout(async () => {
        try {
          msg.delete()
          channel.send({ embed: { description: `Destek Talebi <@!${message.author.id}> Tarafından Kapatıldı`, color: `YELLOW` } })
          let type = 'member'
          await Promise.all(channel.permissionOverwrites.filter(o => o.type === type).map(o => o.delete()));
          channel.setName(`closed-${(await db.get(`ticket_${channel.id}_${message.guild.id}`))}`)
          let log_embed = new Discord.MessageEmbed()
            .setTitle(`Destek Talebi Kapatıldı`)
            .addField(`Destek Talebi`, `<#${channel.id}>`)
            .addField(`Eylem`, `<@!${message.author.id}>`)
            .setTimestamp()
            .setColor(`YELLOW`)
            .setFooter(message.guild.name, message.guild.iconURL())
          channelLog(log_embed)
        } catch (e) {
          return message.channel.send(`Bir hata oluştu. Lütfen tekrar deneyin!`);
        }
      }, 1000)
    }
  }

  if (command == prefix + 'aç') {
    if (!message.member.hasPermission('MANAGE_ROLES')) return message.lineReply(`:x: Bu komut için \`MANAGA_ROLES\` izni gerekir.`);
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = await db.get(`Staff_${message.guild.id}`)
    if (!sfats) return message.lineReply({ embed: { description: `Bu sunucunun önce personel rollerini ayarlaması gerekiyor! \`{prefix}personelayarla\``, color: `#33cd15` } })
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      let msg = await message.lineReply({ embed: { description: `Destek Talebiniz 5 saniye sonra açılacaktır`, color: `#33cd15` } })
      setTimeout(async () => {
        try {
          msg.delete()
          channel.send({ embed: { description: `Destek Talebi <@!${message.author.id}> Tarafından Açıldı`, color: `GREEN` } })
          let meember = client.users.cache.get(await db.get(`ticket_${channel.id}_${message.guild.id}`).ticket_by);
          channel.updateOverwrite(meember, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
          })
          channel.updateOverwrite((await db.get(`Staff_${message.guild.id}.Admin`)), {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
          })
          channel.updateOverwrite((await db.get(`Staff_${message.guild.id}.Moder`)), {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
          })
          channel.setName(`destek-${await db.get(`ticket_${channel.id}_${message.guild.id}`).count}`)
          let log_embed = new Discord.MessageEmbed()
            .setTitle(`Destek Talebi Tekrar Açıldı`)
            .addField(`Destek Talebi`, `<#${channel.id}>`)
            .addField(`Eylem`, `<@!${message.author.id}>`)
            .setTimestamp()
            .setColor(`GREEN`)
            .setFooter(message.guild.name, message.guild.iconURL())
          channelLog(log_embed)
        } catch (e) {
          return message.channel.send(`Bir hata oluştu. Lütfen tekrar deneyin!`);
        }
      }, 1000)
    }
  }
  if (command == prefix + 'isimdegistir' || command == prefix + 'isimyenile') {
    if (!message.member.hasPermission('MANAGE_ROLES')) return message.lineReply(`:x: Bu komut için \`MANAGA_ROLES\` izni gerekir.`);
    let channel = message.mentions.channels.first() || message.channel;
    const sfats = await db.get(`Staff_${message.guild.id}`)
    if (!sfats) return message.lineReply({ embed: { description: `Bu sunucunun önce personel rollerini ayarlaması gerekiyor! \`{prefix}personelayarla\``, color: `#33cd15` } })
    if (await db.get(`ticket_${channel.id}_${message.guild.id}`)) {
      let args = message.content.split(' ').slice(1).join(' ');
      if (!args) return message.lineReply({ embed: { description: `Lütfen Destek Talebi için istediğiniz ismi seçin`, color: `#33cd15` } })
      channel.setName(args)
      message.delete()
      let log_embed = new Discord.MessageEmbed()
        .setTitle(`Destek Talebinin İsmi Değişti`)
        .addField(`Yeni İsim`, args)
        .addField(`Destek Talebi`, `<#${channel.id}>`)
        .addField(`Kişi`, `<@!${message.author.id}>`)
        .setTimestamp()
        .setColor(`#33cd15`)
        .setFooter(message.guild.name, message.guild.iconURL())
      channelLog(log_embed)
    }
  }
  if (command == prefix + 'personelayarla'){
    console.log(args)
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.lineReply(`:x: Bu komut \`ADMINISTRATOR\` izni gerektirir.`);  
    if (args.length != 2) return message.lineReply({ embed: { description: `Lütfen bu komutla bir Yönetici rol kimliği, *sonra* bir Mod rol kimliği sağlayın! `, color: `#33cd15` } })
    if (message.mentions.roles.length < 2 && !Number(args[0]) && !Number(args[1])) return message.lineReply({ embed: { description: `Lütfen bu komutla önce bir Yönetici rolünden (veya iD), *sonra* bir Mod rolünden (veya iD) bahsedin! `, color: `#33cd15` } })
    const Admin = message.guild.roles.cache.get(args[0]);
    const Moder = message.guild.roles.cache.get(args[1]);
    await db.set(`Staff_${message.guild.id}.Admin`, Admin.id)
    await db.set(`Staff_${message.guild.id}.Moder`, Moder.id)
    message.react("✅")
  }
  if (command == prefix + 'kanalayarla'){
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.lineReply(`:x: Bu komut \`ADMINISTRATOR\` izni gerektirir.`);
    if (args.length != 2) return message.lineReply({ embed: { description: `Lütfen bu komutla bir kanal kimliği, *sonra* bir kategori kimliği belirtin! `, color: `#33cd15` } })
    if (message.mentions.roles.length < 2 && !Number(args[0]) && !Number(args[1])) return message.lineReply({ embed: { description: `Lütfen bu komutla bir Log Kanalı (veya iD), *sonra* bir Kategori (veya iD) belirtin! `, color: `#33cd15` } })
    const txt = message.guild.channels.cache.get(args[0]);
    const cat = message.guild.channels.cache.get(args[1]);
    if (txt.type !== "text") return message.channel.send("Bir Metin Kanalı Olmalı");
    if (cat.type !== "category") return message.channel.send("Bir Kategori Olmalı");
    await db.set(`Channels_${message.guild.id}.Log`, txt.id)
    await db.set(`Channels_${message.guild.id}.Cat`, cat.id)
    message.react("✅")
  }
  if (command == prefix + 'gönder' || command == prefix + 'destek') {
    if (!message.member.hasPermission('MANAGE_ROLES')) return message.lineReply(`:x: Bu komut \`MANAGE_ROLES\` izni gerektirir.`);
    const sfats = await db.get(`Staff_${message.guild.id}`)
    const sfas = await db.get(`Channels_${message.guild.id}`)
    if (!sfats || sfats === null) return message.lineReply({ embed: { description: `Bu sunucunun önce personel rollerini ayarlaması gerekiyor! \`${prefix}setstaff\``, color: `#33cd15` } })
    if (!sfas || sfas === null) return message.lineReply({ embed: { description: `Bu sunucunun önce destek talebi kanallarını kurması gerekiyor! \`${prefix}setchannels\``, color: `#33cd15` } })
    let idd = randomstring.generate({ length: 20 })
    let args = message.content.split(' ').slice(1).join(' ');
    if (!args) args = `Destek Ve Partnerlik`  // .gönder'deki Mesajlar
    let button1 = new MessageMenuOption()
    .setLabel('IC Destek')
    .setEmoji('898132754615660554')
    .setValue("urunler")
    .setDescription('IC Destek almak istiyorum.')
    let button2 = new MessageMenuOption()
    .setLabel('DC Destek')
    .setEmoji('891459284183941170')
    .setValue("destek")
    .setDescription('Discord ile alakalı destek almak istiyorum.')
    let button3 = new MessageMenuOption()
    .setLabel('Diğer')
    .setEmoji('898080548256354314')
    .setValue("partner")
    .setDescription('Başka bir yardıma ihtiyacım var.')
    let select = new MessageMenu()
    .setID(idd)
    .setPlaceholder('Destek Talebi Oluştur!')
    .setMaxValues(1)
    .setMinValues(1)
    .addOptions(button1, button2, button3)
    let embed = new Discord.MessageEmbed()
      .setTitle(args) 
      .setDescription("**Destek Talebi Oluşturmak İçin Aşağıdaki Seçeneklerden Birini Seçin**")
       .setImage('')
      .setThumbnail(message.guild.iconURL())
      .setTimestamp()
      .setColor(`#33cd15`)
      .setFooter(message.guild.name, message.guild.iconURL())
    let msg = await message.channel.send({ embed: embed, component: select }).then(async msg => {
      msg.pin()
      let log_embed = new Discord.MessageEmbed()
        .setTitle(`Yeni biletlerin açılması için bir mesaj gönderildi`)
        .addField(`Kanal`, `<#${message.channel.id}>`)
        .addField(`Kişi`, `<@!` + message.author.id + `>`)
        .setTimestamp()
        .setColor(`#33cd15`)
        .setFooter(message.guild.name, message.guild.iconURL())
      channelLog(log_embed)
      await db.set(`tickets_${idd}_${message.guild.id}`, {
        reason: args,
        msgID: msg.id,
        id: idd,
        options: [button1, button2, button3],
        guildName: message.guild.name,
        guildAvatar: message.guild.iconURL(),
        channelID: message.channel.id
      })
    })
  }

})


client.on('clickMenu', async (button) => {
  console.log(button.values)
  if (await db.get(`tickets_${button.id}_${button.message.guild.id}`)) {
    await button.reply.send(`Destek Talebiniz Hazırlanıyor. Lütfen Bekleyin `, true)
    await db.math(`counts_${button.message.id}_${button.message.guild.id}`, `+`, 1)
    let count = await db.get(`counts_${button.message.id}_${button.message.guild.id}`)
    let channel;
    await button.clicker.fetch();
    if (button.values[0] === "urunler") { //ürünler +
          button.guild.channels.create(`destek-${count}`, {
            permissionOverwrites: [
              {
                id: button.guild.roles.everyone,
                deny: ['VIEW_CHANNEL'],
              },
              {
                id: (await db.get(`Staff_${button.message.guild.id}.Admin`)),
                allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`,`MANAGE_MESSAGES`],
              },
              {
                id: (await db.get(`Staff_${button.message.guild.id}.Moder`)),
                allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`,`MANAGE_MESSAGES`],
              },
              {
                id: button.clicker.user.id,
                allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`],
              },
            ], parent: (await db.get(`Channels_${button.message.guild.id}.Cat`)), position: 1, topic: `Desteği Açan : <@!${button.clicker.user.id}>`, reason: "Tüm hakları kerem#0666'e aittir."
          }).then(async channel => {
            channel = channel
            await db.set(`ticket_${channel.id}_${button.message.guild.id}`, { count: count, ticket_by: button.clicker.user.id })
          
            await button.reply.edit(`
      **IC DESTEK Talebiniz Başarıyla Açıldı** <#${channel.id}>`, true)
                let log_embed = new Discord.MessageEmbed()
                  .setTitle(`Destek Talebi Açıldı`)
                  .addField(`Destek Talebi`, `<#${channel.id}>`)
                  .addField(`Destek`, `<@!${button.clicker.user.id}>`)
                  .addField(`Destek Numarası`, count)
                  .setTimestamp()
                  .setColor(`GREEN`)  
                channelLog(log_embed)
            const embedticket = new Discord.MessageEmbed()
              .setTimestamp()
              .setTitle("Konu : IC DESTEK") 
              .setFooter(``)
              .setColor(`#33cd15`)
              .setDescription(`Bu destek talebini kapatmak için 🔒 emojisine tıklayın.`)
            let idd = randomstring.generate({ length: 25 })
            await db.set(`close_${button.clicker.user.id}`, idd)
            let bu1tton = new disbut.MessageButton()
              .setStyle(`red`)
              .setEmoji(`🔒`)
              .setLabel(`Kapat`)
              .setID(idd)
            channel.send(`Hoşgeldin <@!${button.clicker.user.id}>, Destek Personelleri Seninle İlgilenecektir.`, { embed: embedticket, component: bu1tton }).then(msg => {
              msg.pin()
            })
            })
        }

      if (button.values[0] === "destek"){ // destek +
          button.guild.channels.create(`destek-${count}`, {
            permissionOverwrites: [
              {
                id: button.guild.roles.everyone,
                deny: ['VIEW_CHANNEL'],
              },
              {
                id: (await db.get(`Staff_${button.message.guild.id}.Admin`)),
                allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`,`MANAGE_MESSAGES`],
              },
              {
                id: (await db.get(`Staff_${button.message.guild.id}.Moder`)),
                allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`,`MANAGE_MESSAGES`],
              },
              {
                id: button.clicker.user.id,
                allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`],
              },
            ], parent: (await db.get(`Channels_${button.message.guild.id}.Cat`)), position: 1, topic: `Desteği Açan : <@!${button.clicker.user.id}>`, reason: "All rights reserved to MrVenomYt#7103"
          }).then(async channel => {
            channel = channel
            await db.set(`ticket_${channel.id}_${button.message.guild.id}`, { count: count, ticket_by: button.clicker.user.id })
          
            await button.reply.edit(`
      **Discord Destek Talebiniz Başarıyla Oluşturuldu** <#${channel.id}>`, true)
                let log_embed = new Discord.MessageEmbed()
                  .setTitle(`Bir Destek Talebi Oluşturuldu`)
                  .addField(`Destek Talebi`, `<#${channel.id}>`)
                  .addField(`Mağdur`, `<@!${button.clicker.user.id}>`)
                  .addField(`Destek Numarası`, count)
                  .setTimestamp()
                  .setColor(`GREEN`)
                channelLog(log_embed)
            const embedticket = new Discord.MessageEmbed()
              .setTimestamp()
              .setTitle("Konu : Discord Destek")
              .setFooter(``)
              .setColor(`#33cd15`)
              .setDescription(`Bu destek talebini kapatmak için 🔒 emojisine tıklayın`)
            let idd = randomstring.generate({ length: 25 })
            await db.set(`close_${button.clicker.user.id}`, idd)
            let bu1tton = new disbut.MessageButton()
              .setStyle(`red`)
              .setEmoji(`🔒`)
              .setLabel(`Kapat`)
              .setID(idd)
            channel.send(`Hoşgeldin <@!${button.clicker.user.id}>, Destek Personelleri Seninle İlgilenecektir. `, { embed: embedticket, component: bu1tton }).then(msg => {
              msg.pin()
            })
            })
        }
  if (button.values[0] === "partner"){ // partner +
          button.guild.channels.create(`destek-${count}`, {
            permissionOverwrites: [
              {
                id: button.guild.roles.everyone,
                deny: ['VIEW_CHANNEL'],
              },
              {
                id: (await db.get(`Staff_${button.message.guild.id}.Admin`)),
                allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`,`MANAGE_MESSAGES`],
              },
              {
                id: (await db.get(`Staff_${button.message.guild.id}.Moder`)),
                allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`,`MANAGE_MESSAGES`],
              },
              {
                id: button.clicker.user.id,
                allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`],
              },
            ], parent: (await db.get(`Channels_${button.message.guild.id}.Cat`)), position: 1, topic: `Partnerlik Başvurusu Yapan : <@!${button.clicker.user.id}>`, reason: "All rights reserved to MrVenomYt#7103"
          }).then(async channel => {
            channel = channel
            await db.set(`ticket_${channel.id}_${button.message.guild.id}`, { count: count, ticket_by: button.clicker.user.id })
          
            await button.reply.edit(`
      **Diğer Destek Talebiniz Başarıyla Oluşturuldu** <#${channel.id}>`, true)
                let log_embed = new Discord.MessageEmbed()
                  .setTitle(`Destek Talebi Oluşturuldu`)
                  .addField(`Destek`, `<#${channel.id}>`)
                  .addField(`Mağdur`, `<@!${button.clicker.user.id}>`)
                  .addField(`Destek Numarası`, count)
                  .setTimestamp()
                  .setColor(`GREEN`)
                channelLog(log_embed)
            const embedticket = new Discord.MessageEmbed()
              .setTimestamp()
              .setTitle("Konu : Diğer Destek")
              .setFooter(``)
              .setColor(`#33cd15`)
              .setDescription(`Bu destek talebini kapatmak için 🔒 emojisine tıklayın`)
            let idd = randomstring.generate({ length: 25 })
            await db.set(`close_${button.clicker.user.id}`, idd)
            let bu1tton = new disbut.MessageButton()
              .setStyle(`red`)
              .setEmoji(`🔒`)
              .setLabel(`Kapat`)
              .setID(idd)
            channel.send(`Hoşgeldin <@!${button.clicker.user.id}>, Destek Personelleri Seninle İlgilenecektir. `, { embed: embedticket, component: bu1tton }).then(msg => {
              msg.pin()
            })
            })
        }
      }
    });

      client.on('clickButton' , async (button1) => {
    // if(message.member.hasPermission('ADMINISTRATOR')){
        await button1.clicker.fetch()
        let idd = randomstring.generate({ length: 25 })
        await db.set(`close_${button1.clicker.user.id}_sure`, idd)
        if (button1.id == (await db.get(`close_${button1.clicker.user.id}`))) {
          let bu0tton = new disbut.MessageButton()
            .setStyle(`red`)
            .setLabel(`Kapat`)
            .setID(idd)
          await button1.reply.send(`Destek Talebini Kapatmak İstediğine Emin Misin?`, { component: bu0tton, ephemeral: true });
        }
//       }else{

// message.channel.send('testing')

//       }
      })
        client.on('clickButton', async (button) => {
          await button.clicker.fetch()
          if (button.id == (await db.get(`close_${button.clicker.user.id}_sure`))) {
          await button.reply.send(`Destek Talebi 5 Saniye Sonra Kapanacak`, true)   
            let ch = button.channel
            if (!ch) return;
            setTimeout(async () => {
              try {
                await ch.send({ embed: { description: `Destek Talebi <@!${button.clicker.user.id}> Tarafından Kapatıldı`, color: `YELLOW` } });
                let type = 'member'
                await Promise.all(ch.permissionOverwrites.filter(o => o.type === type).map(o => o.delete()));
                ch.setName(`kapalı-destek`)
                let log_embed = new Discord.MessageEmbed()
                  .setTitle(`Destek Talebi Kapandı`)
                  .addField(`Destek Talebi`, `<#${ch.id}>`)
                  .addField(`Eylem`, `<@!${button.clicker.user.id}>`)
                  .setTimestamp()
                  .setColor(`YELLOW`)
                channelLog(log_embed)
              } catch (e) {
                return button.channel.send(`Bir hata oluştu. Lütfen tekrar deneyin!`);
              }
            }, 4000)
          }
        })
client.login(config.token);