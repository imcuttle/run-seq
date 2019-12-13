import Case3 from './case-3'
import React, { Component, PureComponent } from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import tree from './tree-data'

/**
 *              p
 *    img  text    p
 *              img  text
 *
 */
class App extends PureComponent {
  tree = observable.object(tree)

  update() {
    this.tree.nodes[2].nodes[0].data.src = 'update.png'
  }

  transformers = [
    (node, children, next) => {
      if (node.tagName === 'p') {
        console.log(node)
        return <p>{children}</p>
      }
      return next(node, children)
    },
    (node, children, next) => {
      if (node.tagName === 'img') {
        console.log(node.data.src)
        return <img src={node.data.src} />
      }

      return next(node, children)
    },
    (node, children, next) => {
      if (node.tagName === 'text') {
        return node.text
      }
      return next(node, children)
    }
  ]

  render() {
    return <Case3 tree={this.tree} transformers={this.transformers} />
  }
}

export default observer(App)
