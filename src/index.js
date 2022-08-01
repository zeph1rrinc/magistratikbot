let botInfo = {}
if (process.env.npm_command !== "start") {
    require("dotenv").config({ path: '/home/zeph1rr/WebstormProjects/vk-magistratik-bot/src/.env' })
    botInfo = require("../package.json")
} else {
    require("dotenv").config()
    botInfo = require("./package.json")
}
const VkBot = require('node-vk-bot-api');

const controller = require('./controllers/bot.controller')
const {Logger} = require("./utils")

const bot = new VkBot(process.env.TOKEN);


bot.command('Начать', async ctx => await controller.start(ctx))

bot.command('Помощь', async ctx => await controller.help(ctx))

bot.command('Рейтинг', async ctx => await controller.rating(ctx))

bot.command('Игроки', async ctx => await controller.players(ctx))

bot.command('Власть', async ctx => await controller.head(ctx))

bot.command('История', async ctx => await controller.history(ctx))

bot.command(['Зефир красный', 'Люблю Зефира'], async ctx => controller.red(ctx))

bot.on(async ctx => await controller.uncaught(ctx))

try {
    bot.startPolling((err) => {
        if (err) {
            Logger.Error({message: `${err}`, from: "POLLING"});
            console.log(err)
        } else {
            Logger.Info({message: `${botInfo.name}:${botInfo.version} successfully started`})
        }
    });
} catch (e) {
    Logger.Error({message: `${e}`, from: "GLOBAL"})
}
