const
  Discord = require('discord.js'),
  client = new Discord.Client(),
  glob = require('glob'),
  token = '';

let
  channel = '',
  connection = '',
  timerId = '';

const timerStart = (min) => {
  let
    count = min * 60,
    prefix = '@here\n'

  timerId = setInterval(() => {
    count --
    if (count === 3600) {
      channel.send(`${prefix}残り時間**60分**です！`)
    }
    else if (count === 3000) {
      channel.send(`${prefix}残り時間**50分**です！`)
    }
    else if (count === 2400) {
      channel.send(`${prefix}残り時間**40分**です！`)
    }
    else if (count === 1800) {
      channel.send(`${prefix}残り時間**30分**です！`)
    }
    else if (count === 1200) {
      channel.send(`${prefix}残り時間**20分**です！`)
    }
    else if (count === 600) {
      channel.send(`${prefix}残り時間**10分**です！`)
    }
    else if (count === 300) {
      channel.send(`${prefix}残り時間**5分**です！`)
    }
    else if (count === 180) {
      channel.send(`${prefix}残り時間**3分**です！`)
    }
    else if (count === 60) {
      channel.send(`${prefix}残り時間**1分**です！`)
    }
    else if (count <= 0) {
      channel.send(`${prefix}|============================|\n|   (｀・ω・´)✧  -- Fin --  illi (OдO\`) illi   |\n|============================|\nタイマー終了！`)
      clearInterval(timerId)
    }
  }, 1000)
}

client.once('message', res => channel = res.channel)

client.on('message', async msg => {
  if (msg.author.bot) return;

  if (msg.content.indexOf('$timer') !== -1) {
    const min = msg.content.slice(7);
    if (isNaN(min)) return

    channel.send(`@here\n|============================|\n|   (*•̀ㅂ•́)و   -- START --   o(・\`д・´｡)   |\n|============================|\n**${min}分**のタイマーをスタートしました！`)
    timerStart(Number(min))
  }

  else if (msg.content.indexOf('$stop') !== -1) {
    channel.send('タイマーをストップしました！')
    clearInterval(timerId)
  }

  else if (msg.content.indexOf('$order') !== -1) {
    let
      randoms = [],
      text = '';
      users = msg.content.slice(7).split('/');

    for (let i = 0; i < users.length; i ++) {
      randoms.push({
        user: users[i],
        num: Math.random()
      })
    }

    randoms.sort((a, b) => b.num - a.num)
    for (let i = 0; i < randoms.length; i ++) {
      let prefix = '\n';
      if (i === 0) prefix = ''
      text += `${prefix}${[i + 1]}: ${randoms[i].user}`;
    }

    channel.send(text)
  }

  else if (msg.content.indexOf('$clear') !== -1) {
    const
      messages = await channel.messages.fetch({limit: 100}),
      botMessage = messages.filter(m => m.author.bot),
      commandMessage = messages.filter(m => m.content.indexOf('$') !== -1);

    channel.bulkDelete(botMessage)
    channel.bulkDelete(commandMessage)
  }

  else if (msg.content.indexOf('$join') !== -1) {
    if (!msg.member.voice.channel) return
    connection = await msg.member.voice.channel.join()
  }

  else if (msg.content.indexOf('$p') !== -1) {
    if (!connection) return
    const
      keyword =  msg.content.slice(3),
      entry = 'audio/*';

    new Promise((res) => {
      glob(entry, (err, files) => {
        res(files.filter(file => file.indexOf(keyword) !== -1)[0]);
      })
    })
    .then((playFile) => {
      (function loop() {
        let player = connection.play(playFile);
        player.on('finish', () => loop())
      }())
    })
  }

  else if (msg.content.indexOf('$dc') !== -1) {
    if (!connection) return
    connection.disconnect()
    connection = ''
  }
})

client.login(token)