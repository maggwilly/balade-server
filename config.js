module.exports.Config= {
    name: 'rest-api',
    version: '0.0.1',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8080,
    db: {
        uri: 'mongodb+srv://admin:admin@cluster0-atqy1.gcp.mongodb.net/weelder_db?retryWrites=true'
    }
}