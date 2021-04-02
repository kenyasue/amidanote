const dotenv = require('dotenv')
const path = require('path')
const Dotenv = require('dotenv-webpack')

module.exports = {
  typescript: {
    // Pls fix this in the future
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer,webpack }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty'
      }
    }

    config.plugins.push(new webpack.DefinePlugin({ "global.GENTLY": false }));

    config.plugins = [
      ...config.plugins,

      // Read the .env file
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true,
      }),
    ]
        
    return config
  }
}