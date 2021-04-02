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

    config.plugins.push(new webpack.DefinePlugin({ "global.GENTLY": false }))
    return config
  }
}