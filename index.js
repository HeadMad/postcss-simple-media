let postcss = require('postcss')

const isRange = /^\d+-\d+$/
const isLimit = /^(\d+)([+-])?$/
const inBrackets = /^\((.+)\)$/
const isNot = /^!(.+)$/


const makeMedia = arg => {
  if (inBrackets.test(arg)) {
    let match = arg.match(inBrackets)
    return `(${makeMedia(match[1]).trim()})`

  } else if (isRange.test(arg)) {
    let args = arg.split('-').sort((a, b) => a - b)
    return `(min-width: ${args[0]}px) and (max-width: ${args[1]}px)`

  } else if (isLimit.test(arg)) {
    let matches = arg.match(isLimit)
    return matches[2]
      ? `(${matches[2] === '+' ? 'min' : 'max'}-width: ${matches[1]}px)`
      : `(width: ${matches[1]}px)`

  } else if (isNot.test(arg)) {
    let match = arg.match(isNot)
    return `not ${makeMedia(match[1].trim())}`
  }
  
  return arg
}

const parseParam = param => {
  const set = new Set(postcss.list.space(param))
  return [...set].map(item => makeMedia(item))
    .join(' and ').replace(/\bonly and/g, 'only')
}

const makeParams = params => {
  const set = new Set(postcss.list.comma(params))
  return [...set].map(param => parseParam(param)).join(', ')
}


const plugin = postcss.plugin('postcss-simple-media', (opts = { }) => {
  const atrule = opts.atrule || 'sm'
  const prop = opts.atrule || 'media'
  return root => {
    const stack = new Map()

    root.walkRules(rule => {
      let newAtRule, params, newRule

      rule.walkDecls(decl => {
        if (decl.prop === prop) {
          if (newAtRule) {
            newAtRule.append(newRule)
            stack.set(params, newAtRule)
          }

          params = makeParams(decl.value)
          newAtRule = stack.has(params)
            ? stack.get(params)
            : postcss.atRule({name: 'media', params})

          newRule = postcss.rule({selector: rule.selector})
          decl.remove()
          return
        }
        if (newRule) newRule.append(decl)
      })

      if (newAtRule) {
        newAtRule.append(newRule)
        stack.set(params, newAtRule)
      }
    })
    
    Array.from(stack).forEach(([_, atRule]) => root.append(atRule))

  }
})

module.exports = plugin
