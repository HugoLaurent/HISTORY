const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname),
        filename: 'bundle.js',
        publicPath: '/'
    },
    devServer: {
        static: path.resolve(__dirname), // Définit le dossier où Webpack Dev Server servira les fichiers générés
        hot: true, // Active le hot reloading
        open: true, // Ouvre automatiquement le navigateur après le démarrage du serveur
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
};
