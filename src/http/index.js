const {default: axios} = require("axios");

const $authHost = axios.create({
    baseURL: process.env.API_URL
})

const authInterceptor = config => {
    config.headers.authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU2NDUwNDQ2LCJleHAiOjE2NTY1MzY4NDZ9.htLLKqvA1rggxJAfvtQhTw7gmDqIsBZ6eJvAxiT1_sI`
    return config
}

$authHost.interceptors.request.use(authInterceptor)

module.exports = {$authHost}