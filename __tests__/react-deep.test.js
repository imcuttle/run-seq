const runSeq = require('..').default
const React = require('react')
const shallowEqual = require('shallowequal')
const { Map, fromJS, List } = require('immutable')
const { mount } = require('enzyme')

class Node extends React.Component {
  shouldComponentUpdate(newProps, newState) {
    return !shallowEqual(this.props.node, newProps.node)
  }
  render() {
    console.log(this.props.node.toJS())
    return this.props.render() || null
  }
}

class ReactDeep extends React.Component {
  static defaultProps = {
    transformers: []
  }

  get transformers() {
    return [
      (node, next) => {
        if (!node || node.isEmpty()) return ''

        if (Map.isMap(node)) {
          node = List([node])
        }

        return (
          <>
            {node.map((node, index) => (
              <Node key={node.key || index} node={node} render={() => next(node)} />
            ))}
          </>
        )
      },
      ...this.props.transformers,
      (node, next) => {
        return ''
      }
    ]
  }

  render() {
    console.log('root render')
    return runSeq(this.transformers, [fromJS(this.props.state)])
  }
}

describe('react-deep', function() {
  it('should spec works `next.all` well', function() {
    const state = fromJS({
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
          switch (node.get('tagName')) {
            case 'img':
              return <img src={node.get('data').get('src')} />
            case 'p':
              return <p>{next.all(node.get('nodes'))}</p>
          }
        },
        (node, next) => {
          switch (node.get('tagName')) {
            case 'text':
              return <span>{node.get('text')}</span>
          }
          return next.all(node)
        }
      ]
    })

    const wrapper = mount(elem)
    expect(wrapper.html()).toMatchInlineSnapshot(`"<p><img src=\\"./img.png\\"><p><img src=\\"./img.png\\"></p></p>"`)

    const newState = state.updateIn(['nodes', 2, 'nodes', 0], img => img.setIn(['data', 'src'], './updated.png'))
    wrapper.setProps({
      state: newState
    })
    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<p><img src=\\"./img.png\\"><p><img src=\\"./updated.png\\"></p></p>"`
    )
  })
})
