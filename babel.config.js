module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,  // Matches both .js and .jsx files
                exclude: /node_modules/,  // Excludes node_modules folder
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    }
                }
            }
        ]
    }
}
