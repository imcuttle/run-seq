/**
 * @file helper
 */
const waterFall = require('..').waterFall
const React = require('react')
const visitTree = require('@moyuyc/visit-tree')
const { isImmutable } = require('immutable')

const transformReactElement = (tree, fnList) => {
  let element

  visitTree(
    tree,
    (node, ctx) => {
      // 适配 Immutable
      if (isImmutable(node)) {
        Object.defineProperties(node, {
          nodes: {
            configurable: true,
            get() {
              return node.get('nodes') && node.get('nodes').toJSON()
            }
          },
          tagName: {
            configurable: true,
            get() {
              return node.get('tagName')
            }
          },
          data: {
            configurable: true,
            get() {
              return node.get('data').toJS()
            }
          },
          text: {
            configurable: true,
            get() {
              return node.get('text')
            }
          }
        })
      }

      ctx.elements = []
    },
    (node, ctx) => {
      const props = {
        node,
        parent: ctx.parent,
        context: ctx,
        children: ctx.elements
      }

      const elem = waterFall(fnList, [node, props])
      if (ctx.parentCtx) {
        ctx.parentCtx.elements.push(
          elem &&
            React.cloneElement(elem, {
              key: ctx.paths.join('-')
            })
        )
      }
      if (!ctx.parent) {
        element = elem
      }
    },
    {
      path: 'nodes'
    }
  )

  return element
}

module.exports = {
  transformReactElement,
  tree: {
    tagName: 'p',
    nodes: [
      {
        tagName: 'img',
        data: {
          src: './img.png'
        }
      },
      {
        tagName: 'text',
        text: 'lalalala'
      },
      {
        tagName: 'p',
        nodes: [
          {
            tagName: 'img',
            data: {
              src: './img.png'
            }
          },
          {
            tagName: 'text',
            text: 'lalalala'
          }
        ]
      }
    ]
  },
  transformers: [
    (node, ctx, next) => {
      switch (node.tagName) {
        case 'img':
          console.log(node.data.src)
          return <img src={node.data.src} />
        case 'p':
          return <p>{ctx.children}</p>
      }
      return next()
    },
    (node, ctx, next) => {
      switch (node.tagName) {
        case 'text':
          return <span>{node.text}</span>
      }
      return next()
    }
  ]
}
