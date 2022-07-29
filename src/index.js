let botInfo = {}
if (process.env.npm_command !== "start") {
    require("dotenv").config({ path: '/home/zeph1rr/WebstormProjects/vk-magistratik-bot/src/.env' })
    botInfo = require("../package.json")
} else {
    require("dotenv").config()
    botInfo = require("./package.json")
}
const VkBot = require('node-vk-bot-api');

const {vkAPI, googleAPI} = require("./apis/");
const {Logger} = require("./utils")

process.on("SIGTERM", () => {
    Logger.Info("Received SIGTERM")
    process.exit(0)
})
process.on("SIGINT", () => {
    Logger.Info({message: "Received SIGINT"})
    process.exit(0)
})
process.on("exit", (code) => {
    Logger.Info({ message: `${botInfo.name}:${botInfo.version} exit with code: ${code}` })
})

const bot = new VkBot(process.env.TOKEN);

bot.command('Начать', async (ctx) => {
    await Logger.Message(ctx)
    const {first_name} = await vkAPI.get_user(ctx)
    ctx.reply(`Привет, ${first_name}!`);
})

bot.command('Помощь', async (ctx) => {
    await Logger.Message(ctx)
    ctx.reply(process.env.HELP || "Не понимаю(")
})

bot.command('Рейтинг', async (ctx) => {
    await Logger.Message(ctx)
    const message = ctx.message.text.split(' ').filter(word => word.length > 0)
    const nickname = message.slice(1, message.length + 1).join(' ')
    await ctx.reply(await googleAPI.getRating(ctx, nickname))
})

try {
    bot.startPolling((err) => {
        Logger.Info({message: `${botInfo.name}:${botInfo.version} successfully started`})
        if (err) {
            Logger.Error({message: `${err}`});
        }
    });
} catch (e) {
    Logger.Error({message: `${e}`})
}
