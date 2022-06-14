require("dotenv").config()
const { Telegraf } = require('telegraf')
const { GoogleSpreadsheet } = require('google-spreadsheet')
const BotController = require('./bot.controller')

const bot = new Telegraf(process.env.BOT_TOKEN)
const doc = new GoogleSpreadsheet(process.env.DOC_SPREADSHEET)
const controller = new BotController(doc)



bot.start((ctx) => {
    ctx.reply(`Привет, ${ctx.message.from.first_name}!`)
    controller.Help(ctx)
    console.log(ctx.message.chat.id)
})

bot.help((ctx) => controller.Help(ctx))

bot.hears(['Рейтинг', 'рейтинг'], async (ctx) => {
    await controller.GetRating(ctx)
})

bot.on('message', async (ctx) => {
    const message = ctx.message.text
    if (message.toLowerCase().indexOf('рейтинг') !== -1) {
        const messageArray = message.split(' ')
        const nickname = messageArray.slice(1, messageArray.length + 1).join(' ')
        await controller.GetRating(ctx, nickname)
    } else {
        ctx.reply('Я тебя не понимаю(')
    }
})

const start = async () => {
    try {
        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY,
        });
        await bot.launch()
    } catch (e) {
        console.log(`ERROR: ${e}`)
    }

}

start()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))