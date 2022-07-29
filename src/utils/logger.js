const {get_user} = require("../apis/vkAPI");
const logger = require("zeph1rr-logger")(process.env.DEBUG_LEVEL, process.env.LOG_PATH);

class Logger {
    log (data) {
        logger(data)
    }
    Info (data) {
        this.log({
            type: "INFO",
            ...data
        })
    }
    Error (data) {
        this.log({
            type: "ERROR",
            ...data
        })
    }
    async Message (ctx) {
        const userData = await get_user(ctx)
        const username = `${userData.first_name} ${userData.last_name}`
        this.log({
            type: "MESSAGE",
            user_id: ctx.message.from_id,
            username,
            message: ctx.message.text
        })
    }
}

module.exports = new Logger()
