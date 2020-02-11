let postcss = require('postcss')

const isRange = /^\d+-\d+$/
const isLimit = /^(\d+)([+-])$/


const makeMedia = arg => {
  if (isRange.test(arg)) {
    let args = arg.split('-').sort((a, b) => a - b)
    return `(min-width: ${args[0]}px) and (max-width: ${args[1]}px)`

  } else if (isLimit.test(arg)) {
    let matches = arg.match(isLimit)
    return `(${matches[2] === '+' ? 'min' : 'max'}-width: ${matches[1]}px)`
  }
  
  return arg
}

const parseParam = param => {
  const set = new Set(postcss.list.space(param))
  return [...set].map(item => makeMedia(item)).join(' and ')
}

const makeParams = params => {
  const set = new Set(postcss.list.comma(params))
  return [...set].map(param => parseParam(param)).join(', ')
}


const plugin = postcss.plugin('postcss-simple-media', (opts = { }) => {
  const sm = opts.atrule || 'sm'
  return root => {
    const stack = new Map()

    root.walkAtRules(sm, atRule => {
      const params = makeParams(atRule.params)
      const newAtRule = stack.has(params)
        ? stack.get(params)
        : postcss.atRule({name: 'media', params})

      if (atRule.parent.type === 'rule') {
        content = postcss.rule({selector: atRule.parent.selector})
        atRule.walkDecls(decl => content.append(decl))
        newAtRule.append(content)

      } else {
        atRule.walkRules(rule => newAtRule.append(rule))
      }
      
      stack.set(params, newAtRule)

      atRule.remove()
      Array.from(stack).forEach(([_, atRule]) => root.append(atRule))
    })

  }
})

module.exports = plugin
