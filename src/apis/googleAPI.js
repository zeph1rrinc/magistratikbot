const { GoogleSpreadsheet } = require('google-spreadsheet')
const doc = new GoogleSpreadsheet(process.env.DOC_SPREADSHEET)

const start = async () => {
    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
    });
}

start().then()


const getRows = async () => {
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0]
    return await sheet.getRows()
}

const getRating = async (ctx, nickname='') => {
    let result = ''
    const rows = await getRows()
    if (!nickname.length) {
        rows.forEach(row => {
            if (row._rowNumber < 22) {
                const stringifyData = row._rawData
                result += `${stringifyData[0]}. ${stringifyData[1]} - ${stringifyData[2]}\t\n`
            }
        })
        return result
    } else {
        const row = rows.filter(row => row._rawData[1].toLowerCase() === nickname.toLowerCase())
        if (row.length) {
            const data = row[0]._rawData
            return `${data[0]}. ${data[1]} - ${data[2]}`
        } else {
            return 'К сожалению, игрок не найден('
        }
    }
}

module.exports = {getRating}

