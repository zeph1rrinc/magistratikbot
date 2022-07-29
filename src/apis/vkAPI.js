const get_user = async (ctx, id=undefined) => {
    if (!id) {
        id = ctx.message.from_id
    }
    const data = await ctx.bot.api("users.get", {
        access_token: process.env.TOKEN,
        user_id: id
    })
    return data.response[0]
}

module.exports = {get_user}
