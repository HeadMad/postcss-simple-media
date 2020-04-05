let postcss = require('postcss')

/**
 * Parse splittet by comma and space input
 * @param {String} arg value of declaration property
 * @return {String} params of media query
 */
const makeMedia = (arg) => {
  const inBrackets = /^\((.+)\)$/
  const isRange = /^\d+-\d+$/
  const isLimit = /^(\d+)([+-])?$/
  const isNot = /^!(.+)$/

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

/**
 * Split input by space
 * @param {String} param value of declaration prop, splitted by comma
 * @return {String} 
 */
const parseSpaceParams = (param) => {
  return postcss.list.space(param)
    .map((item) => makeMedia(item))
    .join(' and ')
    .replace(/( and\b){2,}/g, ' and')
    .replace(/\b(only|not) and\b/g, '$1')
}

/**
 * Split input by comma and pares they
 * @param {String} params value of declaration property
 * @return {String}
 */
const parseCommaParams = (params) => {
  return postcss.list.comma(params)
    .map((param) => parseSpaceParams(param))
    .join(', ')
}

/**
 * Get rule from atRule, or make new and put it in atRule
 * @param {Object} atRule 
 * @param {String} selector 
 * @return {Object} new rule
 */
const setNewRule = (atRule, selector) => {
  if (atRule.nodes)
    for (const rule of atRule.nodes)
      if (rule.selector === selector)
        return rule
  const rule = postcss.rule({selector})
  atRule.append(rule)
  return rule
}

/**
 * Check, if rule has no same decl, then put they in
 * @param {Object} rule 
 * @param {Object} decl 
 */
const addDeclInRule = (rule, decl) => {
  if (rule.nodes)
    for (const {prop, value} of rule.nodes)
      if (prop === decl.prop && value === decl.value)
        return
  rule.append(decl)
}

const walkDecls = (prop, root) => {
  const atRulesStack = new Map()

  root.walkRules((rule) => {
    const selector = rule.selector
    let newAtRule, params, newRule

    rule.walkDecls((decl) => {
      if (decl.prop === prop) {
        // If new media, in one rule
        // add previos in atRulesStack
        if (newAtRule)
          atRulesStack.set(params, newAtRule)

        params = parseCommaParams(decl.value)
        newAtRule = atRulesStack.has(params)
          ? atRulesStack.get(params)
          : postcss.atRule({name: 'media', params})

        newRule = setNewRule(newAtRule, selector)
        decl.remove()
        return
      }
      if (newRule)
        addDeclInRule(newRule, decl)
    })

    if (newAtRule)
      atRulesStack.set(params, newAtRule)

  })
  Array.from(atRulesStack).forEach(([_, atRule]) => root.append(atRule))
}


const simpleMedia = postcss.plugin('postcss-simple-media', (opts = {}) => {
  const prop = opts.prop || 'media'
  return (root) => {
    walkDecls(prop, root)
  }
})

module.exports = simpleMedia
