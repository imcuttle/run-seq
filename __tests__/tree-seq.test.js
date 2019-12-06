const waterFall = require('..').waterFall
const React = require('react')
const visitTree = require('@moyuyc/visit-tree')
const { mount } = require('enzyme')

const treeSeq = (tree, fnList) => {
  visitTree(
    tree,
    null,
    (node, ctx) => {
      if (!ctx.parent) {
        tree = waterFall(fnList, [node, ctx])
      } else {
        ctx.replace(waterFall(fnList, [node, ctx]))
      }
    },
    {
      path: 'nodes'
    }
  )

  return tree
}

describe('tree-seq', function() {
  it('should spec', function() {
    const state = {
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
    }

    const elem = treeSeq(state, [
      (node, ctx, next) => {
        switch (node.tagName) {
          case 'img':
            return <img src={node.data.src} />
          case 'p':
            return <p>{node.nodes}</p>
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
    ])
    const wrapper = mount(elem)
    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<p><img src=\\"./img.png\\"><span>lalalala</span><p><img src=\\"./img.png\\"><span>lalalala</span></p></p>"`
    )
  })
})
