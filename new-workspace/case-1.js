import React, { Component } from 'react'

class Case1 extends Component {
  static defaultProps = {
    tree: {},
    renderNode: (node, children) => {
      return null
    }
  }

  renderTree(node = this.props.tree) {
    const { renderNode } = this.props
    const children = []
    for (const childNode of node.nodes || []) {
      children.push(this.renderTree(childNode))
    }

    return renderNode(node, children)
  }

  render() {
    return this.renderTree()
  }
}

export default Case1
