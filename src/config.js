const config = {
    production: {
        composerService: {
            baseUrl: '',
        }
    },
    development: {
        composerService: {
            baseUrl: 'http://127.0.0.1:5000',
        }
    }
}

module.exports = config[process.env.NODE_ENV || 'development']
