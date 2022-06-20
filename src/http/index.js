const {default: axios} = require("axios");

const $authHost = axios.create({
    baseURL: process.env.API_URL
})

const authInterceptor = config => {
    config.headers.authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU1NzI2MzM4LCJleHAiOjE2NTU4MTI3Mzh9.VvjVTfmkfQMumLbTDHB0U03cb2T12oe3obW2Qdxsl3A`
    return config
}

$authHost.interceptors.request.use(authInterceptor)

module.exports = {$authHost, $host}