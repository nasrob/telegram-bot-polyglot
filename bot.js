require('dotenv').config()

const axios = require('axios')

const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

bot.start(ctx => ctx.reply('Welcome'))

bot.startPolling()

bot.help(ctx => ctx.reply('Here\'s all the help I can give!'))

// intercept any message
bot.on('message', ctx => {
    axios.get('https://translate.yandex.net/api/v1.5/tr.json/translate', {
        params: {
            key: process.env.YANDEX_API_KEY,
            text: ctx.message.text,
            lang: 'en'
        }
    }).then(res => ctx.reply(res.data.text[0]))
})

// bot.hears('/hi/i', ctx => ctx.reply('Hi There')) // intercept a specific message


