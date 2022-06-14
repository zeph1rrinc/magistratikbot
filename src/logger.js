const fs = require("fs")
const format = require("node.date-time");
const path = require("path");

const logger = (logPath, data, needConsoleLog = true) => {
    const today = new Date().format("yyyy-MM-dd")
    const now = new Date().format("yyyy-MM-dd HH:mm:SS.ms")
    const log = JSON.stringify({
        timestamp: now,
        ...data
    })
    if (needConsoleLog) {
        console.log(log)
    }
    fs.appendFile(path.join(logPath, `log-${today}.txt`), log + '\n', err => {
        if (err) throw err
    })

}

module.exports = logger