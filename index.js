require("dotenv").config()
const { Telegraf } = require('telegraf')
// const sequelize = require('./db')
// const {Users} = require("./models/models");
const { GoogleSpreadsheet } = require('google-spreadsheet')

const bot = new Telegraf(process.env.BOT_TOKEN)
const doc = new GoogleSpreadsheet('1xjx8k6lgupL2CaPLQhJw1kbT2rQKCAOamtbcwZhoE1w')


const getRows = async () => {
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0]
    return await sheet.getRows()
}


bot.start((ctx) => {
    ctx.reply(`Привет, ${ctx.message.from.first_name}!`)
    console.log(ctx.message.chat.id)
})
bot.help((ctx) => ctx.reply('Команды:\n1. Рейтинг - показывает топ20 рейтинга\n2. Рейтинг ник - Показывает рейтинг конкретного игрока'))
// bot.on('sticker', (ctx) => ctx.reply('👍'))
// bot.hears(['Запись', 'запись'], (ctx) => {
//     const admins = process.env.ADMIN_IDS.split(',')
//     if (admins.indexOf(ctx.message.chat.id.toString()) === -1) {
//         admins.forEach(admin => {
//             bot.telegram.sendMessage(admin, `@${ctx.message.from.username} насрал мне вчат`)
//         })
//         ctx.reply('Это ты насрал')
//     } else {
//         ctx.reply('Мне пока насрал только @Zeph1rr')
//     }
// })
bot.hears(['Рейтинг', 'рейтинг'], async (ctx) => {
    try{
        ctx.reply("Секундочку...")
        const rows = await getRows()
        let answer = ''
        rows.forEach(row => {
            if (row._rowNumber < 22) {
                const stringifyData = row._rawData
                answer += `${stringifyData[0]}. ${stringifyData[1]} - ${stringifyData[2]}\t\n`
            }
        })
        ctx.reply(answer)
    } catch (e) {
        console.log(e.message)
        ctx.reply('Непредвиденная ошибка, попробуйте позже')
    }
})

bot.on('message', async (ctx) => {
    const message = ctx.message.text
    if (message.toLowerCase().indexOf('рейтинг') !== -1) {
        const messageArray = message.split(' ')
        const nickname = messageArray.slice(1, messageArray.length + 1).join(' ')
        const rows = await getRows()
        const row = rows.filter(row => row._rawData[1].toLowerCase() === nickname.toLowerCase())
        if (row.length) {
            const data = row[0]._rawData
            ctx.reply(`${data[0]}. ${data[1]} - ${data[2]}`)
        } else {
            ctx.reply('К сожалению, игрок не найден(')
        }
    } else {
        ctx.reply('Я тебя не понимаю(')
    }
})

const start = async () => {
    try {
        // await sequelize.authenticate()
        // await sequelize.sync()
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