module.exports = {
    mongodbMemoryServerOptions: {
        instance: {
            dbName: 'jest'
        },
        binary: {
            version: '4.0.9', // Version of MongoDB
            skipMD5: true
        },
        autoStart: false
    }
};
