const path = require('path');

module.exports = {
    resolve: {
        fallback: {
            "http": require.resolve("stream-http")
        }
    },
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    }
};