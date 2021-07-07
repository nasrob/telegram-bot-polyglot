require('dotenv').config()

const axios = require('axios')
const { Telegraf, session } = require('telegraf')
const LocalSession = require('telegraf-session-local')


const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)
bot.use((new LocalSession({ database: '.data/session.json' })).middleware())

bot.start(ctx => ctx.reply('Welcome'))

bot.startPolling()

bot.help(ctx => ctx.reply('Here\'s all the help I can give!'))

// intercept any message
bot.on('message', ctx => {
    const lang = (ctx.session.from ? ctx.session.from + '-' : '') + (ctx.session.to || 'en')
    axios.get('https://translate.yandex.net/api/v1.5/tr.json/translate', {
        params: {
            key: process.env.YANDEX_API_KEY,
            text: ctx.message.text,
            lang: 'en'
        }
    }).then(res => ctx.reply(res.data.text[0]))
})

bot.command('from', ctx => {
    const lang = ctx.message.text.substring(6)

    if (lang.length > 2 || lang.length === 1) {
        ctx.reply('🤔 language code must be 2 chars, e.g. "en" or "fr"')
        return
    }

    ctx.reply(lang ? '✅ "from" language set to ' + lang : '✅ autodetect "from" language')

    ctx.session.from = lang
})

bot.command('to', ctx => {
    const lang = ctx.message.text.substring(4)

    if (lang.length === 0) {
        ctx.reply('🤔 please specify a language code! It must be 2 chars, e.g. "en" or "fr"')
        return
    }

    if (lang.length > 2 || lang.length === 1) {
        ctx.reply('🤔 language code must be 2 chars, e.g. "en" or "fr"')
        return
    }

    ctx.session.to = lang;
    ctx.reply('✅ "to" language set to ' + lang)
})

// bot.hears('/hi/i', ctx => ctx.reply('Hi There')) // intercept a specific message


