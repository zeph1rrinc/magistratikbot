class botController
{
    constructor(doc) {
        this.doc = doc
    }

    Help(ctx) {
        ctx.reply(process.env.HELP)
    }

    async GetRows() {
        await this.doc.loadInfo()
        const sheet = this.doc.sheetsByIndex[0]
        return await sheet.getRows()
    }

    async GetRating(ctx, nickname='') {
        try{
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
}

module.exports = botController