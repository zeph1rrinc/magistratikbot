require("dotenv").config()
const { Telegraf } = require('telegraf')
const { GoogleSpreadsheet } = require('google-spreadsheet')
const BotController = require('./bot.controller')
const botInfo = require("./package.json")
const logger = require('./logger')

const bot = new Telegraf(process.env.BOT_TOKEN)
const doc = new GoogleSpreadsheet(process.env.DOC_SPREADSHEET)
const controller = new BotController(doc)

bot.start((ctx) => {
    ctx.reply(`Привет, ${ctx.message.from.first_name}!`)
    controller.Help(ctx)
})

bot.help((ctx) => controller.Help(ctx))

bot.on('message', async (ctx) => {
    await controller.OnMessage(ctx)
})

const start = async () => {
    try {
        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY,
        });
        await bot.launch()
        logger({message: `${botInfo.name}:${botInfo.version} successfully started`})
    } catch (e) {
        console.log(`ERROR: ${e}`)
    }

}

start()

// Enable graceful stop
process.once('SIGINT', () => {
    logger({message: `${botInfo.name}:${botInfo.version} successfully stopped (SIGINT)`})
    bot.stop('SIGINT')
})
process.once('SIGTERM', () => {
    logger({message: `${botInfo.name}:${botInfo.version} successfully stopped (SIGTERM)`})
    bot.stop('SIGTERM')
})