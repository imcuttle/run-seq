import Case1 from './case-1'
import Case2 from './case-2'
import React, { Component, PureComponent } from 'react'
import { fromJS } from 'immutable'
import tree from './tree-data'

/**
 *              p
 *    img  text    p
 *              img  text
 *
 */

class App extends PureComponent {
  state = {
    tree: fromJS(tree)
  }

  update() {
    this.setState(({ tree }) => {
      return {
        tree: tree.updateIn(['nodes', 2, 'nodes', 0, 'data', 'src'], src => 'update.png')
      }
    })
  }

  transformers = [
    (node, children, next) => {
      if (node.get('tagName') === 'p') {
        console.log(node.get('tagName'))
        return <p>{children}</p>
      }
      return next(node, children)
    },
    (node, children, next) => {
      if (node.get('tagName') === 'img') {
        return <img src={node.get('data').get('src')} />
      }

      return next(node, children)
    },
    (node, children, next) => {
      if (node.get('tagName') === 'text') {
        return node.text
      }
      return next(node, children)
    }
  ]

  render() {
    return <Case2 tree={this.state.tree} transformers={this.transformers} />
  }
}

export default App
