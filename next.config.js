const dotenv = require('dotenv')
const path = require('path')
const Dotenv = require('dotenv-webpack')

module.exports = {
  typescript: {
    // Pls fix this in the future
    ignoreBuildErrors: true,
    "typeRoots": [
        "lib/customTypings",
        "node_modules/@types"
    ]
  },
  build: {
      extend(config, {}) {
          config.node = {
              fs: 'empty'
          }
      }
  },
  webpack: (config, { isServer,webpack }) => {


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