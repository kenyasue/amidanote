const withSass = require('@zeit/next-sass')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer()

module.exports = withSass({
  /* config options here */
})
