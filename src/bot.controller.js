const logger = require("./logger");

class botController
{
    constructor(doc) {
        this.doc = doc
    }

    Log (ctx) {
        const data = {
            chatId: ctx.message.chat.id,
            username: ctx.message.from.username,
            text: ctx.message.text
        }
        logger(process.env.LOG_PATH, data, true)
    }

    Help(ctx) {
        ctx.reply(process.env.HELP)
        this.Log(ctx)
    }

    async GetRows() {
        await this.doc.loadInfo()
        const sheet = this.doc.sheetsByIndex[0]
        return await sheet.getRows()
    }

    async GetRating(ctx, nickname='') {
        try{
            this.Log(ctx)
            ctx.reply("Секундочку...")
            if (!nickname.length) {
                const rows = await this.GetRows()
                let answer = ''
                rows.forEach(row => {
                    if (row._rowNumber < 22) {
                        const stringifyData = row._rawData
                        answer += `${stringifyData[0]}. ${stringifyData[1]} - ${stringifyData[2]}\t\n`
                    }
                })
                ctx.reply(answer)
            } else {
                const rows = await this.GetRows()
                const row = rows.filter(row => row._rawData[1].toLowerCase() === nickname.toLowerCase())
                if (row.length) {
                    const data = row[0]._rawData
                    ctx.reply(`${data[0]}. ${data[1]} - ${data[2]}`)
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
        this.Log(ctx)
        const message = ctx.message.text
        if (message.trim().toLowerCase().indexOf('рейтинг') !== -1) {
            const messageArray = message.trim().split(' ').filter(word => word.length > 0)
            const nickname = messageArray.slice(1, messageArray.length + 1).join(' ')
            await this.GetRating(ctx, nickname)
        } else {
            ctx.reply('Я тебя не понимаю(')
        }
    }
}

module.exports = botController