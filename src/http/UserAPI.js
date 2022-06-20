const {$host} = require('./index')

const getRows = async () => {
    return $host.get('players')
}


module.exports = {getRows}