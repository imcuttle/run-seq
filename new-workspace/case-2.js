import React, { Component } from 'react'

const transformer = (transformers, argv) => {
  const next = (pos, ...passArgv) => {
    const head = transformers[pos]
    if (head) {
      return head.apply(this, passArgv.concat(next.bind(null, pos + 1)))
    }
  }

  return next(0, ...argv)
}

class Case1 extends Component {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return !this.props.tree.equals(nextProps.tree)
  }

  static defaultProps = {
    tree: {},
    transformers: []
    // renderNode: (node, children) => {
    //   return null
    // }
  }

  renderTree(node = this.props.tree) {
    const children = []
    const nodes = node.has('nodes') ? node.get('nodes') : []
    for (const childNode of nodes) {
      children.push(<Case1 tree={childNode} transformers={this.props.transformers} />)
    }

    return transformer(this.props.transformers, [node, children])
  }

  render() {
    return this.renderTree() || null
  }
}

export default Case1
