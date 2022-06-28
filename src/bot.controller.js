const logger = require('./logger')
const {default: axios} = require("axios");

const borisId = 238703542

const getUsername = (ctx) => {
    return ctx.message.from.username || ctx.message.from.first_name || 'Anonymous'
}

const $host = axios.create({
    baseURL: process.env.API_URL
})

const getRows = async () => {
    return $host.get('players')
}

class botController
{
    async GetUser(ctx) {
        return await $host.get(`botusers/${ctx.message.chat.id}`)
    }

    async Register(ctx) {
        const botUser = await this.GetUser(ctx)
        if (!botUser.data) {
            await $host.post('botusers', {id: ctx.message.chat.id, name: getUsername(ctx)})
            logger({message: "new user!", name: getUsername(ctx)})
        }
    }

    async Log (ctx) {
        const response = await this.GetUser(ctx)
        const username = response.data
        const name = username.name || getUsername(ctx)
        const data = {
            chatId: ctx.message.chat.id,
            username: name,
            text: ctx.message.text
        }
        logger(data)
    }

    async Help(ctx) {
        ctx.reply(process.env.HELP)
        await this.Log(ctx)
    }

    async OnStart(ctx) {
        ctx.reply(`Привет, ${ctx.message.from.first_name}!`)
        await this.Register(ctx)
        await this.Help(ctx)
    }

    async GetRating(ctx, nickname='') {
        try{
            await this.Log(ctx)
            const response = await getRows()
            const rows = response.data.lines.sort((a, b) => (b.rating - a.rating))
            ctx.reply("Секундочку...")
            if (!nickname.length) {
                let answer = ''
                rows.forEach(row => {
                    if (rows.indexOf(row) < 20) {
                        answer += `${rows.indexOf(row) + 1}. ${row.nickname} - ${row.rating}\t\n`
                    }
                })
                ctx.reply(answer)
            } else {
                const row = rows.filter(row => row.nickname.toLowerCase() === nickname.toLowerCase())[0]
                if (row) {
                    ctx.reply(`${rows.indexOf(row)+1}. ${row.nickname} - ${row.rating}`)
                } else {
                    ctx.reply('К сожалению, игрок не найден(')
                }
            }
        } catch (e) {
            console.log(e.message)
            ctx.reply('Непредвиденная ошибка, попробуйте позже')
        }
    }

    async OnMessage(ctx) {
        const message = ctx.message.text.trim()
        await this.Register(ctx)
        if (message.toLowerCase().indexOf('рейтинг') === 0) {
            const messageArray = message.split(' ').filter(word => word.length > 0)
            const nickname = messageArray.slice(1, messageArray.length + 1).join(' ')
            await this.GetRating(ctx, nickname)
        } else {
            await this.Log(ctx)
            if (ctx.message.chat.id === borisId) {
                ctx.reply('Борис красный!')
            } else {
                ctx.reply('Я тебя не понимаю(')
            }
        }
    }
}

module.exports = new botController()