const config = {
    production: {
        composerService: {
            baseUrl: '',
        }
    },
    development: {
        composerService: {
            baseUrl: 'http://localhost:5000',
        }
    }
}

module.exports = config[process.env.NODE_ENV || 'development']
