const runSeq = require('..').default
const React = require('react')
const mobx = require('mobx')
const { observer, Observer } = require('mobx-react')
const { mount } = require('enzyme')

class Node extends React.Component {
  render() {
    console.log(this.props.node)
    return this.props.render() || null
  }
}
Node = observer(Node)

class ReactDeep extends React.Component {
  static defaultProps = {
    transformers: []
  }

  get transformers() {
    return [
      (node, next) => {
        if (!node) return null

        if (!mobx.isObservableArray(node)) {
          node = mobx.observable.array([node])
        }

        return (
          <>
            {/*{node.map((node, index) => (*/}
            {/*    <Node key={node.key || index} node={node} render={() => next(node)} />*/}
            {/*))}*/}
            {node.map((node, index) => (
              <Observer key={node.key || index}>{() => (console.log(node), next(node))}</Observer>
            ))}
          </>
        )
      },
      ...this.props.transformers,
      (node, next) => {
        return null
      }
    ]
  }

  render() {
    return runSeq(this.transformers, [this.props.state])
  }
}

describe('react-deep-mobx', function() {
  it('should spec works `next.all` well', function() {
    const state = mobx.observable.object({
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
    })

    const elem = React.createElement(ReactDeep, {
      state: state,
      transformers: [
        (node, next) => {
          switch (node.tagName) {
            case 'img':
              return <img src={node.data.src} />
            case 'p':
              return <p>{next.all(node.nodes)}</p>
            default:
              return next(node)
          }
        },
        (node, next) => {
          switch (node.tagName) {
            case 'text':
              return <span>{node.text}</span>
          }
          return next.all(node)
        }
      ]
    })

    const wrapper = mount(elem)
    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<p><img src=\\"./img.png\\"><span>lalalala</span><p><img src=\\"./img.png\\"><span>lalalala</span></p></p>"`
    )

    // state.updateIn()
    state.nodes[2].nodes[0].data.src = './updated.png'
    // wrapper.setProps({
    // state: newState
    // })
    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<p><img src=\\"./img.png\\"><span>lalalala</span><p><img src=\\"./updated.png\\"><span>lalalala</span></p></p>"`
    )
  })
})
