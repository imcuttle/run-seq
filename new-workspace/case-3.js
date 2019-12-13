import React, { Component } from 'react'
import { observer } from 'mobx-react'

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
  static defaultProps = {
    tree: {},
    transformers: []
  }

  renderTree(node = this.props.tree) {
    const children = []
    for (const childNode of node.nodes || []) {
      children.push(<Case1 tree={childNode} transformers={this.props.transformers} />)
    }

    return transformer(this.props.transformers, [node, children])
  }

  render() {
    return this.renderTree() || null
  }
}

export default observer(Case1)
