require("dotenv").config()
const { Telegraf } = require('telegraf')
const botInfo = require("./package.json")
const logger = require('./logger')
const controller = require('./bot.controller')
const bot = new Telegraf(process.env.BOT_TOKEN)


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
        await bot.launch()
        logger({message: `${botInfo.name}:${botInfo.version} successfully started`})
    } catch (e) {
        logger({message: `${e}`})
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