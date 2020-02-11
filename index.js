let postcss = require('postcss')

module.exports = postcss.plugin('postcss-simple-media', (opts = { }) => {

  // Work with options here

  return (root, result) => {

    // Transform CSS AST here

  }
})
