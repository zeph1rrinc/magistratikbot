const {Logger} = require("../utils");
const {vkAPI, googleAPI} = require("../apis");

class BotController {
    async start(ctx) {
        await Logger.Message(ctx)
        const {first_name} = await vkAPI.get_user(ctx)
        ctx.reply(`Привет, ${first_name}!`);
        await this.help(ctx)
    }

    async help(ctx) {
        await Logger.Message(ctx)
        ctx.reply(process.env.HELP || "Не понимаю(")
    }

    async rating(ctx) {
        await Logger.Message(ctx)
        const message = ctx.message.text.split(' ').filter(word => word.length > 0)
        const nickname = message.slice(1, message.length + 1).join(' ')
        await ctx.reply(await googleAPI.getRating(nickname))
    }

    async players(ctx) {
        await Logger.Message(ctx)
        await ctx.reply(await googleAPI.getPlayers())
    }

    async head(ctx) {
        await Logger.Message(ctx)
        await ctx.reply(process.env.HEAD)
    }

    async uncaught(ctx) {
        await Logger.Message(ctx)
        await ctx.reply('Я теюя не понимаю, но Борис красный!')
    }
}

module.exports = new BotController()
