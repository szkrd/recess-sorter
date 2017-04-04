/**
 * remove nodes, leaving empty spaces behind (mutates tree)
 *
 * @param {Object[]} nodes  gonzales nodes
 */
function pluckNodes (nodes) {
  for (let i = 0, l = nodes.length; i < l; i++) {
    nodes[i].parent.removeChild(nodes[i].index - i)
  }
}

/**
 * insert nodes into the empty positions (mutates tree)
 *
 * @param {Object[]} origOrderNodes  gonzales nodes
 * @param {Object[]} newOrderNodes  gonzales nodes
 */
function insertNodes (origOrderNodes, newOrderNodes) {
  if (origOrderNodes.length !== newOrderNodes.length) {
    throw new Error('Number of nodes must match!')
  }
  for (let i = 0, l = origOrderNodes.length; i < l; i++) {
    origOrderNodes[i].parent.insert(origOrderNodes[i].index, newOrderNodes[i].node)
  }
}

/**
 * sort nodes by a sort order defined in an array
 *
 * @param {Object[]} nodes  gonzales nodes
 * @param {String[]} orderSet  array of strings defining an order
 * @returns {Object[]}
 */
function sortNodesByProp (nodes, orderSet) {
  const nodesProps = nodes.map(node => node.prop) // found prop names
  const sortedFound = []
  for (let i = 0, l = orderSet.length; i < l; i++) {
    // we could do a prefix list + map + filter + shift here, but that's
    // MUCH slower with deep recursive parsing
    const prefixes = ['', '-webkit-', '-moz-', '-ms-']
    for (let m = 0, n = prefixes.length; m < n; m++) {
      let prefix = prefixes[m]
      const at = nodesProps.indexOf(prefix + orderSet[i])
      if (at > -1) {
        sortedFound.push(nodes[at])
        break // prefix match, pos found, break prefix loop
      }
    }
  }
  const remnants = []
  for (let i = 0, l = nodes.length; i < l; i++) {
    if (sortedFound.indexOf(nodes[i]) === -1) {
      remnants.push(nodes[i])
    }
  }
  return sortedFound.concat(remnants)
}

module.exports = {
  pluckNodes,
  insertNodes,
  sortNodesByProp
}
