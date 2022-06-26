const logger = require('./logger')
const {default: axios} = require("axios");

// const borisId = 238703542
const borisId = 1138552898

const $host = axios.create({
    baseURL: process.env.API_URL
})

const getRows = async () => {
    return $host.get('players')
}

class botController
{
    Log (ctx) {
        const data = {
            chatId: ctx.message.chat.id,
            username: ctx.message.from.username,
            text: ctx.message.text
        }
        logger(data)
    }

    Help(ctx) {
        ctx.reply(process.env.HELP)
        this.Log(ctx)
    }

    async GetRating(ctx, nickname='') {
        try{
            this.Log(ctx)
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
        if (message.toLowerCase().indexOf('рейтинг') === 0) {
            const messageArray = message.split(' ').filter(word => word.length > 0)
            const nickname = messageArray.slice(1, messageArray.length + 1).join(' ')
            await this.GetRating(ctx, nickname)
        } else {
            this.Log(ctx)
            if (ctx.message.chat.id === borisId) {
                ctx.reply('Борис красный!')
            } else {
                ctx.reply('Я тебя не понимаю(')
            }
        }
    }
}

module.exports = new botController()