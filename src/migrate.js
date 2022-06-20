require("dotenv").config()
const { GoogleSpreadsheet } = require('google-spreadsheet')
const doc = new GoogleSpreadsheet(process.env.DOC_SPREADSHEET)
const {$authHost} = require('./http')


const GetRows = async () => {
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0]
    return await sheet.getRows()
}

const login = async () => {
    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
    });
}

login()

rows = GetRows().then(rows => rows.forEach(row => {
    const stringifyData = row._rawData
    const line = {
        nickname: stringifyData[1],
        rating: stringifyData[2],
        series_count: stringifyData[3]
    }
    $authHost.post('players', line)
        .then(response => console.log(response.data.nickname))
        .catch(response => console.log(`${line.nickname} - ${response.response.data.message}`))
}))