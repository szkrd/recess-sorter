const gonzales = require('gonzales-pe')
const nodeUtils = require('./nodeUtils')
const recessOrder = require('./recessOrder')

// technically special variable nodes stay in place, but everyone else
// goes around/before them, so they inadvertently end up at the end of the block
function isAllowedNode (node) {
  let src = node.toString()
  // not sure if we have a nicer way to do this,
  // this feels a bit hackish of course
  if (node.syntax === 'scss' && src.startsWith('$')) {
    return false
  }
  if (node.syntax === 'less' && src.startsWith('@')) {
    return false
  }
  return true
}

/**
 * sort properties inside declaration blocks
 * according to the twitter recess order definition
 *
 * @param {String} source  gonzales supported stylesheet
 * @param {"scss"/"css"/"sass"/"less"} syntax
 * @returns {Object}  gonzales ast
 */
function sort (source = '', syntax = 'scss') {
  const parseTree = gonzales.parse(source, { syntax })
  const declarations = []
  parseTree.traverse(function (node, index, parent) {
    if (node.is('declaration')) {
      if (declarations.indexOf(parent) === -1) {
        declarations.push(parent)
      }
      parent._nodeBag = parent._nodeBag || []
      if (parent.type === 'block' && isAllowedNode(node)) {
        parent._nodeBag.push({
          node,
          parent,
          index,
          str: node.toString(),
          prop: node.first('property').toString()
        })
      }
    }
  })
  declarations.forEach(block => {
    const nodes = block._nodeBag || []
    const orderedNodes = nodeUtils.sortNodesByProp(nodes, recessOrder)
    nodeUtils.pluckNodes(nodes)
    nodeUtils.insertNodes(nodes, orderedNodes)
  })
  return parseTree
}

module.exports = {
  sort
}
